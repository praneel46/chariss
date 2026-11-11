# CHARIS Deployment Guide 🚀

This repository is pre-configured for zero-friction independent deployment:
- **Frontend** → **Vercel**
- **Backend** → **Render**

---

## 1. Deploying Frontend to Vercel ▲

### Method A: Via Vercel Web Dashboard (Recommended)
1. Go to [vercel.com](https://vercel.com) and click **"Add New Project"**.
2. Select your GitHub repository: `praneel46/chariss`.
3. In **Project Settings**:
   * **Framework Preset**: `Vite`
   * **Root Directory**: Click *Edit* and select **`client`**.
   * *(Optional)* If you leave Root Directory as `/`, the root `vercel.json` will automatically build the client via `npm run build --prefix client`.
4. In **Environment Variables**:
   * `VITE_API_BASE_URL`: Enter your deployed Render backend URL (e.g., `https://charis-backend.onrender.com/api/v1`).
5. Click **Deploy**.
   * Vercel will install dependencies and produce the production bundle.
   * `client/vercel.json` rewrites all SPA routes to `/index.html` preventing 404s on page refresh.

---

## 2. Deploying Backend to Render 🌐

### Method A: 1-Click Render Blueprint (Using `render.yaml`)
1. Go to [dashboard.render.com/blueprints](https://dashboard.render.com/blueprints).
2. Click **"New Blueprint Instance"**.
3. Connect your repository: `praneel46/chariss`.
4. Render will detect `render.yaml` and configure the web service:
   * **Name**: `charis-backend`
   * **Environment**: `Node`
   * **Root Directory**: `server`
   * **Build Command**: `npm install`
   * **Start Command**: `npm start`
   * **Health Check Path**: `/health`
5. Fill in the required environment variables:
   * `MONGODB_URI`: Your MongoDB Atlas connection string (e.g. `mongodb+srv://...`).
   * `CLIENT_ORIGIN`: Your deployed Vercel URL (e.g. `https://chariss.vercel.app`).
6. Click **Apply**.

### Method B: Manual Web Service on Render
1. In Render Dashboard, click **New +** → **Web Service**.
2. Connect `praneel46/chariss`.
3. Set the following settings:
   * **Root Directory**: `server`
   * **Runtime**: `Node`
   * **Build Command**: `npm install`
   * **Start Command**: `npm start`
4. In **Environment Variables**, add:
   * `NODE_ENV`: `production`
   * `PORT`: `10000`
   * `MONGODB_URI`: `mongodb+srv://...`
   * `CLIENT_ORIGIN`: `https://your-app.vercel.app`
5. Click **Create Web Service**.

---

## 3. Connecting Frontend to Backend
Once both services are running:
1. Copy your Render service URL (e.g., `https://charis-backend.onrender.com`).
2. In your Vercel Dashboard → Project Settings → **Environment Variables**:
   * Add: `VITE_API_BASE_URL` = `https://charis-backend.onrender.com/api/v1`
3. In your Render Dashboard → Environment:
   * Add: `CLIENT_ORIGIN` = `https://your-vercel-domain.vercel.app`
4. Redeploy Vercel to pick up the new environment variable.
