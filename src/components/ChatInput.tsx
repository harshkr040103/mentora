import { useState } from "react";
import { Send } from "lucide-react";

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
}

export function ChatInput({ onSend, disabled }: ChatInputProps) {
  const [input, setInput] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !disabled) {
      onSend(input.trim());
      setInput("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-3 items-end">
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSubmit(e);
          }
        }}
        placeholder="Type your response..."
        disabled={disabled}
        className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-5 py-3.5 resize-none focus:outline-none focus:border-black transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        rows={1}
        style={{ minHeight: '52px', maxHeight: '150px' }}
      />
      <button
        type="submit"
        disabled={!input.trim() || disabled}
        className="flex-shrink-0 w-[52px] h-[52px] bg-black text-white rounded-xl hover:bg-gray-800 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
      >
        <Send className="w-5 h-5" />
      </button>
    </form>
  );
}
