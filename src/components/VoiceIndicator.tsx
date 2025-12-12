import { Mic } from "lucide-react";

export function VoiceIndicator() {
  return (
    <div className="flex items-center justify-center gap-2 py-3 px-4 bg-gray-50 border border-gray-200 rounded-lg mb-4">
      <Mic className="w-4 h-4 text-gray-600" />
      <span className="text-sm text-gray-600">MENTORA Voice Mode Active — Conversational responses optimized for clarity</span>
    </div>
  );
}
