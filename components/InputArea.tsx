import React, { useState, useRef, useEffect } from 'react';
import { Send, Sparkles } from 'lucide-react';
import { ThemeConfig } from '../types';

interface InputAreaProps {
  onSendMessage: (text: string) => void;
  isLoading: boolean;
  prefill?: string;
  theme: ThemeConfig;
}

const InputArea: React.FC<InputAreaProps> = ({ onSendMessage, isLoading, prefill, theme }) => {
  const [input, setInput] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (prefill) {
      setInput(prefill);
      if (textareaRef.current) {
        textareaRef.current.focus();
        // Adjust height immediately
        requestAnimationFrame(() => {
           if(textareaRef.current) {
             textareaRef.current.style.height = 'auto';
             textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
           }
        });
      }
    }
  }, [prefill]);

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    // Auto-resize
    e.target.style.height = 'auto';
    e.target.style.height = `${e.target.scrollHeight}px`;
  };

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || isLoading) return;
    
    onSendMessage(input);
    setInput('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className={`border-t backdrop-blur-md p-4 pb-6 absolute bottom-0 left-0 right-0 z-10 transition-colors duration-500 ${theme.border} ${theme.bgPanel}`}>
      <div className="max-w-3xl mx-auto">
        <form onSubmit={handleSubmit} className={`relative flex items-end gap-2 p-2 rounded-3xl border focus-within:ring-2 transition-all shadow-inner 
          ${theme.inputBg} ${theme.border} ${theme.id === 'default' ? 'focus-within:ring-bare-300' : 'focus-within:ring-gray-300'}`}>
          <textarea
            ref={textareaRef}
            value={input}
            onChange={handleInput}
            onKeyDown={handleKeyDown}
            placeholder="Describe your occasion, mood, or what items you have..."
            className={`w-full bg-transparent border-none focus:ring-0 resize-none max-h-32 py-3 px-4 min-h-[48px] placeholder-opacity-70 ${theme.textMain} ${theme.fontSans}`}
            style={{ '--tw-placeholder-opacity': '0.7' } as React.CSSProperties}
            rows={1}
            disabled={isLoading}
          />
          <button
            type="button"
            className={`p-2 mb-1 transition-colors ${theme.textMuted} hover:opacity-80`}
            title="Style Wizard (Help)"
            onClick={() => setInput("Occasion: \nWeather: \nMood: \nI have: \nBudget: ")}
          >
            <Sparkles size={20} />
          </button>
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className={`p-3 rounded-full mb-1 transition-all duration-200 shadow-md
              ${!input.trim() || isLoading 
                ? 'opacity-50 cursor-not-allowed bg-gray-300 text-gray-500' 
                : `${theme.buttonBg} ${theme.buttonText} hover:scale-105`}`}
          >
            <Send size={20} />
          </button>
        </form>
        <p className={`text-center text-xs mt-2 transition-colors ${theme.textMuted} ${theme.fontSans}`}>
          BareStich Style Buddy can make mistakes. Trust your mirror first.
        </p>
      </div>
    </div>
  );
};

export default InputArea;