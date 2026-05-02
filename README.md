# Habit Mode 🌟

Your personal habit tracker. Built with React + Vite, deployable to Vercel in ~2 minutes.

---

## Deploy to Vercel (Step by Step)

### Option A — Drag & Drop (Easiest, no GitHub needed)

1. Go to [vercel.com](https://vercel.com) and sign up / log in (free)
2. On your dashboard, click **"Add New Project"**
3. Click **"Upload"** (or drag the project folder straight onto the page)
4. Upload this entire `habit-mode` folder as a zip
5. Vercel auto-detects Vite — just click **Deploy**
6. Done! You get a URL like `habit-mode-xyz.vercel.app`

### Option B — GitHub (Best for future updates)

1. Create a free [GitHub](https://github.com) account
2. Create a new repo called `habit-mode`
3. Upload all these files to the repo
4. Go to [vercel.com](https://vercel.com) → **Add New Project** → Import from GitHub
5. Select your repo → Deploy
6. Future updates: just replace files in GitHub and Vercel auto-redeploys

---

## Add to iPhone Home Screen (makes it feel like a real app)

1. Open your Vercel URL in **Safari** (must be Safari, not Chrome)
2. Tap the **Share** button (box with arrow pointing up)
3. Scroll down and tap **"Add to Home Screen"**
4. Name it **Habit Mode** → tap **Add**
5. It now lives on your home screen like a native app ✨

---

## Local Development (optional)

```bash
npm install
npm run dev
```

Then open http://localhost:5173

---

## Updating the App

When you make changes with Claude:
1. Claude gives you an updated `App.jsx`
2. Replace `src/App.jsx` with the new file
3. If on GitHub: push the change → Vercel auto-redeploys in ~30 seconds
4. If drag & drop: re-upload the folder to Vercel

---

## Data & Backup

- Data is stored in `localStorage` on your device
- Use the **Export Backup** button in the Stats tab regularly
- Google Drive auto-backup activates once deployed

