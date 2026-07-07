// netlify/functions/push-subscribe.js
// Saves a device's push subscription for a user.

const { createClient } = require('@supabase/supabase-js');

exports.handler = async (event) => {
  const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json',
  };
  if (event.httpMethod === 'OPTIONS') return { statusCode: 200, headers, body: '' };
  if (event.httpMethod !== 'POST') return { statusCode: 405, headers, body: JSON.stringify({ error: 'Method not allowed' }) };

  try {
    const { userId, subscription } = JSON.parse(event.body || '{}');
    if (!userId || !subscription?.endpoint) {
      return { statusCode: 400, headers, body: JSON.stringify({ error: 'Missing userId or subscription' }) };
    }
    // one row per device endpoint
    await supabase.from('push_subscriptions').delete().eq('endpoint', subscription.endpoint);
    const { error } = await supabase.from('push_subscriptions').insert({
      user_id: userId,
      endpoint: subscription.endpoint,
      subscription,
    });
    if (error) throw error;
    return { statusCode: 200, headers, body: JSON.stringify({ ok: true }) };
  } catch (e) {
    return { statusCode: 500, headers, body: JSON.stringify({ error: e.message }) };
  }
};
