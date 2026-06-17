# --------------------------------------
# Stage 1: Install all dependencies (including devDependencies for build)
# --------------------------------------
FROM node:20-alpine AS deps
WORKDIR /app

# Copy package management files
COPY package.json package-lock.json ./

# Install ALL dependencies (including devDependencies for TypeScript build)
RUN npm ci

# --------------------------------------
# Stage 2: Build the TypeScript application
# --------------------------------------
FROM node:20-alpine AS builder
WORKDIR /app

# Copy node_modules from deps stage
COPY --from=deps /app/node_modules ./node_modules

# Copy source code
COPY . .

# Build TypeScript to ./dist
RUN npm run build

# --------------------------------------
# Stage 3: Production runtime
# --------------------------------------
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production

# Copy only production dependencies
COPY package.json package-lock.json ./
RUN npm ci --omit=dev && npm cache clean --force

# Copy built output from builder
COPY --from=builder /app/dist ./dist

# The app.ts uses path.join(__dirname, '../uploads') to serve static files.
# At runtime __dirname = /app/dist/server/, so uploads must be at /app/dist/uploads/
COPY --from=builder /app/uploads ./dist/uploads

# Create a non-root user for security
RUN addgroup --system --gid 1001 nodeuser && \
    adduser --system --uid 1001 appuser && \
    chown -R appuser:nodeuser /app

USER appuser

# Health check - verify API is running
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD node -e "require('http').get('http://localhost:${PORT:-5000}/api/health',(r)=>{process.exit(r.statusCode===200?0:1)}).on('error',()=>process.exit(1))"

EXPOSE 5000

ENV PORT=5000
ENV HOSTNAME=0.0.0.0

CMD ["node", "dist/server/server.js"]
