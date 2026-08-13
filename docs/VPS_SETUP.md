# VPS Setup Runbook — Glowing Partner (second app on the Sakura VPS)

Reuses the VPS already hosting World-Partners (`160.16.132.98`). Do these
steps once the hosting repo + domain + DNS provider are decided.

---

## 1. App directory

```bash
ssh deploy@160.16.132.98
mkdir -p /opt/apps/glowing-partner
```

---

## 2. Nginx (two server blocks — frontend + API subdomain)

Replace `<domain>` with the real domain once chosen.

```bash
sudo tee /etc/nginx/sites-available/<domain> << 'EOF'
server {
    listen 80;
    server_name <domain>;

    location /.well-known/acme-challenge/ {
        root /var/www/html;
    }

    location / {
        return 301 https://$host$request_uri;
    }
}

server {
    listen 443 ssl;
    server_name <domain>;

    ssl_certificate     /etc/letsencrypt/live/<domain>/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/<domain>/privkey.pem;
    include             /etc/letsencrypt/options-ssl-nginx.conf;
    ssl_dhparam         /etc/letsencrypt/ssl-dhparams.pem;

    client_max_body_size 50m;

    location / {
        proxy_pass         http://127.0.0.1:3002;
        proxy_http_version 1.1;
        proxy_set_header   Upgrade $http_upgrade;
        proxy_set_header   Connection 'upgrade';
        proxy_set_header   Host $host;
        proxy_set_header   X-Real-IP $remote_addr;
        proxy_set_header   X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header   X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
EOF

sudo tee /etc/nginx/sites-available/api.<domain> << 'EOF'
server {
    listen 80;
    server_name api.<domain>;

    location /.well-known/acme-challenge/ {
        root /var/www/html;
    }

    location / {
        return 301 https://$host$request_uri;
    }
}

server {
    listen 443 ssl;
    server_name api.<domain>;

    ssl_certificate     /etc/letsencrypt/live/api.<domain>/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/api.<domain>/privkey.pem;
    include             /etc/letsencrypt/options-ssl-nginx.conf;
    ssl_dhparam         /etc/letsencrypt/ssl-dhparams.pem;

    client_max_body_size 50m;

    location / {
        proxy_pass         http://127.0.0.1:3003;
        proxy_http_version 1.1;
        proxy_set_header   Upgrade $http_upgrade;
        proxy_set_header   Connection 'upgrade';
        proxy_set_header   Host $host;
        proxy_set_header   X-Real-IP $remote_addr;
        proxy_set_header   X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header   X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
EOF

sudo ln -s /etc/nginx/sites-available/<domain> /etc/nginx/sites-enabled/
sudo ln -s /etc/nginx/sites-available/api.<domain> /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx
```

---

## 3. DNS + TLS

1. A records: `<domain>` and `api.<domain>` -> `160.16.132.98` (low TTL first).
2. `dig <domain> +short` / `dig api.<domain> +short` to confirm propagation.
3. `certbot --nginx -d <domain> -d api.<domain>` (one cert, two SANs — simpler than two certs).
4. `certbot renew --dry-run`.

---

## 4. GitHub Secrets (new hosting repo)

| Secret | Value |
|---|---|
| `SSH_HOST` | `160.16.132.98` |
| `SSH_USER` | `deploy` |
| `SSH_PRIVATE_KEY` | New keypair, separate from World-Partners' `world-partners-deploy` key |
| `DATABASE_USER` | MariaDB app username |
| `DATABASE_PASSWORD` | MariaDB app password |
| `DATABASE_NAME` | `glowing_partner` |
| `MYSQL_ROOT_PASSWORD` | MariaDB root password (container init) |
| `BETTER_AUTH_SECRET` | Random string, 64+ chars |
| `BETTER_AUTH_URL` | `https://api.<domain>` |
| `CORS_ORIGIN` | `https://<domain>` (comma-separate if more origins needed) |
| `R2_ACCESS_KEY_ID` | Existing production R2 bucket's access key |
| `R2_SECRET_ACCESS_KEY` | Existing production R2 bucket's secret key |
| `R2_ENDPOINT` | `https://da7a862cf39f3a73d7acc0e23161f203.r2.cloudflarestorage.com` |
| `R2_PUBLIC_URL` | `https://pub-59e45ee9923c479eafeae7dfde7d3b6a.r2.dev` |
| `S3_ACCOUNT_ID` | `da7a862cf39f3a73d7acc0e23161f203` |
| `NEXT_PUBLIC_API_BASE_URL` | `https://api.<domain>` |

---

## 5. First deploy

Push to `main` on the hosting repo. Then verify:

```bash
ssh deploy@160.16.132.98
docker compose -p glowing-partner ps
docker logs glowing-partner-backend --tail 50
docker logs glowing-partner-frontend --tail 50
```

`prisma migrate deploy` runs automatically on backend container start
(baked into the Dockerfile `CMD`) — no manual SQL import step needed,
unlike World-Partners' one-time dump import.

---

## 6. Verify

```bash
curl https://api.<domain>/health
curl -I https://<domain>
```

---

## Notes vs. World-Partners setup

- Two app ports instead of one: frontend `3002`, backend `4000`->`3003` (WP used `3001`).
- MariaDB container instead of MySQL — own volume `glowing-partner_mariadb_data`, isolated from WP's `world-partners_mysql_data`.
- No shared compose file, no shared network — `docker compose -p glowing-partner` is a fully separate project.
- Hosting repo is separate from the app's dev repo (different GitHub account, to get a fresh Actions minutes quota). The workflow currently lives at `.github/workflows/deploy.yml` in the dev repo as a template — move it (and `deploy/`, both `Dockerfile`s) into the hosting repo when created.
