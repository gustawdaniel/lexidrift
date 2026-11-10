# Stage 1: Build
FROM node:26-alpine AS builder

# Enable pnpm via npm
RUN npm install -g pnpm@9.15.4

# Set working directory
WORKDIR /app

# Copy package manager files and install dependencies
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

# Copy source code
COPY . .

# Transpile TypeScript to JavaScript
RUN pnpm build

# Stage 2: Runtime
FROM node:26-alpine

# Enable pnpm in runtime stage for managing dependencies (optional)
RUN npm install -g pnpm@9.15.4

# Set working directory
WORKDIR /app

# Copy built files and dependencies
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json


# Start the application
CMD ["pnpm", "serve:prod"]
