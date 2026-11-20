#!/bin/bash
# ==============================================================================
# 🚀 DEPLOY AUTOMATIZADO — Portal Institucional de Lajes Pintadas/RN
# 🖥️  Ambiente Alvo: VPS HostGator (Ubuntu 22.04 / 24.04 LTS)
# ==============================================================================
# Uso na VPS:
#   chmod +x deploy-setup.sh && ./deploy-setup.sh
# ==============================================================================

set -euo pipefail

# Cores do terminal
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

log()  { echo -e "${GREEN}[✔]${NC} $1"; }
warn() { echo -e "${YELLOW}[⚠]${NC} $1"; }
err()  { echo -e "${RED}[✘]${NC} $1"; }
info() { echo -e "${BLUE}[ℹ]${NC} $1"; }

PROJECT_DIR="/opt/site-lajes"
DOMAIN="lajespintadas.rn.gov.br"

echo ""
echo "==========================================================="
echo "  🏛️  Prefeitura Municipal de Lajes Pintadas / RN"
echo "  📦  Instalação & Deploy na VPS HostGator"
echo "==========================================================="
echo ""

# 1. Verificar privilégios de root
if [ "$EUID" -ne 0 ]; then
  err "Este script deve ser executado como root: sudo ./deploy-setup.sh"
  exit 1
fi
log "Executando com permissões administrativas (root)"

# 2. Atualizar pacotes do sistema
info "Atualizando pacotes do sistema..."
apt update -y && apt upgrade -y
apt install -y curl wget git unzip ufw ca-certificates gnupg
log "Sistema operacional atualizado com sucesso"

# 3. Instalar Docker se necessário
if command -v docker &> /dev/null; then
  log "Docker já está instalado: $(docker --version)"
else
  info "Instalando Docker Engine..."
  curl -fsSL https://get.docker.com | sh
  systemctl enable docker
  systemctl start docker
  log "Docker instalado com sucesso: $(docker --version)"
fi

# 4. Instalar Docker Compose Plugin se necessário
if docker compose version &> /dev/null; then
  log "Docker Compose já disponível: $(docker compose version)"
else
  info "Instalando plugin Docker Compose..."
  apt install -y docker-compose-plugin
  log "Docker Compose instalado com sucesso"
fi

# 5. Configurar Firewall (UFW)
info "Configurando regras de firewall..."
ufw allow 22/tcp   # SSH
ufw allow 80/tcp   # HTTP
ufw allow 443/tcp  # HTTPS
ufw --force enable
log "Portas essenciais liberadas (22, 80, 443)"

# 6. Preparar diretório do projeto
mkdir -p "$PROJECT_DIR"
cd "$PROJECT_DIR"

# 7. Verificar variáveis de ambiente (.env.production)
if [ ! -f "$PROJECT_DIR/.env.production" ]; then
  warn "Arquivo .env.production não encontrado em $PROJECT_DIR!"
  if [ -f "$PROJECT_DIR/.env.production.example" ]; then
    cp "$PROJECT_DIR/.env.production.example" "$PROJECT_DIR/.env.production"
    info "Criado .env.production a partir do modelo de exemplo."
    echo ""
    warn "ATENÇÃO: Edite o arquivo $PROJECT_DIR/.env.production com seu DATABASE_URL antes de prosseguir:"
    echo "  nano $PROJECT_DIR/.env.production"
    echo ""
    read -p "Pressione [ENTER] assim que tiver configurado o .env.production..."
  else
    err "Por favor, crie o arquivo .env.production no diretório $PROJECT_DIR"
    exit 1
  fi
fi

# 8. Compilar e subir containers Docker
info "Iniciando build e subida dos containers com Docker Compose..."
docker compose -f docker-compose.prod.yml up -d --build

sleep 8

if docker ps | grep -q site_institucional; then
  log "✅ Container da aplicação Next.js 14 está ATIVO e rodando!"
else
  err "Falha na inicialização do container. Verifique os logs:"
  echo "  docker compose -f docker-compose.prod.yml logs web"
  exit 1
fi

if docker ps | grep -q nginx_proxy; then
  log "✅ Nginx Reverse Proxy está ATIVO na porta 80/443!"
fi

IP_SERVER=$(curl -s ifconfig.me || hostname -I | awk '{print $1}')
echo ""
echo "==========================================================="
log "🎉 Implantação concluída com sucesso!"
echo "   Acesso temporário: http://$IP_SERVER"
echo "==========================================================="
echo ""

# 9. Configuração opcional de SSL com Certbot
read -p "Deseja emitir certificado SSL (HTTPS) agora com Let's Encrypt? (s/n): " SETUP_SSL
if [ "$SETUP_SSL" = "s" ] || [ "$SETUP_SSL" = "S" ]; then
  read -p "Informe o domínio configurado no DNS (ex: $DOMAIN): " USER_DOMAIN
  USER_DOMAIN=${USER_DOMAIN:-$DOMAIN}
  read -p "Informe seu e-mail para notificações de SSL: " SSL_EMAIL

  info "Solicitando certificado SSL para $USER_DOMAIN..."
  docker compose -f docker-compose.prod.yml run --rm certbot \
    certonly --webroot \
    -w /var/www/certbot \
    -d "$USER_DOMAIN" \
    -d "www.$USER_DOMAIN" \
    --email "$SSL_EMAIL" \
    --agree-tos \
    --no-eff-email

  log "Certificado SSL emitido com sucesso!"
  docker compose -f docker-compose.prod.yml restart nginx
fi
