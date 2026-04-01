const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

exports.handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json',
  };

  if (event.httpMethod === 'OPTIONS') return { statusCode: 200, headers, body: '' };

  try {
    const body = JSON.parse(event.body || '{}');
    const { method, userId, date, subject, timeBlock, note, status, schoolYear, recordId } = body;

    if (!userId) return { statusCode: 400, headers, body: JSON.stringify({ error: 'Missing userId' }) };

    // ── UPSERT ────────────────────────────────────────────────────────────────
    if (method === 'upsert') {
      const { data: existing, error: selectError } = await supabase
        .from('teaching_log')
        .select('id')
        .eq('user_id', userId)
        .eq('date', date)
        .eq('subject', subject)
        .maybeSingle();

      if (selectError) {
        console.error('teaching-log select error:', selectError);
        return { statusCode: 500, headers, body: JSON.stringify({ error: selectError.message }) };
      }

      if (existing) {
        const { error: updateError } = await supabase
          .from('teaching_log')
          .update({ status, updated_at: new Date().toISOString() })
          .eq('id', existing.id);

        if (updateError) {
          console.error('teaching-log update error:', updateError);
          return { statusCode: 500, headers, body: JSON.stringify({ error: updateError.message }) };
        }
      } else {
        const { error: insertError } = await supabase
          .from('teaching_log')
          .insert({
            user_id:     userId,
            date,
            subject,
            time_block:  timeBlock || null,
            note:        note || null,
            status:      status || 'completed',
            school_year: schoolYear,
          });

        if (insertError) {
          console.error('teaching-log insert error:', insertError);
          return { statusCode: 500, headers, body: JSON.stringify({ error: insertError.message }) };
        }
      }

      return { statusCode: 200, headers, body: JSON.stringify({ ok: true }) };
    }

    // ── DELETE by date+subject ────────────────────────────────────────────────
    if (method === 'delete') {
      const { error: deleteError } = await supabase
        .from('teaching_log')
        .delete()
        .eq('user_id', userId)
        .eq('date', date)
        .eq('subject', subject);

      if (deleteError) {
        console.error('teaching-log delete error:', deleteError);
        return { statusCode: 500, headers, body: JSON.stringify({ error: deleteError.message }) };
      }

      return { statusCode: 200, headers, body: JSON.stringify({ ok: true }) };
    }

    // ── LIST ──────────────────────────────────────────────────────────────────
    if (method === 'list') {
      const { startDate, endDate, schoolYear: sy } = body;
      const { data, error } = await supabase
        .from('teaching_log')
        .select('*')
        .eq('user_id', userId)
        .eq('school_year', sy)
        .gte('date', startDate)
        .lte('date', endDate)
        .order('date', { ascending: true })
        .order('time_block', { ascending: true, nullsFirst: true });

      if (error) {
        console.error('teaching-log list error:', error);
        return { statusCode: 500, headers, body: JSON.stringify({ error: error.message }) };
      }

      return { statusCode: 200, headers, body: JSON.stringify({ records: data || [] }) };
    }

    // ── UPDATE NOTE ───────────────────────────────────────────────────────────
    if (method === 'update-note') {
      const { error: noteError } = await supabase
        .from('teaching_log')
        .update({ note, updated_at: new Date().toISOString() })
        .eq('id', recordId)
        .eq('user_id', userId);

      if (noteError) {
        console.error('teaching-log update-note error:', noteError);
        return { statusCode: 500, headers, body: JSON.stringify({ error: noteError.message }) };
      }

      return { statusCode: 200, headers, body: JSON.stringify({ ok: true }) };
    }

    // ── DELETE by record ID ───────────────────────────────────────────────────
    if (method === 'delete-record') {
      const { error: delRecError } = await supabase
        .from('teaching_log').delete()
        .eq('id', recordId)
        .eq('user_id', userId);

      if (delRecError) {
        console.error('teaching-log delete-record error:', delRecError);
        return { statusCode: 500, headers, body: JSON.stringify({ error: delRecError.message }) };
      }

      return { statusCode: 200, headers, body: JSON.stringify({ ok: true }) };
    }

    return { statusCode: 400, headers, body: JSON.stringify({ error: 'Unknown method' }) };

  } catch (e) {
    console.error('teaching-log error:', e);
    return { statusCode: 500, headers, body: JSON.stringify({ error: e.message }) };
  }
};
