// Runs via GitHub Actions at session times (3:45 PM ET weekdays, 10 AM ET Saturday)
// Captures traffic + weather + school context → traffic_snapshots table.
// The log form reads from this snapshot so session rows always reflect conditions at session start,
// regardless of when the reporter actually fills in the counts.

const path = require('path');
const SCHOOL_CALENDAR = require(path.join(__dirname, '../../js/calendar.js'));

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

async function fetchWeather(date) {
  const today = new Date().toISOString().slice(0, 10);
  const isFuture = date > today;
  const base = isFuture
    ? 'https://api.open-meteo.com/v1/forecast'
    : 'https://archive-api.open-meteo.com/v1/archive';
  const url = `${base}?latitude=${LAT}&longitude=${LON}&daily=temperature_2m_max,precipitation_sum,weather_code&temperature_unit=fahrenheit&timezone=America%2FNew_York&start_date=${date}&end_date=${date}`;
  try {
    const res  = await fetch(url);
    const json = await res.json();
    const code   = json.daily?.weather_code?.[0]       ?? null;
    const temp   = json.daily?.temperature_2m_max?.[0] ?? null;
    const precip = json.daily?.precipitation_sum?.[0]  ?? null;
    const WMO = { 0:'Clear sky',1:'Mainly clear',2:'Partly cloudy',3:'Overcast',45:'Foggy',48:'Icy fog',51:'Light drizzle',53:'Drizzle',55:'Heavy drizzle',61:'Light rain',63:'Rain',65:'Heavy rain',71:'Light snow',73:'Snow',75:'Heavy snow',80:'Rain showers',81:'Showers',82:'Violent showers',95:'Thunderstorm',96:'Thunderstorm + hail',99:'Severe thunderstorm' };
    return { temp_f: temp, code, precip_mm: precip, desc: WMO[code] ?? 'Unknown' };
  } catch {
    return { temp_f: null, code: null, precip_mm: null, desc: 'Unavailable' };
  }
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

  console.log(`Capturing session context for ${et.date} (${sessionTime} session)...`);

  const [traffic, weather] = await Promise.all([fetchTraffic(), fetchWeather(et.date)]);
  const cal = SCHOOL_CALENDAR.getInfo(et.date);

  if (!traffic) console.log('No traffic data — storing null values.');

  const snapRow = {
    date:            et.date,
    session_time:    sessionTime,
    congestion:      traffic?.congestion      ?? null,
    current_speed:   traffic?.current_speed   ?? null,
    free_flow_speed: traffic?.free_flow_speed ?? null,
    captured_at:     new Date().toISOString(),
    weather_temp_f:  weather.temp_f    ?? null,
    weather_code:    weather.code      ?? null,
    weather_precip:  weather.precip_mm ?? null,
    weather_desc:    weather.desc      ?? null,
    is_school_day:   ['school', 'early_release'].includes(cal.type),
    school_event:    cal.desc          ?? null,
  };
  const result = await supabase('POST', 'traffic_snapshots', snapRow);
  console.log(result ? `✓ Snapshot saved for ${et.date}` : '✗ Failed to save snapshot');
}

main().catch(err => { console.error(err); process.exit(1); });
