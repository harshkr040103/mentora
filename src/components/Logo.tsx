export function Logo({ variant = "horizontal", className = "" }: { variant?: "horizontal" | "stacked" | "symbol" | "wordmark", className?: string }) {
  
  // Ultra-minimal geometric M symbol representing:
  // - Guidance (upward direction)
  // - Clarity (clean lines)
  // - Strategic thinking (geometric precision)
  const Symbol = () => (
    <svg viewBox="0 0 100 100" fill="currentColor" className="w-full h-full">
      {/* Geometric M with subtle upward direction */}
      <path d="M20 75 L20 25 L50 50 L80 25 L80 75" 
            stroke="currentColor" 
            strokeWidth="3" 
            fill="none" 
            strokeLinecap="square" 
            strokeLinejoin="miter"/>
      <circle cx="50" cy="50" r="2" fill="currentColor" />
    </svg>
  );

  const Wordmark = () => (
    <div className="tracking-[0.3em] uppercase" style={{ fontFamily: '-apple-system, system-ui, BlinkMacSystemFont, "SF Pro Display", sans-serif' }}>
      MENTORA
    </div>
  );

  if (variant === "symbol") {
    return (
      <div className={className} style={{ aspectRatio: '1/1' }}>
        <Symbol />
      </div>
    );
  }

  if (variant === "wordmark") {
    return (
      <div className={className}>
        <Wordmark />
      </div>
    );
  }

  if (variant === "stacked") {
    return (
      <div className={`flex flex-col items-center gap-4 ${className}`}>
        <div className="w-16 h-16">
          <Symbol />
        </div>
        <Wordmark />
      </div>
    );
  }

  // Default: horizontal
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className="w-8 h-8">
        <Symbol />
      </div>
      <Wordmark />
    </div>
  );
}
