
// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://ldrabuhmwihetefbmdsy.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxkcmFidWhtd2loZXRlZmJtZHN5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQzODAzMjAsImV4cCI6MjA1OTk1NjMyMH0.vbJ6UJc8ea84gVgkYL5l8o0lC6yzXu2vdZo29fSy3oM";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    storage: localStorage,
    flowType: 'pkce',
    // Set the redirect URL to the production URL for authentication
    cookieOptions: {
      domain: 'lovable.app',
    },
    autoRefreshToken: true,
    detectSessionInUrl: true,
  }
});
