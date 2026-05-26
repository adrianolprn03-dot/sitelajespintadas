#!/bin/bash
# =============================================================
# Script de Atualização do Site - Lajes Pintadas
# Execute na VPS: bash /var/www/sitelajespintadas/scripts/update.sh
# =============================================================

APP_DIR="/var/www/sitelajespintadas"

echo ""
echo "🔄 Atualizando site Lajes Pintadas..."
echo ""

cd "$APP_DIR"

# Buscar últimas alterações do GitHub
echo "[1/4] Baixando atualizações do GitHub..."
git pull origin main

# Rebuild da imagem
echo "[2/4] Reconstruindo imagem Docker..."
docker compose build --no-cache

# Reiniciar containers
echo "[3/4] Reiniciando containers..."
docker compose up -d

# Aguardar e mostrar status
echo "[4/4] Verificando status..."
sleep 8
docker compose ps

echo ""
echo "✅ Atualização concluída!"
echo ""
