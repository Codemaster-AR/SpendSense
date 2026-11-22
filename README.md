# SpendSense

SpendSense is a local-first budgeting and financial literacy app for students and young adults in the UAE. It includes a personalized dashboard, monthly budget planner, expense tracker, savings goals, interactive decision challenges, a pretend-money purchase simulation, reports, and Money Talks prompts with a live, generic personal-finance news feed, and a locally tracked daily activity streak.
## Recommended: Use browser:
Go to codemaster-ar.github.io/spendsense/
## Run locally

```sh
npm install
npm run dev
```

Vite prints a local URL to open in your browser. Your profile and financial data are saved in that browser using localStorage. They do not sync to another device and may be lost if browser data is cleared. The optional 4-digit PIN is only a local screen lock; it is not an online account or secure cloud authentication.

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
