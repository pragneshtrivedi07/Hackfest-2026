# 🚀 Deployment Guide: IAR UDAAN HACKFEST 2026

Your website is now production-ready! Follow these steps to put it live on the internet so students and judges can access it globally.

## 🛠️ Step 1: Prepare Your Code
I have already built the production assets for you in the `/dist` folder and configured `server.js` to serve them. Ensure your `.env` file looks like this (replace with your real key):
```env
PORT=3001
ADMIN_PASSWORD=UDAAN2026@ADMIN
ANTHROPIC_API_KEY=your_actual_key_here
```

## 📦 Step 2: Push to GitHub
1. Go to [GitHub.com](https://github.com) and create a **private** repository named `hackfest-2026`.
2. In your terminal, run these commands:
   ```powershell
   git init
   git add .
   git commit -m "Initial production-ready commit"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/hackfest-2026.git
   git push -u origin main
   ```

## 🌐 Step 3: Host on Render (Recommended)
[Render.com](https://render.com) is free and perfect for this project.

1. **Sign Up**: Create an account on Render.
2. **New Web Service**: Click **"New"** -> **"Web Service"**.
3. **Connect Repo**: Connect your GitHub account and select the `hackfest-2026` repository.
4. **Configure Settings**:
   - **Runtime**: `Node`
   - **Build Command**: `npm run build` (optional, as I already built it for you, but good for safety)
   - **Start Command**: `node server.js`
5. **Environment Variables**: Click the **"Environment"** tab and add:
   - `ADMIN_PASSWORD`: Your secret admin password.
   - `ANTHROPIC_API_KEY`: Your real Anthropic/Claude API key.
   - `PORT`: `10000` (Render will assign this automatically, but setting it doesn't hurt).

## ✅ Step 4: Your Site is Live!
Once Render finishes deploying, it will give you a URL like `https://hackfest-2026.onrender.com`. Share this link with your team!

---
### 💡 Important Notes:
- **SQLite Database**: Since we are using SQLite (`hackfest.db`), your data will reset every time the server restarts on free hosting. For a permanent contest, consider a **Render Disk** or switching to **PostgreSQL** if you need persistence across restarts.
- **API Key**: Never share your Claude API key in public commits. Always use environment variables as shown above.
