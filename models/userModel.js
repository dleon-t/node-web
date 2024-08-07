// userModel.js
const { Request, TYPES } = require('tedious');
const connection = require('../config/conexion');
const bcrypt = require('bcryptjs');

async function getUsers() {
    const query = 'SELECT Id, nombre, user_nombre FROM usuarios';
    const result = await executeQuery(query);
    return result.rows.map(row => ({
        Id: row[0].value,
        nombre: row[1].value,
        user_nombre: row[2].value
    }));
}

async function updateUser(id, nombre, usuario) {
    const query = `UPDATE Usuarios SET nombre = @Nombre, Usuario = @Usuario WHERE Id = @Id`;

    return executeQuery(query, [
        { name: 'nombre', type: TYPES.NVarChar, value: nombre },
        { name: 'user_name', type: TYPES.NVarChar, value: usuario },
        { name: 'Id', type: TYPES.Int, value: id }
    ]);
}

async function deleteUser(id) {
    const query = `DELETE FROM Usuarios WHERE Id = @Id`;

    return executeQuery(query, [
        { name: 'Id', type: TYPES.Int, value: id }
    ]);
}

async function createUser(nombre, usuario, password) {
    const hashedPassword = await bcrypt.hash(password, 10);
    const query = `INSERT INTO Usuarios (nombre, user_name, contrasena, fechaCreacion) VALUES (@nombre, @user_nombre, @contrasena, @fechaCreacion)`;

    return new Promise((resolve, reject) => {
        const request = new Request(query, (err) => {
            if (err) {
                reject(err);
            } else {
                resolve();
            }
        });

        request.addParameter('nombre', TYPES.NVarChar, nombre);
        request.addParameter('user_nombre', TYPES.NVarChar, usuario);
        request.addParameter('contrasena', TYPES.NVarChar, hashedPassword);
        request.addParameter('fechaCreacion', TYPES.DateTime, new Date());

        connection.execSql(request);
    });
}
/*
function executeQuery(query, parameters = []) {
    return new Promise((resolve, reject) => {
        const request = new Request(query, (err, rowCount, rows) => {
            if (err) {
                reject(err);
            } else {
                resolve({ rowCount, rows });
            }
        });

        parameters.forEach(param => {
            request.addParameter(param.name, param.type, param.value);
        });

        if (connection.state.name === 'LoggedIn') {
            connection.execSql(request);
        } else {
            connection.on('connect', (err) => {
                if (err) {
                    reject(err);
                } else {
                    connection.execSql(request);
                }
            });
        }
    });
}*/
function executeQuery(query, parameters = []) {
    return new Promise((resolve, reject) => {
        const request = new Request(query, (err, rowCount, rows) => {
            if (err) {
                reject(err);
            } else {
                resolve({ rowCount, rows });
            }
        });

        parameters.forEach(param => {
            request.addParameter(param.name, param.type, param.value);
        });

        if (connection.state.name === 'LoggedIn') {
            connection.execSql(request);
        } else {
            connection.on('connect', (err) => {
                if (err) {
                    reject(err);
                } else {
                    connection.execSql(request);
                }
            });
        }
    });
}

async function authenticateUser(usuario, password) {
    const query = 'SELECT * FROM usuarios WHERE user_nombre = @usuario';
    console.log('Query:', query);

    return new Promise((resolve, reject) => {
        const request = new Request(query, async (err, rowCount, rows) => {
            if (err) {
                console.error('Error en la consulta:', err);
                reject(err);
            } else if (rowCount === 0) {
                console.error('Usuario no encontrado:', usuario);
                reject(new Error('Usuario no encontrado'));
            } else {
                // Procesar las filas de resultados
                if (!rows || rows.length === 0 || rows[0].length === 0) {
                    reject(new Error('No se encontraron datos para el usuario especificado'));
                    return;
                }

                // Asumiendo que solo hay un usuario que coincide
                const user = {};
                rows[0].forEach(column => {
                    user[column.metadata.colName] = column.value;
                });

                // Comprobar la contraseña
                const match = await bcrypt.compare(password, user.contrasena);
                if (match) {
                    resolve(user);
                } else {
                    console.error('Contraseña incorrecta para el usuario:', usuario);
                    reject(new Error('Contraseña incorrecta'));
                }
            }
        });

        console.log('Ejecutando consulta para el usuario:', usuario);
        request.addParameter('usuario', TYPES.NVarChar, usuario);
        console.log('Parámetros de la consulta:', { usuario });

        // Asegúrate de que la conexión esté en el estado correcto
        /*
        if (connection.state.name === 'LoggedIn') {
            connection.execSql(request);
        } else {
            connection.on('connect', (err) => {
                if (err) {
                    console.error('Error al conectar:', err);
                    reject(err);
                } else {
                    console.log('Conexión establecida, ejecutando consulta...');
                    connection.execSql(request);
                }
            });
        }*/
    });
}

// Ejemplo de uso
authenticateUser('sa', 'sa')
    .then(user => {
        console.log('Usuario autenticado:', user);
    })
    .catch(err => {
        console.error('Error de autenticación:', err);
    });

module.exports = { authenticateUser };