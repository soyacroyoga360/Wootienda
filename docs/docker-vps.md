# Docker en VPS Hostinger

Esta configuración levanta el proyecto Next.js y una pila Supabase local en Docker.

## 1. Clave SSH para Hostinger

Genera la clave en tu equipo local, no dentro del chat:

```bash
ssh-keygen -t ed25519 -C "hostinger-directorio-negocios" -f ~/.ssh/hostinger_directorio_negocios
```

Copia la clave publica al panel de Hostinger o al servidor:

```bash
ssh-copy-id -i ~/.ssh/hostinger_directorio_negocios.pub root@TU_IP_DEL_VPS
```

Entra al VPS:

```bash
ssh -i ~/.ssh/hostinger_directorio_negocios root@TU_IP_DEL_VPS
```

## 2. Variables de entorno

Copia el ejemplo:

```bash
cp .env.docker.example .env
```

Edita `.env` y cambia las URLs a tu dominio o IP publica. Para un VPS expuesto directamente, por ejemplo:

```env
NEXT_PUBLIC_SUPABASE_URL=http://TU_IP_DEL_VPS:8000
SITE_URL=http://TU_IP_DEL_VPS:3000
ADDITIONAL_REDIRECT_URLS=http://TU_IP_DEL_VPS:3000/auth/callback
```

Genera secretos fuertes:

```bash
openssl rand -base64 32
openssl rand -base64 64
openssl rand -hex 8
```

Para `SUPABASE_ANON_KEY` y `SUPABASE_SERVICE_ROLE_KEY`, deben ser JWT firmados con el mismo `JWT_SECRET`. Puedes generarlos con la herramienta oficial de Supabase o con un script JWT usando roles `anon` y `service_role`.

Este repo incluye un generador simple:

```bash
node scripts/generate-supabase-keys.mjs "TU_JWT_SECRET_DE_32_CARACTERES_O_MAS"
```

Copia la salida `JWT_SECRET`, `SUPABASE_ANON_KEY` y `SUPABASE_SERVICE_ROLE_KEY` dentro de `.env`.

## 3. Levantar servicios

```bash
docker compose up -d --build
```

Servicios publicados por defecto:

- App Next.js: `http://localhost:3000`
- Supabase API: `http://localhost:8000`
- Supabase Studio: `http://localhost:3001`

En el VPS reemplaza `localhost` por tu IP o dominio.

## 4. Base de datos

El servicio `supabase_schema` espera a que Supabase cree `auth.users` y `storage.buckets`, y luego ejecuta [supabase-schema.sql](supabase-schema.sql). El SQL es idempotente, así que puedes relanzar el servicio si actualizas el esquema:

```bash
docker compose run --rm supabase_schema
```

## 5. Produccion con dominio

Para produccion, coloca Nginx, Caddy o Traefik delante y usa HTTPS. Expón el dominio de Supabase en `NEXT_PUBLIC_SUPABASE_URL` y el dominio de la app en `SITE_URL`.
