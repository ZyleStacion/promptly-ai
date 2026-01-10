# ------------------------------
# Stage 1: Build the frontend
# ------------------------------
FROM node:20-alpine AS build

# Set working directory
WORKDIR /app

# Accept build arguments for environment variables
ARG VITE_API_URL=http://13.216.200.51.nip.io:5000
ARG VITE_GOOGLE_CLIENT_ID

# Set environment variables for build
ENV VITE_API_URL=$VITE_API_URL
ENV VITE_GOOGLE_CLIENT_ID=$VITE_GOOGLE_CLIENT_ID

# Install dependencies
COPY package*.json ./
RUN npm ci

# Copy all source files and build the app
COPY . .
RUN npm run build

# ------------------------------
# Stage 2: Serve with Nginx
# ------------------------------
FROM nginx:stable-alpine

# Remove default nginx static files
RUN rm -rf /usr/share/nginx/html/*

# Copy built frontend from build stage
COPY --from=build /app/dist /usr/share/nginx/html

# Copy custom nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# Start Nginx in foreground
CMD ["nginx", "-g", "daemon off;"]
