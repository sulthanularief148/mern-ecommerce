# Use Node.js for building the admin panel
FROM node:20.11.1 AS builder

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json for deterministic builds
COPY package.json package-lock.json ./

# Install dependencies with a clean environment
RUN npm ci

# Copy application files and build the admin panel
COPY . ./
RUN npm run build

# Use Nginx to serve the admin panel
FROM nginx:alpine

# Remove default Nginx configuration to prevent conflicts
RUN rm /etc/nginx/conf.d/default.conf

# Copy the build files to Nginx's serving directory
COPY --from=builder /app/build /usr/share/nginx/html


# Expose port 80
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
