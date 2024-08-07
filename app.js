const express = require('express');
const bodyParser = require('body-parser');
const userController = require('./controllers/userController');
const userRoutes = require('./routes/userRoutes');
const path = require('path');

const app = express();
const port = 3000;


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// Middleware
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public'))); // Servir archivos estáticos

// Rutas
app.use('/', userRoutes);

// Ruta para la página de inicio de sesión
app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

// Ruta para la página de creación de cuenta
app.get('/crear-cuenta', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'crear-cuenta.html'));
});

// Ruta para la página de usuarios
app.get('/users', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'users.html'));
});

// Ruta para la página principal (opcional)
app.get('/', (req, res) => {
    res.send('¡Hola, mundo! Esta es la página principal.');
});

// Iniciar el servidor
app.listen(port, () => {
    console.log(`Servidor escuchando en http://localhost:${port}/login`);
});