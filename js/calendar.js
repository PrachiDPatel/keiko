// Forsyth County Schools calendar — verify/update from fcboe.org each year
// Types: 'holiday' | 'break' | 'early_release' | 'summer' | 'weekend'

const SCHOOL_CALENDAR = (() => {
  const events = {};

  function add(dateStr, type, desc) {
    events[dateStr] = { type, desc };
  }

  function range(start, end, type, desc) {
    const d = new Date(start + 'T12:00:00');
    const e = new Date(end   + 'T12:00:00');
    while (d <= e) {
      add(d.toISOString().slice(0,10), type, desc);
      d.setDate(d.getDate() + 1);
    }
  }

  // ── 2025-26 school year ──────────────────────────────────────────────────
  // First/last days (verify at fcboe.org)
  const SY2526_START = '2025-08-04';
  const SY2526_END   = '2026-05-28';

  add('2025-09-01',  'holiday',      'Labor Day');
  range('2025-10-06','2025-10-10',   'break',     'Fall Break');
  add('2025-11-11',  'holiday',      'Veterans Day');
  range('2025-11-24','2025-11-28',   'break',     'Thanksgiving Break');
  range('2025-12-22','2026-01-02',   'break',     'Winter Break');
  add('2026-01-19',  'holiday',      'MLK Day');
  add('2026-02-16',  'holiday',      "Presidents' Day");
  range('2026-03-30','2026-04-03',   'break',     'Spring Break');
  add('2026-05-25',  'holiday',      'Memorial Day');

  // Summer (no school = kids may show up more during the day)
  range('2026-05-29','2026-08-02',   'summer',    'Summer Break');

  // ── 2026-27 school year (UPDATE from fcboe.org when published) ──────────
  const SY2627_START = '2026-08-03';
  const SY2627_END   = '2027-05-27';

  add('2026-09-07',  'holiday',      'Labor Day');
  range('2026-10-05','2026-10-09',   'break',     'Fall Break');
  range('2026-11-23','2026-11-27',   'break',     'Thanksgiving Break');
  range('2026-12-21','2027-01-01',   'break',     'Winter Break');
  add('2027-01-18',  'holiday',      'MLK Day');
  add('2027-02-15',  'holiday',      "Presidents' Day");
  range('2027-03-29','2027-04-02',   'break',     'Spring Break');
  add('2027-05-31',  'holiday',      'Memorial Day');
  range('2027-05-28','2027-08-01',   'summer',    'Summer Break');

  // ── Helpers ──────────────────────────────────────────────────────────────
  function getInfo(dateStr) {
    if (events[dateStr]) return events[dateStr];
    const d = new Date(dateStr + 'T12:00:00');
    const dow = d.getDay();
    if (dow === 0 || dow === 6) return { type: 'weekend', desc: 'Weekend' };

    // Within a known school year?
    if (dateStr >= SY2526_START && dateStr <= SY2526_END) return { type: 'school', desc: 'Regular school day' };
    if (dateStr >= SY2627_START && dateStr <= SY2627_END) return { type: 'school', desc: 'Regular school day' };
    if (dateStr >= '2026-05-29' && dateStr <= '2026-08-02') return { type: 'summer', desc: 'Summer Break' };
    if (dateStr >= '2027-05-28' && dateStr <= '2027-08-01') return { type: 'summer', desc: 'Summer Break' };

    return { type: 'unknown', desc: 'Check calendar' };
  }

  function isSchoolDay(dateStr) {
    return getInfo(dateStr).type === 'school';
  }

  function getUpcoming(n = 7) {
    const results = [];
    const today = new Date();
    for (let i = 0; i < 30 && results.length < n; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      const s = d.toISOString().slice(0,10);
      const info = getInfo(s);
      if (info.type !== 'school' && info.type !== 'weekend') {
        results.push({ date: s, ...info });
      }
    }
    return results;
  }

  return { getInfo, isSchoolDay, getUpcoming };
})();
