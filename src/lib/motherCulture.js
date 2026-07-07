// src/lib/motherCulture.js
// One shared source of truth for the mother's daily check-in, so the
// home-screen row and the Evening Close always agree.

export const MC_ITEMS = [
  { id: "movement", label: "Movement" },
  { id: "protein",  label: "Protein meal" },
  { id: "nature",   label: "Nature moment" },
  { id: "rest",     label: "Rest · create" },
];

const KEY = "tend_mother_culture";

export function mcDateKey(d = new Date()) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

export function loadMC(dateKey = mcDateKey()) {
  try {
    const all = JSON.parse(localStorage.getItem(KEY)) || {};
    return all[dateKey] || [];
  } catch { return []; }
}

export function saveMC(done, dateKey = mcDateKey()) {
  try {
    const all = JSON.parse(localStorage.getItem(KEY)) || {};
    all[dateKey] = done;
    localStorage.setItem(KEY, JSON.stringify(all));
  } catch {}
}

export function toggleMC(id, dateKey = mcDateKey()) {
  const done = loadMC(dateKey);
  const next = done.includes(id) ? done.filter(x => x !== id) : [...done, id];
  saveMC(next, dateKey);
  return next;
}
