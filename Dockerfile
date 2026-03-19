# Estágio de Dependências
FROM node:20-alpine AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

# Estágio de Build
FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Desabilita o envio de telemetria do Next.js durante o build
ENV NEXT_TELEMETRY_DISABLED 1

# Gera o client do Prisma
RUN npx prisma generate

# Executa o build
RUN npm run build

# Estágio de Runner
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Cria diretórios para persistência (SQLite e Uploads)
RUN mkdir -p /app/prisma /app/public/uploads && chown -R nextjs:nodejs /app

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/prisma ./prisma
COPY --from=builder --chown=nextjs:nodejs /app/package.json ./package.json

USER nextjs

EXPOSE 3000

ENV PORT 3000
# set hostname to localhost
ENV HOSTNAME "0.0.0.0"

# O banco dev.db precisa estar na imagem inicial ou ser montado como volume
# Por segurança, o standalone do Next.js não copia o node_modules inteiro, 
# mas o Prisma precisa do engine dentro de prisma/
CMD ["node", "server.js"]
