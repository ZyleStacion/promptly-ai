FROM node:20-alpine
WORKDIR /app

# Install dependencies (omit dev for smaller image)
COPY package*.json ./
RUN npm install --omit=dev

# Copy source and set production env
COPY . .
ENV NODE_ENV=production

EXPOSE 3000
CMD ["node", "server.js"]
