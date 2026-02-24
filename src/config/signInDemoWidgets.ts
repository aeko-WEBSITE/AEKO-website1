import type { SignInDemoChatConfig } from "@/components/SignInDemoChatWidget";

export const SIGNIN_DEMO_WIDGETS: SignInDemoChatConfig[] = [
  {
    id: "support",
    title: "AKOBOT AI Support",
    subtitle: "Always Available",
    avatarLetter: "S",
    placeholder: "Ask SIA about AKOBOT ...",
    steps: [
      { role: "agent", text: "Hello, how can I assist you?" },
      { role: "user", text: "Can you raise a ticket for me?" },
      { role: "agent", text: "Searching knowledge base...", isTyping: true },
      { role: "agent", text: "Sure! Could you share a few details? What's the issue about?" },
      { role: "user", text: "Login issue" },
      { role: "agent", text: "Ticket created. Your ticket number is #AK-2847." },
    ],
  },
  {
    id: "sales",
    title: "Sales Agent",
    subtitle: "Always Available",
    avatarLetter: "A",
    steps: [
      { role: "agent", text: "Hello, how's your day?" },
      { role: "user", text: "Great!" },
      { role: "agent", text: "Well we can make your day even better — our product is offering 30% discount with quality." },
      { role: "user", text: "I'd love to know more about it." },
    ],
  },
  {
    id: "lead",
    title: "Lead Agent",
    subtitle: "Always Available",
    avatarLetter: "L",
    steps: [
      { role: "agent", text: "How's your day?" },
      { role: "user", text: "Great! Can you give me today's leads you fetched?" },
      { role: "agent", text: "Here's the list of 10 websites related to our product use case." },
    ],
  },
  {
    id: "image-creation",
    title: "Image Creation Agent",
    subtitle: "Always Available",
    avatarLetter: "I",
    avatarGradient: "from-emerald-500 via-teal-500 to-cyan-500",
    steps: [
      { role: "agent", text: "How's your day?" },
      { role: "user", text: "Good! Can you generate 50 images for me related to 3D comic Marvel characters and post them to my mail?" },
      { role: "agent", text: "Done, I'll do it." },
    ],
  },
  {
    id: "content-creation",
    title: "Content Creation Agent",
    subtitle: "Always Available",
    avatarLetter: "C",
    avatarGradient: "from-amber-500 via-orange-500 to-rose-500",
    steps: [
      { role: "agent", text: "How's your day?" },
      { role: "user", text: "Hi, I'm good. Can you give me today's report?" },
      { role: "agent", text: "Sure, and I'll give you a PDF of the report. Can you share the mail to the following 30 members?" },
      { role: "user", text: "Share." },
      { role: "agent", text: "I will do it." },
    ],
  },
  {
    id: "data-analytics",
    title: "Data Analytics Agent",
    subtitle: "Always Available",
    avatarLetter: "D",
    avatarGradient: "from-indigo-500 via-purple-500 to-pink-500",
    steps: [
      { role: "agent", text: "How's it going?" },
      { role: "user", text: "Good! Can you pull yesterday's metrics?" },
      { role: "agent", text: "Here are your key metrics and the summary dashboard." },
    ],
  },
];
