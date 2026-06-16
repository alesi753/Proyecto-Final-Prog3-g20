-- PC Builder — DDL
-- Compatible with PostgreSQL 14+

CREATE TABLE "Categorias" (
  id        SERIAL PRIMARY KEY,
  nombre    VARCHAR(100) NOT NULL,
  "padreId" INTEGER REFERENCES "Categorias"(id) ON DELETE SET NULL
);

CREATE TABLE "Marcas" (
  id     SERIAL PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL
);

CREATE TABLE "Usuarios" (
  id       SERIAL PRIMARY KEY,
  nombre   VARCHAR(100) NOT NULL,
  apellido VARCHAR(100) NOT NULL,
  correo   VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  rol      VARCHAR(20)  NOT NULL DEFAULT 'cliente' CHECK (rol IN ('admin', 'cliente'))
);

CREATE TABLE "Productos" (
  id               SERIAL PRIMARY KEY,
  "categoriaId"    INTEGER        NOT NULL REFERENCES "Categorias"(id),
  "marcaId"        INTEGER        NOT NULL REFERENCES "Marcas"(id),
  modelo           VARCHAR(255)   NOT NULL,
  precio           DECIMAL(10, 2) NOT NULL CHECK (precio >= 0),
  stock            INTEGER        NOT NULL DEFAULT 0 CHECK (stock >= 0),
  especificaciones JSONB          NOT NULL DEFAULT '{}'
);

CREATE TABLE "Carritos" (
  id          SERIAL PRIMARY KEY,
  "usuarioId" INTEGER   NOT NULL UNIQUE REFERENCES "Usuarios"(id) ON DELETE CASCADE,
  "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE "Carrito_Item" (
  id           SERIAL PRIMARY KEY,
  "carritoId"  INTEGER NOT NULL REFERENCES "Carritos"(id) ON DELETE CASCADE,
  "productoId" INTEGER NOT NULL REFERENCES "Productos"(id),
  cantidad     INTEGER NOT NULL CHECK (cantidad > 0),
  CONSTRAINT idx_carrito_producto_unique UNIQUE ("carritoId", "productoId")
);

CREATE TABLE "Ordenes" (
  id              SERIAL PRIMARY KEY,
  "usuarioId"     INTEGER        NOT NULL REFERENCES "Usuarios"(id),
  "precioTotal"   DECIMAL(10, 2) NOT NULL CHECK ("precioTotal" >= 0),
  estado          VARCHAR(20)    NOT NULL DEFAULT 'pendiente' CHECK (estado IN ('pendiente', 'pagado', 'preparando', 'enviado', 'entregado', 'cancelado')),
  "fechaCreacion" TIMESTAMP      NOT NULL DEFAULT NOW()
);

CREATE TABLE "Orden_Item" (
  id                SERIAL PRIMARY KEY,
  "ordenId"         INTEGER        NOT NULL REFERENCES "Ordenes"(id) ON DELETE CASCADE,
  "productoId"      INTEGER        NOT NULL REFERENCES "Productos"(id),
  cantidad          INTEGER        NOT NULL CHECK (cantidad > 0),
  "precioAlComprar" DECIMAL(10, 2) NOT NULL CHECK ("precioAlComprar" >= 0),
  CONSTRAINT idx_orden_producto_unique UNIQUE ("ordenId", "productoId")
);

-- Indexes
CREATE INDEX ON "Productos"("categoriaId");
CREATE INDEX ON "Productos"("marcaId");
CREATE INDEX ON "Productos" USING GIN (especificaciones);
CREATE INDEX ON "Carritos"("usuarioId");
CREATE INDEX ON "Carrito_Item"("carritoId");
CREATE INDEX ON "Carrito_Item"("productoId");
CREATE INDEX ON "Ordenes"("usuarioId");
CREATE INDEX ON "Orden_Item"("ordenId");
CREATE INDEX ON "Orden_Item"("productoId");
CREATE INDEX ON "Categorias"("padreId");
