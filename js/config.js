const CONFIG = {
  supabaseUrl:  'https://pyihdoazbvookiqnbyir.supabase.co',
  supabaseKey:  'sb_publishable_hOMuwVCLihE_ja2LYad8mw_mlsU5243',

  // Forsyth County location (used for weather)
  latitude:  34.2048,
  longitude: -84.1401,

  // Staffing settings (adjustable in the Analysis UI too)
  preferredRatio:       4,     // 1 sensei per N kids
  senseiHourlyRate:     15,    // dollars
  defaultSessionHours:  1.5,

  tomtomKey: null, // set by js/secrets.js locally (gitignored)

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
