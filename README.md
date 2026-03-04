# Apify Campaign API

API REST para la gestión y simulación de envío masivo de campañas de mensajería, desarrollada en **Node.js, Express y TypeScript** utilizando **PostgreSQL** como base de datos con consultas SQL directas.  
Proyecto desarrollado como prueba técnica.

## 🚀 Tecnologías y Arquitectura Utilizadas

- **Runtime:** Node.js
- **Framework:** Express.js
- **Lenguaje:** TypeScript
- **Base de Datos:** PostgreSQL (`pg` library para consultas SQL nativas / raw SQL).
- **Validación:** Zod
- **Arquitectura:** Estructura Modular/Limpia:
  - `controllers/`: Manejo de peticiones y respuestas.
  - `services/`: Lógica de negocio y validaciones de existencia.
  - `repositories/`: Consultas SQL directas a la base de datos.
  - `routes/`: Definición de endpoints.
  - `utils/`: Utilidades como el manejador de respuestas estandarizado.

## ✅ Funcionalidades Logradas

1. **Estructura Organizada:** Refactorización total a carpetas por responsabilidad (`controllers`, `services`, etc.).
2. **Manejo de Respuestas:** Sistema estandarizado de respuestas con mensajes claros de éxito y error, incluyendo códigos HTTP adecuados.
3. **Validación Robusta:** Validación de tipos y requerimientos mediante **Zod** y validaciones de existencia en base de datos en la capa de servicios.
4. **Creación y Configuración:** Creación de campañas con control de `rate_limit_per_minute`.
5. **Contactos:** Inyección rápida de listas de contactos.
6. **Estadísticas:** Endpoint (GET `/progress`) que calcula porcentajes de envío en tiempo real.

---

## 🛠️ Instrucciones de Instalación Local

1. Clona el repositorio.
2. Instala las dependencias:
   ```bash
   npm install
   ```
3. Configura las variables de entorno:
   ```bash
   cp .env.example .env
   ```
4. Actualiza las credenciales en el archivo `.env`.

## 📦 Base de Datos y Ejecución

1. Asegúrate de tener PostgreSQL corriendo y crea la base de datos.
2. Ejecuta el script SQL en `init.sql` o usa el seeder (si está disponible):
   ```bash
   node --loader ts-node/esm src/config/seed.ts
   ```
3. Inicia el servidor de desarrollo:
   ```bash
   npm run dev
   ```

El servidor estará en `http://localhost:3000`.
