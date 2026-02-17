import { useState, useRef, useEffect, KeyboardEvent } from "react";
import { ArrowUp } from "lucide-react";
import { useChat } from "@/context/ChatContext";

const MessageInput = () => {
  const [input, setInput] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { sendMessage, isAiTyping, activeConversationId } = useChat();

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 200) + "px";
    }
  }, [input]);

  const handleSend = () => {
    if (!input.trim() || isAiTyping || !activeConversationId) return;
    sendMessage(input.trim());
    setInput("");
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="border-t border-border bg-background p-5">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-end gap-3 bg-muted rounded-2xl px-5 py-3">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={activeConversationId ? "Message FoxBrain AI..." : "Start a new chat to begin"}
            disabled={!activeConversationId}
            rows={1}
            className="flex-1 bg-transparent resize-none outline-none text-lg py-2 max-h-[200px] placeholder:text-muted-foreground disabled:opacity-50"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isAiTyping || !activeConversationId}
            className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center disabled:opacity-40 hover:opacity-90 transition-opacity"
          >
            <ArrowUp className="w-4 h-4" />
          </button>
        </div>
        <p className="text-sm text-muted-foreground text-center mt-2">
          FoxBrain AI can make mistakes. Verify important information.
        </p>
      </div>
    </div>
  );
};

export default MessageInput;
