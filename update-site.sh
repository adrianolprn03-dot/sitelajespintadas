#!/bin/bash
# ==============================================================================
# 🔄 Script de Atualização Contínua do Site na VPS HostGator
# ==============================================================================
# Uso:
#   ./update-site.sh
# ==============================================================================

set -euo pipefail

PROJECT_DIR="/opt/site-lajes"
cd "$PROJECT_DIR"

echo "==========================================================="
echo "  🔄 Atualizando Portal Institucional — Lajes Pintadas/RN"
echo "==========================================================="

echo "[1/4] Puxando últimas alterações do GitHub (branch main)..."
git pull origin main

echo "[2/4] Recompilando containers com a nova versão..."
docker compose -f docker-compose.prod.yml up -d --build

echo "[3/4] Limpando imagens antigas e recursos não utilizados..."
docker image prune -f

echo "[4/4] Verificando integridade..."
sleep 5
docker compose -f docker-compose.prod.yml ps

echo "==========================================================="
echo "  ✅ Atualização concluída com sucesso!"
echo "==========================================================="
