# Backend API REST - Control de Inventario DEMO

Backend desacoplado construido con **Node.js**, **Express.js** y **PostgreSQL (`pg`)**, diseñado para alimentar la aplicación de control y trazabilidad de inventario.

---

## 🚀 Requisitos Previos

- **Node.js** v18+ instalado.
- **PostgreSQL** v13+ en ejecución local (o una base de datos PostgreSQL remota en servicios como Neon, Supabase, Railway o Render).

---

## 🛠️ Instalación y Configuración

### 1. Instalar dependencias del backend

```bash
cd backend
npm install
```

### 2. Configurar variables de entorno

Copia el archivo `.env.example` a `.env` si aún no existe y edita los valores con las credenciales de tu PostgreSQL:

```env
PORT=5000
NODE_ENV=development

# Credenciales locales de PostgreSQL
PGHOST=localhost
PGPORT=5432
PGDATABASE=inventario_db
PGUSER=postgres
PGPASSWORD=tu_password_aqui

# O bien usar un connection string de PostgreSQL (ej. Supabase / Neon / Render)
# DATABASE_URL=postgresql://usuario:password@host:5432/inventario_db?sslmode=require

CORS_ORIGIN=http://localhost:5173
```

### 3. Inicializar y Sembrar la Base de Datos

Ejecuta el script automatizado para crear la base de datos `inventario_db`, las tablas (`categories`, `products`, `activity_logs`), triggers, índices y cargar los 18 productos iniciales:

```bash
npm run db:init
```

---

## ▶️ Ejecución del Servidor

### Modo desarrollo (con recarga automática):

```bash
npm run dev
```

### Modo producción:

```bash
npm start
```

El servidor quedará disponible en: `http://localhost:5000`

---

## 📚 Endpoints de la API REST

### 1. Health & Estado del Sistema
- `GET /api/health`: Retorna el estado del servicio y la conexión activa con PostgreSQL.
- `POST /api/db/reset`: Restaura la base de datos al estado inicial con los 18 productos de demostración.
- `POST /api/db/query`: Ejecuta consultas SQL de solo lectura (`SELECT` / `EXPLAIN`).

### 2. Productos (`/api/products`)
- `GET /api/products`: Obtiene la lista de productos. Soporta query parameters:
  - `search`: Búsqueda por ID, nombre o categoría (ej. `?search=Producto 1`).
  - `category`: Filtro por nombre de categoría (ej. `?category=Categoría 1`).
  - `status`: Filtro por estado (`ALL`, `OPTIMAL`, `LOW`, `OUT`).
  - `page` y `limit`: Paginación (ej. `?page=1&limit=10`).
  - `sortBy` y `sortOrder`: Ordenamiento (ej. `?sortBy=stock&sortOrder=DESC`).
- `GET /api/products/:id`: Obtiene un producto por su identificador (ej. `/api/products/PRD-001`).
- `POST /api/products`: Crea un nuevo producto y genera automáticamente un registro en `activity_logs`.
  ```json
  {
    "name": "Nuevo Producto",
    "category": "Categoría 1",
    "stock": 50,
    "price": 125000,
    "minStock": 20
  }
  ```
- `PUT /api/products/:id`: Actualiza un producto existente y genera log de trazabilidad.
- `DELETE /api/products/:id`: Elimina un producto y genera log de trazabilidad.

### 3. Categorías (`/api/categories`)
- `GET /api/categories`: Retorna la lista de categorías y métricas de productos asociados.
- `POST /api/categories`: Registra una nueva categoría (`{ "name": "Nueva Categoría" }`).

### 4. Trazabilidad y Auditoría (`/api/logs`)
- `GET /api/logs`: Retorna los últimos registros de auditoría (`?limit=20&type=CREATE`).
- `POST /api/logs`: Inserta un log manual (ej. al exportar reporte CSV).

### 5. Estadísticas del Dashboard (`/api/stats`)
- `GET /api/stats`: Ejecuta agregaciones SQL de alto rendimiento para calcular:
  - `totalProducts`: Total de ítems activos.
  - `totalValue`: Valorización total en COP sumando `(precio * stock)`.
  - `lowStockCount`: Conteo de ítems con stock menor al mínimo.
  - `outOfStockCount`: Conteo de ítems con 0 unidades.
  - `categoryDistribution`: Distribución agrupada para gráficos.
  - `urgentItems`: Ítems con stock crítico.

---

## 🗄️ Esquema DDL en PostgreSQL

```sql
CREATE TABLE categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE products (
  id VARCHAR(20) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  category_name VARCHAR(100) NOT NULL REFERENCES categories(name) ON UPDATE CASCADE,
  stock INT NOT NULL DEFAULT 0 CHECK (stock >= 0),
  price NUMERIC(15, 2) NOT NULL CHECK (price >= 0),
  min_stock INT NOT NULL DEFAULT 15 CHECK (min_stock >= 0),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE activity_logs (
  id SERIAL PRIMARY KEY,
  username VARCHAR(100) NOT NULL,
  action VARCHAR(100) NOT NULL,
  details TEXT,
  action_type VARCHAR(20) CHECK (action_type IN ('CREATE', 'UPDATE', 'DELETE', 'STOCK_IN', 'EXPORT', 'ALERT')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```
