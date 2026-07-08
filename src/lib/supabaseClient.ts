/// <reference types="vite/client" />
import { createClient } from '@supabase/supabase-js';

const urlVal = import.meta.env.VITE_SUPABASE_URL;
const keyVal = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = !!(urlVal && keyVal && urlVal !== 'https://placeholder-project.supabase.co' && urlVal !== '');

const supabaseUrl = urlVal || 'https://placeholder-project.supabase.co';
const supabaseAnonKey = keyVal || 'placeholder-anon-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);


