// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://kertsebmbmfvheqwzbyk.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtlcnRzZWJtYm1mdmhlcXd6YnlrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU3NjI1MTEsImV4cCI6MjA2MTMzODUxMX0.vonAVRANyfi2vT_A2BHZihoDOBuiFU7h4NDmNV1_1-E";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);