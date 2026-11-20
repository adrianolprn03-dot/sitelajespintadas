# ==============================================================================
# Dockerfile Multi-Stage para Next.js 14 (App Router) + Prisma
# Otimizado para VPS HostGator (Ubuntu 22.04/24.04 LTS), Coolify e Easypanel
# ==============================================================================

# ------------------------------------------------------------------------------
# 1. Dependências
# ------------------------------------------------------------------------------
FROM node:20-alpine AS deps
RUN apk add --no-cache libc6-compat openssl
WORKDIR /app

COPY package.json package-lock.json ./
COPY prisma ./prisma

# Instalação limpa com tratamento de dependências
RUN npm ci --legacy-peer-deps

# ------------------------------------------------------------------------------
# 2. Build
# ------------------------------------------------------------------------------
FROM node:20-alpine AS builder
RUN apk add --no-cache openssl
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Argumentos de Build para conexão inicial e secrets
ARG DATABASE_URL="postgresql://placeholder:placeholder@localhost:5432/placeholder"
ARG DIRECT_URL="postgresql://placeholder:placeholder@localhost:5432/placeholder"
ARG NEXTAUTH_SECRET="build-secret-placeholder-key-for-standalone"
ARG NEXTAUTH_URL="http://localhost:3000"
ARG NEXT_PUBLIC_BASE_URL="http://localhost:3000"
ARG BLOB_READ_WRITE_TOKEN=""
ARG NODE_ENV=production

ENV DATABASE_URL=${DATABASE_URL}
ENV DIRECT_URL=${DIRECT_URL}
ENV NEXTAUTH_SECRET=${NEXTAUTH_SECRET}
ENV NEXTAUTH_URL=${NEXTAUTH_URL}
ENV NEXT_PUBLIC_BASE_URL=${NEXT_PUBLIC_BASE_URL}
ENV BLOB_READ_WRITE_TOKEN=${BLOB_READ_WRITE_TOKEN}
ENV NODE_ENV=${NODE_ENV}
ENV NEXT_TELEMETRY_DISABLED=1

# Gera o cliente Prisma
RUN npx prisma generate

# Limite de memória rigoroso (1024MB) para rodar com folga e segurança na VPS compacta (1.7GB RAM)
ENV NODE_OPTIONS="--max-old-space-size=1024"

# Build de produção (gera a pasta .next/standalone configurada no next.config.js)
RUN npm run build

# ------------------------------------------------------------------------------
# 3. Runner de Produção
# ------------------------------------------------------------------------------
FROM node:20-alpine AS runner
RUN apk add --no-cache openssl curl
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Usuário de sistema sem privilégios de root para segurança máxima
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Cria diretórios necessários com permissão correta
RUN mkdir -p /app/prisma /app/public/uploads && chown -R nextjs:nodejs /app

# Copia apenas os artefatos mínimos necessários gerados no build
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/prisma ./prisma
COPY --from=builder --chown=nextjs:nodejs /app/package.json ./package.json

USER nextjs

EXPOSE 3000

# Inicia o servidor nativo gerado pelo Next.js Standalone
CMD ["node", "server.js"]
