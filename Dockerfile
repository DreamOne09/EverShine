# Use standard node image instead of alpine to avoid musl compatibility issues with Rollup
FROM node:20-slim

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install ALL dependencies (including devDependencies for build)
# Use --legacy-peer-deps if needed
RUN npm ci --legacy-peer-deps || npm ci

# Copy source code
COPY . .

# Build the React app
RUN npm run build

# Verify build output
RUN ls -la dist/ && ls -la dist/assets/

# Remove devDependencies to reduce image size
RUN npm prune --production

# Set environment
ENV PORT=8080
ENV NODE_ENV=production

# Expose port
EXPOSE 8080

# Start the server
CMD ["npm", "run", "start"]
