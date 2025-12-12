import { Logo } from "./Logo";

interface ChatMessageProps {
  role: "user" | "assistant";
  content: string;
}

export function ChatMessage({ role, content }: ChatMessageProps) {
  const isUser = role === "user";

  return (
    <div className={`flex gap-4 ${isUser ? "justify-end" : "justify-start"} mb-6`}>
      {!isUser && (
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-black text-white flex items-center justify-center">
          <Logo variant="symbol" className="w-5 h-5" />
        </div>
      )}
      
      <div className={`max-w-[85%] ${isUser ? "bg-black text-white" : "bg-gray-50 text-gray-900"} rounded-2xl px-6 py-4`}>
        <div 
          className="whitespace-pre-wrap"
          dangerouslySetInnerHTML={{ __html: formatMessage(content) }}
        />
      </div>

      {isUser && (
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
          <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </div>
      )}
    </div>
  );
}

// Format MENTORA's structured responses
function formatMessage(content: string): string {
  let formatted = content;

  // Bold headers (lines ending with colon or starting with **)
  formatted = formatted.replace(/\*\*(.*?)\*\*/g, '<strong class="font-medium">$1</strong>');
  
  // Detect and format numbered lists
  formatted = formatted.replace(/^(\d+\.\s.*?)$/gm, '<div class="ml-4 mt-2">$1</div>');
  
  // Detect and format bullet points
  formatted = formatted.replace(/^[•\-]\s(.*)$/gm, '<div class="ml-4 mt-1.5">• $1</div>');
  
  // Format sections with headers
  formatted = formatted.replace(/^([A-Z\s]+):$/gm, '<div class="mt-4 mb-2 font-medium tracking-wide">$1</div>');

  return formatted;
}
