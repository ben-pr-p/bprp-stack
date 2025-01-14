FROM imbios/bun-node AS base

WORKDIR /app

# Copy package files
COPY package.json bun.lockb ./

# Install dependencies
RUN bun install

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Set environment to production
ENV NODE_ENV production

# Expose port if needed
EXPOSE 3000

# Start the application
CMD ["npm", "run", "start"]