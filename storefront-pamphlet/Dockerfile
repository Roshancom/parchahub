# --------------------------------------
# Stage 1: Install dependencies
# --------------------------------------
FROM node:20-alpine AS deps
WORKDIR /app

# Install only production dependencies first for better caching
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile --production=false

# --------------------------------------
# Stage 2: Build the application
# --------------------------------------
FROM node:20-alpine AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Set build-time defaults (overridden by Railway env vars at runtime)
ARG NEXT_PUBLIC_API_BASE_URL
ENV NEXT_PUBLIC_API_BASE_URL=$NEXT_PUBLIC_API_BASE_URL

# Build the Next.js application
RUN yarn build

# --------------------------------------
# Stage 3: Production server
# --------------------------------------
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production

# Create a non-root user for security
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy the standalone output (includes only necessary files)
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/public ./public

USER nextjs

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000',(r)=>{process.exit(r.statusCode===200?0:1)}).on('error',()=>process.exit(1))"

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME=0.0.0.0

CMD ["node", "server.js"]
