import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import rateLimit from "express-rate-limit";
import { WebSocketServer } from "ws";
import { SarvamAIClient } from "sarvamai";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json({ limit: "1mb" }));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: {
    success: false,
    message: "Too many requests. Please try again later."
  }
});
app.use(limiter);

const client = new SarvamAIClient({
  apiSubscriptionKey: process.env.SARVAM_API_KEY
});

app.get("/", (req, res) => {
  res.json({ status: "Sarvam Backend Running" });
});

app.post("/api/chat", async (req, res) => {
  try {
    const { messages } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({
        success: false,
        message: "Messages array is required"
      });
    }

    const response = await client.chat.completions({
      messages
    });

    return res.json({
      success: true,
      reply: response.choices[0].message.content,
      usage: response.usage || null
    });
  } catch (error) {
    console.error("Sarvam Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error"
    });
  }
});

const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});

// Voice agent WebSocket (STT -> LLM -> TTS streaming)
const wss = new WebSocketServer({ server });

wss.on("connection", async (ws) => {
  console.log("Client connected for voice");

  let sttStream;
  try {
    if (client.speech_to_text_streaming && typeof client.speech_to_text_streaming.connect === "function") {
      sttStream = await client.speech_to_text_streaming.connect({
        model: "saaras-v3",
        mode: "transcribe",
        language_code: "en-IN",
        high_vad_sensitivity: true
      });
    }
  } catch (err) {
    console.error("STT stream init error:", err);
    try {
      ws.send(JSON.stringify({ type: "error", message: "Voice STT not available" }));
      ws.close();
    } catch (e) {}
    return;
  }

  if (!sttStream) {
    try {
      ws.send(JSON.stringify({ type: "error", message: "Voice streaming not available in this SDK. Use text chat." }));
      ws.close();
    } catch (e) {}
    return;
  }

  ws.on("message", async (chunk) => {
      try {
        if (chunk instanceof Buffer) {
          await sttStream.transcribe(chunk);
        }
      } catch (err) {
        console.error("STT transcribe error:", err);
      }
    });

    sttStream.on("message", async (data) => {
      try {
        if (data.transcript) {
          ws.send(JSON.stringify({ type: "stt", text: data.transcript }));
        }
        if (data.is_final && data.transcript) {
          const text = data.transcript.trim();
          if (!text) return;

          const llmResp = await client.chat.completions({
            messages: [
              { role: "system", content: "You are a helpful assistant." },
              { role: "user", content: text }
            ]
          });
          const replyText = llmResp.choices[0].message.content;

          ws.send(JSON.stringify({ type: "tts_start", text: replyText }));

          if (client.text_to_speech_streaming && typeof client.text_to_speech_streaming.connect === "function") {
            const ttsStream = await client.text_to_speech_streaming.connect({
              voice: "anika",
              language_code: "en-IN"
            });
            await ttsStream.synthesize({ text: replyText });
            ttsStream.on("message", (msg) => {
              if (msg.audio_chunk) {
                ws.send(JSON.stringify({ type: "tts_chunk", chunk: msg.audio_chunk }));
              }
            });
            ttsStream.on("end", () => {
              ws.send(JSON.stringify({ type: "tts_end" }));
            });
          } else {
            ws.send(JSON.stringify({ type: "tts_end" }));
          }
        }
      } catch (err) {
        console.error("Voice pipeline error:", err);
        ws.send(JSON.stringify({ type: "error", message: err.message || "Voice error" }));
      }
    });

  ws.on("close", () => {
    try {
      if (sttStream && typeof sttStream.close === "function") sttStream.close();
    } catch (e) {}
    console.log("Client disconnected");
  });
});
