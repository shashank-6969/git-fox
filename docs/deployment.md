# Deployment

This guide covers deploying the GitFox frontend to **Vercel** and the backend to **Render**.

---

## Overview

| Service | Platform | Cost |
|---|---|---|
| Frontend | [Vercel](https://vercel.com) | Free tier available |
| Backend | [Render](https://render.com) | Free tier available (spins down after 15 min idle) |

---

## Backend — Deploy to Render

### 1. Push to GitHub

Make sure your `backend/` code is pushed to a GitHub repository.

### 2. Create a Render Web Service

1. Go to [render.com](https://render.com) and sign in.
2. Click **New → Web Service**.
3. Connect your GitHub repository.
4. Configure the service:

| Setting | Value |
|---|---|
| **Name** | `git-fox-api` |
| **Root Directory** | `backend` |
| **Environment** | `Node` |
| **Build Command** | `npm install && npm run build` |
| **Start Command** | `node dist/index.js` |
| **Instance Type** | Free (or Starter for no spin-down) |

### 3. Set Environment Variables

In the Render dashboard under **Environment**, add:

| Key | Value |
|---|---|
| `NODE_ENV` | `production` |
| `GITHUB_TOKEN` | Your GitHub PAT |
| `CACHE_TTL` | `60` |
| `FRONTEND_URL` | Your Vercel URL (add after frontend deploy) |

### 4. Deploy

Click **Create Web Service**. Render will build and deploy automatically.

Your backend URL will be something like:
```
https://git-fox-api.onrender.com
```

Test it:
```bash
curl https://git-fox-api.onrender.com/health
# {"status":"ok","timestamp":"..."}
```

> **Free Tier Note:** Render's free tier spins down services after 15 minutes of inactivity. The first request after spin-down may take 30–60 seconds. Upgrade to a paid tier for always-on behaviour.

---

## Frontend — Deploy to Vercel

### 1. Push to GitHub

Make sure your `frontend/` code is pushed to GitHub.

### 2. Import to Vercel

1. Go to [vercel.com](https://vercel.com) and sign in.
2. Click **Add New → Project**.
3. Import your GitHub repository.
4. Configure the project:

| Setting | Value |
|---|---|
| **Framework Preset** | Vite |
| **Root Directory** | `frontend` |
| **Build Command** | `npm run build` |
| **Output Directory** | `dist` |
| **Install Command** | `npm install` |

### 3. Set Environment Variables

In the Vercel project settings under **Environment Variables**, add:

| Key | Value | Environment |
|---|---|---|
| `VITE_API_BASE_URL` | `https://git-fox-api.onrender.com` | Production |

### 4. Deploy

Click **Deploy**. Your app will be live at:
```
https://git-fox.vercel.app
```
(or a custom domain you configure)

---

## Post-Deployment: Update CORS

Once both services are deployed, go back to Render and update the `FRONTEND_URL` environment variable:

```
FRONTEND_URL=https://git-fox.vercel.app
```

Then trigger a redeploy on Render (or it will auto-redeploy on next push).

---

## Continuous Deployment

Both Vercel and Render support automatic deployments on every push to your main branch. No manual steps needed after the initial setup.

---

## Production Checklist

- [ ] `GITHUB_TOKEN` is set on Render
- [ ] `VITE_API_BASE_URL` points to the Render backend URL
- [ ] `FRONTEND_URL` is set to the Vercel URL on the backend
- [ ] `NODE_ENV=production` is set on Render
- [ ] Test `GET /health` on the backend URL
- [ ] Test a username search on the Vercel URL
- [ ] Verify browser DevTools shows no direct calls to `api.github.com`

---

## Custom Domain (Optional)

### Vercel
1. Go to your project → **Settings → Domains**
2. Add your domain and follow the DNS instructions

### Render
1. Go to your service → **Settings → Custom Domains**
2. Add your domain and follow the DNS instructions

---

## Environment Variable Summary

### Backend (Render)

```dotenv
NODE_ENV=production
PORT=10000                           # Render sets this automatically
GITHUB_TOKEN=ghp_xxxxxxxxxxxxx
CACHE_TTL=60
FRONTEND_URL=https://your-app.vercel.app
```

### Frontend (Vercel)

```dotenv
VITE_API_BASE_URL=https://your-backend.onrender.com
```
