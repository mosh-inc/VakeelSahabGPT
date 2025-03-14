import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import ChatContainer from '@/components/ChatContainer';
import MessageInput from '@/components/MessageInput';
import DisclaimerBanner from '@/components/DisclaimerBanner';
import TopicCategories from '@/components/TopicCategories';
import { LEGAL_CATEGORIES, LegalCategory } from '@shared/schema';
import { MessageType } from '@/lib/types';
import { useQuery, useMutation } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { queryClient } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { useIsMobile } from '@/hooks/use-mobile';

export default function Home() {
  const [sessionId, setSessionId] = useState<string>('');
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<LegalCategory>('all');
  const { toast } = useToast();

  // Initialize session on component mount
  useEffect(() => {
    // Check if we have a session ID in localStorage
    const storedSessionId = localStorage.getItem('legalAssistSessionId');
    if (storedSessionId) {
      setSessionId(storedSessionId);
    } else {
      // Create a new session ID
      const newSessionId = uuidv4();
      localStorage.setItem('legalAssistSessionId', newSessionId);
      setSessionId(newSessionId);
    }
  }, []);

  // Fetch messages when session ID is available
  const { data: fetchedMessages, isLoading } = useQuery({
    queryKey: ['/api/messages', sessionId],
    queryFn: async () => {
      if (!sessionId) return [];
      const response = await fetch(`/api/messages/${sessionId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch messages');
      }
      return response.json();
    },
    enabled: !!sessionId
  });

  // Update messages when fetch completes
  useEffect(() => {
    if (fetchedMessages) {
      setMessages(fetchedMessages);
    }
  }, [fetchedMessages]);

  // Add a welcome message if no messages exist
  useEffect(() => {
    if (!isLoading && messages.length === 0) {
      setMessages([
        {
          id: 0,
          sessionId,
          content: "**Assalamu Alaikum!** 👋\n\nWelcome to Vakeel Sahab GPT, your AI-powered legal assistant. I'm designed to provide information on Pakistani and international legal topics including:\n\n- Contract law and agreement reviews\n- Family law matters including marriage, divorce, and inheritance\n- Employment and labor regulations\n- Property laws and documentation\n- Intellectual property protection\n\nHow may I assist you with your legal questions today?",
          role: 'assistant',
          category: null,
          sources: null,
          createdAt: new Date(),
        },
      ]);
    }
  }, [isLoading, messages.length, sessionId]);

  // Chat message mutation
  const chatMutation = useMutation({
    mutationFn: async (message: string) => {
      const response = await apiRequest('POST', '/api/chat', {
        message,
        sessionId,
        category: selectedCategory !== 'all' ? selectedCategory : undefined
      });
      return response.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['/api/messages', sessionId] });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: `Failed to send message: ${error.message}`,
        variant: 'destructive'
      });
    }
  });

  // Handle sending a message
  const handleSendMessage = async (message: string) => {
    if (!message.trim() || !sessionId) return;

    // Optimistically add user message to chat
    const userMessage: MessageType = {
      id: Date.now(),
      sessionId,
      content: message,
      role: 'user',
      category: null,
      sources: null,
      createdAt: new Date(),
    };
    
    setMessages((prev) => [...prev, userMessage]);
    
    // Send to API
    await chatMutation.mutate(message);
  };

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Header - Gemini-style header with subtle bottom border */}
      <header className="bg-white border-b border-neutral-200/70 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary mr-3">
              <path d="M18 8h1a4 4 0 0 1 0 8h-1"></path>
              <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"></path>
              <line x1="6" y1="1" x2="6" y2="4"></line>
              <line x1="10" y1="1" x2="10" y2="4"></line>
              <line x1="14" y1="1" x2="14" y2="4"></line>
            </svg>
            <div>
              <h1 className="text-neutral-900 text-xl font-medium">Vakeel Sahab GPT</h1>
              <p className="text-neutral-500 text-xs">Your AI Legal Assistant</p>
            </div>
          </div>
          <div className="flex items-center space-x-1">
            <button className="p-2 rounded-full hover:bg-neutral-100 focus:outline-none text-neutral-600" aria-label="Theme">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="5"></circle>
                <line x1="12" y1="1" x2="12" y2="3"></line>
                <line x1="12" y1="21" x2="12" y2="23"></line>
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                <line x1="1" y1="12" x2="3" y2="12"></line>
                <line x1="21" y1="12" x2="23" y2="12"></line>
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
              </svg>
            </button>
            <button className="p-2 rounded-full hover:bg-neutral-100 focus:outline-none text-neutral-600" aria-label="Settings">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="3"></circle>
                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
              </svg>
            </button>
            <button className="ml-1 flex items-center justify-center w-8 h-8 rounded-full bg-neutral-100 text-neutral-600 hover:bg-neutral-200 focus:outline-none">
              <span className="font-medium text-sm">VS</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-auto max-w-5xl mx-auto px-4 sm:px-6 md:px-8 py-6 flex flex-col space-y-6">
        {/* Disclaimer Banner */}
        <DisclaimerBanner />
      
        {/* Topic Categories */}
        <TopicCategories 
          categories={LEGAL_CATEGORIES} 
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
        />

        {/* Chat Container */}
        <div className="flex-1 min-h-0 overflow-y-auto mb-4">
          <ChatContainer 
            messages={messages} 
            isLoading={chatMutation.isPending}
          />
        </div>

        {/* Input Area - Fixed at bottom */}
        <div className="sticky bottom-0 pb-4 pt-2 bg-white">
          <MessageInput 
            onSendMessage={handleSendMessage} 
            disabled={chatMutation.isPending}
          />
        </div>
      </main>

      {/* Footer - Simplified Gemini-style footer */}
      <footer className="bg-white border-t border-neutral-200/70 py-3">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col sm:flex-row justify-between items-center text-xs text-neutral-500">
            <div className="mb-2 sm:mb-0">
              <p>© {new Date().getFullYear()} Vakeel Sahab GPT. All rights reserved.</p>
            </div>
            <div className="flex space-x-6">
              <a href="#" className="hover:text-primary transition-colors">Terms</a>
              <a href="#" className="hover:text-primary transition-colors">Privacy</a>
              <a href="#" className="hover:text-primary transition-colors">Help</a>
              <a href="#" className="hover:text-primary transition-colors">Feedback</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
