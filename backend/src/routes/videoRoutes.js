import express from 'express';
import { generateVideo, getVideoStatus } from '../controllers/videoController.js';

const router = express.Router();

router.post('/generate-video', generateVideo);
router.post('/video-status', getVideoStatus);

export default router;
