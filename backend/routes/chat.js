import express from 'express';
const router = express.Router();
import { chat } from '../controllers/ollamaController.js';

router.post('/chat', chat);

export default router;
