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
        <div className="mr-3 py-3 px-4 rounded-2xl rounded-tr-sm bg-primary/5 text-neutral-900 max-w-3xl border border-neutral-200/60">
          <p className="whitespace-pre-wrap">{content}</p>
        </div>
        <div className="w-8 h-8 rounded-full bg-primary/10 flex-shrink-0 flex items-center justify-center text-neutral-600">
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
        <div className="w-8 h-8 rounded-full bg-primary/10 flex-shrink-0 flex items-center justify-center text-primary">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 8h1a4 4 0 0 1 0 8h-1"></path>
            <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"></path>
            <line x1="6" y1="1" x2="6" y2="4"></line>
            <line x1="10" y1="1" x2="10" y2="4"></line>
            <line x1="14" y1="1" x2="14" y2="4"></line>
          </svg>
        </div>
        <div className="ml-3 py-3 px-4 rounded-2xl rounded-tl-sm bg-white max-w-3xl border border-neutral-200/60">
          {category && (
            <div className="mb-2 pb-2 border-b border-neutral-100">
              <Badge variant="outline" className="text-xs text-primary/80 font-medium bg-primary/5 rounded-full px-2 py-0.5 border-primary/10">
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
          
          {sources && Array.isArray(sources) && sources.length > 0 && (
            <div className="mt-3 pt-2 border-t border-neutral-100 text-sm text-neutral-500">
              <p className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
                  <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
                  <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
                </svg>
                <span>Sources: {typeof sources === 'string' ? sources : Array.isArray(sources) ? sources.join(', ') : 'Unknown'}</span>
              </p>
            </div>
          )}
        </div>
      </div>
    );
  }
}
