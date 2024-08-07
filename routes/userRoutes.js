const express = require('express');
const userController = require('../controllers/userController');
const { Connection, Request } = require('tedious');
const bcrypt = require('bcryptjs');
const connection = require('../config/conexion');
const router = express.Router();

router.post('/register', userController.register);
router.post('/login', userController.login);

router.get('/users', userController.getUsers);
router.post('/users', userController.createUser);
router.put('/users/:id', userController.updateUser);
//router.post('/users', userController.createUser);
router.delete('/users/:id', userController.deleteUser);


// Obtener todos los usuarios
router.get('/users', (req, res) => {
    const query = 'SELECT * FROM usuarios';
    const request = new Request(query, (err, rowCount, rows) => {
        if (err) {
            console.error('Error al obtener usuarios:', err);
            res.status(500).send('Error al obtener usuarios');
        } else {
            res.json(rows.map(row => ({
                Id: row[0].value,
                nombre: row[1].value,
                user_nombre: row[2].value,
                contrasena: row[3].value,
            })));
        }
    });

    connection.execSql(request);
});

// Crear un nuevo usuario
router.post('/users', async (req, res) => {
    const { nombre, usuario, contraseña } = req.body;
    const hashedPassword = await bcrypt.hash(contraseña, 10);
    const query = `INSERT INTO Usuarios (nombre, user_nombre, contrasena) VALUES (@Nombre, @Usuario, @Contraseña)`;
    
    const request = new Request(query, (err) => {
        if (err) {
            console.error('Error al crear usuario:', err);
            res.status(500).send('Error al crear usuario');
        } else {
            res.status(201).send('Usuario creado exitosamente');
        }
    });

    request.addParameter('nombre', TYPES.NVarChar, nombre);
    request.addParameter('user_nombre', TYPES.NVarChar, usuario);
    request.addParameter('contrasena', TYPES.NVarChar, hashedPassword);

    connection.execSql(request);
});

// Actualizar un usuario
router.put('/users/:id', async (req, res) => {
    const { id } = req.params;
    const { nombre, contrasena } = req.body;
    let query = `UPDATE Usuarios SET Nombre = @Nombre`;
    if (contrasena) {
        const hashedPassword = await bcrypt.hash(contrasena, 10);
        query += `, Contraseña = @Contraseña`;
    }
    query += ` WHERE Id = @Id`;

    const request = new Request(query, (err) => {
        if (err) {
            console.error('Error al actualizar usuario:', err);
            res.status(500).send('Error al actualizar usuario');
        } else {
            res.send('Usuario actualizado exitosamente');
        }
    });

    request.addParameter('Nombre', TYPES.NVarChar, nombre);
    request.addParameter('Id', TYPES.Int, id);
    if (contrasena) {
        request.addParameter('Contraseña', TYPES.NVarChar, hashedPassword);
    }

    connection.execSql(request);
});

// Eliminar un usuario
router.delete('/users/:id', (req, res) => {
    const { id } = req.params;
    const query = `DELETE FROM Usuarios WHERE Id = @Id`;

    const request = new Request(query, (err) => {
        if (err) {
            console.error('Error al eliminar usuario:', err);
            res.status(500).send('Error al eliminar usuario');
        } else {
            res.send('Usuario eliminado exitosamente');
        }
    });

    request.addParameter('Id', TYPES.Int, id);

    connection.execSql(request);
});

module.exports = router;