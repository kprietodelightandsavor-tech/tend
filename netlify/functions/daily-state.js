const { createClient } = require('@supabase/supabase-js');

exports.handler = async (event) => {
  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_KEY
  );

  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json',
  };

  if (event.httpMethod === 'OPTIONS') return { statusCode: 200, headers, body: '' };

  try {
    const { method, userId, date, state } = JSON.parse(event.body || '{}');

    if (!userId || !date) {
      return { statusCode: 400, headers, body: JSON.stringify({ error: 'Missing userId or date' }) };
    }

    if (method === 'get') {
      const { data, error } = await supabase
        .from('daily_state')
        .select('state, updated_at')
        .eq('user_id', userId)
        .eq('date', date)
        .maybeSingle();
      if (error) throw error;
      return { statusCode: 200, headers, body: JSON.stringify({ state: data?.state || null }) };
    }

    if (method === 'set') {
      const { error } = await supabase
        .from('daily_state')
        .upsert({ user_id: userId, date, state, updated_at: new Date().toISOString() }, { onConflict: 'user_id,date' });
      if (error) throw error;
      return { statusCode: 200, headers, body: JSON.stringify({ ok: true }) };
    }

    return { statusCode: 400, headers, body: JSON.stringify({ error: 'Unknown method' }) };
  } catch (e) {
    console.error('daily-state error:', e.message);
    return { statusCode: 500, headers, body: JSON.stringify({ error: e.message }) };
  }
};
