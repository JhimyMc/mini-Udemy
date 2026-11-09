const request = require('supertest');
const app = require('../src/app');
const pool = require('../src/db');

describe('Microservicio Cursos', () => {
  afterAll(async () => {
    await pool.end();
  });

  // C1: Verificar estado del servicio
  test('C1 - GET /health debe responder correctamente', async () => {
    const response = await request(app).get('/health');

    expect(response.status).toBe(200);
    expect(response.body.servicio).toBe('cursos');
  });

  // C2: Listar cursos
  test('C2 - GET /cursos debe listar los cursos', async () => {
    const response = await request(app).get('/cursos');

    expect(response.status).toBe(200);
    expect(response.body.length).toBeGreaterThan(0);
  });

  // C3: Obtener un curso existente
  test('C3 - GET /cursos/1 debe devolver el curso', async () => {
    const response = await request(app).get('/cursos/1');

    expect(response.status).toBe(200);
    expect(response.body.id).toBe(1);
    expect(response.body.total_lecciones).toBe(3);
  });

  // C4: Buscar un curso inexistente
  test('C4 - GET /cursos/9999 debe responder 404', async () => {
    const response = await request(app).get('/cursos/9999');

    expect(response.status).toBe(404);
    expect(response.body.error).toBe('Curso no encontrado');
  });

  // C5: Rechazar total de lecciones inválido
  test('C5 - POST /cursos debe rechazar cero lecciones', async () => {
    const response = await request(app)
      .post('/cursos')
      .send({
        titulo: 'Curso inválido',
        instructor: 'Prueba',
        precio: 20,
        total_lecciones: 0
      });

    expect(response.status).toBe(400);
  });

  // C6: Rechazar precio negativo
  test('C6 - POST /cursos debe rechazar precio negativo', async () => {
    const response = await request(app)
      .post('/cursos')
      .send({
        titulo: 'Curso inválido',
        instructor: 'Prueba',
        precio: -10,
        total_lecciones: 3
      });

    expect(response.status).toBe(400);
  });

  // C7: Registrar un curso válido
  test('C7 - POST /cursos debe registrar un curso', async () => {
    const response = await request(app)
      .post('/cursos')
      .send({
        titulo: 'Curso de prueba automatizada',
        instructor: 'Jest',
        precio: 25,
        total_lecciones: 4
      });

    expect(response.status).toBe(201);
    expect(response.body.id).toBeDefined();

    await pool.query(
      'DELETE FROM cursos WHERE id = $1',
      [response.body.id]
    );
  });
});