# Stage 1: Build
FROM node:22-alpine AS builder

ENV VITE_API_URL=https://api.lexidrift.com
ENV VITE_LEXIFY_URL=https://lexify.lexidrift.com
ENV GOOGLE_CLIENT_ID=659003851076-p3f3osumj0la8ug98t11kf7ihek003bg.apps.googleusercontent.com

# Enable pnpm via corepack
RUN corepack enable pnpm

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
FROM node:22-alpine

# Enable pnpm in runtime stage for managing dependencies (optional)
RUN corepack enable pnpm

# Set working directory
WORKDIR /app

# Copy built files and dependencies
COPY --from=builder /app/.output ./.output
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

RUN apk add --no-cache bash curl && curl -1sLf \
'https://dl.cloudsmith.io/public/infisical/infisical-cli/setup.alpine.sh' | bash \
&& apk add infisical

# Start the application
CMD ["pnpm", "serve:prod"]
