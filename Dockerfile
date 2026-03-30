# Stage 1: Build dependencies
FROM node:20-bullseye-slim AS builder

WORKDIR /app

# Set memory limit for Next.js build to fit in Free Tier
ENV NODE_OPTIONS="--max-old-space-size=450"

# Install build dependencies for better-sqlite3 
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
ENV NODE_OPTIONS="--max-old-space-size=450"

# Install production binaries (ffmpeg, python, yt-dlp)
RUN apt-get update && apt-get install -y \
    ffmpeg \
    python3 \
    python3-pip \
    && rm -rf /var/lib/apt/lists/*

RUN pip3 install --no-cache-dir yt-dlp

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

# Create data and downloads folder with correct permissions
RUN mkdir -p data downloads && chmod -R 777 data downloads

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]
