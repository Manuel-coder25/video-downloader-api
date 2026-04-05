# Dockerfile

# Use official Node 18 image
FROM node:18

# Install system dependencies
RUN apt-get update && \
    apt-get install -y python3 ffmpeg curl && \
    rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Copy package files first (for caching)
COPY package.json package-lock.json* ./

# Install Node dependencies
RUN npm install

# Copy the rest of your app
COPY . .

# Expose port (change if your app uses another port)
EXPOSE 3000

# Start command
CMD ["npm", "start"]
