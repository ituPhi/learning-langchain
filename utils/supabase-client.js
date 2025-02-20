import { createClient } from '@supabase/supabase-js';
const url = process.env.SUPABASE_URL;
const key = process.env.SUPABASE_KEY;

export const supabaseClient = createClient(url, key);
