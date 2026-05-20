// Supabase database operations

let _db = null;

function getDB() {
  if (!_db) {
    _db = supabase.createClient(CONFIG.supabaseUrl, CONFIG.supabaseKey);
  }
  return _db;
}

async function logSession(data) {
  const { error, data: row } = await getDB()
    .from('sessions')
    .insert([data])
    .select()
    .single();
  if (error) throw error;
  return row;
}

async function getSessions({ from, to, limit } = {}) {
  let q = getDB().from('sessions').select('*').order('date', { ascending: false });
  if (from)  q = q.gte('date', from);
  if (to)    q = q.lte('date', to);
  if (limit) q = q.limit(limit);
  const { data, error } = await q;
  if (error) throw error;
  return data ?? [];
}

async function getSessionByDate(dateStr) {
  const { data } = await getDB()
    .from('sessions')
    .select('*')
    .eq('date', dateStr)
    .order('time_slot');
  return data ?? [];
}

async function deleteSession(id) {
  const { error } = await getDB().from('sessions').delete().eq('id', id);
  if (error) throw error;
}

async function updateSession(id, updates) {
  const { error } = await getDB().from('sessions').update(updates).eq('id', id);
  if (error) throw error;
}

async function getPrevSession(beforeDate) {
  const { data } = await getDB()
    .from('sessions')
    .select('kids_count')
    .lt('date', beforeDate)
    .order('date', { ascending: false })
    .limit(1)
    .maybeSingle();
  return data?.kids_count ?? null;
}

async function getTrafficSnapshot(dateStr) {
  const { data } = await getDB()
    .from('traffic_snapshots')
    .select('*')
    .eq('date', dateStr)
    .maybeSingle();
  return data || null;
}

// Aggregates used by the analysis page
function computeAnalysis(sessions, preferredRatio, rate) {
  return sessions.map(s => {
    const needed   = Math.ceil(s.kids_count / preferredRatio);
    const extra    = Math.max(0, s.senseis_count - needed);
    const shortage = Math.max(0, needed - s.senseis_count);
    const waste    = extra * rate * s.duration_hours;
    const actualRatio = s.senseis_count > 0 ? (s.kids_count / s.senseis_count).toFixed(1) : '—';
    return { ...s, needed, extra, shortage, waste, actualRatio };
  });
}

function summaryStats(analysed) {
  const totalWaste    = analysed.reduce((a, s) => a + s.waste, 0);
  const avgKids       = analysed.length ? analysed.reduce((a,s)=>a+s.kids_count,0)/analysed.length : 0;
  const avgSenseis    = analysed.length ? analysed.reduce((a,s)=>a+s.senseis_count,0)/analysed.length : 0;
  const overstaffed   = analysed.filter(s => s.extra > 0).length;
  const understaffed  = analysed.filter(s => s.shortage > 0).length;
  return { totalWaste, avgKids, avgSenseis, overstaffed, understaffed, total: analysed.length };
}
