import React, { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, X, Bot, User, Loader2 } from 'lucide-react';
import { ChatMessage } from '../types';
import { getGeminiResponse } from '../services/geminiService';

interface GeminiAssistantProps {
  isOpen: boolean;
  onClose: () => void;
}

const GeminiAssistant: React.FC<GeminiAssistantProps> = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'model',
      text: 'Greetings. I am NEORA, your royal market intelligence analyst. How may I assist you with your portfolio or market strategies today?',
      timestamp: Date.now()
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: input,
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
        const history = messages.map(m => ({ role: m.role, text: m.text }));
        const responseText = await getGeminiResponse(userMsg.text, history);

        const aiMsg: ChatMessage = {
            id: (Date.now() + 1).toString(),
            role: 'model',
            text: responseText,
            timestamp: Date.now()
        };
        setMessages(prev => [...prev, aiMsg]);
    } catch (error) {
        const errorMsg: ChatMessage = {
            id: (Date.now() + 1).toString(),
            role: 'model',
            text: "I encountered a disturbance in the data stream. Please try again.",
            timestamp: Date.now()
        };
        setMessages(prev => [...prev, errorMsg]);
    } finally {
        setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-y-0 right-0 w-full sm:w-[450px] bg-bg-primary/95 dark:bg-bg-secondary/95 backdrop-blur-2xl border-l border-border-light shadow-2xl z-50 flex flex-col transform transition-transform duration-300 ease-in-out">
      {/* Header */}
      <div className="p-6 border-b border-border-light flex items-center justify-between bg-surface-primary/80 dark:bg-surface-glass backdrop-blur-md">
        <div className="flex items-center space-x-4">
          <div className="p-3 bg-gradient-main rounded-2xl shadow-lg shadow-accent-glow animate-pulse-slow">
            <Sparkles className="text-white h-5 w-5" />
          </div>
          <div>
            <h2 className="font-display font-bold text-xl text-text-primary tracking-tight">NEORA AI</h2>
            <p className="text-xs font-bold text-accent-main uppercase tracking-widest">Royal Analyst</p>
          </div>
        </div>
        <button onClick={onClose} className="p-2 hover:bg-surface-elevated rounded-full text-text-secondary transition-colors">
          <X size={20} />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6" ref={scrollRef}>
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`flex max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'} items-start gap-3`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 border border-border-light shadow-sm ${
                msg.role === 'user' ? 'bg-bg-tertiary' : 'bg-gradient-main'
              }`}>
                {msg.role === 'user' ? <User size={14} className="text-text-primary" /> : <Bot size={14} className="text-white" />}
              </div>
              <div className={`p-4 rounded-2xl text-sm leading-relaxed shadow-sm transition-all ${
                msg.role === 'user' 
                  ? 'bg-surface-elevated text-text-primary rounded-tr-none border border-border-light shadow-3d' 
                  : 'bg-accent-main/10 text-text-primary rounded-tl-none border border-accent-main/20 shadow-none'
              }`}>
                {msg.text}
              </div>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="flex items-center gap-3">
               <div className="w-8 h-8 rounded-full bg-gradient-main flex items-center justify-center animate-bounce">
                 <Bot size={14} className="text-white" />
               </div>
               <div className="bg-surface-primary p-4 rounded-2xl rounded-tl-none border border-accent-main/20 flex items-center gap-3 shadow-sm">
                 <Loader2 size={16} className="animate-spin text-accent-main" />
                 <span className="text-xs text-text-tertiary font-bold tracking-wide">ANALYZING MARKETS...</span>
               </div>
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="p-6 border-t border-border-light bg-surface-primary/50 dark:bg-surface-glass">
        <div className="relative group">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask about trends, valuations, or forecasts..."
            className="w-full bg-surface-elevated text-text-primary border border-border-light rounded-2xl pl-5 pr-14 py-4 focus:outline-none focus:border-accent-main focus:ring-2 focus:ring-accent-main/20 transition-all placeholder:text-text-tertiary shadow-inner-light"
          />
          <button 
            onClick={handleSend}
            disabled={!input.trim() || loading}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-2.5 bg-accent-main text-white rounded-xl hover:bg-accent-secondary disabled:opacity-50 transition-all shadow-md transform active:scale-95"
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default GeminiAssistant;