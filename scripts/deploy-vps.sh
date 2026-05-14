#!/bin/bash
set -e

echo "=== PharmaRAG VPS Deploy ==="

cd /opt/pharma-rag

# 1. Stop existing containers
echo "[1/6] Stopping containers..."
docker compose down 2>/dev/null || true

# 2. Pull latest code
echo "[2/6] Pulling latest code..."
git pull origin main

# 3. Start services
echo "[3/6] Starting services..."
docker compose up -d --build

# 4. Connect to cheslav-net
echo "[4/6] Connecting to cheslav-net..."
docker network connect cheslav-net pharma-rag-frontend-1 2>/dev/null || echo "  frontend already connected"
docker network connect cheslav-net pharma-rag-backend-1 2>/dev/null || echo "  backend already connected"

# 5. Add nginx location (if not already present)
echo "[5/6] Configuring nginx..."
docker cp cheslav-nginx:/etc/nginx/conf.d/cheslav.conf /tmp/cheslav.conf

if grep -q "pharma-rag" /tmp/cheslav.conf; then
    echo "  nginx already configured for pharma-rag"
else
    # Insert pharma-rag locations before the last closing brace of the ssl server block
    sed -i '$d' /tmp/cheslav.conf
    cat >> /tmp/cheslav.conf << 'NGINX'

    location /pharma-rag/ {
        proxy_pass http://pharma-rag-frontend-1:80/;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    location /pharma-rag/api/ {
        proxy_pass http://pharma-rag-backend-1:8000/api/;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header Connection '';
        proxy_buffering off;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
NGINX

    docker cp /tmp/cheslav.conf cheslav-nginx:/etc/nginx/conf.d/cheslav.conf
    docker exec cheslav-nginx nginx -t && docker exec cheslav-nginx nginx -s reload
    echo "  nginx configured and reloaded"
fi

# 6. Seed data (if empty)
echo "[6/6] Checking data..."
HEALTH=$(curl -s http://localhost:8000/api/health)
DOCS=$(echo "$HEALTH" | grep -o '"documents":[0-9]*' | grep -o '[0-9]*')

if [ "$DOCS" = "0" ]; then
    echo "  Seeding drug instruction PDFs..."
    docker compose exec -T backend python -m app.seed
else
    echo "  Already has $DOCS documents, skipping seed"
fi

echo ""
echo "=== Done! ==="
echo "Health: $(curl -s http://localhost:8000/api/health)"
echo "Live: https://cheslav.space/pharma-rag/"
