import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send, Bot, Sparkles, Loader2, Trash2, Minimize2, Maximize2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Message {
  role: "bot" | "user";
  text: string;
  timestamp: Date;
}

const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY || "";
const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { 
      role: "bot", 
      text: "Hi! I'm ThinkAuto AI, your intelligent IT helpdesk assistant. I can help you with:\n\n• Technical troubleshooting\n• Software issues\n• Hardware problems\n• Network connectivity\n• Access requests\n• General IT queries\n\nHow can I assist you today?",
      timestamp: new Date()
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessageToGroq = async (userMessage: string) => {
    try {
      const response = await fetch(GROQ_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${GROQ_API_KEY}`,
        },
        body: JSON.stringify({
          model: "mixtral-8x7b-32768",
          messages: [
            {
              role: "system",
              content: "You are ThinkAuto AI, a helpful and intelligent IT helpdesk assistant for ThinkAuto company. You help employees with technical issues, software problems, hardware troubleshooting, network connectivity, access requests, and general IT queries. Be concise, professional, and helpful. If you can't solve an issue directly, suggest creating a support ticket."
            },
            ...messages.map(m => ({
              role: m.role === "bot" ? "assistant" : "user",
              content: m.text
            })),
            {
              role: "user",
              content: userMessage
            }
          ],
          temperature: 0.7,
          max_tokens: 1024,
          top_p: 1,
          stream: false
        }),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      return data.choices[0]?.message?.content || "I apologize, but I couldn't generate a response. Please try again.";
    } catch (error) {
      console.error("Groq API error:", error);
      return "I'm having trouble connecting right now. Please try again in a moment or create a support ticket for immediate assistance.";
    }
  };

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput("");
    
    // Add user message
    const newUserMessage: Message = {
      role: "user",
      text: userMessage,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, newUserMessage]);
    setIsLoading(true);

    try {
      // Get AI response
      const botResponse = await sendMessageToGroq(userMessage);
      
      // Add bot response
      const newBotMessage: Message = {
        role: "bot",
        text: botResponse,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, newBotMessage]);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to get response. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([
      { 
        role: "bot", 
        text: "Hi! I'm ThinkAuto AI, your intelligent IT helpdesk assistant. How can I assist you today?",
        timestamp: new Date()
      },
    ]);
    toast({
      title: "Chat cleared",
      description: "Conversation history has been reset.",
    });
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <>
      {/* Floating Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-6 right-6 z-50 gradient-primary rounded-full p-5 glow-orange shadow-2xl hover:shadow-primary/50 transition-shadow"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <Bot className="w-7 h-7 text-primary-foreground" />
            <motion.span 
              className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-background"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ repeat: Infinity, duration: 2 }}
            />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className={`fixed z-50 glass-strong rounded-2xl shadow-2xl overflow-hidden border border-border/50 ${
              isMinimized 
                ? 'bottom-6 right-6 w-80' 
                : 'bottom-6 right-6 w-[90vw] sm:w-[450px] lg:w-[500px]'
            }`}
          >
            {/* Header */}
            <div className="gradient-primary p-4 flex items-center justify-between backdrop-blur-xl">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="gradient-primary rounded-full p-2">
                    <Bot className="w-5 h-5 text-primary-foreground" />
                  </div>
                  <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-background"></span>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-display font-bold text-primary-foreground text-lg">ThinkAuto AI</span>
                    <Sparkles className="w-4 h-4 text-yellow-300 animate-pulse" />
                  </div>
                  <p className="text-xs text-primary-foreground/80">Online • Always here to help</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => setIsMinimized(!isMinimized)}
                  className="hover:bg-white/10 rounded-lg p-1.5 transition-colors"
                  title={isMinimized ? "Expand" : "Minimize"}
                >
                  {isMinimized ? (
                    <Maximize2 className="w-4 h-4 text-primary-foreground/80 hover:text-primary-foreground" />
                  ) : (
                    <Minimize2 className="w-4 h-4 text-primary-foreground/80 hover:text-primary-foreground" />
                  )}
                </button>
                <button 
                  onClick={clearChat}
                  className="hover:bg-white/10 rounded-lg p-1.5 transition-colors"
                  title="Clear chat"
                >
                  <Trash2 className="w-4 h-4 text-primary-foreground/80 hover:text-primary-foreground" />
                </button>
                <button 
                  onClick={() => setIsOpen(false)}
                  className="hover:bg-white/10 rounded-lg p-1.5 transition-colors"
                >
                  <X className="w-4 h-4 text-primary-foreground/80 hover:text-primary-foreground" />
                </button>
              </div>
            </div>

            {!isMinimized && (
              <>
                {/* Messages */}
                <div className={`overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-secondary/30 to-background ${
                  messages.length > 6 ? 'h-[400px] sm:h-[450px]' : 'h-[350px]'
                }`}>
                  {messages.map((msg, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"} gap-2`}
                    >
                      {msg.role === "bot" && (
                        <div className="flex-shrink-0">
                          <div className="gradient-primary rounded-full p-2">
                            <Bot className="w-4 h-4 text-primary-foreground" />
                          </div>
                        </div>
                      )}
                      <div className={`flex flex-col ${msg.role === "user" ? "items-end" : "items-start"} max-w-[85%]`}>
                        <div
                          className={`rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                            msg.role === "user"
                              ? "gradient-primary text-primary-foreground shadow-lg"
                              : "glass border border-border/50 text-foreground shadow-md"
                          }`}
                        >
                          <p className="whitespace-pre-wrap break-words">{msg.text}</p>
                        </div>
                        <span className="text-[10px] text-muted-foreground mt-1 px-1">
                          {formatTime(msg.timestamp)}
                        </span>
                      </div>
                      {msg.role === "user" && (
                        <div className="flex-shrink-0">
                          <div className="bg-secondary border border-border/50 rounded-full p-2">
                            <div className="w-4 h-4 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-[10px] font-bold text-white">
                              U
                            </div>
                          </div>
                        </div>
                      )}
                    </motion.div>
                  ))}
                  
                  {isLoading && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex justify-start gap-2"
                    >
                      <div className="gradient-primary rounded-full p-2">
                        <Bot className="w-4 h-4 text-primary-foreground" />
                      </div>
                      <div className="glass border border-border/50 rounded-2xl px-4 py-3">
                        <div className="flex gap-1.5">
                          <motion.div
                            className="w-2 h-2 bg-primary rounded-full"
                            animate={{ scale: [1, 1.3, 1] }}
                            transition={{ repeat: Infinity, duration: 1, delay: 0 }}
                          />
                          <motion.div
                            className="w-2 h-2 bg-primary rounded-full"
                            animate={{ scale: [1, 1.3, 1] }}
                            transition={{ repeat: Infinity, duration: 1, delay: 0.2 }}
                          />
                          <motion.div
                            className="w-2 h-2 bg-primary rounded-full"
                            animate={{ scale: [1, 1.3, 1] }}
                            transition={{ repeat: Infinity, duration: 1, delay: 0.4 }}
                          />
                        </div>
                      </div>
                    </motion.div>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <div className="p-4 border-t border-border/50 bg-background/50 backdrop-blur-xl">
                  <div className="flex gap-2">
                    <input
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && sendMessage()}
                      placeholder="Ask me anything..."
                      disabled={isLoading}
                      className="flex-1 bg-secondary/80 backdrop-blur-sm border border-border/50 rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-primary/50 transition-all disabled:opacity-50"
                    />
                    <button
                      onClick={sendMessage}
                      disabled={isLoading || !input.trim()}
                      className="gradient-primary rounded-xl px-4 py-3 text-primary-foreground hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-primary/50"
                    >
                      {isLoading ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : (
                        <Send className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                  <p className="text-[10px] text-muted-foreground mt-2 text-center">
                    Powered by Groq AI • Press Enter to send
                  </p>
                </div>
              </>
            )}

            {isMinimized && (
              <div className="p-4 text-center">
                <p className="text-sm text-muted-foreground">Chat minimized</p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ChatBot;
