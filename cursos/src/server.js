const app = require('./app');

const PORT = process.env.PORT || 3002;

app.listen(PORT, () => {
  console.log(`Servicio Cursos ejecutándose en el puerto ${PORT}`);
});
