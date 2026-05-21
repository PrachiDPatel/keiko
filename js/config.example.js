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

  // Weekly session schedule — JS day index (0=Sun, 1=Mon … 6=Sat)
  schedule: {
    2: '3:45 PM',   // Tuesday
    3: '3:45 PM',   // Wednesday
    4: '3:45 PM',   // Thursday
    6: '10:00 AM',  // Saturday
  },

  // Earliest time logging is allowed each session day (24h, local time)
  loggingOpens: {
    2: '18:00',  // Tuesday
    3: '18:00',  // Wednesday
    4: '18:00',  // Thursday
    6: '13:00',  // Saturday
  },
};
