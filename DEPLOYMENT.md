# Deployment Guide 🚀

To share this app with your friend, we need to host it online. Since it uses `yt-dlp`, `ffmpeg`, and a local database, **Railway.app** is the easiest and most powerful way to deploy it.

## 1. Push to GitHub
If you haven't already, push your code to a GitHub repository:
1. Create a new repository on [GitHub](https://github.com/new).
2. Run these commands in your project terminal:
   ```bash
   git init
   git add .
   git commit -m "Initialize project"
   git remote add origin YOUR_GITHUB_REPO_URL
   git push -u origin main
   ```

## 2. Deploy on Railway.app
1. Go to [Railway.app](https://railway.app/) and sign in with GitHub.
2. Click **+ New Project** -> **Deploy from GitHub repository**.
3. Select this repository.
4. Railway will automatically see your `Dockerfile` and start building the app.

## 3. Persistent Data (CRITICAL)
Since you are using a database (`app.db`) and saving videos to the `downloads` folder, you need to tell Railway to **keep these files** even if the server restarts.

1. Once the project is created, go to the **Settings** or **Volumes** tab.
2. Click **+ Add Volume**.
3. Set the **Mount Path** to `/app/data` (for your database).
4. Click **+ Add Volume** again and set the **Mount Path** to `/app/downloads` (for your video files).

## 4. Get Your Link
1. Go to the **Settings** tab in Railway.
2. Scroll to **Networking** and click **Generate Domain**.
3. You will get a link like `youtubr-downloader.up.railway.app`.
4. **Send this link to your friend!** 🎉

---
### Note for Vercel users (Alternative)
*Vercel is great for simple websites, but YouTube downloaders generally FAIL on Vercel because they don't allow long-running background tasks or custom apps like `yt-dlp`. **Railway is the best choice.** *
