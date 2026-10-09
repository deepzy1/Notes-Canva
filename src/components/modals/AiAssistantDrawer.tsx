import React, { useState } from 'react';
import { X, Send, Sparkles, Bot, User, Loader2, Lightbulb } from 'lucide-react';
import { geminiService } from '../../services/geminiService';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface AiAssistantDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  canvasTitle: string;
}

export const AiAssistantDrawer: React.FC<AiAssistantDrawerProps> = ({
  isOpen,
  onClose,
  canvasTitle,
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: `Hello! I'm your LearnCanvas AI tutor. Ask me anything about ${canvasTitle}, Python syntax, algorithms, or request new exercises!`,
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setIsLoading(true);

    try {
      const answer = await geminiService.askAIQuestion(
        userMsg,
        `Currently on canvas "${canvasTitle}". Interactive developer learning session.`
      );
      setMessages(prev => [...prev, { role: 'assistant', content: answer }]);
    } catch (e) {
      setMessages(prev => [
        ...prev,
        { role: 'assistant', content: 'Encountered an issue retrieving response. Please try again.' },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-y-0 right-0 w-80 sm:w-96 bg-white shadow-2xl border-l border-neutral-200 z-50 flex flex-col select-none animate-in slide-in-from-right duration-200">
      {/* Header */}
      <div className="p-4 border-b border-neutral-100 flex items-center justify-between bg-gradient-to-r from-purple-50/50 to-pink-50/50">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-purple-600 to-pink-500 p-0.5 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-neutral-900">AI Tutor</h3>
            <p className="text-[11px] text-purple-600 font-medium">Context: {canvasTitle}</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-1 rounded-full text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Messages Feed */}
      <div className="flex-1 p-4 overflow-y-auto space-y-3">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex items-start space-x-2 ${
              msg.role === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            {msg.role === 'assistant' && (
              <div className="w-6 h-6 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Bot className="w-3.5 h-3.5" />
              </div>
            )}
            <div
              className={`max-w-[82%] p-3 rounded-2xl text-xs leading-relaxed ${
                msg.role === 'user'
                  ? 'bg-purple-600 text-white font-medium rounded-tr-xs'
                  : 'bg-neutral-100 text-neutral-800 rounded-tl-xs whitespace-pre-wrap'
              }`}
            >
              {msg.content}
            </div>
            {msg.role === 'user' && (
              <div className="w-6 h-6 rounded-full bg-neutral-200 text-neutral-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                <User className="w-3.5 h-3.5" />
              </div>
            )}
          </div>
        ))}
        {isLoading && (
          <div className="flex items-center space-x-2 text-xs text-neutral-400 p-2">
            <Loader2 className="w-4 h-4 animate-spin text-purple-600" />
            <span>AI Tutor is thinking...</span>
          </div>
        )}
      </div>

      {/* Quick Prompts */}
      <div className="px-4 py-2 bg-neutral-50 border-t border-neutral-100 flex items-center space-x-1.5 overflow-x-auto text-[11px]">
        <button
          onClick={() => setInput('Explain list comprehensions with a quick snippet')}
          className="px-2.5 py-1 rounded-full bg-white border border-neutral-200 text-neutral-600 hover:border-purple-300 hover:text-purple-700 whitespace-nowrap cursor-pointer"
        >
          List Comprehension
        </button>
        <button
          onClick={() => setInput('What is the difference between tuple and list?')}
          className="px-2.5 py-1 rounded-full bg-white border border-neutral-200 text-neutral-600 hover:border-purple-300 hover:text-purple-700 whitespace-nowrap cursor-pointer"
        >
          Tuple vs List
        </button>
      </div>

      {/* Input area */}
      <div className="p-3 border-t border-neutral-100 flex items-center space-x-2">
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSend()}
          placeholder="Ask a question..."
          className="flex-1 px-3 py-2 text-xs bg-neutral-100 rounded-xl border border-transparent focus:border-purple-300 focus:bg-white outline-hidden"
        />
        <button
          onClick={handleSend}
          disabled={!input.trim() || isLoading}
          className="p-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white disabled:opacity-40 transition-colors cursor-pointer"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
