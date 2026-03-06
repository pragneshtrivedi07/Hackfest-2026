# 🚀 Deployment Guide: IAR UDAAN HACKFEST 2026

Your website is now production-ready! Follow these steps to put it live on the internet so students and judges can access it globally.

## 🛠️ Step 1: Prepare Your Code
I have already built the production assets for you in the `/dist` folder and configured `server.js` to serve them. Ensure your `.env` file looks like this (replace with your real key):
```env
PORT=3001
ADMIN_PASSWORD=UDAAN2026@ADMIN
ANTHROPIC_API_KEY=your_actual_key_here
```

## ✅ Step 2: Push to GitHub (COMPLETED)
I have already initialized your repository, committed your code, and successfully pushed it to:
**https://github.com/pragneshtrivedi07/Hackfest-2026**

---

---

## 🚀 Alternative 1: Railway.app (Highly Recommended)
Railway is often faster than Render and has a great developer experience.

1. **Sign Up**: Log in with GitHub at [Railway.app](https://railway.app).
2. **New Project**: Click **"New Project"** -> **"Deploy from GitHub"**.
3. **Select Repo**: Choose `Hackfest-2026`.
4. **Environment**: Add `ADMIN_PASSWORD` and `ANTHROPIC_API_KEY` in the **Variables** tab.
5. **Port**: Railway will automatically detect you're running on port 3001.

## 🚀 Alternative 2: Koyeb
Koyeb is a modern platform that supports high-performance global deployments.

1. **Sign Up**: Log in with GitHub at [Koyeb.com](https://www.koyeb.com).
2. **Create Service**: Click **"Create Service"** -> **"GitHub"**.
3. **Select Repo**: Choose `Hackfest-2026`.
4. **Commands**:
   - Build: `npm run build`
   - Start: `node server.js`
5. **Env Vars**: Add your keys in the Service settings.

---

## ⚠️ Important: The SQLite Persistence Rule
All "Free Tier" cloud providers (Render, Railway, Koyeb) have **ephemeral filesystems**. This means:
- Every time you redeploy or the server "sleeps," your `hackfest.db` (and all registration data) **will be wiped**.
- **The Solution**: 
   - **Render/Railway Disks**: Both offer a paid "Disk" feature (usually $1-5/month) where your `hackfest.db` stays permanent.
   - **External DB**: Connect to a free cloud database like [Supabase](https://supabase.com) (PostgreSQL) or [MongoDB Atlas](https://www.mongodb.com/atlas/database) if you want 100% free persistence. (I can help you switch if you want this).

## 🏢 Alternative 3: VPS (DigitalOcean/Linode/AWS)
If you want **100% control** and your data to **never** reset:
- Rent a $5/month "Droplet" or "Nanode".
- Manually install Node.js and run `node server.js`.
- This is the most professional way to keep a SQLite database alive forever.
