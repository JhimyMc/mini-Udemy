const request = require('supertest');
const app = require('../src/app');
const pool = require('../src/db');

afterAll(async () => {
    await pool.end();
});

test('X1 - GET /health responde correctamente', async () => {
    const response = await request(app).get('/health');
    expect(response.statusCode).toBe(200);
    expect(response.body.servicio).toBe('certificados');
});

test('X2 - POST /certificados con progreso incompleto (33 %) responde 400', async () => {
    const response = await request(app).post('/certificados').send({ inscripcion_id: 2 });
    expect(response.statusCode).toBe(400);
    expect(response.body.error).toBe('El curso no está completado');
});

test('X3 - POST /certificados con inscripción inexistente responde 400', async () => {
    const response = await request(app).post('/certificados').send({ inscripcion_id: 9999 });
    expect(response.statusCode).toBe(400);
});

test('X4 - Emitir (100 %), verificar por código y rechazar duplicado', async () => {
    let id;
    try {
        const emitido = await request(app).post('/certificados').send({ inscripcion_id: 1 });
        id = emitido.body.id;
        expect(emitido.statusCode).toBe(201);
        expect(emitido.body.codigo).toMatch(/^MU-[0-9A-F]{8}$/);

        const verificado = await request(app).get(`/certificados/codigo/${emitido.body.codigo}`);
        expect(verificado.statusCode).toBe(200);

        const duplicado = await request(app).post('/certificados').send({ inscripcion_id: 1 });
        expect(duplicado.statusCode).toBe(409);
    } finally {
        if (id) await pool.query('DELETE FROM certificados WHERE id = $1', [id]);
    }
});

test('X5 - GET /certificados/codigo/MU-NOEXISTE responde 404', async () => {
    const response = await request(app).get('/certificados/codigo/MU-NOEXISTE');
    expect(response.statusCode).toBe(404);
});
