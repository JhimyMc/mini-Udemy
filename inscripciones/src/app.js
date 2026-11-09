const express = require('express');
const pool = require('./db');

const app = express();
app.use(express.json());

// Consulta otro microservicio: true si existe, false si responde 404, error si falla.
async function existe(url) {
    const respuesta = await fetch(url);
    if (respuesta.status === 404) return false;
    if (!respuesta.ok) throw new Error(`Error al consultar ${url}`);
    return true;
}

async function validarReferencias(estudianteId, cursoId) {
    const [estudiante, curso] = await Promise.all([
        existe(`${process.env.ESTUDIANTES_URL}/estudiantes/${estudianteId}`),
        existe(`${process.env.CURSOS_URL}/cursos/${cursoId}`)
    ]);
    return estudiante && curso;
}

const esEnteroPositivo = (v) => Number.isInteger(Number(v)) && Number(v) > 0;

app.get('/health', (req, res) => {
    res.json({ estado: 'ok', servicio: 'inscripciones' });
});

app.get('/inscripciones', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM inscripciones ORDER BY id');
        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al consultar inscripciones' });
    }
});

app.get('/inscripciones/:id', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM inscripciones WHERE id = $1', [req.params.id]);
        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'Inscripción no encontrada' });
        }
        res.json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al consultar inscripción' });
    }
});

app.post('/inscripciones', async (req, res) => {
    const { estudiante_id, curso_id } = req.body;
    if (!esEnteroPositivo(estudiante_id) || !esEnteroPositivo(curso_id)) {
        return res.status(400).json({ error: 'estudiante_id y curso_id deben ser enteros positivos' });
    }
    try {
        if (!(await validarReferencias(estudiante_id, curso_id))) {
            return res.status(400).json({ error: 'El estudiante o curso no existe' });
        }
    } catch (error) {
        console.error(error);
        return res.status(503).json({ error: 'No se pudo contactar a Estudiantes o Cursos' });
    }
    try {
        const result = await pool.query(
            'INSERT INTO inscripciones (estudiante_id, curso_id) VALUES ($1, $2) RETURNING *',
            [estudiante_id, curso_id]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        if (error.code === '23505') {
            return res.status(409).json({ error: 'El estudiante ya está inscrito en este curso' });
        }
        console.error(error);
        res.status(500).json({ error: 'Error al crear inscripción' });
    }
});

app.delete('/inscripciones/:id', async (req, res) => {
    try {
        const result = await pool.query('DELETE FROM inscripciones WHERE id = $1 RETURNING *', [req.params.id]);
        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'Inscripción no encontrada' });
        }
        res.json({ mensaje: 'Inscripción eliminada', inscripcion: result.rows[0] });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al eliminar inscripción' });
    }
});

module.exports = app;
