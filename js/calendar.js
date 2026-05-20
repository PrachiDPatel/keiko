// Forsyth County Schools — 2025-26, 2026-27, 2027-28
// Source: official FCS student calendars (images on file)
// Types: 'school' | 'holiday' | 'break' | 'early_release' | 'summer'

const SCHOOL_CALENDAR = (() => {
  const events = {};

  function add(dateStr, type, desc) {
    events[dateStr] = { type, desc };
  }

  function range(start, end, type, desc) {
    const d = new Date(start + 'T12:00:00');
    const e = new Date(end   + 'T12:00:00');
    while (d <= e) {
      add(d.toISOString().slice(0, 10), type, desc);
      d.setDate(d.getDate() + 1);
    }
  }

  // ── 2025–2026 ───────────────────────────────────────────────────────────────
  const S26_START = '2025-08-05';
  const S26_END   = '2026-05-22';

  add ('2025-08-29', 'early_release', 'K-12 Early Release / Prof. Dev.');
  add ('2025-09-01', 'holiday',       'Labor Day');
  range('2025-09-22','2025-09-26',    'break',        'Fall Break');
  add ('2025-10-17', 'holiday',       'K-12 Online Learning / Parent Conf.');
  add ('2025-10-20', 'holiday',       'Prof. Dev. (Student Holiday)');
  range('2025-11-24','2025-11-28',    'break',        'Thanksgiving Break');
  add ('2025-12-17', 'early_release', 'HS Early Release (Exams)');
  add ('2025-12-18', 'early_release', 'HS Early Release (Exams)');
  add ('2025-12-19', 'early_release', 'K-12 Early Release – End of Semester');
  range('2025-12-22','2026-01-02',    'break',        'Winter Break');
  add ('2026-01-05', 'holiday',       'Prof. Dev. (Student Holiday)');
  add ('2026-01-19', 'holiday',       'MLK Day');
  add ('2026-02-13', 'early_release', 'K-12 Early Release / Prof. Dev.');
  add ('2026-02-16', 'holiday',       'Student/Staff Holiday');
  add ('2026-02-17', 'holiday',       'Prof. Dev. (Student Holiday)');
  add ('2026-03-13', 'holiday',       'K-12 Online Learning / Parent Conf.');
  range('2026-04-06','2026-04-10',    'break',        'Spring Break');
  range('2026-05-04','2026-05-08',    'early_release','HS Online Learning Only');
  range('2026-05-18','2026-05-21',    'early_release','HS Early Release (Exams)');
  add ('2026-05-22', 'early_release', 'K-12 Early Release – Last Day of School');
  add ('2026-05-25', 'holiday',       'Staff Holiday');
  add ('2026-05-26', 'holiday',       'Post Planning (Staff Only)');
  range('2026-05-27','2026-08-05',    'summer',       'Summer Break');

  // ── 2026–2027 ───────────────────────────────────────────────────────────────
  const S27_START = '2026-08-06';
  const S27_END   = '2027-05-27';

  add ('2026-09-04', 'early_release', 'K-12 Early Release');
  add ('2026-09-07', 'holiday',       'Labor Day');
  range('2026-09-28','2026-10-02',    'break',        'Fall Break');
  add ('2026-10-16', 'holiday',       'K-12 Online Learning / Parent Conf.');
  add ('2026-10-19', 'holiday',       'Prof. Dev. (Student Holiday)');
  range('2026-11-23','2026-11-27',    'break',        'Thanksgiving Break');
  add ('2026-12-16', 'early_release', 'HS Early Release (Exams)');
  add ('2026-12-17', 'early_release', 'HS Early Release (Exams)');
  add ('2026-12-18', 'early_release', 'K-12 Early Release – End of Semester');
  range('2026-12-21','2027-01-01',    'break',        'Winter Break');
  add ('2027-01-04', 'holiday',       'Prof. Dev. (Student Holiday)');
  add ('2027-01-18', 'holiday',       'MLK Day');
  range('2027-02-12','2027-02-15',    'break',        'Mid-Winter Break');
  add ('2027-02-16', 'holiday',       'Prof. Dev. (Student Holiday)');
  add ('2027-03-12', 'holiday',       'K-12 Online Learning / Parent Conf.');
  add ('2027-03-15', 'holiday',       'Prof. Dev. (Student Holiday)');
  range('2027-04-05','2027-04-09',    'break',        'Spring Break');
  range('2027-05-24','2027-05-26',    'early_release','HS Early Release (Exams)');
  add ('2027-05-27', 'early_release', 'K-12 Early Release – Last Day of School');
  add ('2027-05-28', 'holiday',       'Post Planning (Staff Only)');
  range('2027-05-29','2027-08-04',    'summer',       'Summer Break');

  // ── 2027–2028 ───────────────────────────────────────────────────────────────
  const S28_START = '2027-08-05';
  const S28_END   = '2028-05-25';

  add ('2027-09-03', 'early_release', 'K-12 Early Release');
  add ('2027-09-06', 'holiday',       'Labor Day');
  range('2027-09-27','2027-10-01',    'break',        'Fall Break');
  add ('2027-10-15', 'holiday',       'K-12 Online Learning / Parent Conf.');
  add ('2027-10-18', 'holiday',       'Prof. Dev. (Student Holiday)');
  range('2027-11-22','2027-11-26',    'break',        'Thanksgiving Break');
  add ('2027-12-15', 'early_release', 'HS Early Release (Exams)');
  add ('2027-12-16', 'early_release', 'HS Early Release (Exams)');
  add ('2027-12-17', 'early_release', 'K-12 Early Release – End of Semester');
  range('2027-12-20','2028-01-02',    'break',        'Winter Break');
  add ('2028-01-03', 'holiday',       'Prof. Dev. (Student Holiday)');
  add ('2028-01-17', 'holiday',       'MLK Day');
  range('2028-02-18','2028-02-21',    'break',        'Mid-Winter Break');
  add ('2028-02-22', 'holiday',       'Prof. Dev. (Student Holiday)');
  add ('2028-03-17', 'holiday',       'K-12 Online Learning / Parent Conf.');
  add ('2028-03-20', 'holiday',       'Prof. Dev. (Student Holiday)');
  range('2028-04-03','2028-04-07',    'break',        'Spring Break');
  add ('2028-05-22', 'early_release', 'HS Early Release (Exams)');
  add ('2028-05-23', 'early_release', 'HS Early Release (Exams)');
  add ('2028-05-24', 'early_release', 'K-12 Early Release');
  add ('2028-05-25', 'early_release', 'Last Day of School – K-12 Early Release');
  add ('2028-05-26', 'holiday',       'Post Planning (Staff Only)');
  range('2028-05-27','2028-08-04',    'summer',       'Summer Break');

  // ── Helpers ──────────────────────────────────────────────────────────────────
  function getInfo(dateStr) {
    if (events[dateStr]) return events[dateStr];
    const dow = new Date(dateStr + 'T12:00:00').getDay();
    if (dow === 0 || dow === 6) return { type: 'weekend', desc: 'Weekend' };
    if (dateStr >= S26_START && dateStr <= S26_END) return { type: 'school', desc: 'Regular school day' };
    if (dateStr >= S27_START && dateStr <= S27_END) return { type: 'school', desc: 'Regular school day' };
    if (dateStr >= S28_START && dateStr <= S28_END) return { type: 'school', desc: 'Regular school day' };
    return { type: 'unknown', desc: 'Check calendar' };
  }

  function isSchoolDay(dateStr) {
    return getInfo(dateStr).type === 'school';
  }

  function getUpcoming(n = 7) {
    const results = [];
    const today = new Date();
    for (let i = 0; i < 60 && results.length < n; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      const s = d.toISOString().slice(0, 10);
      const info = getInfo(s);
      if (info.type !== 'school' && info.type !== 'weekend') {
        results.push({ date: s, ...info });
      }
    }
    return results;
  }

  return { getInfo, isSchoolDay, getUpcoming };
})();
