CREATE TABLE cursos (
    id SERIAL PRIMARY KEY,
    titulo VARCHAR(150) NOT NULL,
    instructor VARCHAR(100) NOT NULL,
    precio DECIMAL(10,2) NOT NULL CHECK (precio >= 0),
    total_lecciones INTEGER NOT NULL CHECK (total_lecciones > 0)
);

INSERT INTO cursos (titulo, instructor, precio, total_lecciones) VALUES
('Excel básico', 'María Quispe', 0, 3),
('Inglés para turismo', 'John Smith', 50, 5),
('Emprendimiento digital', 'Rosa Huamán', 30, 4);
