import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://ffmnanvczrkobdeyunmq.supabase.co";
const supabaseAnonKey = "sb_publishable_Kr42G2TFiLQ_F2-_bz_39g_4MClcLrN";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
