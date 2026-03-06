# ⚡ Deploying to Vercel

You asked about Vercel! Here is how it works for this specific project.

## ⚠️ The Quick Answer
Vercel is **amazing** for frontend, but it has two big limitations for this project:
1. **SQLite Database**: Vercel is "Serverless." Every time someone visits the site, a new temporary server starts. This means your `hackfest.db` will be **wiped frequently** and data won't stay saved between users.
2. **Backend Server**: Our `server.js` is a long-running Node.js process. Vercel prefers "Serverless Functions" which work slightly differently.

---

## 🛠️ Option A: The "Pro" Way (Vercel + Supabase)
If you really want to use Vercel, you should:
1. **Frontend**: Deploy to Vercel (it will automatically build it).
2. **Database**: Switch from SQLite to **Supabase** (it's free and permanent).
3. **Backend**: Keep the backend on **Render** or **Railway** (or use Vercel's Serverless Functions).

## 🚀 Option B: The "Easiest" Way (Railway.app)
I highly recommend **Railway.app** over Vercel for this specific project because:
- It supports **SQLite** (if you pay $5 for a "Volume" or "Disk").
- It runs your `server.js` exactly as it is now.
- It is just as fast as Vercel.

---

## 📝 If you still want to try Vercel:
1. Push your code to GitHub.
2. Go to [Vercel.com](https://vercel.com) and import the repo.
3. Vercel will see `package.json` and try to deploy it as a static site.
4. **Note**: It likely won't start the backend `server.js` correctly without extra configuration (`vercel.json`).

**My Recommendation**: Stick with **Railway** or **Render** for now to keep your data safe and your backend running simply!
