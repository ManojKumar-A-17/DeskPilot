# AI Chatbot & Consultation Logs - DeskPilot IT Helpdesk

## Overview
The AI-powered chatbot and consultation logs system provides intelligent IT support and conversation tracking for the DeskPilot helpdesk platform.

## Features

### 🤖 AI Chatbot (ChatBot.tsx)
**Location**: `deskpilot_frontend/src/components/ChatBot.tsx`

#### Key Features:
- **Groq API Integration**: Uses Mixtral-8x7b-32768 model for intelligent responses
- **Responsive Design**: 
  - Mobile: 90vw width
  - Small screens: 450px width
  - Large screens: 500px width
  - Chat height: 350-450px (adjusts based on message count)
- **Real-time AI Responses**: Powered by Groq's fast inference
- **Conversation Context**: Maintains full chat history for context-aware responses
- **Modern UI/UX**:
  - Floating button with pulse animation
  - Minimize/maximize functionality
  - Clear chat option
  - Message timestamps
  - Typing indicator with animated dots
  - User/bot avatars
  - Gradient themes with glow effects
  - Smooth animations using Framer Motion

#### Configuration:
```typescript
// API key is stored in environment variable for security
const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY || "";
const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";
```

**Environment Setup:**
Create a `.env` file in `deskpilot_frontend/` directory:
```env
VITE_GROQ_API_KEY=your_groq_api_key_here
```

#### System Prompt:
The chatbot is configured as "DeskPilot AI", a helpful IT helpdesk assistant that:
- Helps with technical issues
- Troubleshoots software problems
- Assists with hardware issues
- Resolves network connectivity problems
- Handles access requests
- Answers general IT queries

#### Components:
1. **Floating Button**: Bottom-right position with online status indicator
2. **Chat Window**: Glass-morphism design with gradient header
3. **Messages Area**: Scrollable container with user/bot message differentiation
4. **Input Section**: Text input with send button, supports Enter key submission
5. **Header Controls**: Minimize, clear chat, and close buttons

### 📊 Consultation Logs (ConsultationLogs.tsx)
**Location**: `deskpilot_frontend/src/pages/ConsultationLogs.tsx`

#### Key Features:
- **Comprehensive Dashboard**: View all AI chatbot interactions
- **Statistics Cards**:
  - Total consultations
  - Resolved queries (with success rate)
  - Average duration
  - Today's consultations
- **Advanced Filtering**:
  - Search by query, user name, or user ID
  - Filter by category (Email, Network, Software, Hardware, Access, Security)
  - Filter by status (All, Resolved, Unresolved)
- **Export Functionality**: Download logs as CSV
- **Detailed View**: Click any log card to view full conversation
- **Responsive Grid**: 1 column (mobile) → 2 columns (tablet) → 3 columns (desktop)
- **Modern Design**: Glass-morphism cards with hover effects

#### Data Structure:
```typescript
interface ConsultationLog {
  id: string;
  timestamp: Date;
  user: string;
  userId: string;
  query: string;
  response: string;
  duration: number; // in seconds
  category: string;
  resolved: boolean;
}
```

#### Sample Categories:
- Email
- Network
- Software
- Hardware
- Access
- Security

## Routing

### Employee Routes:
- `/employee/consultation-logs` - View consultation history

### Technician Routes:
- `/technician/consultation-logs` - View consultation history

### Admin Routes:
- `/admin/consultation-logs` - View all consultation history

## Navigation
The "Consultation Logs" link has been added to the navigation menu for all roles:
- **Employee**: Dashboard → Raise Ticket → My Tickets → Knowledge Base → **Consultation Logs**
- **Technician**: Dashboard → Assigned Tickets → Update Status → **Consultation Logs**
- **Admin**: Dashboard → Analytics → Team → SLA Monitor → **Consultation Logs** → Settings

## Technical Implementation

