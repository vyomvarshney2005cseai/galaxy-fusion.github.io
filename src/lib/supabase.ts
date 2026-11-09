import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

export const SUPABASE_URL = 'https://pfsklgdqabozkglltqax.supabase.co';
export const SUPABASE_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBmc2tsZ2RxYWJvemtnbGx0cWF4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUyNjU5NzAsImV4cCI6MjA5MDg0MTk3MH0.iEDVq_sjN3rC2w_Ywu4YYOmAFyn5tnT8URrNgkASOao';
export const EMAIL_DOMAIN = '@galaxy.local';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

export function rollToEmail(roll: string): string {
  return roll.toLowerCase().trim() + EMAIL_DOMAIN;
}
