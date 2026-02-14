import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import { Conversation, Message, User } from "@/types/chat";
import { conversationsApi, messagesApi, authApi } from "@/services/api";
import { toast } from "sonner";

interface ChatContextType {
  user: User | null;
  conversations: Conversation[];
  activeConversationId: string | null;
  messages: Message[];
  isLoadingMessages: boolean;
  isAiTyping: boolean;
  sidebarOpen: boolean;
  darkMode: boolean;
  isAuthLoading: boolean;
  setUser: (user: User | null) => void;
  setSidebarOpen: (open: boolean) => void;
  setDarkMode: (dark: boolean) => void;
  loadConversations: () => Promise<void>;
  selectConversation: (id: string) => Promise<void>;
  createConversation: () => Promise<void>;
  renameConversation: (id: string, title: string) => Promise<void>;
  deleteConversation: (id: string) => Promise<void>;
  sendMessage: (content: string) => Promise<void>;
  logout: () => Promise<void>;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export function ChatProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [isAiTyping, setIsAiTyping] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [darkMode, setDarkModeState] = useState(false);

  // Listen to Supabase auth state changes
  useEffect(() => {
    const { data: { subscription } } = authApi.onAuthStateChange((supaUser: any) => {
      if (supaUser) {
        setUser({
          id: supaUser.id,
          name: supaUser.user_metadata?.name || supaUser.email?.split("@")[0] || "User",
          email: supaUser.email || "",
        });
      } else {
        setUser(null);
        setConversations([]);
        setMessages([]);
        setActiveConversationId(null);
      }
      setIsAuthLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const setDarkMode = useCallback((dark: boolean) => {
    setDarkModeState(dark);
    document.documentElement.classList.toggle("dark", dark);
  }, []);

  const loadConversations = useCallback(async () => {
    try {
      const data = await conversationsApi.getAll();
      setConversations(data);
    } catch {
      toast.error("Failed to load conversations");
    }
  }, []);

  const selectConversation = useCallback(async (id: string) => {
    setActiveConversationId(id);
    setIsLoadingMessages(true);
    try {
      const data = await messagesApi.getByConversation(id);
      setMessages(data);
    } catch {
      toast.error("Failed to load messages");
    } finally {
      setIsLoadingMessages(false);
    }
  }, []);

  const createConversation = useCallback(async () => {
    if (!user) return;
    try {
      const conv = await conversationsApi.create(user.id);
      setConversations((prev) => [conv, ...prev]);
      setActiveConversationId(conv.id);
      setMessages([]);
    } catch {
      toast.error("Failed to create conversation");
    }
  }, [user]);

  const renameConversation = useCallback(async (id: string, title: string) => {
    try {
      await conversationsApi.rename(id, title);
      setConversations((prev) => prev.map((c) => (c.id === id ? { ...c, title } : c)));
      toast.success("Conversation renamed");
    } catch {
      toast.error("Failed to rename conversation");
    }
  }, []);

  const deleteConversation = useCallback(async (id: string) => {
    try {
      await conversationsApi.delete(id);
      setConversations((prev) => prev.filter((c) => c.id !== id));
      if (activeConversationId === id) {
        setActiveConversationId(null);
        setMessages([]);
      }
      toast.success("Conversation deleted");
    } catch {
      toast.error("Failed to delete conversation");
    }
  }, [activeConversationId]);

  const sendMessage = useCallback(async (content: string) => {
    if (!activeConversationId) return;

    const userMsg: Message = {
      id: `temp-${Date.now()}`,
      conversationId: activeConversationId,
      role: "user",
      content,
      createdAt: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsAiTyping(true);

    try {
      const aiMsg = await messagesApi.send(activeConversationId, content);
      setMessages((prev) => [...prev, aiMsg]);
      // Refresh conversations to get updated titles
      loadConversations();
    } catch {
      toast.error("Failed to send message");
    } finally {
      setIsAiTyping(false);
    }
  }, [activeConversationId, loadConversations]);

  const logout = useCallback(async () => {
    await authApi.logout();
    setUser(null);
    setConversations([]);
    setMessages([]);
    setActiveConversationId(null);
  }, []);

  return (
    <ChatContext.Provider
      value={{
        user, conversations, activeConversationId, messages,
        isLoadingMessages, isAiTyping, sidebarOpen, darkMode, isAuthLoading,
        setUser, setSidebarOpen, setDarkMode,
        loadConversations, selectConversation, createConversation,
        renameConversation, deleteConversation, sendMessage, logout,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}

export function useChat() {
  const ctx = useContext(ChatContext);
  if (!ctx) throw new Error("useChat must be used within ChatProvider");
  return ctx;
}
