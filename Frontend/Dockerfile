 # --- Stage 1: Build the Frontend Application ---
FROM node:20-alpine AS build

WORKDIR /app

# Copy package.json and package-lock.json for caching npm install
COPY package*.json ./

# Install frontend dependencies
RUN npm install

# Copy all frontend source files
COPY . .

# Build the frontend application (e.g., React, Vue, Angular build command)
# This typically creates a 'build' or 'dist' folder
RUN npm run build
# Adjust the above command if your build script is different (e.g., 'yarn build')

# --- Stage 2: Serve the Built Frontend with Nginx ---
FROM nginx:alpine

# Copy the Nginx default configuration (optional, but good practice if you customize)
# You might need to create a custom nginx.conf if your app needs specific routing
# COPY nginx.conf /etc/nginx/conf.d/default.conf

# Remove the default Nginx index.html
#RUN rm /etc/nginx/html/index.html

# Copy the built frontend files from the 'build' stage to the Nginx serving directory
# Replace 'build' with 'dist' if your frontend build output directory is named 'dist'
COPY --from=build /app/dist /usr/share/nginx/html

# Expose port 80 for the web server
EXPOSE 80

# Command to start Nginx in the foreground
CMD ["nginx", "-g", "daemon off;"]