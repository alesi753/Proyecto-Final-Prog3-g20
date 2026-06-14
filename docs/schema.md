# PC Builder — Relational Schema

## ERD

```mermaid
erDiagram
  Categorias {
    integer id PK
    varchar nombre
    integer padreId FK "nullable — null = raíz"
  }

  Marcas {
    integer id PK
    varchar nombre
  }

  Productos {
    integer id PK
    integer categoriaId FK
    integer marcaId FK
    varchar modelo
    decimal precio
    integer stock
    jsonb especificaciones
  }

  Usuarios {
    integer id PK
    varchar nombre
    varchar apellido
    varchar correo
    varchar password
    varchar rol
  }

  Ordenes {
    integer id PK
    integer usuarioId FK
    decimal precioTotal
    varchar estado
    timestamp fechaCreacion
  }

  Orden_Item {
    integer id PK
    integer ordenId FK
    integer productoId FK
    integer cantidad
    decimal precioAlComprar
  }

  Categorias ||--o{ Categorias : "padre de"
  Categorias ||--o{ Productos : "categoriza"
  Marcas     ||--o{ Productos : "fabrica"
  Usuarios   ||--o{ Ordenes   : "realiza"
  Ordenes    ||--|{ Orden_Item : "contiene"
  Productos  ||--o{ Orden_Item : "incluido en"
```

## Design notes

- `Categorias.padreId` is self-referential and nullable. Root nodes (`Componentes`, `Periféricos`, etc.) have `padreId = NULL`. Enables arbitrary-depth trees for compatibility hierarchies (e.g. `Componentes > Procesadores > Procesadores Intel > Procesadores Intel LGA1151`).
- `Productos.especificaciones` is a `jsonb` column. It holds component-specific attributes (`socket`, `ram_type`, `tdp`, `capacidad_gb`, etc.). Compatibility logic at the builder level is resolved by comparing jsonb values across selected components — the motherboard acts as the compatibility hub.
- Cart state is intentionally **not persisted** in the DB. It lives in `localStorage` keyed by `userId`. On checkout, the cart is read, prices are fetched fresh from the DB, and an `Orden` + `Orden_Item` snapshot is written.
- `Orden_Item.precioAlComprar` captures the price at the moment of purchase. `Productos.precio` may change over time; order history must not be affected.
- `Ordenes.estado` should be constrained to an enum: `pendiente | pagado | enviado | cancelado`.
- `Usuarios.rol` should be constrained to an enum: `admin | cliente`.
