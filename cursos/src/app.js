const express = require('express');
const pool = require('./db');

const app = express();

app.use(express.json());

const validarCurso = (datos) => {
  const { titulo, instructor, precio, total_lecciones } = datos;

  if (!titulo || !instructor || precio === undefined ||
      precio === null || total_lecciones === undefined ||
      total_lecciones === null) {
    return 'Todos los campos son obligatorios';
  }

  if (typeof titulo !== 'string' || typeof instructor !== 'string') {
    return 'El título y el instructor deben ser texto';
  }

  if (typeof precio !== 'number' || precio < 0) {
    return 'El precio debe ser un número mayor o igual a cero';
  }

  if (!Number.isInteger(total_lecciones) || total_lecciones <= 0) {
    return 'El total de lecciones debe ser un entero mayor a cero';
  }

  return null;
};

// Verificar estado del servicio
app.get('/health', (req, res) => {
  res.json({ estado: 'ok', servicio: 'cursos' });
});

// Listar todos los cursos
app.get('/cursos', async (req, res) => {
  try {
    const resultado = await pool.query('SELECT * FROM cursos ORDER BY id');
    res.json(resultado.rows);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener cursos' });
  }
});

// Obtener un curso por ID
app.get('/cursos/:id', async (req, res) => {
  try {
    const resultado = await pool.query(
      'SELECT * FROM cursos WHERE id = $1',
      [req.params.id]
    );

    if (resultado.rows.length === 0) {
      return res.status(404).json({ error: 'Curso no encontrado' });
    }

    res.json(resultado.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener el curso' });
  }
});

// Registrar un curso
app.post('/cursos', async (req, res) => {
  const errorValidacion = validarCurso(req.body);

  if (errorValidacion) {
    return res.status(400).json({ error: errorValidacion });
  }

  try {
    const { titulo, instructor, precio, total_lecciones } = req.body;

    const resultado = await pool.query(
      `INSERT INTO cursos (titulo, instructor, precio, total_lecciones)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [titulo, instructor, precio, total_lecciones]
    );

    res.status(201).json(resultado.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Error al registrar el curso' });
  }
});

// Actualizar un curso
app.put('/cursos/:id', async (req, res) => {
  const errorValidacion = validarCurso(req.body);

  if (errorValidacion) {
    return res.status(400).json({ error: errorValidacion });
  }

  try {
    const { titulo, instructor, precio, total_lecciones } = req.body;

    const resultado = await pool.query(
      `UPDATE cursos
       SET titulo = $1, instructor = $2, precio = $3, total_lecciones = $4
       WHERE id = $5 RETURNING *`,
      [titulo, instructor, precio, total_lecciones, req.params.id]
    );

    if (resultado.rows.length === 0) {
      return res.status(404).json({ error: 'Curso no encontrado' });
    }

    res.json(resultado.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar el curso' });
  }
});

// Eliminar un curso
app.delete('/cursos/:id', async (req, res) => {
  try {
    const resultado = await pool.query(
      'DELETE FROM cursos WHERE id = $1 RETURNING *',
      [req.params.id]
    );

    if (resultado.rows.length === 0) {
      return res.status(404).json({ error: 'Curso no encontrado' });
    }

    res.json({
      mensaje: 'Curso eliminado',
      curso: resultado.rows[0]
    });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar el curso' });
  }
});

module.exports = app;
