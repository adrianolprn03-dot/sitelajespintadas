#!/bin/bash
# =============================================================
# Script de Setup da VPS - Site Institucional Lajes Pintadas
# Ubuntu 20.04 / 22.04
# Execute como root: bash setup_vps.sh
# =============================================================

set -e

DOMAIN="lajespintadas.rn.gov.br"
REPO="https://github.com/adrianolprn03-dot/sitelajespintadas.git"
APP_DIR="/var/www/sitelajespintadas"
EMAIL="seu-email@exemplo.com"  # ALTERE AQUI: email para o SSL

echo ""
echo "=============================================="
echo "  SETUP VPS - LAJES PINTADAS"
echo "=============================================="
echo ""

# -----------------------------------------------
# 1. Atualizar sistema
# -----------------------------------------------
echo "[1/8] Atualizando sistema..."
apt update && apt upgrade -y
apt install -y curl git ufw

# -----------------------------------------------
# 2. Instalar Docker
# -----------------------------------------------
echo "[2/8] Instalando Docker..."
if ! command -v docker &> /dev/null; then
    curl -fsSL https://get.docker.com | bash
    systemctl enable docker
    systemctl start docker
else
    echo "  Docker já instalado. Pulando..."
fi

# Instalar Docker Compose v2
if ! docker compose version &> /dev/null; then
    apt install -y docker-compose-plugin
fi

# -----------------------------------------------
# 3. Instalar Certbot (SSL Let's Encrypt)
# -----------------------------------------------
echo "[3/8] Instalando Certbot..."
apt install -y certbot
mkdir -p /var/www/certbot

# -----------------------------------------------
# 4. Configurar Firewall
# -----------------------------------------------
echo "[4/8] Configurando Firewall (UFW)..."
ufw allow OpenSSH
ufw allow 80/tcp
ufw allow 443/tcp
ufw --force enable
echo "  Firewall configurado."

# -----------------------------------------------
# 5. Clonar o repositório
# -----------------------------------------------
echo "[5/8] Clonando repositório..."
if [ -d "$APP_DIR" ]; then
    echo "  Diretório já existe. Atualizando..."
    cd "$APP_DIR"
    git pull origin main
else
    git clone "$REPO" "$APP_DIR"
    cd "$APP_DIR"
fi

# -----------------------------------------------
# 6. Gerar SSL (antes de subir os containers)
# -----------------------------------------------
echo "[6/8] Gerando certificado SSL..."
echo ""
echo "  IMPORTANTE: O DNS do domínio $DOMAIN deve"
echo "  estar apontando para o IP desta VPS!"
echo ""
read -p "  O DNS já está apontando para este servidor? (s/N): " dns_ok

if [[ "$dns_ok" =~ ^[Ss]$ ]]; then
    certbot certonly --standalone \
        --non-interactive \
        --agree-tos \
        --email "$EMAIL" \
        -d "$DOMAIN" \
        -d "www.$DOMAIN" \
        --pre-hook "systemctl stop nginx 2>/dev/null || true" \
        --post-hook "systemctl start nginx 2>/dev/null || true"
    echo "  Certificado SSL gerado com sucesso!"
else
    echo ""
    echo "  ⚠️  ATENÇÃO: Pulando geração de SSL."
    echo "  Após apontar o DNS, execute:"
    echo "  certbot certonly --standalone -d $DOMAIN -d www.$DOMAIN --email $EMAIL --agree-tos --non-interactive"
    echo ""
    echo "  O site será iniciado em HTTP por enquanto."
    # Usa configuração temporária só com HTTP
    cat > /var/www/sitelajespintadas/nginx.conf << 'NGINX_TEMP'
server {
    listen 80;
    server_name lajespintadas.rn.gov.br www.lajespintadas.rn.gov.br _;

    client_max_body_size 50M;

    location / {
        proxy_pass http://web:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
NGINX_TEMP
fi

# -----------------------------------------------
# 7. Criar renovação automática do SSL
# -----------------------------------------------
echo "[7/8] Configurando renovação automática do SSL..."
(crontab -l 2>/dev/null; echo "0 3 * * * certbot renew --quiet --deploy-hook 'docker compose -f $APP_DIR/docker-compose.yml restart nginx'") | crontab -

# -----------------------------------------------
# 8. Build e subir os containers
# -----------------------------------------------
echo "[8/8] Iniciando os containers Docker..."
echo ""
echo "  ⚠️  ANTES DE CONTINUAR: verifique se o arquivo"
echo "  .env.production está correto em $APP_DIR/"
echo ""
read -p "  O .env.production está configurado? (s/N): " env_ok

if [[ "$env_ok" =~ ^[Ss]$ ]]; then
    cd "$APP_DIR"
    docker compose down 2>/dev/null || true
    docker compose build --no-cache
    docker compose up -d
    echo ""
    echo "  Aguardando o app inicializar..."
    sleep 10
    docker compose ps
    echo ""
    echo "=============================================="
    echo "  ✅ DEPLOY CONCLUÍDO!"
    echo "=============================================="
    echo ""
    echo "  Site: http://$DOMAIN"
    if [[ "$dns_ok" =~ ^[Ss]$ ]]; then
        echo "  Site: https://$DOMAIN"
    fi
    echo ""
    echo "  Comandos úteis:"
    echo "    Ver logs:      docker compose -f $APP_DIR/docker-compose.yml logs -f"
    echo "    Reiniciar:     docker compose -f $APP_DIR/docker-compose.yml restart"
    echo "    Atualizar:     cd $APP_DIR && git pull && docker compose build && docker compose up -d"
    echo ""
else
    echo ""
    echo "  Configure o .env.production e depois execute:"
    echo "  cd $APP_DIR && docker compose build && docker compose up -d"
    echo ""
fi
