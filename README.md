# Keiko

Log daily attendance at Code Ninjas → see exactly how much money was wasted on overstaffing.

**[→ Open Keiko](https://prachidpatel.github.io/keiko/)**

## What it does

- **Dashboard** — today's snapshot, attendance trend, upcoming school events
- **Log Session** — record kids + senseis per time block; weather + school status auto-fill
- **Cost Analysis** — adjust the preferred ratio, pick a date range, see cumulative wasted wages broken down by day, month, and school day — exportable to CSV

Built this because I kept noticing we had way too many senseis scheduled on slow school days and no easy way to quantify it.

## Setup

Needs a free [Supabase](https://supabase.com) project for the database.

1. Create a Supabase project → run `schema.sql` in the SQL Editor
2. Copy `js/config.example.js` → `js/config.js` and fill in your project URL + anon key
3. Deploy to GitHub Pages or open locally — it's just static HTML

> The Supabase anon key is safe to make public. `config.js` is gitignored by default so you'll need to either commit it or add it manually after deploying.

## Stack

- HTML / CSS / JavaScript
- Supabase (PostgreSQL)
- SQL
