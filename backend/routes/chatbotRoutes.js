import express from 'express';
import {
	sendMessage,
	getChatbotStatus,
	getConsultationLogs,
	clearConsultationLogs
} from '../controllers/chatbotController.js';
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

// @route   GET /api/chatbot/consultations
// @desc    Get consultation logs
// @access  Private
router.get('/consultations', getConsultationLogs);

// @route   DELETE /api/chatbot/consultations
// @desc    Clear consultation logs (admin clears all, others clear own)
// @access  Private
router.delete('/consultations', clearConsultationLogs);

export default router;