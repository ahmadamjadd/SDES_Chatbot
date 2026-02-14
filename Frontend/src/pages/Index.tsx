import { ChatProvider, useChat } from "@/context/ChatContext";
import Sidebar from "@/components/chat/Sidebar";
import ChatArea from "@/components/chat/ChatArea";
import { AnimatePresence } from "framer-motion";
import { Navigate } from "react-router-dom";

const ChatLayout = () => {
  const { user, isAuthLoading } = useChat();

  if (isAuthLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="text-4xl animate-pulse">🦊</div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <AnimatePresence>
        <Sidebar />
      </AnimatePresence>
      <ChatArea />
    </div>
  );
};

const Index = () => {
  return (
    <ChatProvider>
      <ChatLayout />
    </ChatProvider>
  );
};

export default Index;
