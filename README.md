---
title: OmniLoad Downloader
emoji: 📹
colorFrom: blue
colorTo: purple
sdk: docker
app_port: 3000
---

# 🎥 OmniLoad | Universal Video Downloader

[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy?repo=https://github.com/VivekDubey126/youtubr_vid_downloade)
[![Deploy to Koyeb](https://www.koyeb.com/static/images/deploy/button.svg)](https://app.koyeb.com/deploy?repository=github.com/VivekDubey126/youtubr_vid_downloade&type=git)

A professional, high-performance web application to extract, convert, and save videos from **ANY website** (YouTube, Vimeo, Twitter, Instagram, etc.) with a premium glassmorphic dashboard interface.

---

### 🚀 Get Your Active Link (FREE)
If **Render** is not loading for you (sometimes blocked by ISPs), click the **"Deploy to Koyeb"** button above. It is a great free alternative that works very well in all regions. 

1. Click **"Deploy to Koyeb"**.
2. Log in with your GitHub account.
3. Click **"Deploy"**.
4. You will get a link (like `omniload.koyeb.app`) to share with your friend!

---

## ✨ Features

- **🚀 Premium UI**: Stunning glassmorphism dashboard using Apple & Vercel design language.
- **⚡ Universal Support**: Download from YouTube, Vimeo, Twitter, Instagram, and 1000+ other sites.
- **⚡ Live Progress**: Real-time download percentages using `yt-dlp` stream parsing.
- **📥 High-Quality Downloads**: Supports 4K (video) and Lossless (MP3/Audio).
- **💾 Save As Integration**: Directly download from the dashboard to your computer with a native browser "Save As" popup.
- **📜 Persistent History**: All past downloads are saved locally via SQLite for management.
- **🐳 Docker Ready**: Pre-configured Dockerfile including `FFmpeg` and `yt-dlp` for easy deployment on Render/Railway.

## 💻 Tech Stack

- **Frontend**: Next.js 15 (App Router), Framer Motion, TailwindCSS v4, Lucide React, Shadcn UI.
- **Backend**: Next.js API Routes, better-sqlite3.
- **Engine**: `yt-dlp` (Core extractor), `FFmpeg` (Audio/Video merging).
- **Environment**: Node.js 20+.

## 🛠️ Local Setup

1. **Clone the repository**:
   ```sh
   git clone https://github.com/VivekDubey126/youtubr_vid_downloade.git
   cd youtubr_vid_downloader
   ```

2. **Install Dependencies**:
   ```sh
   npm install
   ```

3. **Install Core Requirements**:
   Ensure you have Python, [yt-dlp](https://github.com/yt-dlp/yt-dlp), and [FFmpeg](https://ffmpeg.org/) installed on your machine.
   ```sh
   pip install yt-dlp
   ```

4. **Run Development Server**:
   ```sh
   npm run dev
   ```
   Visit `http://localhost:3000`.

## 🚢 Deployment (Full Stack)

Since this app requires system-level tools (`yt-dlp` & `ffmpeg`), it is best deployed on **Render** or **Railway** using the included `Dockerfile`.

1. Push your code to your GitHub repo: `VivekDubey126/youtubr_vid_downloade`.
2. On **Render.com**, create a new **Web Service**.
3. Connect your repository.
4. Render will automatically use the `Dockerfile` to install dependencies and deploy the full stack.

---

Crafted with ❤️ by Vivekdubey126
