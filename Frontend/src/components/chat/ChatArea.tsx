import { useEffect, useRef, useState } from "react";
import { useChat } from "@/context/ChatContext";
import ChatMessage from "./ChatMessage";
import TypingIndicator from "./TypingIndicator";
import MessageInput from "./MessageInput";
import { ArrowDown, Menu, MessageSquarePlus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const ChatArea = () => {
  const { messages, isAiTyping, isLoadingMessages, activeConversationId, sidebarOpen, setSidebarOpen, createConversation } = useChat();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showScrollBtn, setShowScrollBtn] = useState(false);

  const scrollToBottom = () => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isAiTyping]);

  const handleScroll = () => {
    if (!scrollRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
    setShowScrollBtn(scrollHeight - scrollTop - clientHeight > 100);
  };

  return (
    <div className="flex flex-col h-full flex-1">
      {/* Header */}
      <div className="flex items-center gap-2 px-4 py-3 border-b border-border bg-background/80 backdrop-blur-sm">
        {!sidebarOpen && (
          <button onClick={() => setSidebarOpen(true)} className="p-2 rounded-lg hover:bg-muted transition-colors">
            <Menu className="w-5 h-5 text-muted-foreground" />
          </button>
        )}
        <h2 className="text-sm font-medium">FoxBrain AI</h2>
        <div className="flex-1" />
        <button
          onClick={createConversation}
          className="p-2 rounded-lg hover:bg-muted transition-colors md:hidden"
        >
          <MessageSquarePlus className="w-5 h-5 text-muted-foreground" />
        </button>
      </div>

      {/* Messages */}
      <div ref={scrollRef} onScroll={handleScroll} className="flex-1 overflow-y-auto scrollbar-thin relative">
        {!activeConversationId ? (
          <EmptyState />
        ) : isLoadingMessages ? (
          <div className="flex items-center justify-center h-full">
            <div className="flex gap-1">
              <span className="w-2 h-2 rounded-full bg-primary animate-bounce-dot" style={{ animationDelay: "0s" }} />
              <span className="w-2 h-2 rounded-full bg-primary animate-bounce-dot" style={{ animationDelay: "0.16s" }} />
              <span className="w-2 h-2 rounded-full bg-primary animate-bounce-dot" style={{ animationDelay: "0.32s" }} />
            </div>
          </div>
        ) : messages.length === 0 ? (
          <EmptyConversation />
        ) : (
          <div className="max-w-3xl mx-auto py-4">
            {messages.map((msg) => (
              <ChatMessage key={msg.id} message={msg} />
            ))}
            {isAiTyping && <TypingIndicator />}
          </div>
        )}

        <AnimatePresence>
          {showScrollBtn && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              onClick={scrollToBottom}
              className="fixed bottom-28 left-1/2 -translate-x-1/2 w-9 h-9 rounded-full bg-card border border-border shadow-lg flex items-center justify-center hover:bg-muted transition-colors z-10"
            >
              <ArrowDown className="w-4 h-4" />
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      <MessageInput />
    </div>
  );
};

function EmptyState() {
  const { createConversation } = useChat();
  return (
    <div className="flex flex-col items-center justify-center h-full gap-4 px-4">
      <div className="text-6xl">🦊</div>
      <h2 className="text-2xl font-semibold">Welcome to FoxBrain AI</h2>
      <p className="text-muted-foreground text-center max-w-sm">
        Your intelligent assistant, ready to help with anything. Start a new conversation to begin!
      </p>
      <button
        onClick={createConversation}
        className="mt-2 px-6 py-2.5 bg-primary text-primary-foreground rounded-full text-sm font-medium hover:opacity-90 transition-opacity"
      >
        + New Chat
      </button>
    </div>
  );
}

function EmptyConversation() {
  return (
    <div className="flex flex-col items-center justify-center h-full gap-3 px-4">
      <div className="text-5xl">🦊</div>
      <h3 className="text-lg font-medium">How can I help you today?</h3>
      <p className="text-muted-foreground text-sm text-center max-w-sm">
        Ask me anything — from coding questions to creative ideas.
      </p>
    </div>
  );
}

export default ChatArea;
