// Minutes between now and the scheduled session time string ('3:45 PM')
function minutesFromSession(sessionTimeStr) {
  if (!sessionTimeStr) return Infinity;
  const [time, period] = sessionTimeStr.split(' ');
  let [h, m] = time.split(':').map(Number);
  if (period === 'PM' && h !== 12) h += 12;
  if (period === 'AM' && h === 12) h = 0;
  const now = new Date();
  return now.getHours() * 60 + now.getMinutes() - (h * 60 + m);
}

// Always fetch — caller decides how to interpret capturedAt vs session time
async function fetchTraffic(lat, lon, apiKey) {
  if (!apiKey || apiKey === 'YOUR_TOMTOM_KEY') return null;
  try {
    const url = `https://api.tomtom.com/traffic/services/4/flowSegmentData/absolute/10/json?key=${apiKey}&point=${lat},${lon}`;
    const res = await fetch(url);
    if (!res.ok) return null;
    const flow = (await res.json()).flowSegmentData;
    if (!flow) return null;
    const congestion = flow.freeFlowSpeed > 0
      ? Math.max(0, Math.min(1, +(1 - flow.currentSpeed / flow.freeFlowSpeed).toFixed(2)))
      : 0;
    return {
      congestion,
      currentSpeed:   flow.currentSpeed,
      freeFlowSpeed:  flow.freeFlowSpeed,
      capturedAt:     new Date().toISOString(),
    };
  } catch {
    return null;
  }
}

function trafficIcon(congestion) {
  if (congestion === null || congestion === undefined) return '—';
  if (congestion < 0.25) return '🟢 Free flowing';
  if (congestion < 0.50) return '🟡 Moderate';
  if (congestion < 0.75) return '🔴 Heavy';
  return '🚨 Standstill';
}
