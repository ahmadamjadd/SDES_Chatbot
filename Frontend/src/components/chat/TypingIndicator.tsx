const TypingIndicator = () => (
  <div className="flex items-start gap-3 px-4 py-3">
    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-lg">
      🦊
    </div>
    <div className="flex items-center gap-1 pt-2">
      <span className="w-2 h-2 rounded-full bg-primary animate-bounce-dot" style={{ animationDelay: "0s" }} />
      <span className="w-2 h-2 rounded-full bg-primary animate-bounce-dot" style={{ animationDelay: "0.16s" }} />
      <span className="w-2 h-2 rounded-full bg-primary animate-bounce-dot" style={{ animationDelay: "0.32s" }} />
    </div>
  </div>
);

export default TypingIndicator;
