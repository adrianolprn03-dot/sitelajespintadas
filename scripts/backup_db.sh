#!/bin/bash
BACKUP_DIR="/root/backups"
DB_URL="postgresql://neondb_owner:npg_NztwAjG93rWe@ep-wandering-term-am49xyll-pooler.c-5.us-east-1.aws.neon.tech/neondb?sslmode=require"
DATE=$(date +%Y-%m-%d_%H-%M-%S)
FILENAME="backup_lajes_$DATE.sql.gz"

echo "Iniciando backup em $DATE usando Docker (Postgres 17)..."
docker run --rm postgres:17-alpine pg_dump "$DB_URL" | gzip > "$BACKUP_DIR/$FILENAME"

echo "Backup concluido: $FILENAME"
# Remove backups com mais de 7 dias
find "$BACKUP_DIR" -name "backup_lajes_*.sql.gz" -mtime +7 -delete
