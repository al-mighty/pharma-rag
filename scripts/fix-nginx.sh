#!/bin/bash
set -e

CONF="/opt/cheslav/nginx/conf.d/cheslav.conf"

if grep -q "pharma-rag" "$CONF"; then
    echo "pharma-rag already in nginx config"
    exit 0
fi

echo "Adding pharma-rag to nginx config..."

# Remove last closing brace
sed -i '$ d' "$CONF"

# Append locations + closing brace
cat >> "$CONF" << 'EOF'

    location /pharma-rag/ {
        proxy_pass http://pharma-rag-frontend-1:80/;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    location /pharma-rag/api/ {
        proxy_pass http://pharma-rag-backend-1:8000/api/;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header Connection '';
        proxy_buffering off;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
EOF

echo "Testing nginx config..."
docker exec cheslav-nginx nginx -t

echo "Restarting nginx..."
docker restart cheslav-nginx

echo "Done! Testing..."
sleep 2
curl -s --max-time 5 -o /dev/null -w "https://cheslav.space/pharma-rag/ -> HTTP %{http_code}\n" https://cheslav.space/pharma-rag/
