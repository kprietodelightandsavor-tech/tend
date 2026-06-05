import { useState } from "react";

const Icon = {
  User: () => (
    <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="#4A5568" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/>
      <circle cx="12" cy="7" r="4"/>
    </svg>
  ),
  Leaf: () => (
    <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="#A9B786" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 8C8 10 5.9 16.17 3.82 19.34L5.71 21l1-1.3A4.49 4.49 0 008 20c8 0 13-8 13-16-2 0-5 1-8 4z"/>
    </svg>
  ),
  Calendar: () => (
    <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="#4A5568" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
      <line x1="16" y1="2" x2="16" y2="6"/>
      <line x1="8" y1="2" x2="8" y2="6"/>
      <line x1="3" y1="10" x2="21" y2="10"/>
    </svg>
  ),
  Tend: () => (
    <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="#A9B786" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22V12"/>
      <path d="M12 12C12 12 8 11 7 7c3 0 5 2 5 5z"/>
      <path d="M12 12C12 12 16 11 17 7c-3 0-5 2-5 5z"/>
      <path d="M8 22h8"/>
    </svg>
  ),
};

export default function SettingsScreen({ settings, onSave, onNavigate }) {
  const [name, setName]           = useState(settings?.name || "");
  const [outdoorGoal, setGoal]    = useState(settings?.outdoorGoal || 15);
  const [term, setTerm]           = useState(settings?.term || 1);
  const [week, setWeek]           = useState(settings?.week || 1);
  const [saved, setSaved]         = useState(false);
  const [icsUrl, setIcsUrl]       = useState(() => { try { return localStorage.getItem("tend_ics_url") || ""; } catch { return ""; } });
  const [calEvents, setCalEvents] = useState([]);
  const [calMsg, setCalMsg]       = useState("");
  const [calLoading, setCalLoading] = useState(false);
  const [homePrefs, setHomePrefs] = useState(() => {
    const d = { quote: true, outdoor: true, beautyLoop: true, motherCulture: false, habit: false };
    try { return { ...d, ...JSON.parse(localStorage.getItem("tend_home_prefs") || "{}") }; } catch { return d; }
  });
  const toggleHome = (key) => setHomePrefs(prev => {
    const next = { ...prev, [key]: !prev[key] };
    try { localStorage.setItem("tend_home_prefs", JSON.stringify(next)); } catch {}
    return next;
  });
  const HOME_SECTIONS = [
    ["quote", "Daily quote"],
    ["outdoor", "Nature study (outdoor)"],
    ["beautyLoop", "Beauty Loop"],
    ["motherCulture", "Mother Culture"],
    ["habit", "Habit focus"],
  ];
  const [summerMode, setSummerMode] = useState(() => { try { return localStorage.getItem("tend_summer_mode") === "true"; } catch { return false; } });
  const toggleSummer = () => setSummerMode(v => { const n = !v; try { localStorage.setItem("tend_summer_mode", String(n)); } catch {} return n; });

  const loadCalendar = async () => {
    const url = icsUrl.trim();
    if (!url) { setCalMsg("Paste your calendar link first."); return; }
    setCalLoading(true); setCalMsg("");
    try {
      localStorage.setItem("tend_ics_url", url);
      if (settings?.saveToMeta) settings.saveToMeta({ ics_url: url });
      const res = await fetch("/.netlify/functions/sync-calendar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url, days: 30 }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong");
      setCalEvents(data.events || []);
      setCalMsg(`Connected — found ${(data.events || []).length} events in the next 30 days.`);
    } catch (e) {
      setCalEvents([]);
      setCalMsg("Couldn't load: " + e.message);
    } finally {
      setCalLoading(false);
    }
  };

  const save = () => {
    onSave({ name, outdoorGoal, term, week });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="screen">
      <p className="eyebrow" style={{ marginBottom: 6 }}>Preferences</p>
      <h1 className="display serif" style={{ marginBottom: 28 }}>Settings</h1>

      {/* Name */}
      <div style={{ marginBottom: 32 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
          <Icon.User />
          <p className="eyebrow" style={{ marginBottom: 0 }}>Your Name</p>
        </div>
        <input className="input-line"
          placeholder="Your first name…"
          value={name}
          onChange={e => setName(e.target.value)}
          style={{ fontSize: 18, fontFamily: "'Playfair Display', serif" }}
        />
        <p className="caption italic" style={{ marginTop: 8 }}>
          This is how Tend greets you each morning.
        </p>
      </div>

      <div style={{ height: 1, background: "var(--rule)", marginBottom: 28 }} />

      {/* Outdoor goal */}
      <div style={{ marginBottom: 32 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
          <Icon.Leaf />
          <p className="eyebrow" style={{ marginBottom: 0 }}>Weekly Outdoor Goal</p>
        </div>
        <p className="corm italic" style={{ fontSize: 15, color: "var(--ink-faint)", marginBottom: 16, lineHeight: 1.7 }}>
          Charlotte Mason recommended children spend time outdoors every day. Set a weekly hour goal for your family.
        </p>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <button onClick={() => setGoal(g => Math.max(1, g - 1))}
            style={{ width: 36, height: 36, borderRadius: "50%", border: "1px solid var(--rule)", background: "none", cursor: "pointer", fontSize: 20, color: "var(--ink-faint)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            −
          </button>
          <div style={{ textAlign: "center", flex: 1 }}>
            <span className="serif" style={{ fontSize: 36, color: "var(--sage)" }}>{outdoorGoal}</span>
            <p className="caption" style={{ marginTop: 2 }}>hours per week</p>
          </div>
          <button onClick={() => setGoal(g => Math.min(40, g + 1))}
            style={{ width: 36, height: 36, borderRadius: "50%", border: "1px solid var(--rule)", background: "none", cursor: "pointer", fontSize: 20, color: "var(--ink-faint)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            +
          </button>
        </div>
      </div>

      <div style={{ height: 1, background: "var(--rule)", marginBottom: 28 }} />

      {/* Term & Week */}
      <div style={{ marginBottom: 32 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
          <Icon.Calendar />
          <p className="eyebrow" style={{ marginBottom: 0 }}>Term & Week</p>
        </div>
        <p className="corm italic" style={{ fontSize: 15, color: "var(--ink-faint)", marginBottom: 20, lineHeight: 1.7 }}>
          Adjust if your counter is off.
        </p>

        <p className="eyebrow" style={{ marginBottom: 10 }}>Term</p>
        <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
          {[1, 2, 3].map(n => (
            <button key={n} onClick={() => setTerm(n)}
              style={{
                flex: 1, padding: "12px 0", borderRadius: 2,
                border: `1px solid ${term === n ? "var(--sage)" : "var(--rule)"}`,
                background: term === n ? "var(--sage-bg)" : "none",
                cursor: "pointer", fontFamily: "'Playfair Display', serif",
                fontSize: 18, color: term === n ? "var(--sage)" : "var(--ink)",
              }}>
              {n}
            </button>
          ))}
        </div>

        <p className="eyebrow" style={{ marginBottom: 10 }}>Week</p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {Array.from({ length: 12 }, (_, i) => i + 1).map(n => (
            <button key={n} onClick={() => setWeek(n)}
              style={{
                width: 40, height: 40, borderRadius: 2,
                border: `1px solid ${week === n ? "var(--sage)" : "var(--rule)"}`,
                background: week === n ? "var(--sage)" : "none",
                cursor: "pointer", fontSize: 13,
                color: week === n ? "white" : "var(--ink)",
                fontFamily: "'Lato', sans-serif",
              }}>
              {n}
            </button>
          ))}
        </div>
      </div>

      <div style={{ height: 1, background: "var(--rule)", marginBottom: 28 }} />

      {/* Schedule Mode */}
      <div style={{ marginBottom: 32 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
          <Icon.Calendar />
          <p className="eyebrow" style={{ marginBottom: 0 }}>Schedule Mode</p>
        </div>
        <p className="corm italic" style={{ fontSize: 15, color: "var(--ink-faint)", marginBottom: 16, lineHeight: 1.7 }}>
          Switch to your summer rhythm. Your school-year schedule stays saved and untouched.
        </p>
        <div onClick={() => toggleSummer()} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 0", borderBottom: "1px solid var(--rule)", cursor: "pointer" }}>
          <span style={{ fontSize: 16, fontFamily: "'Playfair Display', serif", color: "var(--ink)" }}>Summer school mode</span>
          <span style={{ width: 44, height: 26, borderRadius: 20, background: summerMode ? "var(--gold)" : "var(--rule)", position: "relative", transition: "background .2s", flexShrink: 0 }}>
            <span style={{ position: "absolute", top: 3, left: summerMode ? 21 : 3, width: 20, height: 20, borderRadius: "50%", background: "white", transition: "left .2s" }} />
          </span>
        </div>
        <p className="caption italic" style={{ marginTop: 12, lineHeight: 1.6 }}>Changes show next time you open the planner.</p>
      </div>

      <div style={{ height: 1, background: "var(--rule)", marginBottom: 28 }} />

      {/* Home Screen */}
      <div style={{ marginBottom: 32 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
          <Icon.Tend />
          <p className="eyebrow" style={{ marginBottom: 0 }}>Home Screen</p>
        </div>
        <p className="corm italic" style={{ fontSize: 15, color: "var(--ink-faint)", marginBottom: 16, lineHeight: 1.7 }}>
          Choose what shows on your home screen. Turn off anything you don't want for a calmer page.
        </p>
        {HOME_SECTIONS.map(([key, label]) => {
          const on = homePrefs[key];
          return (
            <div key={key} onClick={() => toggleHome(key)} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 0", borderBottom: "1px solid var(--rule)", cursor: "pointer" }}>
              <span style={{ fontSize: 16, fontFamily: "'Playfair Display', serif", color: "var(--ink)" }}>{label}</span>
              <span style={{ width: 44, height: 26, borderRadius: 20, background: on ? "var(--sage)" : "var(--rule)", position: "relative", transition: "background .2s", flexShrink: 0 }}>
                <span style={{ position: "absolute", top: 3, left: on ? 21 : 3, width: 20, height: 20, borderRadius: "50%", background: "white", transition: "left .2s" }} />
              </span>
            </div>
          );
        })}
        <p className="caption italic" style={{ marginTop: 12, lineHeight: 1.6 }}>Changes show next time you open the home screen.</p>
      </div>

      <div style={{ height: 1, background: "var(--rule)", marginBottom: 28 }} />

      {/* Calendar Sync */}
      <div style={{ marginBottom: 32 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
          <Icon.Calendar />
          <p className="eyebrow" style={{ marginBottom: 0 }}>Calendar Sync</p>
        </div>
        <p className="corm italic" style={{ fontSize: 15, color: "var(--ink-faint)", marginBottom: 16, lineHeight: 1.7 }}>
          Paste the public link from your Apple/iCloud calendar to pull in co-op, tennis, and other commitments.
        </p>
        <input className="input-line" placeholder="webcal://… or https://…"
          value={icsUrl} onChange={e => setIcsUrl(e.target.value)} style={{ marginBottom: 14, fontSize: 14 }} />
        <button className="btn-sage" style={{ width: "100%", opacity: calLoading ? 0.6 : 1 }} disabled={calLoading} onClick={loadCalendar}>
          {calLoading ? "Loading…" : "Connect & load events"}
        </button>
        {calMsg && <p className="caption italic" style={{ marginTop: 12, lineHeight: 1.6 }}>{calMsg}</p>}
        {calEvents.length > 0 && (
          <div style={{ marginTop: 16 }}>
            {calEvents.slice(0, 12).map((ev, i) => (
              <div key={i} style={{ padding: "8px 0", borderBottom: "1px solid var(--rule)" }}>
                <p style={{ fontSize: 14, color: "var(--ink)", fontFamily: "'Playfair Display', serif" }}>{ev.title}</p>
                <p className="caption">{new Date(ev.start).toLocaleString("en-US", { weekday: "short", month: "short", day: "numeric", hour: "numeric", minute: "2-digit" })}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* About */}
      <div style={{ marginBottom: 32 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
          <Icon.Tend />
          <p className="eyebrow" style={{ marginBottom: 0 }}>About Tend</p>
        </div>
        <p className="corm italic" style={{ fontSize: 15, color: "var(--ink-faint)", lineHeight: 1.7, marginBottom: 8 }}>
          Tend is a daily rhythm app for Charlotte Mason homeschool families.
        </p>
        <p className="caption">Version 1.0 · Delight & Savor</p>
        <a href="https://delightandsavor.com" target="_blank" rel="noopener noreferrer"
          style={{ display: "block", marginTop: 4, fontSize: 12, color: "var(--sage)", fontFamily: "'Lato', sans-serif", letterSpacing: ".06em" }}>
          delightandsavor.com
        </a>
      </div>

      {/* Save */}
      <button className="btn-sage" style={{ width: "100%" }} onClick={save}>
        {saved ? "Saved ✦" : "Save Settings"}
      </button>

      <button onClick={() => onNavigate("home")}
  style={{ width: "100%", background: "none", border: "none", cursor: "pointer", marginTop: 16, fontFamily: "'Lato', sans-serif", fontSize: 11, letterSpacing: ".1em", textTransform: "uppercase", color: "var(--ink-faint)", padding: "10px 0" }}>
  Back to Home
</button>

<div style={{ height: 1, background: "var(--rule)", margin: "24px 0" }} />

<button onClick={async () => {
  const { supabase } = await import("../lib/supabase");
  localStorage.removeItem("tend_user");
  await supabase.auth.signOut();
}}
  style={{ width: "100%", background: "none", border: "1px solid #E8C4BB", borderRadius: 2, padding: "11px 0", cursor: "pointer", fontSize: 11, fontFamily: "'Lato', sans-serif", letterSpacing: ".1em", textTransform: "uppercase", color: "var(--red)" }}>
  Sign Out
</button>
    </div>
  );
}
