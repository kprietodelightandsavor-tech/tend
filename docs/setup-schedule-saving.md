# Turning on schedule saving — your one step

I've changed Tend so your planner edits save permanently instead of vanishing on reload. The code is done. There's one thing only you can do, because it happens inside *your* Supabase account (where Tend keeps its data). It takes about two minutes.

## What you'll do

You're going to create one new place for the schedule to live — a "table" called `schedule_blocks`. You don't have to understand the code; you just paste it in and click run.

1. Go to **supabase.com** and open your Tend project (the one named with `dxsmywjiawgifeyfkdcj`).
2. In the left sidebar, click **SQL Editor**.
3. Click **New query**.
4. Open the file `supabase/migrations/20260604_schedule_blocks.sql` (it's in your project), copy everything in it, and paste it into the editor.
5. Click **Run** (bottom right).

You should see a small "Success" message. That's it — the schedule now has a home.

## How to check it worked

1. Open Tend and sign in.
2. Go to the **Planner**, edit a block — change a time, add a block, or drag one up.
3. **Reload the page.** Your change should still be there.

The first time you open the Planner after running this, Tend fills the new table with your current weekday schedule automatically, so nothing looks different — except now it sticks.

## What this covers (and what it doesn't, yet)

- ✅ Your **weekday** (Mon–Fri) school-year schedule now saves: edits, new blocks, reordering, deleting.
- ⏳ Weekends, alternating weeks, seasonal schedules, and calendar sync are later steps (in `docs/schedule-engine-spec.md`).

If the reload test doesn't hold, tell me — most likely the SQL didn't finish running, and we'll sort it out.
