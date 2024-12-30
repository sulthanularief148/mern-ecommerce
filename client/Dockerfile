# Use Node.js image for building the React app
FROM node:20.11.1 AS builder

# Set working directory
WORKDIR /app

# Copy package.json and install dependencies
COPY package.json ./
RUN npm install

# Copy the rest of the application files
COPY . ./

# Build the React application
RUN npm run build

# Use Nginx to serve the build files
FROM nginx:alpine
COPY --from=builder /app/build /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Start Nginx server
CMD ["nginx", "-g", "daemon off;"]
