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

  // TomTom Traffic Flow API key — get one free at developer.tomtom.com
  tomtomKey: 'YOUR_TOMTOM_KEY',

  // Weekly session schedule — JS day index (0=Sun, 1=Mon … 6=Sat)
  schedule: {
    2: '3:45 PM',   // Tuesday
    3: '3:45 PM',   // Wednesday
    4: '3:45 PM',   // Thursday
    6: '10:00 AM',  // Saturday
  },
};
