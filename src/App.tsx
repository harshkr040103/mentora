import { useState, useRef, useEffect } from "react";
import { Logo } from "./components/Logo";
import { ChatMessage } from "./components/ChatMessage";
import { ChatInput } from "./components/ChatInput";
import { PDFDownload } from "./components/PDFDownload";
import { VoiceIndicator } from "./components/VoiceIndicator";
import { MentoraAI, Phase } from "./components/MentoraAI";
import { RotateCcw } from "lucide-react";

interface Message {
  role: "user" | "assistant";
  content: string;
  showPDFDownload?: boolean;
}

export default function App() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Let's begin. Tell me your current situation and what exactly you feel confused about. Be specific — it helps me map your starting point accurately."
    }
  ]);
  const [isThinking, setIsThinking] = useState(false);
  const [pdfContent, setPdfContent] = useState<string>("");
  const mentora = useRef(new MentoraAI());
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (userMessage: string) => {
    // Add user message
    const newMessages: Message[] = [...messages, { role: "user", content: userMessage }];
    setMessages(newMessages);
    setIsThinking(true);

    // Simulate thinking delay (200-600ms for realism)
    await new Promise(resolve => setTimeout(resolve, 300 + Math.random() * 300));

    // Get MENTORA response
    const response = mentora.current.processMessage(userMessage);
    
    // Check if this is the PDF generation phase
    const currentPhase = mentora.current.getCurrentPhase();
    const showPDF = currentPhase === "voice" && response.includes("MENTORA — PERSONALIZED GROWTH & STRATEGY ROADMAP");
    
    if (showPDF) {
      setPdfContent(response);
    }
    
    setMessages([...newMessages, { role: "assistant", content: response, showPDFDownload: showPDF }]);
    setIsThinking(false);
  };

  const handleReset = () => {
    mentora.current = new MentoraAI();
    setMessages([
      {
        role: "assistant",
        content: "Let's begin. Tell me your current situation and what exactly you feel confused about. Be specific — it helps me map your starting point accurately."
      }
    ]);
  };

  const currentPhase = mentora.current.getCurrentPhase();
  const phaseLabel = getPhaseLabel(currentPhase);

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <header className="border-b border-gray-200 px-6 py-5 flex items-center justify-between sticky top-0 bg-white/80 backdrop-blur-xl z-10">
        <Logo variant="horizontal" className="text-black" />
        
        <div className="flex items-center gap-4">
          {phaseLabel && (
            <div className="text-gray-400 tracking-wider uppercase text-xs">
              {phaseLabel}
            </div>
          )}
          <button
            onClick={handleReset}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            title="Reset session"
          >
            <RotateCcw className="w-4 h-4 text-gray-600" />
          </button>
        </div>
      </header>

      {/* Chat Container */}
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto px-6 py-8">
          {currentPhase === "voice" && <VoiceIndicator />}
          
          {messages.map((message, index) => (
            <div key={index}>
              <ChatMessage role={message.role} content={message.content} />
              {message.showPDFDownload && pdfContent && (
                <PDFDownload 
                  content={pdfContent} 
                  onDownload={() => {
                    // Optional: Track download event
                  }} 
                />
              )}
            </div>
          ))}
          
          {isThinking && (
            <div className="flex gap-4 mb-6">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-black text-white flex items-center justify-center">
                <Logo variant="symbol" className="w-5 h-5" />
              </div>
              <div className="bg-gray-50 rounded-2xl px-6 py-4">
                <div className="flex gap-1.5">
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                </div>
              </div>
            </div>
          )}
          
          <div ref={chatEndRef} />
        </div>
      </main>

      {/* Input Area */}
      <div className="border-t border-gray-200 bg-white">
        <div className="max-w-4xl mx-auto px-6 py-5">
          <ChatInput onSend={handleSend} disabled={isThinking} />
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-gray-100 bg-gray-50 px-6 py-4">
        <div className="max-w-4xl mx-auto text-center text-xs text-gray-400 tracking-wide">
          MENTORA AI · Clarity-driven strategic mentorship · Not for PII or sensitive data
        </div>
      </div>
    </div>
  );
}

function getPhaseLabel(phase: Phase): string {
  switch (phase) {
    case "intro":
      return "INTRODUCTION";
    case "phase1":
    case "phase1_analysis":
      return "PHASE 1: WHERE AM I?";
    case "phase2":
    case "phase2_validation":
      return "PHASE 2: WHERE DO I WANT TO GO?";
    case "phase3":
      return "PHASE 3: HOW WILL I REACH THERE?";
    case "accountability":
      return "ACCOUNTABILITY SETUP";
    case "phase4_pdf":
      return "GENERATING ROADMAP";
    case "voice":
      return "MENTORA VOICE ACTIVE";
    default:
      return "";
  }
}
