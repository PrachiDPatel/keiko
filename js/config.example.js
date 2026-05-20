// Copy this file to config.js and fill in your values.
// config.js is gitignored — but Supabase anon keys are safe to commit if you prefer.

const CONFIG = {
  supabaseUrl:  'https://YOUR_PROJECT.supabase.co',
  supabaseKey:  'YOUR_ANON_KEY',

  // Forsyth County location (used for weather)
  latitude:  34.2048,
  longitude: -84.1401,

  // Staffing settings (adjustable in the Analysis UI too)
  preferredRatio:       4,     // 1 sensei per N kids
  senseiHourlyRate:     15,    // dollars
  defaultSessionHours:  1.5,
};
