import { supabase } from './supabase';

// ─── PROFILE ──────────────────────────────────────────────────────────────────
export async function getProfile(userId) {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();
  if (error && error.code !== 'PGRST116') console.error('getProfile:', error);
  return data;
}

export async function upsertProfile(userId, updates) {
  const { error } = await supabase
    .from('profiles')
    .upsert({ id: userId, ...updates }, { onConflict: 'id' });
  if (error) console.error('upsertProfile:', error);
}

// ─── OUTDOOR MINUTES ──────────────────────────────────────────────────────────
export async function getOutdoorMinutes(userId) {
  const { data } = await supabase
    .from('profiles')
    .select('outdoor_minutes, outdoor_week_start')
    .eq('id', userId)
    .single();
  if (!data) return 0;

  // Reset if it's a new week (Monday)
  const weekStart = new Date(data.outdoor_week_start);
  const now = new Date();
  const daysSince = Math.floor((now - weekStart) / (1000 * 60 * 60 * 24));
  if (daysSince >= 7) {
    await supabase.from('profiles').update({
      outdoor_minutes: 0,
      outdoor_week_start: now.toISOString().split('T')[0],
    }).eq('id', userId);
    return 0;
  }
  return data.outdoor_minutes || 0;
}

export async function updateOutdoorMinutes(userId, minutes) {
  await supabase.from('profiles')
    .update({ outdoor_minutes: Math.max(0, minutes) })
    .eq('id', userId);
}

// ─── JOURNAL ENTRIES ──────────────────────────────────────────────────────────
export async function getJournalEntries(userId) {
  const { data, error } = await supabase
    .from('journal_entries')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  if (error) console.error('getJournalEntries:', error);
  return data || [];
}

export async function addJournalEntry(userId, entry) {
  const { data, error } = await supabase
    .from('journal_entries')
    .insert({ user_id: userId, ...entry })
    .select()
    .single();
  if (error) console.error('addJournalEntry:', error);
  return data;
}

export async function deleteJournalEntry(entryId) {
  const { error } = await supabase
    .from('journal_entries')
    .delete()
    .eq('id', entryId);
  if (error) console.error('deleteJournalEntry:', error);
}

// ─── STUDENTS ─────────────────────────────────────────────────────────────────
export async function getStudents(userId) {
  const { data, error } = await supabase
    .from('students')
    .select('*, narrations(*)')
    .eq('user_id', userId)
    .order('sort_order');
  if (error) console.error('getStudents:', error);
  return data || [];
}

export async function addStudent(userId, student) {
  const { data, error } = await supabase
    .from('students')
    .insert({ user_id: userId, ...student })
    .select()
    .single();
  if (error) console.error('addStudent:', error);
  return data;
}

export async function removeStudent(studentId) {
  const { error } = await supabase
    .from('students')
    .delete()
    .eq('id', studentId);
  if (error) console.error('removeStudent:', error);
}

export async function addNarration(userId, studentId, narration) {
  const { data, error } = await supabase
    .from('narrations')
    .insert({ user_id: userId, student_id: studentId, ...narration })
    .select()
    .single();
  if (error) console.error('addNarration:', error);
  return data;
}

// ─── OBSERVATIONS ─────────────────────────────────────────────────────────────
export async function getObservations(userId) {
  const { data, error } = await supabase
    .from('observations')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(20);
  if (error) console.error('getObservations:', error);
  return data || [];
}

export async function addObservation(userId, observation) {
  const { error } = await supabase
    .from('observations')
    .insert({ user_id: userId, ...observation });
  if (error) console.error('addObservation:', error);
}
