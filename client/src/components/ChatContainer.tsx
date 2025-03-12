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
    <div className="chat-container h-[calc(100vh-15rem)] md:h-[calc(100vh-15rem)] overflow-y-auto bg-white rounded-lg shadow-sm border border-neutral-200 mb-4 p-4">
      {messages.map((message) => (
        <ChatMessage key={message.id} message={message} />
      ))}
      
      {/* Loading indicator shown when waiting for AI response */}
      {isLoading && (
        <div className="flex items-start mb-6">
          <div className="w-8 h-8 rounded-full bg-primary flex-shrink-0 flex items-center justify-center text-white">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
              <polyline points="7.5 4.21 12 6.81 16.5 4.21"></polyline>
              <polyline points="7.5 19.79 7.5 14.6 3 12"></polyline>
              <polyline points="21 12 16.5 14.6 16.5 19.79"></polyline>
              <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
              <line x1="12" y1="22.08" x2="12" y2="12"></line>
            </svg>
          </div>
          <div className="ml-3 bg-neutral-100 p-3 rounded-lg rounded-tl-none max-w-3xl w-full">
            <div className="flex space-x-2">
              <div className="typing-indicator flex items-center space-x-1">
                <div className="w-2 h-2 bg-secondary rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
                <div className="w-2 h-2 bg-secondary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-2 h-2 bg-secondary rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
              </div>
            </div>
            <Skeleton className="h-4 w-3/4 mt-4" />
            <Skeleton className="h-4 w-1/2 mt-2" />
          </div>
        </div>
      )}
      
      <div ref={messagesEndRef} />
    </div>
  );
}
