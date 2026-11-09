require('dotenv').config();
const app = require('./app');

const PORT = process.env.PORT || 3003;

app.listen(PORT, () => {
    console.log(`Servicio de inscripciones ejecutándose en http://localhost:${PORT}`);
});
