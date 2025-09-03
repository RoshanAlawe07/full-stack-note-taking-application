# Use Node.js 18
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./
COPY client/package*.json ./client/
COPY server/package*.json ./server/

# Install dependencies
RUN npm install
RUN cd client && npm install
RUN cd server && npm install

# Copy source code
COPY . .

# Build the client
RUN cd client && npm run build

# Copy build to root
RUN cp -r client/build ./build

# Expose port
EXPOSE 5000

# Start the server
CMD ["npm", "start"]
