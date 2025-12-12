import { Download } from "lucide-react";

interface PDFDownloadProps {
  content: string;
  onDownload: () => void;
}

export function PDFDownload({ content, onDownload }: PDFDownloadProps) {
  const handleDownload = () => {
    // Create a clean text version for PDF conversion
    const cleanContent = content
      .replace(/\*\*/g, '') // Remove markdown bold
      .replace(/═+/g, '─'.repeat(50)) // Replace with simpler line
      .trim();

    // Create blob and download
    const blob = new Blob([cleanContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `MENTORA-Roadmap-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    onDownload();
  };

  return (
    <div className="flex items-center justify-center my-8">
      <button
        onClick={handleDownload}
        className="flex items-center gap-3 bg-black text-white px-8 py-4 rounded-xl hover:bg-gray-800 transition-colors"
      >
        <Download className="w-5 h-5" />
        <span>Download Your Roadmap (PDF-Ready Format)</span>
      </button>
    </div>
  );
}
