import React, { useEffect, useRef, useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { aiService } from '@/services/ai.service';
import { Send, Scale, RefreshCw, MessageSquare, ShieldAlert } from 'lucide-react';
import { useToast } from '@/hooks/useToast';

interface Message {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
}

const CHAT_HISTORY_KEY = 'saakshya_rights_chat';

export const KnowYourRightsPage: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [language, setLanguage] = useState<'en' | 'hi'>('en');

  const bottomRef = useRef<HTMLDivElement>(null);
  const toast = useToast();

  useEffect(() => {
    const saved = localStorage.getItem(CHAT_HISTORY_KEY);
    if (saved) {
      setMessages(JSON.parse(saved) as Message[]);
    } else {
      // Seed a welcome message from our legal advisor
      setMessages([
        {
          id: 'welcome',
          sender: 'ai',
          text: `Namaste! I am your AI Legal Rights Assistant. 

Explain your dispute (e.g., tenant eviction, unpaid invoices, online scam) in plain language, and I will explain your options under Indian laws.`,
          timestamp: new Date().toISOString(),
        },
      ]);
    }
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const saveHistory = (list: Message[]) => {
    localStorage.setItem(CHAT_HISTORY_KEY, JSON.stringify(list));
  };

  const handleSend = async (textToSend: string) => {
    if (!textToSend.trim()) return;

    const userMsg: Message = {
      id: Math.random().toString(36).substring(2, 9),
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toISOString(),
    };

    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    saveHistory(updatedMessages);
    setInput('');
    setLoading(true);

    try {
      const response = await aiService.askLegalQuery(textToSend, language);
      const aiMsg: Message = {
        id: Math.random().toString(36).substring(2, 9),
        sender: 'ai',
        text: response,
        timestamp: new Date().toISOString(),
      };
      const newList = [...updatedMessages, aiMsg];
      setMessages(newList);
      saveHistory(newList);
    } catch (err) {
      toast.danger('Failed to connect to AI engine.');
    } finally {
      setLoading(false);
    }
  };

  const handleClearChat = () => {
    if (window.confirm('Delete all messages in this chat history?')) {
      const reset: Message[] = [
        {
          id: 'welcome',
          sender: 'ai',
          text: 'Chat history cleared. How can I help you understand your legal options today?',
          timestamp: new Date().toISOString(),
        },
      ];
      setMessages(reset);
      saveHistory(reset);
      toast.info('Chat history cleared.');
    }
  };

  const quickStarters = [
    { label: '🏘️ Tenant Security Deposit', query: 'My landlord is refusing to return my security deposit. What are my tenant rights in India?' },
    { label: '📱 Online Fraud Scam', query: 'I paid online for a product but received stones in the package, and the seller blocked me. What should I do?' },
    { label: '💼 Unpaid Work Delivery', query: 'I delivered contract work to a client but they blocked me and refuse to pay. How do I recover my dues?' },
  ];

  return (
    <AppLayout title="Know Your Rights">
      <div className="flex flex-col gap-6 w-full h-[calc(100vh-140px)] max-w-4xl mx-auto pb-6 relative">
        {/* Header toolbar */}
        <div className="flex items-center justify-between w-full select-none flex-shrink-0">
          <div className="flex items-center gap-2 text-primary-400">
            <Scale className="w-5 h-5 text-accent-500 animate-shield-pulse" />
            <h1 className="text-sm font-bold text-text-primary">AI Legal Assistant</h1>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setLanguage(language === 'en' ? 'hi' : 'en')}
              className="text-xs font-bold font-mono px-2 py-1"
            >
              Language: {language === 'en' ? 'English 🇬🇧' : 'Hindi 🇮🇳'}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClearChat}
              className="text-danger hover:bg-danger/5 text-xs px-2 py-1"
            >
              Clear Chat
            </Button>
          </div>
        </div>

        {/* Messages display container */}
        <Card variant="solid" hoverEffect={false} className="flex-1 flex flex-col overflow-hidden border border-border p-4">
          <div className="flex-1 overflow-y-auto pr-2 flex flex-col gap-4 scrollbar-thin">
            {messages.map((msg) => {
              const isUser = msg.sender === 'user';
              return (
                <div
                  key={msg.id}
                  className={`flex ${isUser ? 'justify-end' : 'justify-start'} w-full animate-fade-in`}
                >
                  <div
                    className={`max-w-[80%] rounded-xl px-4 py-3 text-xs leading-relaxed ${
                      isUser
                        ? 'bg-primary-600 text-white rounded-br-none shadow-md'
                        : 'bg-bg-primary/50 text-text-secondary border border-border rounded-bl-none'
                    } whitespace-pre-wrap`}
                  >
                    {msg.text}
                  </div>
                </div>
              );
            })}
            {loading && (
              <div className="flex justify-start w-full animate-pulse">
                <div className="bg-bg-primary/40 border border-border text-text-muted rounded-xl rounded-bl-none px-4 py-3 text-xs flex items-center gap-2">
                  <RefreshCw className="w-4.5 h-4.5 animate-spin text-primary-500" />
                  <span>AI Legal advisor is typing...</span>
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Quick starters on empty flow */}
          {messages.length <= 1 && (
            <div className="p-3 border-t border-border flex flex-col gap-2 flex-shrink-0 select-none">
              <span className="text-[10px] text-text-muted font-bold uppercase tracking-wider">
                Select a topic to begin:
              </span>
              <div className="flex flex-wrap gap-2">
                {quickStarters.map((qs, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSend(qs.query)}
                    className="px-3 py-1.5 rounded-lg border border-border bg-bg-secondary/40 text-[10px] text-text-secondary hover:text-text-primary hover:border-border-hover transition text-left cursor-pointer"
                  >
                    {qs.label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </Card>

        {/* Input box */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend(input);
          }}
          className="flex items-center gap-3 flex-shrink-0 w-full"
        >
          <Input
            type="text"
            placeholder={language === 'en' ? 'Ask about a dispute (e.g. landlord threatening eviction...)' : 'विवाद के बारे में पूछें (उदा. मकान मालिक धमकी दे रहा है...)'}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={loading}
            className="flex-1"
            required
          />
          <Button type="submit" variant="primary" loading={loading} disabled={!input.trim()} className="px-5">
            <Send className="w-4 h-4" />
          </Button>
        </form>
      </div>
    </AppLayout>
  );
};
export default KnowYourRightsPage;
