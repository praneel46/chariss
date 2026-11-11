# CHARIS (charis.) 🎁
> *"Every gift has a feeling. Find yours."*

**CHARIS** is an AI-powered personalized gifting platform that understands relationships, occasions, personality traits, and emotional intent — recommending verified real catalogue products from independent artisans and enabling custom handwritten gift card creation.

---

## 🏗️ Architecture

```
charis/
├── client/              # React 19 + TypeScript + Vite + Tailwind CSS v4 + Framer Motion
│   ├── src/
│   │   ├── components/  # Hero, Navbar, FeaturedGifts, GiftStudio, BagDrawer, etc.
│   │   ├── pages/       # Home, Discover, Occasions, Consultation, Recommendations, GiftStudio
│   │   ├── context/     # Bag & Wishlist state
│   │   └── data/        # Curated artisan catalogue
│   ├── vercel.json      # Client-side SPA routing config for Vercel
│   └── vite.config.ts
├── server/              # Node.js + Express + MongoDB + Mongoose + Zod + Helmet + CORS
│   ├── src/
│   │   ├── controllers/ # Products, Consultations, Gift Cards
│   │   ├── models/      # Mongoose Schemas (Product, Consultation, GiftCard)
│   │   ├── routes/      # REST API (/api/v1)
│   │   ├── app.js       # Express App with Health Check & CORS
│   │   └── server.js    # Entry point
│   └── seeds/           # Product catalogue seed script
├── vercel.json          # Root Vercel deployment blueprint
├── render.yaml          # Render Blueprint for 1-click backend deployment
└── DEPLOYMENT.md        # Step-by-step deployment guide
```

---

## 🚀 Quick Start (Local Development)

### 1. Run Client
```bash
cd client
npm install
npm run dev
# Running at http://localhost:5173
```

### 2. Run Server
```bash
cd server
npm install
cp .env.example .env
npm run dev
# Running at http://localhost:5000
```

---

## ☁️ Deployment

- **Frontend (Vercel)**: Point to GitHub repo. Set Root Directory to `client` (or use root with included `vercel.json`).
- **Backend (Render)**: Connect repo on Render. Render reads `render.yaml` automatically, or create a Web Service with Root Directory `server`.

👉 See **[DEPLOYMENT.md](./DEPLOYMENT.md)** for complete step-by-step instructions.
