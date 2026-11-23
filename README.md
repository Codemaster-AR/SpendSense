# SpendSense

SpendSense is a local-first budgeting and financial literacy app for students and young adults in the UAE. It includes a personalized dashboard, monthly budget planner, expense tracker, savings goals, interactive decision challenges, a pretend-money purchase simulation, reports, and Money Talks prompts with a live, generic personal-finance news feed, and a locally tracked daily activity streak.
## Recommended: Use browser:
Go to [https://quantal-universe.github.io/SpendSense/](https://quantal-universe.github.io/SpendSense/)
## Run locally

```sh
npm install
npm run dev
```

Vite prints a local URL to open in your browser. SpendSense signs users in with a passwordless email link and syncs profile and budgeting data to each user’s Supabase account. On first sign-in, existing browser data is copied to the account if it has no saved data yet. The optional 4-digit PIN stays local to that browser and is not uploaded.

## Supabase setup

The app reads `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` from the environment. For local development, put them in an ignored `.env.local` file. The publishable key is intended for browser code; never use a Supabase secret or service-role key here.

Before the first sign-in, open the Supabase SQL Editor and run `supabase/migrations/202611230001_user_data.sql`. It creates the per-user data table and Row Level Security policies.

For GitHub Pages, add repository Actions variables named `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` under **Settings → Secrets and variables → Actions → Variables**. The deployment workflow passes them into the Vite production build. Supabase Auth URL Configuration should list the deployed site and local development URL as allowed redirects.

## Production build

```sh
npm run build
npm run preview
```

The production site is generated in `dist/`. Netlify can build it using `npm run build` and publish `dist`. `netlify.toml` includes the SPA fallback for direct routes.

Currency follows the selected country. Changing country converts saved monetary amounts using the latest available exchange rate. The app does not connect to banks. Currency conversion fetches a daily rate from ExchangeRate-API when the user changes currency; that request sends currency codes, not account data. The live Money Talks feed uses Google News RSS through RSS2JSON with a generic query; profile and country are not sent.

## Run on GitHub Pages

A GitHub Actions workflow is included at `.github/workflows/deploy.yml`. Push the repository to GitHub, open **Settings → Pages**, set **Source** to **GitHub Actions**, and push to the `main` branch. The workflow builds the site and publishes it; the resulting URL appears in the workflow run or on the Pages settings screen. Project site assets use the repository path automatically during the Pages build.

Exchange-rate attribution: [Rates by ExchangeRate-API](https://www.exchangerate-api.com). Rates are informational, update daily on the open endpoint, and may be unavailable; SpendSense converts saved amounts only after the user reviews and confirms the displayed rate.
