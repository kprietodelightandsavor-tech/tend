# Tend — Schedule Engine Spec

A plan to turn Tend's planner from a hardcoded family schedule into a flexible, sellable scheduling engine that handles real-world variety (alternating weeks, seasonal schedules, fixed outside commitments) and can sync from a calendar via iCal.

> Status: design spec, pre-implementation. Nothing here is built yet. Phases are ordered so you (or a developer) can ship value incrementally.

---

## 1. The core idea

Today a "day" is a hand-kept list of blocks in `src/data/seed.js` (`DAY_SCHEDULE`), copied across five weekdays, and edits in `PlannerScreen` live only in React state — they reset on reload.

The new model stores each thing **once** as an *item* with a *recurrence rule*, grouped into *schedule sets*. The app generates each actual day on the fly from those rules. This is the same approach calendars use (the iCalendar `RRULE`), which is also why it can sync to iCal cleanly.

Four concepts:

- **Schedule set** — a named collection of items with an active window. e.g. "School year" (Aug–May), "Summer" (Jun–Aug). Switching seasons = switching the active set.
- **Item** — one activity, stored once, carrying a recurrence rule (which days, how often, what window, what time) and a layer.
- **Layer** — `personal` / `lessons` / `commitments`. Lets commitments sit *over* the rhythm, and lets a buyer hide layers they don't use.
- **View mode** — clock-time blocks, parts-of-day "gentle shape," or loop scheduling. Different planning philosophies, same data.

---

## 2. Data model (Supabase)

Follows the existing pattern in `src/lib/db.js` (`user_id` scoping, `sort_order`).

### `schedule_sets`

| column | type | notes |
|---|---|---|
| `id` | uuid pk | |
| `user_id` | uuid | |
| `name` | text | "School year", "Summer" |
| `active_from` | date null | optional date-driven activation |
| `active_to` | date null | |
| `is_active` | boolean | manual override if no dates |
| `sort_order` | int | |
| `created_at` | timestamptz | |

### `schedule_items`

| column | type | notes |
|---|---|---|
| `id` | uuid pk | |
| `user_id` | uuid | |
| `set_id` | uuid fk → schedule_sets | |
| `title` | text | the subject ("Strength", "Living Literature") |
| `note` | text | |
| `layer` | text | `personal` \| `lessons` \| `commitments` |
| `part_of_day` | text null | `dawn`/`morning`/`midday`/`afternoon`/`evening` |
| `start_time` | text null | "6:00" — optional |
| `end_time` | text null | "7:00" — optional |
| `byday` | text[] | `{MO,WE}` — which weekdays it repeats |
| `week_interval` | int default 1 | 1 = weekly, 2 = every other week |
| `week_anchor` | int null | parity reference (see §3) |
| `starts_on` | date null | term/season window start |
| `ends_on` | date null | window end |
| `source` | text default 'manual' | `manual` \| `ical` |
| `sort_order` | int | order within a part of day |
| `created_at` | timestamptz | |

### `calendar_feeds` (iCal)

| column | type | notes |
|---|---|---|
| `id` | uuid pk | |
| `user_id` | uuid | |
| `name` | text | "Family calendar" |
| `ics_url` | text | secret subscription URL |
| `layer` | text default 'commitments' | |
| `last_synced_at` | timestamptz null | |

### `synced_events` (cache of expanded occurrences)

| column | type | notes |
|---|---|---|
| `id` | uuid pk | |
| `user_id` | uuid | |
| `feed_id` | uuid fk → calendar_feeds | |
| `uid` | text | iCal event UID (for dedupe) |
| `title` | text | |
| `starts_at` | timestamptz | |
| `ends_at` | timestamptz | |

Refreshed on each sync (delete-and-replace per feed within the sync window).

---

## 3. Recurrence

Most items just need `byday` (e.g. Strength = `{MO,WE}`, The barn = `{TU,TH}`). Two extra fields cover the rest:

- **Every other week** → `week_interval = 2`. To know *which* weeks, anchor parity to Tend's existing term/week counter (`TERM_SETTINGS.currentWeek` in `seed.js`): show the item when `(currentWeek - week_anchor) % week_interval === 0`. No manual tracking — the counter already runs.
- **Season / term limits** → `starts_on` / `ends_on`. Co-op and tennis only render inside their windows.

**Note:** for anything already on your calendar (like the alternating Chispa Tuesdays), you don't need the recurrence math at all — the iCal sync (§4) brings those occurrences in directly, with the calendar as the source of truth.

---

## 4. iCal sync

### v1 — read-only subscription (recommended first)

Google, Apple, and Outlook calendars each expose a secret `.ics` subscription URL. The user pastes that URL into Tend once (stored in `calendar_feeds`). Tend then shows those events as a read-only `commitments` layer over the rhythm.

Browsers can't fetch a third-party `.ics` directly (CORS), so the fetch + parse happens server-side — exactly the pattern you already use in `netlify/functions/parse-schedule.js`. New function:

