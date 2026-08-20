# 📦 Control de Inventario DEMO

API REST para la gestión, supervisión y trazabilidad de inventario empresarial.

El proyecto implementa un backend desacoplado desarrollado con **Node.js + Express.js**, conectado a **PostgreSQL**, que proporciona servicios RESTful para administrar productos, categorías, existencias, estadísticas y registros de auditoría.

> **Proyecto DEMO** orientado a demostrar arquitectura backend, diseño de API REST, persistencia relacional, validación, auditoría y buenas prácticas de desarrollo.

---

## 🏗️ Arquitectura

El sistema utiliza una arquitectura cliente-servidor desacoplada:

```text
┌─────────────────────────────┐
│        Frontend SPA         │
│      React + Vite           │
│                             │
│  Dashboard / Inventario     │
│  Filtros / Reportes         │
└──────────────┬──────────────┘
               │ HTTP / REST
               ▼
┌─────────────────────────────┐
│          Backend            │
│       Node.js + Express     │
│                             │
│ Controllers / Routes        │
│ Services / Middleware       │
│ Validation / Error Handler  │
└──────────────┬──────────────┘
               │ SQL
               ▼
┌─────────────────────────────┐
│         PostgreSQL          │
│                             │
│ Categories                  │
│ Products                    │
│ Activity Logs               │
└─────────────────────────────┘
```

El frontend y backend se mantienen como proyectos independientes, permitiendo desplegarlos y evolucionarlos de forma separada.

---

## 🚀 Características principales

### 📊 Dashboard y KPIs

La API proporciona información para construir un dashboard analítico con:

* Total de productos registrados.
* Valor total del inventario en COP.
* Productos con stock bajo.
* Productos agotados.
* Distribución del inventario por categoría.
* Productos que requieren reabastecimiento.
* Historial reciente de operaciones.

### 📦 Gestión de inventario

CRUD completo de productos:

* Crear productos.
* Consultar productos.
* Consultar un producto específico.
* Actualizar información, existencias y precios.
* Eliminar productos.
* Filtrar por nombre o ID.
* Filtrar por categoría.
* Filtrar por estado del inventario.
* Paginación de resultados.
* Ordenamiento de información.

### 📝 Auditoría

Las operaciones importantes generan registros en `activity_logs`.

Se registran acciones como:

* Creación.
* Actualización.
* Eliminación.
* Ajustes de stock.
* Operaciones relacionadas con inventario.

Cada registro almacena:

* Usuario.
* Acción.
* Tipo de acción.
* Detalle.
* Fecha y hora.

### 🛡️ Validación y manejo de errores

El backend incorpora:

* Validación de datos recibidos.
* Consultas SQL parametrizadas.
* Middleware centralizado para manejo de errores.
* Tratamiento de errores específicos de PostgreSQL.
* Respuestas HTTP estructuradas en JSON.

---

# 🛠️ Stack tecnológico

| Tecnología             | Uso                               |
| ---------------------- | --------------------------------- |
| **Node.js**            | Runtime del backend               |
| **Express.js 4.21**    | Framework HTTP y API REST         |
| **PostgreSQL 14+**     | Base de datos relacional          |
| **pg (node-postgres)** | Conexión y consultas a PostgreSQL |
| **dotenv**             | Gestión de variables de entorno   |
| **CORS**               | Control de acceso entre orígenes  |
| **JavaScript**         | Lenguaje principal                |

### Frontend relacionado

| Tecnología       | Uso                    |
| ---------------- | ---------------------- |
| React 19         | Interfaz SPA           |
| Vite 8           | Build tool             |
| Tailwind CSS 3.4 | Estilos                |
| Recharts         | Visualización de datos |
| Lucide React     | Iconografía            |

---

# 🗄️ Modelo de datos

El sistema utiliza PostgreSQL con un modelo relacional compuesto principalmente por tres entidades:

```text
CATEGORIES
     │
     │ 1:N
     ▼
PRODUCTS

ACTIVITY_LOGS
```

## Categories

| Campo        | Tipo         | Descripción       |
| ------------ | ------------ | ----------------- |
| `id`         | SERIAL       | Clave primaria    |
| `name`       | VARCHAR(100) | Nombre único      |
| `created_at` | TIMESTAMPTZ  | Fecha de creación |

## Products

| Campo           | Tipo          | Descripción                |
| --------------- | ------------- | -------------------------- |
| `id`            | VARCHAR(20)   | Identificador del producto |
| `name`          | VARCHAR(255)  | Nombre                     |
| `category_name` | VARCHAR(100)  | Categoría                  |
| `stock`         | INT           | Existencias                |
| `price`         | NUMERIC(15,2) | Precio                     |
| `min_stock`     | INT           | Stock mínimo               |
| `created_at`    | TIMESTAMPTZ   | Fecha de creación          |
| `updated_at`    | TIMESTAMPTZ   | Última actualización       |

## Activity Logs

| Campo         | Tipo         | Descripción        |
| ------------- | ------------ | ------------------ |
| `id`          | SERIAL       | Clave primaria     |
| `username`    | VARCHAR(100) | Usuario            |
| `action`      | VARCHAR(100) | Acción realizada   |
| `details`     | TEXT         | Detalle            |
| `action_type` | VARCHAR(20)  | Tipo de operación  |
| `created_at`  | TIMESTAMPTZ  | Fecha de operación |

---

