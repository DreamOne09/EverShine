# Production image - serve pre-built dist folder
FROM node:20-slim

WORKDIR /app

# Copy package files for production dependencies only
COPY package*.json ./

# Install only production dependencies (for server.js)
RUN npm install --production

# Copy pre-built dist folder and other necessary files
COPY dist ./dist
COPY public ./public
COPY server.js ./

# Verify dist folder exists
RUN ls -la dist/ && \
    ls -la dist/assets/ && \
    echo "Dist folder verified!"

# Set environment
ENV PORT=8080
ENV NODE_ENV=production

# Expose port
EXPOSE 8080

# Start the server
CMD ["node", "server.js"]
