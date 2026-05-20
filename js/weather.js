// Open-Meteo — free, no API key, real weather data

const WMO_CODES = {
  0: 'Clear sky', 1: 'Mainly clear', 2: 'Partly cloudy', 3: 'Overcast',
  45: 'Foggy', 48: 'Icy fog',
  51: 'Light drizzle', 53: 'Drizzle', 55: 'Heavy drizzle',
  61: 'Light rain', 63: 'Rain', 65: 'Heavy rain',
  71: 'Light snow', 73: 'Snow', 75: 'Heavy snow',
  80: 'Rain showers', 81: 'Showers', 82: 'Violent showers',
  95: 'Thunderstorm', 96: 'Thunderstorm + hail', 99: 'Severe thunderstorm',
};

async function fetchWeather(lat, lon, dateStr) {
  // dateStr = 'YYYY-MM-DD'
  const today = new Date().toISOString().slice(0,10);
  const isFuture = dateStr > today;

  const endpoint = isFuture
    ? `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=temperature_2m_max,precipitation_sum,weather_code&temperature_unit=fahrenheit&timezone=America%2FNew_York&start_date=${dateStr}&end_date=${dateStr}`
    : `https://archive-api.open-meteo.com/v1/archive?latitude=${lat}&longitude=${lon}&daily=temperature_2m_max,precipitation_sum,weather_code&temperature_unit=fahrenheit&timezone=America%2FNew_York&start_date=${dateStr}&end_date=${dateStr}`;

  try {
    const res  = await fetch(endpoint);
    const data = await res.json();
    const code  = data.daily.weather_code?.[0]  ?? null;
    const temp  = data.daily.temperature_2m_max?.[0] ?? null;
    const precip = data.daily.precipitation_sum?.[0] ?? null;
    return {
      temp_f:    temp,
      code:      code,
      precip_mm: precip,
      desc:      WMO_CODES[code] ?? 'Unknown',
    };
  } catch {
    return { temp_f: null, code: null, precip_mm: null, desc: 'Unavailable' };
  }
}

function weatherIcon(code) {
  if (code === null) return '—';
  if (code === 0 || code === 1) return '☀️';
  if (code <= 3)  return '⛅';
  if (code <= 48) return '🌫️';
  if (code <= 67) return '🌧️';
  if (code <= 77) return '❄️';
  if (code <= 82) return '🌦️';
  return '⛈️';
}

function commuteImpact(code, precip) {
  // Returns 'good' | 'fair' | 'poor' — affects expected turnout
  if (code === null) return 'unknown';
  if (code >= 95) return 'poor';
  if (code >= 61 || precip > 10) return 'fair';
  if (code >= 51 || precip > 2)  return 'fair';
  return 'good';
}
