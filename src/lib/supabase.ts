import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface Registration {
  id: string;
  name: string;
  college_name: string;
  email: string;
  course_of_study: string;
  whatsapp_number: string;
  selected_events: string[];
  transaction_id: string;
  payment_proof_url: string | null;
  created_at: string;
}
