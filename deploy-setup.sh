#!/bin/bash
# ===========================================================================
#  🚀 DEPLOY AUTOMATIZADO — Portal Lajes Pintadas → VPS HostGator
# ===========================================================================
#  Uso: curl -sL URL_DESTE_SCRIPT | bash
#  Ou:  chmod +x deploy-setup.sh && ./deploy-setup.sh
# ===========================================================================

set -euo pipefail

# ---- Cores para output ----
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

log()  { echo -e "${GREEN}[✔]${NC} $1"; }
warn() { echo -e "${YELLOW}[⚠]${NC} $1"; }
err()  { echo -e "${RED}[✘]${NC} $1"; }
info() { echo -e "${BLUE}[ℹ]${NC} $1"; }

# ---- Configurações ----
PROJECT_DIR="/opt/site-lajes"
DOMAIN="lajespintadas.rn.gov.br"
GHCR_IMAGE="ghcr.io/adrianolprn03-dot/sitelajespintadas:latest"

echo ""
echo "==========================================================="
echo "  🏛️  Portal Institucional — Lajes Pintadas/RN"
echo "  📦  Deploy Automatizado para VPS HostGator"
echo "==========================================================="
echo ""

# ===========================================================================
# ETAPA 1: Verificar se é root
# ===========================================================================
if [ "$EUID" -ne 0 ]; then
  err "Execute como root: sudo ./deploy-setup.sh"
  exit 1
fi
log "Executando como root"

# ===========================================================================
# ETAPA 2: Atualizar sistema
# ===========================================================================
info "Atualizando sistema operacional..."
apt update -y && apt upgrade -y
apt install -y curl wget git unzip ufw
log "Sistema atualizado"

# ===========================================================================
# ETAPA 3: Instalar Docker
# ===========================================================================
if command -v docker &> /dev/null; then
  log "Docker já instalado: $(docker --version)"
else
  info "Instalando Docker..."
  curl -fsSL https://get.docker.com | sh
  systemctl enable docker
  systemctl start docker
  log "Docker instalado: $(docker --version)"
fi

# ===========================================================================
# ETAPA 4: Instalar Docker Compose
# ===========================================================================
if docker compose version &> /dev/null; then
  log "Docker Compose já instalado: $(docker compose version)"
else
  info "Instalando Docker Compose plugin..."
  apt install -y docker-compose-plugin
  log "Docker Compose instalado"
fi

# ===========================================================================
# ETAPA 5: Configurar Firewall
# ===========================================================================
info "Configurando firewall (UFW)..."
ufw allow 22/tcp   # SSH
ufw allow 80/tcp   # HTTP
ufw allow 443/tcp  # HTTPS
ufw --force enable
log "Firewall configurado (22, 80, 443)"

# ===========================================================================
# ETAPA 6: Criar diretório do projeto
# ===========================================================================
mkdir -p "$PROJECT_DIR"
cd "$PROJECT_DIR"
log "Diretório criado: $PROJECT_DIR"

# ===========================================================================
# ETAPA 7: Verificar se os arquivos de configuração existem
# ===========================================================================
MISSING_FILES=0

if [ ! -f "$PROJECT_DIR/docker-compose.prod.yml" ]; then
  warn "Arquivo docker-compose.prod.yml NÃO encontrado!"
  MISSING_FILES=1
fi

if [ ! -f "$PROJECT_DIR/.env.production" ]; then
  warn "Arquivo .env.production NÃO encontrado!"
  MISSING_FILES=1
fi

if [ ! -f "$PROJECT_DIR/nginx.conf" ] && [ ! -f "$PROJECT_DIR/nginx-initial.conf" ]; then
  warn "Arquivo nginx.conf NÃO encontrado!"
  MISSING_FILES=1
fi

if [ "$MISSING_FILES" -eq 1 ]; then
  echo ""
  err "Arquivos de configuração faltando!"
  echo ""
  echo "Envie os seguintes arquivos do seu PC para a VPS:"
  echo ""
  echo "  scp docker-compose.prod.yml .env.production nginx-initial.conf nginx-ssl.conf root@$(hostname -I | awk '{print $1}'):$PROJECT_DIR/"
  echo ""
  echo "Depois execute este script novamente."
  exit 1
fi

# ===========================================================================
# ETAPA 8: Login no GHCR e puxar imagem
# ===========================================================================
info "Autenticando no GitHub Container Registry..."
echo ""
echo "  Para fazer login, você precisa de um GitHub Personal Access Token"
echo "  com permissão 'read:packages'."
echo ""
echo "  Crie em: https://github.com/settings/tokens/new"
echo ""

if ! docker pull "$GHCR_IMAGE" 2>/dev/null; then
  warn "Não foi possível puxar a imagem. Faça login primeiro:"
  echo ""
  read -p "  Seu usuário GitHub: " GITHUB_USER
  read -sp "  Seu GitHub Token: " GITHUB_TOKEN
  echo ""
  echo "$GITHUB_TOKEN" | docker login ghcr.io -u "$GITHUB_USER" --password-stdin
  echo ""
  docker pull "$GHCR_IMAGE"
