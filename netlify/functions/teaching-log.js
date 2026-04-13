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
    const body = JSON.parse(event.body || '{}');
    const { method, userId, date, subject, timeBlock, note, status, schoolYear, recordId, startDate, endDate } = body;

    if (!userId) return { statusCode: 400, headers, body: JSON.stringify({ error: 'Missing userId' }) };

    if (method === 'upsert') {
      const { data: existing } = await supabase
        .from('teaching_log').select('id')
        .eq('user_id', userId).eq('date', date).eq('subject', subject)
        .maybeSingle();
      if (existing) {
        await supabase.from('teaching_log').update({ status }).eq('id', existing.id);
      } else {
        await supabase.from('teaching_log').insert({
          user_id: userId, date, subject,
          time_block: timeBlock || null,
          note: note || null,
          status: status || 'completed',
          school_year: schoolYear,
        });
      }
      return { statusCode: 200, headers, body: JSON.stringify({ ok: true }) };
    }

    if (method === 'delete') {
      await supabase.from('teaching_log').delete()
        .eq('user_id', userId).eq('date', date).eq('subject', subject);
      return { statusCode: 200, headers, body: JSON.stringify({ ok: true }) };
    }

    if (method === 'list') {
      const { data, error } = await supabase
        .from('teaching_log').select('*')
        .eq('user_id', userId).eq('school_year', schoolYear)
        .gte('date', startDate).lte('date', endDate)
        .order('date', { ascending: true })
        .order('time_block', { ascending: true });
      if (error) throw error;
      return { statusCode: 200, headers, body: JSON.stringify({ records: data || [] }) };
    }

    if (method === 'update-note') {
      await supabase.from('teaching_log').update({ note }).eq('id', recordId).eq('user_id', userId);
      return { statusCode: 200, headers, body: JSON.stringify({ ok: true }) };
    }

    if (method === 'delete-record') {
      await supabase.from('teaching_log').delete().eq('id', recordId).eq('user_id', userId);
      return { statusCode: 200, headers, body: JSON.stringify({ ok: true }) };
    }

    return { statusCode: 400, headers, body: JSON.stringify({ error: 'Unknown method' }) };
  } catch (e) {
    console.error('teaching-log error:', e.message);
    return { statusCode: 500, headers, body: JSON.stringify({ error: e.message }) };
  }
};
