
import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Loader2, Bot } from 'lucide-react';
import { getFinancialAdvice } from '../services/geminiService';
import { Transaction, CreditReport, AdvisorMessage, UserProfile } from '../types';

interface AdvisorChatProps {
  transactions: Transaction[];
  report: CreditReport | null;
  user?: UserProfile;
}

// Ghana region-based greetings
const getRegionGreeting = (region?: string): string => {
  if (!region) return "Akwaaba!";
  
  const regionLower = region.toLowerCase();
  
  // Ewe regions (Volta, Greater Accra, Oti)
  if (regionLower.includes('volta') || regionLower.includes('greater accra') || regionLower.includes('oti')) {
    return "Woezor!";
  }
  
  // Northern regions (Northern, North East, Upper East, Upper West, Savannah)
  if (regionLower.includes('northern') || regionLower.includes('upper east') || regionLower.includes('upper west') || regionLower.includes('savannah')) {
    return "Saha!";
  }
  
  // Default to Akan greeting (Ashanti, Bono, Central, Eastern, Western, etc.)
  return "Akwaaba!";
};

const AdvisorChat: React.FC<AdvisorChatProps> = ({ transactions, report, user }) => {
  const [isOpen, setIsOpen] = useState(false);
  const greeting = getRegionGreeting(user?.region);
  const [messages, setMessages] = useState<AdvisorMessage[]>([
    { role: 'model', text: `${greeting} I'm your CrediGhana Advisor. How can I help you grow your business today?` }
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

    const userMsg: AdvisorMessage = { role: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const response = await getFinancialAdvice([...messages, userMsg], transactions, report);
      setMessages(prev => [...prev, { role: 'model', text: response }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'model', text: "Sorry, I'm having trouble connecting to my brain right now." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[100]">
      {!isOpen ? (
        <button 
          onClick={() => setIsOpen(true)}
          className="w-14 h-14 bg-indigo-600 rounded-full flex items-center justify-center text-white shadow-2xl hover:scale-110 transition active:scale-95"
        >
          <MessageSquare size={24} />
        </button>
      ) : (
        <div className="bg-white rounded-3xl w-[350px] sm:w-[400px] h-[500px] shadow-2xl flex flex-col overflow-hidden border border-slate-200 animate-in slide-in-from-bottom-4 duration-300">
          <div className="bg-indigo-600 p-4 text-white flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <Bot size={20} className="text-indigo-200" />
              <span className="font-bold">Business Advisor</span>
            </div>
            <button onClick={() => setIsOpen(false)} className="hover:bg-white/20 p-1 rounded-lg">
              <X size={20} />
            </button>
          </div>

          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] p-3 rounded-2xl text-sm ${
                  m.role === 'user' 
                  ? 'bg-indigo-600 text-white rounded-br-none' 
                  : 'bg-white border border-slate-100 text-slate-700 rounded-bl-none shadow-sm'
                }`}>
                  {m.text}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-white border border-slate-100 p-3 rounded-2xl rounded-bl-none shadow-sm">
                  <Loader2 size={16} className="animate-spin text-indigo-600" />
                </div>
              </div>
            )}
          </div>

          <div className="p-4 border-t border-slate-100 bg-white">
            <div className="flex space-x-2">
              <input 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Ask about your credit score..."
                className="flex-1 bg-slate-100 border-none rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
              />
              <button 
                onClick={handleSend}
                disabled={loading}
                className="bg-indigo-600 text-white p-2 rounded-xl hover:bg-indigo-700 disabled:opacity-50 transition"
              >
                <Send size={18} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdvisorChat;
