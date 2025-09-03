# Use Node.js 18
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files first for better caching
COPY package*.json ./
COPY client/package*.json ./client/
COPY server/package*.json ./server/

# Install dependencies
RUN npm install
RUN cd client && npm install
RUN cd server && npm install

# Copy all source code
COPY . .

# Debug: List files to verify they're copied
RUN echo "=== Root directory ===" && ls -la
RUN echo "=== Client directory ===" && ls -la client/
RUN echo "=== Client public directory ===" && ls -la client/public/ || echo "client/public not found"
RUN echo "=== All client subdirectories ===" && find client/ -type d -name "*" 2>/dev/null || echo "No client subdirectories found"

# Build the client
RUN cd client && npm run build

# Copy build to root
RUN cp -r client/build ./build

# Expose port
EXPOSE 5000

# Start the server
CMD ["npm", "start"]