fi
log "Imagem Docker puxada: $GHCR_IMAGE"

# ===========================================================================
# ETAPA 9: Iniciar com nginx HTTP-only (para obter certificado SSL)
# ===========================================================================
info "Copiando nginx-initial.conf como nginx.conf (HTTP-only para Certbot)..."
if [ -f "$PROJECT_DIR/nginx-initial.conf" ]; then
  cp "$PROJECT_DIR/nginx-initial.conf" "$PROJECT_DIR/nginx.conf"
fi

info "Iniciando containers..."
docker compose -f docker-compose.prod.yml up -d
sleep 10

# Verificar se o container está rodando
if docker ps | grep -q site_institucional; then
  log "Container da aplicação está rodando!"
else
  err "Container não iniciou. Verifique os logs:"
  echo "  docker compose -f docker-compose.prod.yml logs web"
  exit 1
fi

if docker ps | grep -q nginx_proxy; then
  log "Nginx está rodando!"
else
  err "Nginx não iniciou. Verifique os logs:"
  echo "  docker compose -f docker-compose.prod.yml logs nginx"
  exit 1
fi

echo ""
log "✅ Site acessível em http://$(hostname -I | awk '{print $1}')"
echo ""

# ===========================================================================
# ETAPA 10: Obter certificado SSL
# ===========================================================================
echo ""
info "Deseja configurar SSL (HTTPS) agora? (s/n)"
read -p "  > " SETUP_SSL

if [ "$SETUP_SSL" = "s" ] || [ "$SETUP_SSL" = "S" ]; then
  info "Obtendo certificado SSL para $DOMAIN..."

  read -p "  Seu email (para Let's Encrypt): " SSL_EMAIL

  docker compose -f docker-compose.prod.yml run --rm certbot \
    certonly --webroot \
    -w /var/www/certbot \
    -d "$DOMAIN" \
    -d "www.$DOMAIN" \
    --email "$SSL_EMAIL" \
    --agree-tos \
    --no-eff-email

  if [ $? -eq 0 ]; then
    log "Certificado SSL obtido com sucesso!"

    # Trocar para nginx com SSL
    info "Ativando configuração HTTPS..."
    if [ -f "$PROJECT_DIR/nginx-ssl.conf" ]; then
      cp "$PROJECT_DIR/nginx-ssl.conf" "$PROJECT_DIR/nginx.conf"
      docker compose -f docker-compose.prod.yml restart nginx
      log "HTTPS ativado! Site disponível em https://$DOMAIN"
    else
      warn "nginx-ssl.conf não encontrado. Copie-o manualmente."
    fi

    # Configurar renovação automática via cron
    info "Configurando renovação automática do certificado..."
    CRON_CMD="0 3 * * * cd $PROJECT_DIR && docker compose -f docker-compose.prod.yml run --rm certbot renew --webroot -w /var/www/certbot --quiet && docker compose -f docker-compose.prod.yml restart nginx"
    (crontab -l 2>/dev/null | grep -v certbot; echo "$CRON_CMD") | crontab -
    log "Renovação automática configurada (diário às 3h)"

  else
    err "Falha ao obter certificado SSL."
    warn "Verifique se o DNS de $DOMAIN está apontando para este servidor."
    warn "O site continua funcionando em HTTP."
  fi
else
  info "SSL ignorado. Configure depois com:"
  echo "  cd $PROJECT_DIR && ./deploy-setup.sh"
fi

# ===========================================================================
# FINALIZAÇÃO
# ===========================================================================
echo ""
echo "==========================================================="
echo "  ✅  DEPLOY CONCLUÍDO!"
echo "==========================================================="
echo ""
echo "  🌐 HTTP:  http://$(hostname -I | awk '{print $1}')"
echo "  🌐 Domínio: http://$DOMAIN"
echo ""
echo "  📋 Comandos úteis:"
echo "  ─────────────────────────────────────────"
echo "  Ver logs:       docker compose -f docker-compose.prod.yml logs -f"
echo "  Reiniciar:      docker compose -f docker-compose.prod.yml restart"
echo "  Parar:          docker compose -f docker-compose.prod.yml down"
echo "  Atualizar site: docker compose -f docker-compose.prod.yml pull && docker compose -f docker-compose.prod.yml up -d"
echo "  Status:         docker compose -f docker-compose.prod.yml ps"
echo ""
echo "  ⚠️  Lembre-se de:"
echo "  1. Apontar o DNS de $DOMAIN para $(hostname -I | awk '{print $1}')"
echo "  2. Configurar SSL se ainda não fez (ETAPA 10)"
echo "  3. Trocar os secrets no .env.production"
echo ""
