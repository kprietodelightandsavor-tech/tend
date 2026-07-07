// netlify/functions/send-nudge.js
// Shared sender used by the scheduled morning and evening nudge functions.

const { createClient } = require('@supabase/supabase-js');
const webpush = require('web-push');

async function sendToAll(payload) {
  const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);
  webpush.setVapidDetails(
    process.env.VAPID_SUBJECT || 'mailto:hello@delightandsavor.com',
    process.env.VAPID_PUBLIC_KEY,
    process.env.VAPID_PRIVATE_KEY
  );

  const { data: subs, error } = await supabase.from('push_subscriptions').select('id, subscription');
  if (error) throw error;

  let sent = 0, pruned = 0;
  for (const row of subs || []) {
    try {
      await webpush.sendNotification(row.subscription, JSON.stringify(payload));
      sent++;
    } catch (e) {
      // 404/410 = the device unsubscribed; tidy up quietly
      if (e.statusCode === 404 || e.statusCode === 410) {
        await supabase.from('push_subscriptions').delete().eq('id', row.id);
        pruned++;
      }
    }
  }
  return { sent, pruned };
}

module.exports = { sendToAll };
