require('dotenv').config(); // Load environment variables from .env
const sql = require('mssql');

const config = {
    server: process.env.DB_SERVER,
    database: process.env.DB_DATABASE,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    options: {
        encrypt: false,
        enableArithAbort: true,
        trustServerCertificate: true
    }
};



sql.connect(config)
    .then(() => console.log("Connected to MSSQL successfully"))
    .catch(err => console.error("Connection error:", err));