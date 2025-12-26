# Stage 1: Build React application
FROM node:18-alpine AS build

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY src ./src
COPY public ./public

# Build the application
RUN npm run build

# Ensure GeoJSON file is copied to build (React should do this automatically, but verify)
RUN if [ ! -f /app/build/gadm41_RUS_1.json ]; then \
      echo "GeoJSON file not found in build, copying from public..." && \
      cp /app/public/gadm41_RUS_1.json /app/build/ || echo "File copy failed"; \
    else \
      echo "GeoJSON file found in build directory"; \
    fi

# Verify files in build
RUN ls -lh /app/build/ | grep -E "(json|gadm|index)" || ls -lh /app/build/ | head -10

# Stage 2: Production with Nginx
FROM nginx:alpine

# Copy custom nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy built files from build stage
COPY --from=build /app/build /usr/share/nginx/html

# Ensure proper permissions for all files
RUN chmod -R 755 /usr/share/nginx/html && \
    chown -R nginx:nginx /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]

