import express from 'express';
import { sendMessage, getChatbotStatus } from '../controllers/chatbotController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// All chatbot routes require authentication
router.use(protect);

// @route   POST /api/chatbot/message
// @desc    Send message to chatbot
// @access  Private
router.post('/message', sendMessage);

// @route   GET /api/chatbot/status
// @desc    Get chatbot status
// @access  Private
router.get('/status', getChatbotStatus);

export default router;