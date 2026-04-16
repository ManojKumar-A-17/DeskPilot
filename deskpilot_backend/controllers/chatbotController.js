import fetch from 'node-fetch';

// @desc    Send message to chatbot
// @route   POST /api/chatbot/message
// @access  Private
export const sendMessage = async (req, res) => {
  try {
    const { message, conversationHistory } = req.body;

    if (!message) {
      return res.status(400).json({
        success: false,
        message: 'Message is required'
      });
    }

    if (!process.env.GROQ_API_KEY) {
      return res.status(500).json({
        success: false,
        message: 'Groq API key not configured'
      });
    }

    // Prepare messages for Groq API
    const messages = [
      {
        role: 'system',
        content: `You are DeskPilot AI, a helpful and intelligent IT helpdesk assistant for DeskPilot company. You help employees with technical issues, software problems, hardware troubleshooting, network connectivity, access requests, and general IT queries. 
        
        Be concise, professional, and helpful. If you can't solve an issue directly, suggest creating a support ticket through the helpdesk system.
        
        Common IT issues you can help with:
        - Software installation and configuration
        - Password resets and account access
        - Network connectivity problems
        - Hardware troubleshooting
        - Email and communication tools
        - VPN and remote access
        - Printer and peripheral issues
        - System performance optimization
        
        Always maintain a professional and friendly tone.`
      }
    ];

    // Add conversation history if provided (limit to last 10 messages for context)
    if (conversationHistory && Array.isArray(conversationHistory)) {
      const recentHistory = conversationHistory.slice(-10);
      recentHistory.forEach(msg => {
        if (msg.role && msg.text) {
          messages.push({
            role: msg.role === 'bot' ? 'assistant' : 'user',
            content: msg.text
          });
        }
      });
    }

    // Add current user message
    messages.push({
      role: 'user',
      content: message
    });

    console.log('Sending request to Groq API...');

    // Call Groq API
    const groqResponse = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile', // Updated to user specified model
        messages: messages,
        temperature: 0.7,
        max_tokens: 1024,
        top_p: 1,
        stream: false
      })
    });

    console.log('Groq API response status:', groqResponse.status);

    if (!groqResponse.ok) {
      const errorText = await groqResponse.text();
      console.error('Groq API error response:', errorText);
      throw new Error(`Groq API error: ${groqResponse.status} - ${errorText}`);
    }

    const groqData = await groqResponse.json();
    console.log('Groq API success, response received');

    const botResponse = groqData.choices[0]?.message?.content || 
      "I apologize, but I couldn't generate a response. Please try again or create a support ticket for immediate assistance.";

    res.status(200).json({
      success: true,
      data: {
        response: botResponse,
        timestamp: new Date()
      }
    });
  } catch (error) {
    console.error('Chatbot error:', error);
    res.status(500).json({
      success: false,
      message: 'I\'m having trouble connecting right now. Please try again in a moment or create a support ticket for immediate assistance.',
      error: error.message
    });
  }
};

// @desc    Get chatbot status
// @route   GET /api/chatbot/status
// @access  Private
export const getChatbotStatus = async (req, res) => {
  try {
    const hasGroqApiKey = !!process.env.GROQ_API_KEY;
    
    res.status(200).json({
      success: true,
      data: {
        status: hasGroqApiKey ? 'online' : 'offline',
        message: hasGroqApiKey ? 'DeskPilot AI is ready to help!' : 'Groq API key not configured'
      }
    });
  } catch (error) {
    console.error('Chatbot status error:', error);
    res.status(500).json({
      success: false,
      message: 'Error checking chatbot status',
      error: error.message
    });
  }
};