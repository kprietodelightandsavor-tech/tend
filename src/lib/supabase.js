import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://dxsmywjiawgifeyfkdcj.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_e0D-G3CQEtdhqsg4K21yEQ_mgkqy3bj';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
