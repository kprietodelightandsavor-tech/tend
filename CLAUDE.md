# TEND — Project Memory for Claude
*Kim's Charlotte Mason homeschool ecosystem. If Kim says "bring me back to where we left off," read this file top to bottom and summarize the CURRENT STATE and NEXT STEPS sections back to her.*

Last updated: July 7, 2026

## The two products (a pair)
1. **TEND Keeping Journal** — 67-page GoodNotes PDF, undated, 5 covers, sellable. Final file: Google Drive → TEND folder → `TEND Keeping Journal.pdf`. Also there: `TEND_Sample_Week.pdf` (free lead magnet), `Listing/` (14 shop images), `TEND_Listing_Copy.md` (Etsy/Gumroad/Instagram copy), `TEND_App_Free_vs_Premium.md`, `TEND_Premium_Gumroad_Setup.md`, `Covers/` (5 source images).
2. **Tend app** — this repo. React/Vite/Supabase, deployed at tend-ds.netlify.app via Netlify (auto-deploys on push from GitHub Desktop). PWA with push nudges.

## Pricing decided
- Journal: $24 founding / $28 regular
- App: free tier forever; Premium $29/yr (founding $24 via code FOUNDING)
- Bundle: journal + 1 yr Premium = $48. Journal buyers get code KEEPER ($7 off Premium).
- Premium unlock: Gumroad webhook → Supabase `profiles.is_paid` (already wired, product link delightnsavor.gumroad.com/l/qrxxi)

## Design language (both products)
Warm earth palette: cream #F7F3EC, sage #7E9B84, gold #C49A4E. Fonts: Playfair Display (titles), Cormorant Garamond italic (prose), Lato small-caps (labels). App home page grammar: **slim single lines, one texture at a time, no stacked cards.** Kim is ADHD + designs dyslexia-friendly; never add busy UI. Her seedling sprout = app icon (public/tend_icon*.png, from her brand card in public/). The wildflower sprig (SproutMark/SprigPaths) = in-app mark (home greeting, menu, onboarding).

## App: what's built (all working unless noted)
- Six-block school rhythm (math mornings, done by lunch); Mon full co-op, Thu half co-op; Nature Tue/Fri
- **Break mode** (renamed from Summer) — one rhythm: Morning/Afternoon/Evening chapters, screens window woven in, work-with-edges as a one-line prompt
- Evening Close (thirty seconds of keeping) → **Premium: syncs to Teaching Record** ("records that write themselves")
- Mother Culture pills (movement/protein/nature/rest) shared between home row + Evening Close
- Time-aware day: past blocks/chapters gray out even unchecked; current wears a sage "now" chip; done/skipped sink below a "✓ done & set aside" divider
- **The Lantern** — AI companion (4th nav tab, lantern icon). Two doors: "Transitions" (task-switching help for mother & child) and "Ideas & Untangling" (troubleshooting + muse). Mic input via Web Speech API. Netlify function `tend-guide.js` → Anthropic API (claude-haiku-4-5), key already in Netlify env as ANTHROPIC_API_KEY. Free: 5/day; Premium unlimited.
- Premium gates: records sync, habit months 2+, second+ child, Lantern limit, planner editing, nature topics, Lilies entries, Annual Report
- Push nudges: morning 7:25am / evening 7:45pm CDT (netlify.toml crons in UTC — **will drift 1 hr when DST ends in November; Kim will ask to fix**)
- Calendar iCal sync: timezone/DST-correct, appointments woven into day at time position
- Something Beautiful (rotating line/brush invitations → Consider the Lilies journal)
- Comfort Reading toggle (dyslexia), reduced motion, FocusTimer (15/20/25)

## Kim's outstanding to-dos (remind her gently)
- [ ] Run Supabase SQL migration: `supabase/migrations/20260707_push_subscriptions.sql` (push nudges need it)
- [ ] Netlify env vars for push: VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY, VAPID_SUBJECT (values were given in chat; public key also in src/lib/push.js)
- [ ] Gumroad: set Premium to yearly membership $29, paste copy from `TEND_Premium_Gumroad_Setup.md`, create codes FOUNDING + KEEPER
- [ ] List the journal (Etsy/Gumroad) using `TEND_Listing_Copy.md` + Listing images
- [ ] Paste shop URL into `JOURNAL_URL` in src/screens/MenuScreen.jsx when live
- [ ] Test as a free account after deploy: evening close, second child, locked habit month, Lantern limit

## WHERE WE LEFT OFF (July 7, 2026)
Just finished, uncommitted or freshly committed in GitHub Desktop:
1. Restored her seedling app icon; bolder sprig mark in-app; sprig on home greeting
2. De-busied home page: MC pills one line, lunch one line, timer "need a timer?", break + weekend days same slim grammar
3. Renamed Summer → Break (labels only; internal value still "summer")
4. Time-aware graying + "now" chips + "done & set aside" divider
5. Built The Lantern (renamed from "The Guide"), moved to main nav 4th tab, added mic input, doors renamed to "Transitions" / "Ideas & Untangling"

## NEXT STEPS (the natural continuation)
1. Kim commits & pushes; verify Lantern answers on the live site (key already in Netlify)
2. Kim's to-do list above (especially Gumroad setup + journal listing = launch)
3. Ideas offered but not started: Gumroad Premium page live-check, memory verse list expansion (awaiting her list), third habit term (Attention), region-aware nature notes, print edition of journal (Lulu coil), "How We Tend" field guide, November DST cron fix

## Working with Kim
Voice: warm, literary, CM language ("keeping," "the feast," "riches"), no hype. She gives design feedback in feel-words ("busy," "hard to follow") — respond by simplifying, not adding. She commits/pushes via GitHub Desktop herself. Journal PDFs are generated by `make_journal_v4.py` (lives in Claude's session outputs — regenerate from repo knowledge if lost, or ask her for the Drive copy).
