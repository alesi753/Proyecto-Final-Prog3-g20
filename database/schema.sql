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

CREATE TABLE "Ordenes" (
  id              SERIAL PRIMARY KEY,
  "usuarioId"     INTEGER        NOT NULL REFERENCES "Usuarios"(id),
  "precioTotal"   DECIMAL(10, 2) NOT NULL CHECK ("precioTotal" >= 0),
  estado          VARCHAR(20)    NOT NULL DEFAULT 'pendiente' CHECK (estado IN ('pendiente', 'pagado', 'enviado', 'cancelado')),
  "fechaCreacion" TIMESTAMP      NOT NULL DEFAULT NOW()
);

CREATE TABLE "Orden_Item" (
  id                SERIAL PRIMARY KEY,
  "ordenId"         INTEGER        NOT NULL REFERENCES "Ordenes"(id) ON DELETE CASCADE,
  "productoId"      INTEGER        NOT NULL REFERENCES "Productos"(id),
  cantidad          INTEGER        NOT NULL CHECK (cantidad > 0),
  "precioAlComprar" DECIMAL(10, 2) NOT NULL CHECK ("precioAlComprar" >= 0)
);

-- Indexes
CREATE INDEX ON "Productos"("categoriaId");
CREATE INDEX ON "Productos"("marcaId");
CREATE INDEX ON "Productos" USING GIN (especificaciones);
CREATE INDEX ON "Ordenes"("usuarioId");
CREATE INDEX ON "Orden_Item"("ordenId");
CREATE INDEX ON "Orden_Item"("productoId");
CREATE INDEX ON "Categorias"("padreId");
