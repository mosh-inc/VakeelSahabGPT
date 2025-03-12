import { MessageType } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';

interface ChatMessageProps {
  message: MessageType;
}

export default function ChatMessage({ message }: ChatMessageProps) {
  const { content, role, category, sources } = message;
  
  // Category display names mapping
  const categoryDisplayNames: Record<string, string> = {
    contracts: 'Contracts',
    family: 'Family Law',
    employment: 'Employment Law',
    property: 'Property Law',
    ip: 'Intellectual Property',
    criminal: 'Criminal Law',
    immigration: 'Immigration Law',
    personal_injury: 'Personal Injury',
    tax: 'Tax Law',
    bankruptcy: 'Bankruptcy',
  };

  if (role === 'user') {
    return (
      <div className="flex items-start justify-end mb-6">
        <div className="mr-3 bg-secondary text-white p-3 rounded-lg rounded-tr-none max-w-3xl">
          <p className="whitespace-pre-wrap">{content}</p>
        </div>
        <div className="w-8 h-8 rounded-full bg-neutral-300 flex-shrink-0 flex items-center justify-center text-neutral-600">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
            <circle cx="12" cy="7" r="4"></circle>
          </svg>
        </div>
      </div>
    );
  } else {
    return (
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
        <div className="ml-3 bg-neutral-100 p-3 rounded-lg rounded-tl-none max-w-3xl">
          {category && (
            <div className="mb-2 pb-2 border-b border-neutral-200">
              <Badge variant="outline" className="text-xs text-neutral-500 font-medium bg-neutral-200 rounded-full px-2 py-1">
                {categoryDisplayNames[category] || category}
              </Badge>
            </div>
          )}
          
          <ScrollArea className="max-h-96">
            <div className="text-neutral-800 whitespace-pre-wrap">
              {content.split('\n').map((paragraph, index) => {
                // Handle lists with * or - or 1.
                if (paragraph.trim().match(/^[\*\-]\s/)) {
                  return (
                    <ul key={index} className="list-disc pl-5 space-y-1 mb-3">
                      <li>{paragraph.trim().replace(/^[\*\-]\s/, '')}</li>
                    </ul>
                  );
                } 
                else if (paragraph.trim().match(/^\d+\.\s/)) {
                  return (
                    <ol key={index} className="list-decimal pl-5 space-y-1 mb-3">
                      <li>{paragraph.trim().replace(/^\d+\.\s/, '')}</li>
                    </ol>
                  );
                }
                else {
                  return <p key={index} className="mb-3">{paragraph}</p>;
                }
              })}
            </div>
          </ScrollArea>
          
          {sources && sources.length > 0 && (
            <div className="mt-3 pt-2 border-t border-neutral-200 text-sm text-neutral-500">
              <p>
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="inline mr-1">
                  <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
                  <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
                </svg>
                Sources: {sources.join(', ')}
              </p>
            </div>
          )}
        </div>
      </div>
    );
  }
}