# 🔒 Integridad y rendimiento

La base de datos implementa diferentes mecanismos para garantizar consistencia y rendimiento.

### Restricciones

Se utilizan restricciones `CHECK` para evitar valores inválidos:

```sql
stock >= 0
price >= 0
min_stock >= 0
```

### Foreign Keys

Los productos mantienen una relación con las categorías mediante una clave foránea.

### Trigger

La base de datos incorpora un trigger para actualizar automáticamente `updated_at` cuando un producto es modificado.

```text
update_products_updated_at
```

### Índices

Se utilizan índices para optimizar consultas frecuentes:

```text
idx_products_category
idx_products_stock
idx_logs_created_at
```

---

# 🌐 API REST

La API utiliza el prefijo:

```text
/api
```

## Health Check

```http
GET /api/health
```

Comprueba el estado del backend y la conexión con PostgreSQL.

## Estadísticas

```http
GET /api/stats
```

Obtiene KPIs y agregaciones del inventario.

## Productos

```http
GET    /api/products
GET    /api/products/:id
POST   /api/products
PUT    /api/products/:id
DELETE /api/products/:id
```

Permite consultar y administrar productos.

## Categorías

```http
GET  /api/categories
POST /api/categories
```

```http
Obtiene el historial de operaciones realizadas en el sistema.
```http
POST /api/db/reset
```
> Este endpoint está destinado principalmente a ambientes de demostración y pruebas.

---

# 📁 Estructura del proyecto

```text
backend/
│
├── src/
│   ├── config/
│   │   └── db.js
│   │
│   ├── controllers/
│   │   ├── categoryController.js
│   │   ├── dbController.js
│   │   ├── logController.js
│   │   ├── productController.js
│   │   └── statsController.js
│   │
│   ├── database/
│   │   ├── initDb.js
│   │   ├── schema.sql
│   │   ├── seed.js
│   │   └── seed.sql
│   │
│   ├── middleware/
│   │   ├── errorHandler.js
│   │   └── validator.js
│   │
│   ├── routes/
│   │   ├── categoryRoutes.js
│   │   ├── dbRoutes.js
│   │   ├── logRoutes.js
│   │   ├── productRoutes.js
│   │   └── statsRoutes.js
│   │
│   ├── services/
│   │   └── inventoryService.js
│   │
│   ├── app.js
│   └── index.js
│
├── package.json
├── package-lock.json
└── README.md
```

---

# ⚙️ Instalación

## 1. Clonar el repositorio

```bash
git clone https://github.com/M4DHUTO/Sistema-de-Inventario-Demo.git
```

Entrar al backend:

```bash
cd Sistema-de-Inventario-Demo/backend
```

## 2. Instalar dependencias

```bash
npm install
```

## 3. Configurar PostgreSQL

Crear una base de datos PostgreSQL para el proyecto.

Las credenciales **no se almacenan en el repositorio**.

Configurar las variables de entorno necesarias, por ejemplo:

```env
PGHOST=localhost
PGPORT=5432
PGDATABASE=inventario_db
PGUSER=postgres
PGPASSWORD=tu_password
```

También puede utilizarse:

```env
DATABASE_URL=postgresql://usuario:password@host:5432/inventario_db
```

> ⚠️ Nunca subir un archivo `.env` con credenciales reales al repositorio.

## 4. Ejecutar el backend

```bash
npm start
```

El servidor quedará disponible según la configuración definida en el proyecto.

---

# 🧪 Desarrollo

Para ejecutar el proyecto en modo desarrollo:

```bash
npm run dev
```

Si el proyecto no tiene definido un script `dev`, utilizar el comando configurado en `package.json`.

---

# 🔐 Seguridad

El proyecto aplica varias prácticas de seguridad:

* Variables de entorno para credenciales.
* `.env` excluido mediante `.gitignore`.
* Consultas SQL parametrizadas.
* Prevención de SQL Injection.
* Validación de datos en el backend.
* CORS configurado para controlar orígenes permitidos.
* Manejo centralizado de errores.
* Restricciones de integridad en PostgreSQL.

Las consultas utilizan parámetros posicionales:

```sql
$1
$2
$3
```

en lugar de concatenar directamente valores proporcionados por el usuario.

---

# 📋 Buenas prácticas aplicadas

* Arquitectura desacoplada.
* Separación de responsabilidades.
* Controllers independientes.
* Services para lógica de negocio.
* Routes modularizadas.
* Middleware para validación y errores.
* Variables de entorno.
* SQL parametrizado.
* Integridad referencial.
* Índices para consultas frecuentes.
* Auditoría de operaciones.
* Código organizado por responsabilidades.

---

# 📌 Estado del proyecto

**Proyecto DEMO / Portafolio**

El objetivo principal es demostrar la implementación de una solución de inventario empresarial utilizando tecnologías modernas de desarrollo web y una arquitectura backend desacoplada.

---

## 👩‍💻 Autor

**M4DHUTO**

Proyecto desarrollado como demostración técnica de:

* Desarrollo Backend.
* APIs REST.
* Node.js.
* Express.js.
* PostgreSQL.
* Diseño de bases de datos.
* Arquitectura de software.
* Buenas prácticas de seguridad.

Reinicia y vuelve a sembrar la base de datos con información DEMO.


## Base de datos

GET /api/logs
```


Permite consultar y crear categorías.

# Sistema-de-Inventario-Demo
