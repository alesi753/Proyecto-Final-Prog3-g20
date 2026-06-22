-- init.sql — runs once when the Docker Postgres container is first created.
-- Table creation is intentionally left to Sequelize sync() on server boot,
-- which uses the model tableNames (all lowercase snake_case).

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

SELECT 'Base de datos inicializada correctamente' AS status;
