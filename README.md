# Apify Campaign API

API REST para la gestión y envío de campañas de mensajería, desarrollada en **Node.js, Express y TypeScript** utilizando **PosgreSQL** como base de datos con consultas SQL directas.

## 🚀 Tecnologías Utilizadas

- **Runtime:** Node.js
- **Framework:** Express.js
- **Lenguaje:** TypeScript
- **Base de Datos:** PostgreSQL (`pg` library para consultas raw SQL)

## 📌 Avance Actual (Paso 1 y 2 COMPLETADOS)

En esta rama, el API es capaz de:

1. **Infraestructura:** Conexión exitosa a PostgreSQL mediante la configuración de Pool.
2. **Creación:** Insertar nuevas campañas en la tabla `campaigns` configurando sus límites de rate limit (`/campaigns`).
3. **Asignación:** Recibir un arreglo de IDs y rellenar la tabla pivote de `campaign_contacts` con su estado inicial de "pending" (`/:id/contacts`).
4. **Control de Estados (State Machine):** Actualizar exitosamente los estados de la campaña a `running`, `paused` o de vuelta a running (`/:id/start`, `/:id/pause`, `/:id/resume`).

_Los siguientes pasos (Analítica/Progreso en `/progress` y el Background Job) se completarán posteriormente._

---

## 🛠️ Instrucciones de Instalación Local

1. Clona este repositorio y ubícate en la carpeta raíz.
2. Instala las dependencias:
   ```bash
   npm install
   ```
3. Clona el archivo `.env.example` y renómbralo a `.env`:
   ```bash
   cp .env.example .env
   ```
4. Actualiza las credenciales de base de datos en el nuevo archivo `.env` según tu entorno local.
5. Inicia o crea una base de datos vacía en PostgreSQL con el nombre estipulado en tu `DB_NAME`.

## 📦 Ejecución y Migraciones

El proyecto cuenta con scripts preparados para levantar el entorno.

Para crear rápidamente las tablas (`campaigns`, `contacts` y `campaign_contacts`), ejecuta de manera automática nuestro script de migración SQL usando ts-node:

```bash
npx ts-node --esm src/config/init-db.ts
```

Una vez instaladas las tablas, levanta el servidor de desarrollo mediante nodemon (que recargará los cambios automáticamente):

```bash
npm run dev
```

El servidor estará recibiendo peticiones en `http://localhost:3000`.
