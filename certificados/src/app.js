const express = require('express');
const crypto = require('crypto');
const pool = require('./db');

const app = express();
app.use(express.json());

// Consulta otro microservicio: devuelve el JSON, null si responde 404, o lanza error.
async function obtener(url) {
    const respuesta = await fetch(url);
    if (respuesta.status === 404) return null;
    if (!respuesta.ok) throw new Error(`Error al consultar ${url}`);
    return respuesta.json();
}

const generarCodigo = () => 'MU-' + crypto.randomBytes(4).toString('hex').toUpperCase();
const esEnteroPositivo = (v) => Number.isInteger(Number(v)) && Number(v) > 0;

app.get('/health', (req, res) => {
    res.json({ estado: 'ok', servicio: 'certificados' });
});

app.get('/certificados', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM certificados ORDER BY id');
        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al consultar certificados' });
    }
});

// Verificación pública: un empleador consulta el código del certificado
app.get('/certificados/codigo/:codigo', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM certificados WHERE codigo = $1', [req.params.codigo]);
        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'Certificado no encontrado' });
        }
        res.json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al verificar certificado' });
    }
});

app.get('/certificados/:id', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM certificados WHERE id = $1', [req.params.id]);
        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'Certificado no encontrado' });
        }
        res.json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al consultar certificado' });
    }
});

app.post('/certificados', async (req, res) => {
    const { inscripcion_id } = req.body;
    if (!esEnteroPositivo(inscripcion_id)) {
        return res.status(400).json({ error: 'inscripcion_id debe ser un entero positivo' });
    }
    let inscripcion, progreso;
    try {
        inscripcion = await obtener(`${process.env.INSCRIPCIONES_URL}/inscripciones/${inscripcion_id}`);
        if (inscripcion) {
            progreso = await obtener(`${process.env.PROGRESO_URL}/progreso/inscripcion/${inscripcion_id}`);
        }
    } catch (error) {
        console.error(error);
        return res.status(503).json({ error: 'No se pudo contactar a Inscripciones o Progreso' });
    }
    if (!inscripcion) {
        return res.status(400).json({ error: 'La inscripción no existe' });
    }
    if (!progreso || progreso.porcentaje !== 100) {
        return res.status(400).json({ error: 'El curso no está completado' });
    }
    try {
        const result = await pool.query(
            'INSERT INTO certificados (inscripcion_id, codigo) VALUES ($1, $2) RETURNING *',
            [inscripcion_id, generarCodigo()]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        if (error.code === '23505') {
            return res.status(409).json({ error: 'Ya existe un certificado para esta inscripción' });
        }
        console.error(error);
        res.status(500).json({ error: 'Error al emitir certificado' });
    }
});

app.delete('/certificados/:id', async (req, res) => {
    try {
        const result = await pool.query('DELETE FROM certificados WHERE id = $1 RETURNING *', [req.params.id]);
        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'Certificado no encontrado' });
        }
        res.json({ mensaje: 'Certificado eliminado', certificado: result.rows[0] });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al eliminar certificado' });
    }
});

module.exports = app;
