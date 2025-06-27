# Use an official Node.js runtime as the base image
FROM node:20-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json (if you have one)
# This allows Docker to cache the npm install step if dependencies haven't changed
COPY package*.json ./

# Install application dependencies
RUN npm install --production

# Copy the rest of your backend application code
# The '.' refers to the current directory inside the container (/app),
# and the '.' refers to the current context directory where the Dockerfile resides (Backend/)
COPY . .

# Expose the port your backend Express application listens on
# (Assuming your server.js listens on port 3000. Adjust if different.)
EXPOSE 5000

# Define the command to run your application
# Based on your package.json, your main file is server.js
CMD ["node", "server.js"]