```
netlify/functions/sync-calendar.js
  POST { icsUrl, windowStart, windowEnd }
  → fetch the ICS text server-side
  → parse with node-ical (expands RRULE, incl. every-other-week)
  → return [{ uid, title, start, end }] within the window
```

Client caches the result into `synced_events`, then the planner merges them with the user's own items when rendering a day. Add dependency: `node-ical` (server-side only).

This single feature makes the "tricky" recurrence (biweekly Chispa, co-op terms, tennis season) a non-issue — whatever your calendar says is what shows.

### v2 — two-way Google Calendar (later)

OAuth + Google Calendar API for editing events from inside Tend. Heavier: requires Google's app verification, which matters once you're selling to the public. Defer until v1 proves the demand.

---

## 5. Editing UX

(See the two mockups from the design session.) The same editor serves personal rhythm, lessons, and weekends:

- Items grouped under **parts of the day** (Morning / Afternoon / Evening); clock time is an optional annotation, matching Tend's "a gentle shape, not a schedule" voice.
- Each item carries **repeats-on-days** toggles (M T W Th F S Su) — set "Strength · M/W" once instead of the current destructive "Copy day."
- A **Weekday / Weekend** toggle so the locked-in-code weekend rotations (`SATURDAY_RHYTHMS` / `SUNDAY_RHYTHMS`) become editable like everything else.
- Synced calendar items appear in the `commitments` layer, visually distinct and read-only.

---

## 6. Sellable: templates + layers

The Charlotte Mason content (Beauty Loop, narration stages, terms, the daily spine) becomes the **first template**, not something baked into the engine. The current `seed.js` ships as the "Charlotte Mason starter." Later you add "Classical" or "Secular block" starters, each just a different set of seed items.

- **Layers** let a buyer hide what they don't use (no co-op? hide the commitments layer).
- **View modes** let block-schedulers, loop-schedulers, and time-blockers all use the same product.
- Ties into your existing Gumroad flow (`gumroad-webhook.js`, `check-pending-upgrade.js`, the `isPaid` gate in `PlannerScreen`): templates and calendar sync are natural Premium features.

---

## 7. Migration from `seed.js`

1. Create one set, "Charlotte Mason starter" (or per-user "School year").
2. Collapse the shared weekday morning spine (Rise & Shine → Lunch, identical Mon–Fri) into **single items** tagged `byday = {MO,TU,WE,TH,FR}`. Editing "Living Literature" once updates every day.
3. Afternoon subjects become per-day items (Science = `{MO}`, History Spine = `{WE}`, etc.). Thursday's early Co-op break stays its own item.
4. `SATURDAY_RHYTHMS` / `SUNDAY_RHYTHMS` → items in the set with `byday = {SA}` / `{SU}` (drop the week-rotation, or keep it via `week_interval`).
5. Beauty Loop entries → items with `layer = lessons` and a `beauty_loop` tag.
6. `seed.js` stays as the bootstrap that seeds a new user's first set — it just stops being the live source of truth.

---

## 8. Files to change

- **`supabase`** — migration creating the four tables above + row-level security on `user_id`.
- **`src/lib/db.js`** — add `getScheduleSets`, `getScheduleItems(setId)`, `upsertScheduleItem`, `deleteScheduleItem`, `getCalendarFeeds`, `upsertCalendarFeed`, `getSyncedEvents`. Mirror existing function style.
- **`src/screens/PlannerScreen.jsx`** — load from / save to Supabase instead of local state seeded from the constant (this alone fixes the reset-on-reload bug); render by part-of-day; render repeats-on toggles; merge in the commitments layer.
- **`netlify/functions/sync-calendar.js`** — new (see §4).
- **`package.json`** — add `node-ical`.
- **`src/data/seed.js`** — repurpose as the CM starter template payload.

---

## 9. Build order

1. **Persistence** — tables + wire the *existing* editor to Supabase. Fixes the reset bug; no new UI. Smallest, highest-relief step.
2. **Recurrence + sets** — repeats-on-days, schedule sets, season windows. Replaces "Copy day."
3. **iCal sync** — `calendar_feeds`, `sync-calendar.js`, the commitments layer. Solves biweekly + seasonal commitments.
4. **Sell** — templates, layer hide/show, view modes; gate via Gumroad/Premium.

---

## 10. Open items

- **Summer schedule** isn't in the repo — it's on your calendar. Once v1 iCal sync exists, summer "tidies itself": subscribe to it as a feed, or keep it as a separate schedule set. (Separately, the calendar's summer events can be cleaned up directly now if you want.)
- **Time format** — `seed.js` times have no AM/PM. Decide on a stored format (suggest 24h internally, display in the user's preference).
- **Model string** — `parse-schedule.js` pins `claude-opus-4-5`; confirm before reusing in the new function.
