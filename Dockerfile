# Build stage
FROM node:20-slim AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install all dependencies (including devDependencies for build)
RUN npm install

# Copy source code and public folder
COPY src ./src
COPY public ./public
COPY index.html ./
COPY vite.config.ts ./
COPY tsconfig.json ./
COPY tsconfig.node.json ./
COPY tailwind.config.js ./

# Build the application
RUN npm run build

# Verify build output
RUN ls -la dist/ && \
    ls -la dist/assets/ && \
    test -f dist/index.html && \
    echo "Build verified successfully!"

# Production stage
FROM node:20-slim

WORKDIR /app

# Copy package files for production dependencies
COPY package*.json ./

# Install only production dependencies
RUN npm install --production

# Copy built files from builder stage
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/public ./public
COPY server.js ./

# Verify files exist
RUN ls -la dist/ && \
    ls -la dist/index.html && \
    ls -la public/

# Set environment
ENV PORT=8080
ENV NODE_ENV=production

# Expose port
EXPOSE 8080

# Start the server
CMD ["node", "server.js"]
