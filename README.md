# Keiko

Tracks daily kid + sensei attendance at Code Ninjas and shows how much money would have been saved with optimal staffing.

## Setup (one time, ~10 minutes)

### 1. Supabase (free SQL database)
1. Go to [supabase.com](https://supabase.com) → New project
2. Once created: go to **SQL Editor** → paste contents of `schema.sql` → Run
3. Go to **Project Settings → API** → copy **Project URL** and **anon/public key**

### 2. Configure the site
```bash
cp js/config.example.js js/config.js
```
Edit `js/config.js` and fill in your Supabase URL and anon key.

### 3. Deploy to GitHub Pages
```bash
git init
git add -A
git commit -m "initial"
gh repo create keiko --public --push --source=.
```
Then: GitHub repo → Settings → Pages → Branch: `main`, folder: `/ (root)` → Save.

Your site will be live at `https://YOUR_USERNAME.github.io/codeninjas-scheduler/`

> `config.js` is gitignored. After deploying, you'll need to either:
> - Edit it locally and commit (the Supabase anon key is safe to make public), or
> - Remove `js/config.js` from `.gitignore` once you're comfortable

---

## Usage

- **Dashboard** — today's snapshot, attendance trend, upcoming school events
- **Log Session** — record kids + senseis for a time block. Weather + school status auto-fill.
- **Cost Analysis** — adjust the preferred ratio slider, pick a date range, see cumulative wasted wages + breakdown by day/month/school day. Export to CSV.

---

## Notes

- **Commute difficulty (1–5):** a rough note on travel conditions that day — bad weather, traffic, events nearby, etc. Will be used for pattern analysis once enough data accumulates.
- **School calendar:** Forsyth County dates in `js/calendar.js` — verify each year at [fcboe.org](https://www.fcboe.org) and update the file.
- **Location coordinates:** defaults to Cumming, GA. Update `CONFIG.latitude/longitude` in `config.js` if your location differs.
- **Preferred ratio:** configurable per-analysis in the Cost Analysis page. Default is 1:4.

---

## Future additions (once data accumulates)
- Prediction model: forecast expected kids for a given date based on weather + school calendar + historical patterns
- Semester/year-over-year comparison
- Alert when predicted ratio is off before the session starts
