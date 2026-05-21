// Runs via GitHub Actions at session times (3:45 PM ET weekdays, 10 AM ET Saturday)
// Captures TomTom traffic and stores in traffic_snapshots table.
// The log form reads from this table — no matter when someone manually logs,
// the traffic reflects actual conditions at session start.

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_KEY;
const TOMTOM_KEY   = process.env.TOMTOM_KEY;
const LAT = 34.2048;
const LON = -84.1401;

const SCHEDULE = {
  2: '3:45 PM',   // Tuesday
  3: '3:45 PM',   // Wednesday
  4: '3:45 PM',   // Thursday
  6: '10:00 AM',  // Saturday
};

function getET() {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/New_York',
    year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', hour12: false,
    weekday: 'short',
  }).formatToParts(new Date());
  const p = Object.fromEntries(parts.map(x => [x.type, x.value]));
  const dowMap = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };
  return {
    date:    `${p.year}-${p.month}-${p.day}`,
    hour:    +p.hour,
    minute:  +p.minute,
    dow:     dowMap[p.weekday],
  };
}

async function supabase(method, path, body) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
    method,
    headers: {
      'apikey':        SUPABASE_KEY,
      'Authorization': `Bearer ${SUPABASE_KEY}`,
      'Content-Type':  'application/json',
      'Prefer':        'resolution=merge-duplicates,return=representation',
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  return res.ok ? res.json().catch(() => null) : null;
}

async function snapshotExists(date) {
  const data = await supabase('GET', `traffic_snapshots?date=eq.${date}&select=id,captured_at`);
  if (!Array.isArray(data) || !data.length) return false;
  // Allow overwrite if existing snapshot is more than 4 hours old (e.g., a manual test run earlier in the day)
  const hoursAgo = (Date.now() - new Date(data[0].captured_at)) / 3_600_000;
  return hoursAgo < 4;
}

async function fetchTraffic() {
  if (!TOMTOM_KEY) return null;
  try {
    const url = `https://api.tomtom.com/traffic/services/4/flowSegmentData/absolute/10/json?key=${TOMTOM_KEY}&point=${LAT},${LON}`;
    const res = await fetch(url);
    if (!res.ok) return null;
    const flow = (await res.json()).flowSegmentData;
    if (!flow) return null;
    const congestion = flow.freeFlowSpeed > 0
      ? Math.max(0, Math.min(1, +(1 - flow.currentSpeed / flow.freeFlowSpeed).toFixed(2)))
      : 0;
    return { congestion, current_speed: flow.currentSpeed, free_flow_speed: flow.freeFlowSpeed };
  } catch (e) {
    console.error('TomTom error:', e.message);
    return null;
  }
}

async function main() {
  const et = getET();
  const sessionTime = SCHEDULE[et.dow];

  if (!sessionTime) {
    console.log(`No session scheduled for dow=${et.dow} — skipping.`);
    return;
  }

  // Deduplicate: if the cron fired twice (EDT + EST), only run once
  if (await snapshotExists(et.date)) {
    console.log(`Snapshot already exists for ${et.date} — skipping.`);
    return;
  }

  console.log(`Capturing traffic snapshot for ${et.date} (${sessionTime} session)...`);
  const traffic = await fetchTraffic();

  if (!traffic) {
    console.log('No traffic data available — storing null snapshot as placeholder.');
  }

  const row = {
    date:         et.date,
    session_time: sessionTime,
    congestion:   traffic?.congestion   ?? null,
    current_speed: traffic?.current_speed ?? null,
    free_flow_speed: traffic?.free_flow_speed ?? null,
    captured_at:  new Date().toISOString(),
  };

  const result = await supabase('POST', 'traffic_snapshots', row);
  console.log(result ? `✓ Snapshot saved for ${et.date}` : '✗ Failed to save snapshot');
}

main().catch(err => { console.error(err); process.exit(1); });
