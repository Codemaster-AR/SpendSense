# SpendSense

SpendSense is a local-first budgeting and financial literacy app for students and young adults in the UAE. It includes a personalized dashboard, monthly budget planner, expense tracker, savings goals, interactive decision challenges, a pretend-money purchase simulation, reports, and Money Talks prompts.

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

Currency is fixed to AED. The app does not connect to banks or external APIs.
