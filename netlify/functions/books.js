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
    const { method, userId, schoolYear, subject, title, author, childName, status, bookId, startedAt, finishedAt, notes } = body;

    if (!userId) return { statusCode: 400, headers, body: JSON.stringify({ error: 'Missing userId' }) };

    if (method === 'list') {
      const query = supabase.from('books').select('*').eq('user_id', userId).order('subject').order('created_at', { ascending: false });
      if (schoolYear) query.eq('school_year', schoolYear);
      const { data, error } = await query;
      if (error) throw error;
      return { statusCode: 200, headers, body: JSON.stringify({ books: data || [] }) };
    }

    if (method === 'add') {
      const { data, error } = await supabase.from('books').insert({
        user_id: userId, subject, title, author: author || null,
        child_name: childName || 'All', school_year: schoolYear,
        status: status || 'current', started_at: startedAt || null,
        finished_at: finishedAt || null, notes: notes || null,
      }).select().single();
      if (error) throw error;
      return { statusCode: 200, headers, body: JSON.stringify({ book: data }) };
    }

    if (method === 'update') {
      const updates = {};
      if (status !== undefined) updates.status = status;
      if (title !== undefined) updates.title = title;
      if (author !== undefined) updates.author = author;
      if (finishedAt !== undefined) updates.finished_at = finishedAt;
      if (startedAt !== undefined) updates.started_at = startedAt;
      if (notes !== undefined) updates.notes = notes;
      await supabase.from('books').update(updates).eq('id', bookId).eq('user_id', userId);
      return { statusCode: 200, headers, body: JSON.stringify({ ok: true }) };
    }

    if (method === 'delete') {
      await supabase.from('books').delete().eq('id', bookId).eq('user_id', userId);
      return { statusCode: 200, headers, body: JSON.stringify({ ok: true }) };
    }

    return { statusCode: 400, headers, body: JSON.stringify({ error: 'Unknown method' }) };
  } catch (e) {
    console.error('books error:', e.message);
    return { statusCode: 500, headers, body: JSON.stringify({ error: e.message }) };
  }
};
