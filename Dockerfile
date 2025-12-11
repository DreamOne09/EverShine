# Stage 1: Build
FROM node:20-slim AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Build the app
RUN npm run build

# Verify build output
RUN echo "=== Build Output ===" && \
    ls -la dist/ && \
    echo "=== Assets ===" && \
    ls -la dist/assets/ && \
    echo "=== index.html ===" && \
    head -20 dist/index.html

# Stage 2: Production
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

# Verify files are copied
RUN echo "=== Final dist check ===" && \
    ls -la dist/ && \
    ls -la dist/assets/

# Set environment
ENV PORT=8080
ENV NODE_ENV=production

# Expose port
EXPOSE 8080

# Start the server
CMD ["node", "server.js"]
