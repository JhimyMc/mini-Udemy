CREATE TABLE certificados (
    id SERIAL PRIMARY KEY,
    inscripcion_id INTEGER UNIQUE NOT NULL,
    codigo VARCHAR(20) UNIQUE NOT NULL,
    fecha_emision TIMESTAMP NOT NULL DEFAULT NOW()
);
