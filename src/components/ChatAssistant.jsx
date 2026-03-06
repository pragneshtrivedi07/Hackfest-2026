import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Bot, User, Loader2 } from 'lucide-react';

const ChatAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Hello! I am the HACKFEST AI Assistant. How can I help you regarding the problem statements, tech stack, or RAG concepts today?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const handleSend = async (text = input) => {
    if (!text.trim()) return;
    
    const userMessage = { role: 'user', content: text };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const chatMessages = [...(messages || []).filter(m => m.role !== 'system'), userMessage];
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: chatMessages })
      });
      
      const data = await response.json();
      if (data.text) {
        setMessages(prev => [...prev, { role: 'assistant', content: data.text }]);
      } else {
        throw new Error('No text in response');
      }
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { role: 'assistant', content: "Sorry, I'm having trouble connecting right now. Please try again later." }]);
    } finally {
      setIsLoading(false);
    }
  };

  const quickReplies = [
    "What is RAG?",
    "Team Size Rules",
    "Registration Fees",
    "Bring Laptops?"
  ];

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 w-16 h-16 bg-gradient-to-r from-[var(--color-gold-primary)] to-[#A67F24] rounded-full shadow-2xl flex items-center justify-center text-[var(--color-navy-primary)] hover:scale-110 transition-transform z-50 ${isOpen ? 'hidden' : 'flex'}`}
      >
        <div className="absolute inset-0 rounded-full animate-pulse-ring"></div>
        <MessageSquare size={30} fill="currentColor" />
      </button>

      {isOpen && (
        <div className="fixed bottom-6 right-6 w-[400px] h-[500px] max-h-[80vh] max-w-[90vw] bg-[var(--color-navy-mid)] rounded-2xl flex flex-col shadow-2xl border border-[var(--color-gold-primary)]/30 z-50 overflow-hidden animate-in slide-in-from-bottom-5">
          {/* Header */}
          <div className="bg-[var(--color-navy-primary)] p-4 border-b border-[var(--color-gold-primary)]/20 flex justify-between items-center premium-gradient">
            <div className="flex items-center gap-3">
              <div className="bg-[var(--color-gold-primary)] w-8 h-8 rounded-full flex items-center justify-center">
                <Bot size={20} className="text-[var(--color-navy-primary)]" />
              </div>
              <h3 className="text-white font-bold tracking-wide">HACKFEST AI Assistant</h3>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-white transition-colors">
              <X size={24} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-hide bg-[#0a0f2c] bg-opacity-95">
            {(messages || []).map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                  msg.role === 'user' 
                    ? 'bg-[var(--color-navy-soft)] text-white border border-[var(--color-gold-primary)]/20 rounded-tr-none' 
                    : 'bg-[#1a2342] text-gray-200 border border-gray-700/50 rounded-tl-none'
                }`}>
                  {msg.content}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-[#1a2342] border border-gray-700/50 rounded-2xl rounded-tl-none px-4 py-3 flex gap-1">
                  <div className="w-2 h-2 rounded-full bg-[var(--color-gold-primary)] animate-bounce"></div>
                  <div className="w-2 h-2 rounded-full bg-[var(--color-gold-primary)] animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  <div className="w-2 h-2 rounded-full bg-[var(--color-gold-primary)] animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-3 bg-[var(--color-navy-primary)] border-t border-[var(--color-gold-primary)]/20">
            {/* Quick Replies */}
            {messages.length < 3 && (
              <div className="flex flex-wrap gap-2 mb-3">
                {(quickReplies || []).map(qr => (
                  <button 
                    key={qr} 
                    onClick={() => handleSend(qr)}
                    className="text-xs bg-[var(--color-gold-primary)]/10 text-[var(--color-gold-light)] border border-[var(--color-gold-primary)]/30 rounded-full px-3 py-1.5 hover:bg-[var(--color-gold-primary)]/20 transition-colors whitespace-nowrap"
                  >
                    {qr}
                  </button>
                ))}
              </div>
            )}
            
            <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="flex gap-2">
              <input 
                type="text" 
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder="Ask about AI, RAG, or the hackathon..."
                className="flex-1 bg-[var(--color-navy-soft)] text-white border border-gray-600 rounded-full px-4 py-2 text-sm focus:outline-none focus:border-[var(--color-gold-primary)] transition-colors"
                disabled={isLoading}
              />
              <button 
                type="submit" 
                disabled={isLoading || !input.trim()}
                className="w-10 h-10 bg-[var(--color-gold-primary)] rounded-full flex items-center justify-center text-[var(--color-navy-primary)] disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[var(--color-gold-light)] transition-colors shrink-0"
              >
                {isLoading ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} className="ml-1" />}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatAssistant;
