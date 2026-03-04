# Apify Campaign API

API REST para la gestión y simulación de envío masivo de campañas de mensajería, desarrollada en **Node.js, Express y TypeScript** utilizando **PostgreSQL** como base de datos con consultas SQL directas.  
Proyecto desarrollado como prueba técnica.

## 🚀 Tecnologías y Arquitectura Utilizadas

- **Runtime:** Node.js
- **Framework:** Express.js
- **Lenguaje:** TypeScript
- **Base de Datos:** PostgreSQL (`pg` library para consultas SQL nativas / raw SQL, gestionadas mediante Pools de Conexión).
- **Arquitectura:** Diseño basado en capas (Rutas, Controladores, Servicios y Repositorios) para garantizar el Principio de Responsabilidad Única y lograr un código mantenible y escalable.

## ✅ Funcionalidades Logradas (Prueba 100% Completada)

1. **Creación y Configuración:** Creación de campañas con control estricto de `rate_limit_per_minute` (POST `/campaigns`).
2. **Contactos:** Algoritmo rápido para inyectar listas de destino cambiando su estado a inicial de "pending" (POST `/:id/contacts`).
3. **Control de Estados Analógicos:** Puntos habilitados para `start`, `pause` y `resume` gestionando dinámicamente los estados `running` o `paused` de cada campaña.
4. **Motor Asíncrono en Segundo Plano (Cron Job):**
   - Servicio inyectado con `setInterval` que corre automáticamente.
   - Selecciona campañas corriendo (`running`) y realiza Rate Limiting matemático directamente vía sentencias SQL `LIMIT N`.
   - Modela envíos reales calculando al azar la suerte (90% enviados, 10% fallidos).
   - Apagado inteligente al detectar que no restan contactos pendientes, mutando la campaña a `finished`.
5. **Estadísticas de Rendimiento Puras:** Endpoint especial (GET `/progress`) alimentado por conteo nativo `COUNT(CASE WHEN...)` reduciendo la carga de memoria sobre V8/Node para mostrar los datos calculando los porcentajes exactos de manera progresiva.

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
4. Actualiza las credenciales de base de datos en el nuevo archivo `.env` según tu motor de base de datos local y asegúrate de crear una base de datos vacía.

## 📦 Ejecución y Base de Datos (Migraciones)

Para crear rápidamente las tablas con restricciones (`campaigns`, `contacts` y `campaign_contacts`), ejecuta de manera automática nuestro seeder interno que cargará de paso usuarios de prueba falsos para ti:

```bash
npx ts-node --esm src/config/seed.ts
# O en Windows: node --loader ts-node/esm src/config/seed.ts
```

Una vez instaladas las tablas, levanta el servidor de desarrollo mediante **nodemon**:

```bash
npm run dev
```

El servidor estará recibiendo peticiones en `http://localhost:3000`.
