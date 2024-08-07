const userModel = require('../models/userModel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const JWT_SECRET = 'chapulin';  // Asegúrate de usar una clave secreta segura

async function register(req, res) {
    try {
        const { nombre, usuario, password } = req.body;
        await userModel.createUser(nombre, usuario, password);
        res.status(201).json({ message: 'Usuario registrado' });
    } catch (error) {
        res.status(500).json({ message: 'Error al registrar el usuario', error: error.message });
    }
}

async function login(req, res) {
    try {
        const { usuario, password } = req.body;
        const user = await userModel.authenticateUser(usuario, password);
        const token = jwt.sign({ id: user.Id, nombre: user.nombre }, JWT_SECRET, { expiresIn: '1h' });
        res.json({ token });
    } catch (error) {
        res.status(401).json({ message: 'Error de autenticación: ' + error.message });
    }
}

async function getUsers(req, res) {
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];

        if (!token) {
            return res.status(401).json({ message: 'Token no proporcionado' });
        }

        jwt.verify(token, JWT_SECRET, async (err, user) => {
            if (err) {
                return res.status(403).json({ message: 'Token no válido' });
            }

            const users = await userModel.getUsers();
            res.json(users);
        });
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al obtener usuarios: ', error: error.message });
    }
}

async function createUser(req, res) {
    try {
        const { nombre, usuario, contraseña } = req.body;
        const hashedPassword = await bcrypt.hash(contraseña, 10);
        await userModel.createUser(nombre, usuario, hashedPassword);
        res.status(201).json({ message: 'Usuario creado exitosamente' });
    } catch (error) {
        res.status(500).json({ message: 'Error al crear usuario: ' + error.message });
    }
}

async function updateUser(req, res) {
    try {
        const { id } = req.params;
        const { nombre, contraseña } = req.body;
        let hashedPassword;

        if (contraseña) {
            hashedPassword = await bcrypt.hash(contraseña, 10);
        }

        await userModel.updateUser(id, nombre, hashedPassword);
        res.json({ message: 'Usuario actualizado exitosamente' });
    } catch (error) {
        res.status(500).json({ message: 'Error al actualizar usuario: ' + error.message });
    }
}

async function deleteUser(req, res) {
    try {
        const { id } = req.params;
        await userModel.deleteUser(id);
        res.json({ message: 'Usuario eliminado exitosamente' });
    } catch (error) {
        res.status(500).json({ message: 'Error al eliminar usuario: ' + error.message });
    }
}

module.exports = { register, login, getUsers, createUser, updateUser, deleteUser };