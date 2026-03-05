# 🚀 Apify Campaign API

API REST profesional diseñada para la gestión y simulación de envío masivo de campañas de mensajería con control de **Rate Limit** y procesamiento en **segundo plano (background)**.

Desarrollada como proyecto robusto en **Node.js**, **Express** y **TypeScript**, utilizando **PostgreSQL** con consultas SQL directas para máxima eficiencia.

---

## 📖 Documentación & Repositorio

- **Swagger UI:** [http://localhost:3000/api-docs/](http://localhost:3000/api-docs/)
- **Repositorio:** [https://github.com/JeffersonMontoya/apify-campaign-api](https://github.com/JeffersonMontoya/apify-campaign-api)

---

## 🎯 Objetivo del Proyecto

Simular la lógica central de un sistema de campañas que envía mensajes a contactos, asegurando:

- Control estricto de **Rate Limit** (envíos por minuto).
- Procesamiento persistente en segundo plano.
- Manejo de estados de campaña (borrador, corriendo, pausada, terminada).
- Reporte detallado de progreso.

---

## 🛠️ Stack Tecnológico

- **Runtime:** Node.js
- **Framework:** Express.js
- **Lenguaje:** TypeScript
- **Base de Datos:** PostgreSQL (`pg` library para Raw SQL)
- **Validación:** Zod
- **Documentación:** Swagger (OpenAPI)

---

## 🗄️ Modelo de Datos

El sistema se basa en 3 entidades principales:

1. **Campaigns:** Almacena la configuración de la campaña y su estado actual (`draft`, `running`, `paused`, `finished`).
2. **Contacts:** Maestro de contactos con nombre y teléfono.
3. **Campaign_contacts:** Tabla relacional que gestiona el estado individual de cada envío (`pending`, `sent`, `failed`).

---

## 🛣️ Endpoints Principales

| Método | Endpoint                  | Descripción                                                  |
| :----- | :------------------------ | :----------------------------------------------------------- |
| `POST` | `/campaigns`              | Crear nueva campaña con `rate_limit_per_minute`.             |
| `POST` | `/campaigns/:id/contacts` | Asociar una lista de contactos a una campaña.                |
| `POST` | `/campaigns/:id/start`    | Iniciar el procesamiento de la campaña.                      |
| `POST` | `/campaigns/:id/pause`    | Pausar el procesamiento.                                     |
| `POST` | `/campaigns/:id/resume`   | Reanudar una campaña pausada.                                |
| `GET`  | `/campaigns/:id/progress` | Obtener estadísticas en tiempo real (%, enviados, fallidos). |

---

## ⚙️ Lógica de Procesamiento

El sistema cuenta con un **Motor de Procesamiento Background** (`setInterval`) que:

- Solo procesa campañas en estado `running`.
- Respeta el `rate_limit_per_minute` definido por campaña.
- **Simulación Realista:** Marca el 90% como `sent` y el 10% como `failed` con errores simulados.
- Cambia automáticamente a `finished` cuando no quedan contactos pendientes.

---

## 🚀 Instalación y Configuración

### 1. Clonar y Dependencias

```bash
git clone https://github.com/JeffersonMontoya/apify-campaign-api.git
cd apify-campaign-api
npm install
```

### 2. Variables de Entorno (.env)

El proyecto incluye un archivo `.env.example`.

- **¿Cuál dejar?**: Debes mantener **ambos**.
- El `.env.example` se sube al repositorio como plantilla.
- El `.env` es tu archivo local (ignorado por Git) donde pondrás tus credenciales reales.

```bash
cp .env.example .env
# Luego edita .env con tus datos de PostgreSQL
```

### 3. Base de Datos

Ejecuta el script SQL incluido para crear las tablas:

```bash
# Puedes usar psql o tu cliente favorito con init.sql
```

O usa los scripts automáticos:

```bash
# Crear tablas
npm run db:init

# Insertar contactos de prueba
npm run seed
```

### 4. Ejecución

```bash
# Modo Desarrollo
npm run dev
```

El servidor estará disponible en `http://localhost:3000`.
No olvides visitar `http://localhost:3000/api-docs/` para probar los endpoints interactivamente.
