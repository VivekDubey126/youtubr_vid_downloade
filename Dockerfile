FROM node:20-bullseye-slim

# Install ffmpeg, python3, and curl
RUN apt-get update && apt-get install -y \
    ffmpeg \
    python3 \
    python3-pip \
    && rm -rf /var/lib/apt/lists/*

# Install yt-dlp via pip (which pulls latest directly and safely)
RUN pip3 install --no-cache-dir yt-dlp --break-system-packages

WORKDIR /app

# Install Node dependencies
COPY package*.json ./
RUN npm ci

# Copy project files
COPY . .

# Build Next.js application
RUN npm run build

EXPOSE 3000

# Start production server
CMD ["npm", "run", "start"]
