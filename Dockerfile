# Use standard node image to avoid compatibility issues
FROM node:20-slim

WORKDIR /app

# Copy package files
COPY package*.json ./

# CRITICAL FIX: Delete package-lock.json to avoid npm optional dependencies bug
# Then do a fresh install
RUN rm -f package-lock.json && \
    npm install && \
    npm install rollup --save-dev

# Copy source code
COPY . .

# Build the React app
RUN npm run build

# Verify build output exists
RUN ls -la dist/ && \
    ls -la dist/assets/ && \
    echo "Build successful!"

# Remove devDependencies to reduce image size
RUN npm prune --production

# Set environment
ENV PORT=8080
ENV NODE_ENV=production

# Expose port
EXPOSE 8080

# Start the server
CMD ["npm", "run", "start"]
