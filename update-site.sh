#!/bin/bash
# ===========================================================================
#  🔄 ATUALIZAR SITE — Puxa nova imagem e reinicia
# ===========================================================================
#  Uso: ./update-site.sh
# ===========================================================================

set -euo pipefail

PROJECT_DIR="/opt/site-lajes"
cd "$PROJECT_DIR"

echo ""
echo "🔄 Atualizando Portal Lajes Pintadas..."
echo ""

# Puxar nova imagem
echo "[1/3] Puxando nova imagem do GHCR..."
docker compose -f docker-compose.prod.yml pull web

# Reiniciar apenas o container da aplicação (nginx continua rodando)
echo "[2/3] Reiniciando aplicação..."
docker compose -f docker-compose.prod.yml up -d --no-deps web

# Limpar imagens antigas
echo "[3/3] Limpando imagens antigas..."
docker image prune -f

echo ""
echo "✅ Site atualizado com sucesso!"
echo ""
echo "Verificando status:"
docker compose -f docker-compose.prod.yml ps
echo ""
