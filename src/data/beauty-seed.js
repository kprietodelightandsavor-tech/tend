// src/data/beauty-seed.js
// Beauty Loop rotations + Supabase-backed checkbox state.
// State syncs across devices, resets weekly on Monday.

import { supabase } from "../lib/supabase";

// ─────────────────────────────────────────────────────────────────────
// ANCHORS
// Beauty rotation anchor: Mon May 4, 2026 = Week A
// Tuesday volunteer anchor: Tue May 5, 2026 = NON-volunteer (odd)
//                           Tue May 12, 2026 = volunteer (even)
// ─────────────────────────────────────────────────────────────────────
const BEAUTY_ANCHOR = new Date("2026-05-04T00:00:00");
const TUESDAY_VOLUNTEER_ANCHOR = new Date("2026-05-12T00:00:00"); // first volunteer week

// Returns "A" or "B" for the rotation week
export function getBeautyWeekParity(date = new Date()) {
  const msPerWeek = 7 * 24 * 60 * 60 * 1000;
  const weeksSince = Math.floor((date - BEAUTY_ANCHOR) / msPerWeek);
  return weeksSince % 2 === 0 ? "A" : "B";
}

// Returns true if this Tuesday is a volunteer Tuesday
export function isVolunteerTuesday(date = new Date()) {
  const msPerWeek = 7 * 24 * 60 * 60 * 1000;
  const weeksSince = Math.floor((date - TUESDAY_VOLUNTEER_ANCHOR) / msPerWeek);
  return weeksSince % 2 === 0;
}

// Returns the Monday-anchored week-start ISO date string
export function getCurrentWeekStart(date = new Date()) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  const dayOfWeek = d.getDay();
  const daysFromMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
  d.setDate(d.getDate() - daysFromMonday);
  return d.toISOString().slice(0, 10);
}

// ─────────────────────────────────────────────────────────────────────
// BEAUTY ROTATIONS PER DAY
// Returns an array of items for the day, each: { id, label, scheduled }
// id is stable across weeks so completion persists
// scheduled = true means it's the bolded-sage one for this week
// Returns null/[] if no Beauty for this day
// ─────────────────────────────────────────────────────────────────────
export function getTodayBeauty(dayName, date = new Date()) {
  const week = getBeautyWeekParity(date);

  if (dayName === "Monday") {
    return week === "A"
      ? [
          { id: "mon-artist", label: "Artist Study", scheduled: true },
          { id: "mon-poet",   label: "Poet Study",   scheduled: false },
        ]
      : [
          { id: "mon-poet",   label: "Poet Study",   scheduled: true },
          { id: "mon-artist", label: "Artist Study", scheduled: false },
        ];
  }

  if (dayName === "Tuesday") {
    // Non-volunteer Tuesdays only — volunteer weeks return null
    if (isVolunteerTuesday(date)) return null;
    return [
      { id: "tue-citizenship", label: "Citizenship", scheduled: true },
      { id: "tue-selfgrowth",  label: "Self-Growth", scheduled: false },
    ];
  }

  if (dayName === "Wednesday") {
    // Three items — Recitation always scheduled, Biography and Folk Song alternate
    if (week === "A") {
      return [
        { id: "wed-recitation", label: "Recitation", scheduled: true },
        { id: "wed-biography",  label: "Biography",  scheduled: true },
        { id: "wed-folksong",   label: "Folk Song",  scheduled: false },
      ];
    }
    return [
      { id: "wed-recitation", label: "Recitation", scheduled: true },
      { id: "wed-folksong",   label: "Folk Song",  scheduled: true },
      { id: "wed-biography",  label: "Biography",  scheduled: false },
    ];
  }

  if (dayName === "Friday") {
    return week === "A"
      ? [
          { id: "fri-composer", label: "Composer Study", scheduled: true },
          { id: "fri-hymn",     label: "Hymn Study",     scheduled: false },
        ]
      : [
          { id: "fri-hymn",     label: "Hymn Study",     scheduled: true },
          { id: "fri-composer", label: "Composer Study", scheduled: false },
        ];
  }

  return null; // Thursday, weekend, volunteer Tuesday
}

// ─────────────────────────────────────────────────────────────────────
// SUPABASE STATE FUNCTIONS
// ─────────────────────────────────────────────────────────────────────

// Load all completion states for the current week
// Returns { [beauty_id]: true/false }
export async function loadBeautyProgress(userId, weekStart = null) {
  if (!userId) return {};
  const ws = weekStart || getCurrentWeekStart();

  try {
    const { data, error } = await supabase
      .from("beauty_progress")
      .select("beauty_id, completed")
      .eq("user_id", userId)
      .eq("week_start", ws);

    if (error) throw error;

    const map = {};
    (data || []).forEach(row => { map[row.beauty_id] = !!row.completed; });
    return map;
  } catch (err) {
    console.error("Error loading beauty progress:", err);
    return {};
  }
}

// Toggle a single beauty item's completed state
// Returns the new boolean value, or null on error
export async function toggleBeautyComplete(userId, beautyId, currentValue) {
  if (!userId) return null;
  const weekStart = getCurrentWeekStart();
  const newValue = !currentValue;

  try {
    const { error } = await supabase
      .from("beauty_progress")
      .upsert({
        user_id: userId,
        beauty_id: beautyId,
        completed: newValue,
        week_start: weekStart,
        updated_at: new Date().toISOString(),
      }, { onConflict: "user_id,beauty_id,week_start" });

    if (error) throw error;
    return newValue;
  } catch (err) {
    console.error("Error toggling beauty:", err);
    return null;
  }
}
