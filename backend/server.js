const sql = require('mssql');

const config = {
    server: 'DESKTOP-UD05JRG\MSSQLSERVER01',
    user:'root',
    host:'localhost',
    password:'',
    database:'job',
    options: {
        encrypt: false,
        trustServerCertificate: true,
    }
};

sql.connect(config)
    .then(() => console.log("Connected to MSSQL"))
    .catch(err => console.error("Connection error:", err));