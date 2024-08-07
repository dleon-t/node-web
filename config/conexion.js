
const Connection = require('tedious').Connection;
const Request = require('tedious').Request;

const config = {
    server: 'DIGITADORSISTEM',
    authentication: {
        type: 'default',
        options: {
            userName: "sistemas",
            password: "sistemas"
        }
    },
    options: {
        port: 1433,
        database: 'RIALTODB',
        trustServerCertificate: true
    }
}

const connection = new Connection(config);

connection.connect();

connection.on('connect', (err) => {
    if (err) {
        console.log("Error al conectarse a la base de datos:", err);
        throw err;
    }
        executeStatement();
});

function executeStatement() {
    console.log("Conectado a la base de datos :)");

    const request = new Request('SELECT * FROM usuarios', (err, rowCount) => {
        if (err) {
            console.error("Error en la consulta:", err);
            connection.close();
            return;
        }
        console.log(`Número de filas devueltas: ${rowCount}`);
        connection.close();
    });

    const results = [];
    
    request.on('row', (columns) => {
        const row = {};
        columns.forEach(column => {
            row[column.metadata.colName] = column.value;
        });
        results.push(row);
    });

    request.on('requestCompleted', () => {
        console.log("Resultados:", results);
    });

    connection.execSql(request);
}


/*
const { Connection } = require('tedious');

const config = {
    server: 'DIGITADORSISTEM',
    authentication: {
        type: 'default',
        options: {
            userName: 'sistemas',
            password: 'sistemas',
        },
    },
    options: {
        port: 1433,
        database: 'RIALTODB',
        trustServerCertificate: true,
    },
};

const connection = new Connection(config);

connection.connect((err) => {
    if (err) {
        console.error('Error al conectarse a la base de datos:', err);
    } else {
        console.log('Conectado a la base de datos :)');
    }
});

module.exports = connection;
*/