const request = require('supertest');
const app = require('../src/app');
const pool = require('../src/db');

afterAll(async () => {
    await pool.end();
});

test('I1 - GET /health responde correctamente', async () => {
    const response = await request(app).get('/health');
    expect(response.statusCode).toBe(200);
    expect(response.body.servicio).toBe('inscripciones');
});

test('I2 - GET /inscripciones/1 devuelve una inscripción existente', async () => {
    const response = await request(app).get('/inscripciones/1');
    expect(response.statusCode).toBe(200);
    expect(response.body.curso_id).toBe(1);
});

test('I3 - POST /inscripciones válida responde 201 (consulta Estudiantes y Cursos)', async () => {
    let id;
    try {
        const response = await request(app)
            .post('/inscripciones')
            .send({ estudiante_id: 3, curso_id: 3 });
        id = response.body.id;
        expect(response.statusCode).toBe(201);
    } finally {
        if (id) await pool.query('DELETE FROM inscripciones WHERE id = $1', [id]);
    }
});

test('I4 - POST /inscripciones con estudiante inexistente responde 400', async () => {
    const response = await request(app)
        .post('/inscripciones')
        .send({ estudiante_id: 9999, curso_id: 1 });
    expect(response.statusCode).toBe(400);
    expect(response.body.error).toBe('El estudiante o curso no existe');
});

test('I5 - POST /inscripciones con curso inexistente responde 400', async () => {
    const response = await request(app)
        .post('/inscripciones')
        .send({ estudiante_id: 1, curso_id: 9999 });
    expect(response.statusCode).toBe(400);
});

test('I6 - POST /inscripciones duplicada responde 409', async () => {
    const response = await request(app)
        .post('/inscripciones')
        .send({ estudiante_id: 1, curso_id: 1 });
    expect(response.statusCode).toBe(409);
});