### API Integration (Groq)
```typescript
const sendMessageToGroq = async (userMessage: string) => {
  const response = await fetch(GROQ_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${GROQ_API_KEY}`,
    },
    body: JSON.stringify({
      model: "mixtral-8x7b-32768",
      messages: [...conversationHistory],
      temperature: 0.7,
      max_tokens: 1024,
      top_p: 1,
      stream: false
    }),
  });
  return response.json();
};
```

### State Management
- **ChatBot**: Uses React useState for messages, input, loading states
- **ConsultationLogs**: Local state for logs, filters, and selected log dialog
- **Future Enhancement**: Can be integrated with backend API for persistent storage

### Styling
- **Glass-morphism**: `glass`, `glass-strong` classes
- **Gradients**: `gradient-primary` with orange theme
- **Glow Effects**: `glow-orange` for primary elements
- **Animations**: Framer Motion for smooth transitions
- **Responsive**: Tailwind breakpoints (sm, md, lg, xl)

## Usage Examples

### ChatBot Interactions:
1. **Password Reset**:
   - User: "How do I reset my email password?"
   - AI: Provides step-by-step instructions and offers to create a ticket if needed

2. **Network Issues**:
   - User: "My laptop won't connect to WiFi"
   - AI: Troubleshoots with diagnostic steps and escalates if necessary

3. **Access Requests**:
   - User: "I need access to the finance dashboard"
   - AI: Explains approval process and guides through request form

### Consultation Logs Features:
1. **Search**: Type "password" to find all password-related consultations
2. **Filter**: Select "Network" category to view only network issues
3. **Export**: Download filtered logs as CSV for reporting
4. **Detail View**: Click any card to see full conversation and metadata

## Future Enhancements

### Backend Integration (Planned):
```javascript
// API endpoints to implement
POST /api/consultations - Store new consultation
GET /api/consultations - Retrieve consultation history
GET /api/consultations/:id - Get specific consultation
PUT /api/consultations/:id - Update consultation status
DELETE /api/consultations/:id - Remove consultation
GET /api/consultations/stats - Get analytics data
```

### Additional Features (Roadmap):
- [ ] Real-time consultation logging during chat
- [ ] User-specific consultation history
- [ ] Email notifications for unresolved queries
- [ ] Integration with ticket system (auto-create tickets)
- [ ] Sentiment analysis of conversations
- [ ] AI performance metrics and feedback system
- [ ] Multi-language support
- [ ] Voice input/output capabilities
- [ ] File attachment support in chat
- [ ] Scheduled consultation reports

## Performance Considerations

### Optimization:
- API calls are debounced to prevent spam
- Messages are limited to 1024 tokens per response
- Conversation history is maintained in memory (can be persisted)
- Responsive images and lazy loading for better performance
- CSS transitions use `transform` and `opacity` for GPU acceleration

### Security:
- API key is currently in frontend (for development)
- **Production**: Move API key to backend environment variables
- **Recommendation**: Implement backend proxy for Groq API calls
- Input sanitization for user messages
- CORS protection on backend endpoints

## Browser Compatibility
- Chrome/Edge: Full support
- Firefox: Full support
- Safari: Full support
- Mobile browsers: Responsive design tested

## Accessibility
- Keyboard navigation supported (Enter to send)
- ARIA labels for screen readers
- Color contrast meets WCAG 2.1 AA standards
- Focus indicators on interactive elements

## Troubleshooting

### Common Issues:

1. **API Not Responding**:
   - Check Groq API key validity
   - Verify internet connection
   - Check browser console for CORS errors

2. **Chat Not Opening**:
   - Clear browser cache
   - Check for JavaScript errors in console
   - Verify component is imported in layout

3. **Logs Not Displaying**:
   - Sample data is loaded by default
   - For production, implement backend API
   - Check filter settings (reset to "All")

## Support
For technical support or questions:
- Check [PROBLEM_STATEMENT.md](AI-SMART-IT-HELPDESK/PROBLEM_STATEMENT.md)
- Review [README.md](README.md) for general setup
- Contact the development team

---

**Last Updated**: December 2024  
**Version**: 1.0.0  
**Contributors**: DeskPilot Development Team
