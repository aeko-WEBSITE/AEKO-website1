import express from 'express';
import { crawlWebsite } from '../controllers/crawlController.js';

const router = express.Router();

// POST /api/crawl/website
router.post('/website', crawlWebsite);

export default router;
