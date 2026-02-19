import express from 'express';
import { text2img } from '../controllers/imageController.js';

const router = express.Router();

router.post('/text2img', text2img);

export default router;
