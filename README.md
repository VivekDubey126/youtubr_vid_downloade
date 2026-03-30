# 🎥 Youtubr | Premium YouTube Downloader

A professional, high-performance web application to extract, convert, and store YouTube videos and audio with a premium glassmorphic dashboard interface.

![Next.js](https://img.shields.io/badge/Next.js-15-black?style=flat-square&logo=next.js)
![TailwindCSS v4](https://img.shields.io/badge/TailwindCSS-v4-38b2ac?style=flat-square&logo=tailwind-css)
![SQLite](https://img.shields.io/badge/SQLite-003B57?style=flat-square&logo=sqlite)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=flat-square&logo=docker)

## ✨ Features

- **🚀 Premium UI**: Stunning glassmorphism dashboard using Apple & Vercel design language.
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
   git clone https://github.com/Vivekdubey126/youtubr_vid_downloader.git
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

1. Push your code to your GitHub repo: `Vivekdubey126/youtubr_vid_downloader`.
2. On **Render.com**, create a new **Web Service**.
3. Connect your repository.
4. Render will automatically use the `Dockerfile` to install dependencies and deploy the full stack.

---

Crafted with ❤️ by Vivekdubey126
