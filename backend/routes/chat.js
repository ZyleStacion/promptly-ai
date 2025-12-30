import express from 'express';
const router = express.Router();
import { chat, getModels } from '../controllers/ollamaController.js';

router.post('/chat', chat);
router.get('/models', getModels);

export default router;
