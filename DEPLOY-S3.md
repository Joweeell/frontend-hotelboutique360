# Deploy del frontend → S3 + CloudFront (sitio con HTTPS)

El frontend del Hotel Boutique 360 es una SPA (React + Vite). Se sirve como sitio estático
desde **S3 detrás de CloudFront**, igual que `cloud-s3-chati`.

---

## 1. Por qué CloudFront y no el website de S3

Cognito (Hosted UI / OAuth) solo acepta URLs de retorno **HTTPS**, y el website de S3 solo
entrega HTTP. Por eso el bucket queda **privado** y se sirve por CloudFront con
Origin Access Control (OAC).

---

## 2. Lo que ya está listo en AWS (no repetir)

- Bucket **privado**: solo CloudFront puede leerlo (OAC).
- Distribución CloudFront con HTTPS, `index.html` como root y errores 403/404 → `/index.html`
  (200) para que las rutas de la SPA funcionen.
- Cognito: el **App client** debe tener la URL de CloudFront en `Allowed callback URLs` y
  `Allowed sign-out URLs`.

Si algún día hay que recrearlo:

```bash
aws s3api create-bucket --bucket hotel-boutique-360 --region us-east-1
aws s3api put-public-access-block --bucket hotel-boutique-360 \
  --public-access-block-configuration 'BlockPublicAcls=true,IgnorePublicAcls=true,BlockPublicPolicy=true,RestrictPublicBuckets=true'
# OJO: no activar "static website hosting": CloudFront usa el endpoint REST del bucket (permite OAC).
aws cloudfront create-origin-access-control --origin-access-control-config \
  Name=hotel-boutique-360-oac,OriginAccessControlOriginType=s3,SigningBehavior=always,SigningProtocol=sigv4
```

---

## 3. Secrets de GitHub (para que Actions pueda subir)

Viven en GitHub, los usa el workflow. Tu código no los lee.

| Secret en GitHub | Valor |
|---|---|
| `AWS_ACCESS_KEY_ID` | Tu access key |
| `AWS_SECRET_ACCESS_KEY` | Tu secret key (solo se muestra una vez) |
| `AWS_REGION` | `us-east-1` |
| `S3_BUCKET_NAME` | `hotel-boutique-360` |
| `CLOUDFRONT_DISTRIBUTION_ID` *(recomendado)* | Para invalidar el caché en cada deploy |

Dónde agregarlos: en GitHub abre el repo → **Settings → Secrets and variables → Actions** →
**New repository secret**, uno por uno.

---

## 4. Variables de entorno del frontend

El frontend se compila con Vite, así que las variables se leen **al compilar** (no en runtime).

| Variable | Para qué sirve |
|---|---|
| `VITE_COGNITO_AUTHORITY` | URL del pool de Cognito |
| `VITE_COGNITO_CLIENT_ID` | App client de la SPA |
| `VITE_API_URL` | URL del API Gateway (produce) |
| `VITE_API_BASE` | Base de las llamadas a la API. **Vacío = mismo origen** (lo resuelve CloudFront o el proxy de Vite en local). Con la URL del API Gateway, el front llama directo y el API Gateway necesita **CORS**. |

Están en `.env` (versionado). Para no tocarlo en cada deploy, se pueden sobreescribir en el
workflow con un step previo al build:

```yaml
      - name: Build
        run: |
          echo "VITE_API_BASE=${{ vars.VITE_API_BASE }}" >> .env
          pnpm run build
```

---

## 5. Cómo publicar cambios

1. Trabaja normal en este repo y haz push a `main`:
   ```bash
   git add -A
   git commit -m "lo que sea"
   git push origin main
   ```
2. El workflow corre solo: `pnpm install` → `pnpm run build` → `aws s3 sync dist/` al bucket.
3. Verifica que el run esté en verde y recarga la URL pública (si ves la versión vieja, es caché).
4. Despliegue manual (sin GitHub), si lo necesitas:
   ```bash
   pnpm run build
   aws s3 sync dist/ s3://hotel-boutique-360 --delete
   ```

---

## 6. Desarrollo local contra el BFF

En local **no** hay API Gateway ni CloudFront, así que el frontend habla con el BFF a través
del proxy de Vite, que además inyecta la cabecera `X-Secret-Gateway` que el BFF exige:

```
frontend (5173)  --/api-->  proxy de Vite  --/api + X-Secret-Gateway-->  BFF (8080)
```

Configuración en `.env.development.local` (está en `.gitignore`):

```
VITE_API_BASE=
BFF_URL=http://localhost:8080
GATEWAY_SECRET=secreto_local
```

Con `VITE_API_BASE` vacío, `axios` usa baseURL `''` y las llamadas van a `/api/...` en el
propio origen; Vite las reenvía al BFF.

Levantar el BFF local:

```bash
cd cloud-hotel-bff
DB_URL=jdbc:postgresql://localhost:5432/hotel DB_USER=postgres DB_PASSWORD=postgres \
  API_GATEWAY_SECRET=secreto_local ./gradlew bootRun
```

---

## 7. Checklist rápido si falla

- **AccessDenied** en el sync: claves malas o usuario sin permiso `s3:PutObject` sobre el bucket.
- **NoSuchBucket**: el `S3_BUCKET_NAME` está mal escrito o apunta a otra región.
- **Veo la versión vieja**: es caché del navegador o de CloudFront. Navegador: Cmd/Ctrl+Shift+R.
  CloudFront: crea una invalidación `/*` o espera el TTL.
- **redirect_mismatch** en Cognito: la URL de retorno no está en `Allowed callback URLs`
  (debe calzar exactamente con la URL de CloudFront).
- **CORS error** desde el navegador: estás sirviendo el front desde CloudFront y la API desde
  otro dominio. O configuras CORS en el API Gateway, o dejas `VITE_API_BASE` vacío y haces que
  CloudFront apunte `/api` al API Gateway como origen behaviors.
- **403 del BFF**: falta la cabecera `X-Secret-Gateway`. En AWS la inyecta el API Gateway; en
  local la inyecta el proxy de Vite (revisa `GATEWAY_SECRET`).
