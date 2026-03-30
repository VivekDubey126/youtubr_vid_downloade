# Stage 1: Build dependencies
FROM node:20-bullseye-slim AS builder

WORKDIR /app

# Install build dependencies for better-sqlite3 (python and build-essential)
RUN apt-get update && apt-get install -y \
    python3 \
    make \
    g++ \
    && rm -rf /var/lib/apt/lists/*

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# Stage 2: Production environment
FROM node:20-bullseye-slim AS runner

WORKDIR /app

ENV NODE_ENV=production

# Install production binaries (ffmpeg, python, yt-dlp)
RUN apt-get update && apt-get install -y \
    ffmpeg \
    python3 \
    python3-pip \
    && rm -rf /var/lib/apt/lists/*

RUN pip3 install --no-cache-dir yt-dlp --break-system-packages

COPY --from=builder /app/public ./public

# Use standalone output for smaller image
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

# Ensure data and downloads folders exist
RUN mkdir -p data downloads

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]
