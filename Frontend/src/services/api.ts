import { Conversation, Message } from "@/types/chat";
import { supabase } from "@/lib/supabase";

// TODO: Replace with your actual n8n webhook URL once deployed
const N8N_WEBHOOK_URL = "https://foxbrain.teamfoxtrot.pk/webhook/de82c344-f9dd-466d-ae72-7fc7eedb5dc2";

// Set to false once n8n is ready
const USE_MOCK_AI = false;

// --- Auth API ---
export const authApi = {
  login: async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    return data.user;
  },
  signup: async (name: string, email: string, password: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { name } },
    });
    if (error) throw error;
    return data.user;
  },
  logout: async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },
  forgotPassword: async (email: string) => {
    const redirectTo =
      typeof window !== "undefined"
        ? `${window.location.origin}/reset-password`
        : undefined;
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo,
    });
    if (error) throw error;
  },
  updatePassword: async (newPassword: string) => {
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) throw error;
  },
  getSession: async () => {
    const { data, error } = await supabase.auth.getSession();
    if (error) throw error;
    return data.session;
  },
  onAuthStateChange: (callback: (user: any) => void) => {
    return supabase.auth.onAuthStateChange((_event, session) => {
      callback(session?.user ?? null);
    });
  },
};

// --- Conversations API ---
export const conversationsApi = {
  getAll: async (): Promise<Conversation[]> => {
    const { data, error } = await supabase
      .from("conversations")
      .select("*")
      .order("updated_at", { ascending: false });
    if (error) throw error;
    return (data || []).map((c) => ({
      id: c.id,
      title: c.title,
      createdAt: c.created_at,
      updatedAt: c.updated_at,
    }));
  },
  create: async (userId: string): Promise<Conversation> => {
    const { data, error } = await supabase
      .from("conversations")
      .insert({ user_id: userId, title: "New conversation" })
      .select()
      .single();
    if (error) throw error;
    return {
      id: data.id,
      title: data.title,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    };
  },
  rename: async (id: string, title: string): Promise<Conversation> => {
    const { data, error } = await supabase
      .from("conversations")
      .update({ title, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single();
    if (error) throw error;
    return {
      id: data.id,
      title: data.title,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    };
  },
  delete: async (id: string): Promise<void> => {
    const { error } = await supabase
      .from("conversations")
      .delete()
      .eq("id", id);
    if (error) throw error;
    // Messages are auto-deleted via ON DELETE CASCADE
  },
};

// --- Messages API ---
export const messagesApi = {
  getByConversation: async (conversationId: string): Promise<Message[]> => {
    const { data, error } = await supabase
      .from("messages")
      .select("*")
      .eq("conversation_id", conversationId)
      .order("created_at", { ascending: true });
    if (error) throw error;
    return (data || []).map((m) => ({
      id: m.id,
      conversationId: m.conversation_id,
      role: m.role,
      content: m.content,
      createdAt: m.created_at,
    }));
  },
  send: async (conversationId: string, content: string): Promise<Message> => {
    // 1. Save user message to Supabase
    const { error: userMsgError } = await supabase
      .from("messages")
      .insert({
        conversation_id: conversationId,
        role: "user",
        content,
      });
    if (userMsgError) throw userMsgError;

    // 2. Fetch recent history for context
    const { data: history } = await supabase
      .from("messages")
      .select("role, content")
      .eq("conversation_id", conversationId)
      .order("created_at", { ascending: false })
      .limit(10);

    // 3. Get AI response (mock or real n8n)
    let aiContent: string;
    if (USE_MOCK_AI) {
      await new Promise((r) => setTimeout(r, 1000)); // simulate delay
      aiContent = `🦊 **FoxBrain AI (Test Mode)**\n\nI received your message: "${content}"\n\nThis is a test response. Once n8n is connected, you'll get real AI answers here.`;
    } else {
      const res = await fetch(N8N_WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: content,
          history: (history || []).reverse(),
        }),
      });
      if (!res.ok) throw new Error("Failed to get AI response");
      const aiData = await res.json();
      aiContent = aiData.output || aiData.response || "Sorry, I couldn't generate a response.";
    }

    // 4. Save AI response to Supabase
    const { data: aiMsg, error: aiMsgError } = await supabase
      .from("messages")
      .insert({
        conversation_id: conversationId,
        role: "assistant",
        content: aiContent,
      })
      .select()
      .single();
    if (aiMsgError) throw aiMsgError;

    // 5. Auto-title the conversation if it's the first message
    const { data: conv } = await supabase
      .from("conversations")
      .select("title")
      .eq("id", conversationId)
      .single();
    if (conv && conv.title === "New conversation") {
      const autoTitle = content.slice(0, 40) + (content.length > 40 ? "..." : "");
      await supabase
        .from("conversations")
        .update({ title: autoTitle, updated_at: new Date().toISOString() })
        .eq("id", conversationId);
    } else {
      await supabase
        .from("conversations")
        .update({ updated_at: new Date().toISOString() })
        .eq("id", conversationId);
    }

    return {
      id: aiMsg.id,
      conversationId: aiMsg.conversation_id,
      role: aiMsg.role,
      content: aiMsg.content,
      createdAt: aiMsg.created_at,
    };
  },
};
