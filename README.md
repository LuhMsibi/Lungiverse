# AiToolHub

A full-stack AI tools directory and playground built with Vite, React, Express, and Firebase. This repository demonstrates building a modern web app that integrates AI models, a tools catalog, articles, authentication, and an admin interface.

**Quick summary**

- **Type:** Full-stack (client + server)
- **Frontend:** React, Vite, TailwindCSS
- **Backend:** Express (Node), server-side bundling with esbuild
- **Auth / Data:** Firebase (client + admin), Drizzle ORM for DB interactions
- **Features:** Tools directory, articles, chat/playground, admin pages, favorites

Screenshots
<img width="1891" height="900" alt="image" src="https://github.com/user-attachments/assets/f6158d19-b239-421b-b65e-3147e9d00798" />
<img width="1904" height="904" alt="image" src="https://github.com/user-attachments/assets/bd7daf9a-a6a8-4b7b-9fa9-56b28a57d2e3" />
<img width="1895" height="897" alt="image" src="https://github.com/user-attachments/assets/970775d2-c8a6-41ed-a1d4-923f1250b25b" />
<img width="1082" height="708" alt="Screenshot 2025-10-30 013037" src="https://github.com/user-attachments/assets/0ea4f62c-8fb1-4d59-8903-7f336fa7f005" />





Getting started (local)

1. Prerequisites: Node.js 18+, npm or yarn. Git installed.
2. Clone the repo and cd into it:

```bash
git clone <repo-url>
cd AiToolHub
```

3. Install dependencies:

```bash
npm install
# or
yarn
```

4. Environment & configuration

- This project uses Firebase; see the `firebase-config/` folder and `attached_assets/serviceAccountKey.json` for local admin credentials (keep secrets out of public repos). Create a `.env` or use your environment to provide any required API keys (Hugging Face, OpenAI, Firebase config, DB connection, etc.).

5. Run in development:

```bash
npm run dev
```

6. Build for production:

```bash
npm run build
npm run start
```

Available scripts (from package.json)

- `dev` — runs server in development with tsx (hot reload)
- `build` — builds client with Vite and bundles server with esbuild
- `start` — runs the production server
- `check` — runs TypeScript checks

Tech stack & notable libraries

- React + Vite + TypeScript
- TailwindCSS + @tailwindcss/typography
- React Query (`@tanstack/react-query`) for data fetching
- Firebase (auth + admin), `firebase-admin` on server
- Express for server routes and API endpoints
- Drizzle ORM and drizzle-kit for DB migrations
- OpenAI / Google GenAI / Hugging Face integrations

Project structure (high level)

- `client/` — React app (Vite)
- `server/` — Express API, server-side integrations
- `attached_assets/` — images, firebase admin JSON, seed data
- `shared/` — shared types/schema



Contributing and notes

- This repo is set up for local development; be careful not to commit secrets. Use environment variables for API keys.
- If you want help adding CI (GitHub Actions) or a hosted demo, I can draft the workflow and deploy steps.

License

- MIT (see `package.json`).

Contact

LuhMsibi@gmail.com

