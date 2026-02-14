import { useEffect, useState } from "react";
import { useChat } from "@/context/ChatContext";
import { Conversation } from "@/types/chat";
import { MessageSquarePlus, Pencil, Trash2, X, LogOut, Moon, Sun, PanelLeftClose } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useIsMobile } from "@/hooks/use-mobile";

const Sidebar = () => {
  const {
    conversations, activeConversationId, sidebarOpen, setSidebarOpen, darkMode, setDarkMode,
    loadConversations, selectConversation, createConversation, renameConversation, deleteConversation, logout, user,
  } = useChat();
  const isMobile = useIsMobile();

  useEffect(() => {
    loadConversations();
  }, [loadConversations]);

  // Close sidebar on mobile after selecting
  const handleSelect = (id: string) => {
    selectConversation(id);
    if (isMobile) setSidebarOpen(false);
  };

  const grouped = groupConversations(conversations);

  const sidebarContent = (
    <div className="flex flex-col h-full bg-sidebar text-sidebar-foreground">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-4">
        <div className="flex items-center gap-2">
          <span className="text-xl">🦊</span>
          <span className="font-semibold text-base">FoxBrain AI</span>
        </div>
        <button onClick={() => setSidebarOpen(false)} className="p-1.5 rounded-lg hover:bg-sidebar-accent transition-colors">
          {isMobile ? <X className="w-5 h-5" /> : <PanelLeftClose className="w-5 h-5" />}
        </button>
      </div>

      {/* New Chat */}
      <div className="px-3 pb-2">
        <button
          onClick={createConversation}
          className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity"
        >
          <MessageSquarePlus className="w-4 h-4" />
          New Chat
        </button>
      </div>

      {/* Conversation list */}
      <div className="flex-1 overflow-y-auto scrollbar-thin px-2 pb-2">
        {grouped.map(([label, convs]) => (
          <div key={label} className="mb-2">
            <p className="text-xs font-medium text-muted-foreground px-2 py-2">{label}</p>
            {convs.map((conv) => (
              <ConversationItem
                key={conv.id}
                conversation={conv}
                isActive={conv.id === activeConversationId}
                onSelect={() => handleSelect(conv.id)}
                onRename={(title) => renameConversation(conv.id, title)}
                onDelete={() => deleteConversation(conv.id)}
              />
            ))}
          </div>
        ))}
      </div>

      {/* User section */}
      <div className="border-t border-sidebar-border p-3">
        <div className="flex items-center gap-2 mb-2">
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="flex items-center gap-2 flex-1 px-3 py-2 rounded-lg hover:bg-sidebar-accent transition-colors text-sm"
          >
            {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            {darkMode ? "Light mode" : "Dark mode"}
          </button>
        </div>
        <div className="flex items-center gap-2 px-3 py-2">
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-xs font-semibold">
            {user?.name?.[0] || "?"}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{user?.name}</p>
            <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
          </div>
          <button onClick={logout} className="p-1.5 rounded-lg hover:bg-sidebar-accent transition-colors" title="Logout">
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );

  if (!sidebarOpen) return null;

  if (isMobile) {
    return (
      <>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-foreground/50 z-40"
          onClick={() => setSidebarOpen(false)}
        />
        <motion.div
          initial={{ x: -300 }}
          animate={{ x: 0 }}
          exit={{ x: -300 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="fixed left-0 top-0 bottom-0 w-[280px] z-50 shadow-xl"
        >
          {sidebarContent}
        </motion.div>
      </>
    );
  }

  return (
    <motion.div
      initial={{ width: 0, opacity: 0 }}
      animate={{ width: 280, opacity: 1 }}
      exit={{ width: 0, opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="h-full border-r border-sidebar-border flex-shrink-0 overflow-hidden"
    >
      {sidebarContent}
    </motion.div>
  );
};

// --- Conversation item ---
function ConversationItem({
  conversation,
  isActive,
  onSelect,
  onRename,
  onDelete,
}: {
  conversation: Conversation;
  isActive: boolean;
  onSelect: () => void;
  onRename: (title: string) => void;
  onDelete: () => void;
}) {
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(conversation.title);

  const handleRename = () => {
    if (title.trim() && title !== conversation.title) {
      onRename(title.trim());
    }
    setEditing(false);
  };

  return (
    <div
      className={`group flex items-center gap-1 px-2 py-2 rounded-lg cursor-pointer text-sm transition-colors ${
        isActive ? "bg-sidebar-accent text-sidebar-accent-foreground" : "hover:bg-sidebar-accent/50"
      }`}
      onClick={!editing ? onSelect : undefined}
    >
      {editing ? (
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onBlur={handleRename}
          onKeyDown={(e) => e.key === "Enter" && handleRename()}
          className="flex-1 bg-transparent outline-none border border-border rounded px-1 py-0.5 text-sm"
          autoFocus
          onClick={(e) => e.stopPropagation()}
        />
      ) : (
        <span className="flex-1 truncate">{conversation.title}</span>
      )}
      <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={(e) => { e.stopPropagation(); setEditing(true); setTitle(conversation.title); }}
          className="p-1 rounded hover:bg-sidebar-accent transition-colors"
        >
          <Pencil className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={(e) => { e.stopPropagation(); onDelete(); }}
          className="p-1 rounded hover:bg-destructive/10 hover:text-destructive transition-colors"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}

// --- Grouping ---
function groupConversations(conversations: Conversation[]): [string, Conversation[]][] {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today.getTime() - 86400000);
  const weekAgo = new Date(today.getTime() - 86400000 * 7);
  const monthAgo = new Date(today.getTime() - 86400000 * 30);

  const groups: Record<string, Conversation[]> = {
    Today: [],
    Yesterday: [],
    "Previous 7 Days": [],
    "Previous 30 Days": [],
    Older: [],
  };

  conversations.forEach((c) => {
    const d = new Date(c.updatedAt);
    if (d >= today) groups["Today"].push(c);
    else if (d >= yesterday) groups["Yesterday"].push(c);
    else if (d >= weekAgo) groups["Previous 7 Days"].push(c);
    else if (d >= monthAgo) groups["Previous 30 Days"].push(c);
    else groups["Older"].push(c);
  });

  return Object.entries(groups).filter(([, v]) => v.length > 0);
}

export default Sidebar;
