CREATE TABLE inscripciones (
    id SERIAL PRIMARY KEY,
    estudiante_id INTEGER NOT NULL,
    curso_id INTEGER NOT NULL,
    fecha TIMESTAMP NOT NULL DEFAULT NOW(),
    UNIQUE (estudiante_id, curso_id)
);

INSERT INTO inscripciones (estudiante_id, curso_id) VALUES
(1, 1),
(2, 1),
(3, 2);
