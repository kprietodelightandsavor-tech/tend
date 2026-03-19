import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://dxsmywjiawgifeyfkdcj.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR4c215d2ppYXdnaWZleWZrZGNqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM4Nzc1MTIsImV4cCI6MjA4OTQ1MzUxMn0.LVUXLkGokJ9k68k73Hr2kumsJ94GqNkMCC08Bce2Cdw';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
