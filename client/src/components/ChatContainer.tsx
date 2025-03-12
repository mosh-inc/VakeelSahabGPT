import { useRef, useEffect } from 'react';
import { MessageType } from '@/lib/types';
import ChatMessage from './ChatMessage';
import { Skeleton } from '@/components/ui/skeleton';

interface ChatContainerProps {
  messages: MessageType[];
  isLoading: boolean;
}

export default function ChatContainer({ messages, isLoading }: ChatContainerProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to the bottom of the chat when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  return (
    <div className="chat-container min-h-[400px] md:min-h-[500px] overflow-y-auto bg-white px-0 sm:px-2">
      {messages.length === 0 && !isLoading && (
        <div className="flex flex-col items-center justify-center h-full py-12 text-center">
          <div className="w-16 h-16 rounded-full bg-primary/10 mb-6 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
              <path d="M18 8h1a4 4 0 0 1 0 8h-1"></path>
              <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"></path>
              <line x1="6" y1="1" x2="6" y2="4"></line>
              <line x1="10" y1="1" x2="10" y2="4"></line>
              <line x1="14" y1="1" x2="14" y2="4"></line>
            </svg>
          </div>
          <h3 className="text-xl font-medium text-neutral-800 mb-3">Vakeel Sahab GPT</h3>
          <p className="text-neutral-600 max-w-lg mb-8 text-sm sm:text-base">
            Your AI Legal Assistant powered by advanced language models. Ask me about contracts, family law, employment issues, and more.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-lg mx-auto text-left">
            <button className="bg-neutral-100 hover:bg-neutral-200 text-neutral-700 rounded-xl p-3 text-sm text-left transition-colors">
              <span className="font-medium block mb-1">📝 Help with contract terms</span>
              <span className="text-neutral-500 text-xs">Explain legal terminology in contracts</span>
            </button>
            <button className="bg-neutral-100 hover:bg-neutral-200 text-neutral-700 rounded-xl p-3 text-sm text-left transition-colors">
              <span className="font-medium block mb-1">👪 Family law questions</span>
              <span className="text-neutral-500 text-xs">Information about divorce, custody and inheritance</span>
            </button>
          </div>
        </div>
      )}
      
      {messages.map((message) => (
        <ChatMessage key={message.id} message={message} />
      ))}
      
      {/* Loading indicator shown when waiting for AI response - Gemini style */}
      {isLoading && (
        <div className="flex items-start mb-6">
          <div className="w-8 h-8 rounded-full bg-primary/10 flex-shrink-0 flex items-center justify-center text-primary">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 8h1a4 4 0 0 1 0 8h-1"></path>
              <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"></path>
              <line x1="6" y1="1" x2="6" y2="4"></line>
              <line x1="10" y1="1" x2="10" y2="4"></line>
              <line x1="14" y1="1" x2="14" y2="4"></line>
            </svg>
          </div>
          <div className="ml-3 py-2 px-3 max-w-3xl w-full">
            <div className="flex space-x-2">
              <div className="typing-indicator flex items-center space-x-1">
                <div className="w-2 h-2 bg-primary rounded-full animate-pulse" style={{ animationDelay: '0s' }}></div>
                <div className="w-2 h-2 bg-primary rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-2 h-2 bg-primary rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      <div ref={messagesEndRef} />
    </div>
  );
}
