# Use Node.js image
FROM node:20.11.1

# Set working directory
WORKDIR /app

# Copy package.json and install dependencies
COPY package.json ./
RUN npm install

# Copy the rest of the application files
COPY . ./

# Expose port for the backend
EXPOSE 4000

# Start the backend server
CMD ["npm", "start"]
