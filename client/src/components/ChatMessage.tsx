import { MessageType } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';

interface ChatMessageProps {
  message: MessageType;
}

export default function ChatMessage({ message }: ChatMessageProps) {
  const { content, role, category, sources } = message;
  
  // Category display names mapping with emojis
  const categoryDisplayNames: Record<string, { label: string, icon: string }> = {
    contracts: { label: 'Contracts', icon: '📄' },
    family: { label: 'Family Law', icon: '👪' },
    employment: { label: 'Employment Law', icon: '💼' },
    property: { label: 'Property Law', icon: '🏠' },
    ip: { label: 'Intellectual Property', icon: '™️' },
    criminal: { label: 'Criminal Law', icon: '⚖️' },
    immigration: { label: 'Immigration Law', icon: '🌍' },
    personal_injury: { label: 'Personal Injury', icon: '🩹' },
    tax: { label: 'Tax Law', icon: '📊' },
    bankruptcy: { label: 'Bankruptcy', icon: '💰' },
  };

  // Convert markdown-style strong and emphasis to HTML
  const processText = (text: string): string => {
    // Bold with ** or __
    let processed = text.replace(/\*\*(.*?)\*\*|__(.*?)__/g, '<strong>$1$2</strong>');
    // Italic with * or _
    processed = processed.replace(/\*(.*?)\*|_(.*?)_/g, '<em>$1$2</em>');
    return processed;
  };

  if (role === 'user') {
    return (
      <div className="chat-message user py-6 px-3 sm:px-6">
        <div className="flex items-start justify-end">
          <div className="mr-3 py-3 px-4 rounded-2xl bg-neutral-50 text-neutral-900 max-w-3xl">
            <p className="whitespace-pre-wrap">{content}</p>
          </div>
          <div className="w-8 h-8 rounded-full bg-neutral-200 flex-shrink-0 flex items-center justify-center text-neutral-600">
            <span className="font-medium text-sm">You</span>
          </div>
        </div>
      </div>
    );
  } else {
    return (
      <div className="chat-message assistant py-6 px-3 sm:px-6 border-b border-neutral-100 last:border-b-0">
        <div className="flex items-start">
          <div className="w-8 h-8 rounded-full bg-primary/10 flex-shrink-0 flex items-center justify-center text-primary">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 8h1a4 4 0 0 1 0 8h-1"></path>
              <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"></path>
              <line x1="6" y1="1" x2="6" y2="4"></line>
              <line x1="10" y1="1" x2="10" y2="4"></line>
              <line x1="14" y1="1" x2="14" y2="4"></line>
            </svg>
          </div>
          <div className="ml-3 max-w-3xl">
            {category && (
              <div className="mb-2">
                <Badge variant="outline" className="text-xs text-primary/80 font-medium bg-primary/5 rounded-full px-2 py-0.5 border-primary/10">
                  {categoryDisplayNames[category]?.icon} {categoryDisplayNames[category]?.label || category}
                </Badge>
              </div>
            )}
            
            <ScrollArea className="max-h-[500px]">
              <div className="text-neutral-800">
                {content.split('\n').map((paragraph, index) => {
                  const processed = processText(paragraph);
                  
                  // Handle lists with * or - or 1.
                  if (paragraph.trim().match(/^[\*\-]\s/)) {
                    return (
                      <ul key={index} className="list-disc pl-5 space-y-1 mb-3">
                        <li dangerouslySetInnerHTML={{ __html: processed.trim().replace(/^[\*\-]\s/, '') }} />
                      </ul>
                    );
                  } 
                  else if (paragraph.trim().match(/^\d+\.\s/)) {
                    return (
                      <ol key={index} className="list-decimal pl-5 space-y-1 mb-3">
                        <li dangerouslySetInnerHTML={{ __html: processed.trim().replace(/^\d+\.\s/, '') }} />
                      </ol>
                    );
                  }
                  else if (paragraph.trim() === '') {
                    return <div key={index} className="h-4"></div>;
                  }
                  else {
                    return <p key={index} className="mb-3" dangerouslySetInnerHTML={{ __html: processed }} />;
                  }
                })}
              </div>
            </ScrollArea>
            
            {sources && Array.isArray(sources) && sources.length > 0 && (
              <div className="mt-4 pt-3 border-t border-neutral-100 text-sm text-neutral-600">
                <p className="font-medium mb-1">Sources</p>
                <ul className="list-disc pl-5 space-y-1">
                  {sources.map((source, index) => (
                    <li key={index} className="text-neutral-600">
                      {typeof source === 'string' ? source : 'Source ' + (index + 1)}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
}
