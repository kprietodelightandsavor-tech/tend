import { createClient } from '@supabase/supabase-js'

// === Correct Vite + Netlify setup ===
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Helpful debugging messages (you'll see these in the browser console)
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Supabase environment variables are missing or not loaded.\n' +
    '→ Go to Netlify → Environment variables and make sure you have:\n' +
    '   VITE_SUPABASE_URL\n' +
    '   VITE_SUPABASE_ANON_KEY  (use the anon/public key, NOT service_role)')
} else {
  console.log('✅ Supabase environment variables loaded successfully')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Optional helper to test connection (you can call this later if needed)
export const testSupabaseConnection = async () => {
  try {
    const { error } = await supabase.from('schedules').select('id').limit(1)
    if (error) throw error
    console.log('✅ Supabase is connected and working!')
    return true
  } catch (err) {
    console.error('❌ Supabase connection test failed:', err.message)
    return false
  }
}
