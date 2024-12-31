# Use Node.js as the base image
FROM node:20.11.1

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package.json package-lock.json ./
RUN npm install

# Copy the entire application
COPY . .

# Expose the server port
EXPOSE 4000

# Start the server
CMD ["npm", "start"]
