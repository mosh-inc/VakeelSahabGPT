import { useState, useRef, ChangeEvent, FormEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

interface MessageInputProps {
  onSendMessage: (message: string) => void;
  disabled?: boolean;
}

export default function MessageInput({ onSendMessage, disabled = false }: MessageInputProps) {
  const [message, setMessage] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleInputChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
    adjustTextareaHeight();
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    
    if (!message.trim() || disabled) return;
    
    onSendMessage(message);
    setMessage('');
    
    // Reset the textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const adjustTextareaHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 150)}px`;
    }
  };

  return (
    <div className="bg-white rounded-xl border border-neutral-200 p-2 mx-auto">
      <form onSubmit={handleSubmit} className="flex items-end space-x-2">
        <div className="flex-1 relative">
          <Textarea
            ref={textareaRef}
            value={message}
            onChange={handleInputChange}
            placeholder="Ask about legal information..."
            className="w-full border border-neutral-200 rounded-xl px-4 py-3 pr-16 resize-none focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 min-h-[50px] text-neutral-800 placeholder:text-neutral-500"
            rows={1}
            disabled={disabled}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(e);
              }
            }}
          />
          
          <div className="absolute right-3 bottom-2.5 flex space-x-1">
            {/* Microphone icon - Gemini style */}
            <button 
              type="button" 
              className="text-neutral-400 hover:text-neutral-600 p-1 rounded-full hover:bg-neutral-100" 
              aria-label="Voice input"
              disabled={disabled}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"></path>
                <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
                <line x1="12" y1="19" x2="12" y2="22"></line>
              </svg>
            </button>
            
            {/* Upload icon - Gemini style */}
            <button 
              type="button" 
              className="text-neutral-400 hover:text-neutral-600 p-1 rounded-full hover:bg-neutral-100" 
              aria-label="Upload files"
              disabled={disabled}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="17 8 12 3 7 8"></polyline>
                <line x1="12" y1="3" x2="12" y2="15"></line>
              </svg>
            </button>
          </div>
        </div>
        
        <Button 
          type="submit" 
          className={`rounded-full p-2 w-10 h-10 flex items-center justify-center ${
            message.trim() && !disabled 
              ? 'bg-primary hover:bg-primary/90 text-white' 
              : 'bg-neutral-100 text-neutral-400'
          }`}
          variant={message.trim() && !disabled ? 'default' : 'ghost'}
          disabled={disabled || !message.trim()}
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="20" 
            height="20" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          >
            <path d="M22 2L11 13"></path>
            <path d="M22 2l-7 20-4-9-9-4 20-7z"></path>
          </svg>
        </Button>
      </form>
      
      {/* Disclaimer text below input - Gemini style */}
      <div className="px-2 mt-2 text-center">
        <p className="text-xs text-neutral-500">
          Legal AI may display inaccurate info, including about people, places, facts, and law
        </p>
      </div>
    </div>
  );
}
