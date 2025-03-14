const sql = require('mssql');

const config = {
    server: 'DESKTOP-UD05JRG\\MSSQLSERVER01',  // Replace with your SQL Server instance
    database: 'job',  // Your database name
    authentication: {
        type: 'ntlm',  // Use ntlm for Windows Authentication
        options: {
            domain: 'DESKTOP-UD05JRG',  // Your domain or computer name
            userName: 'Admin',  // Windows username
        }
    },
    options: {
        encrypt: false,  // Set to true if using Azure SQL
        enableArithAbort: true,
        trustServerCertificate: true  // Sometimes needed for self-signed certificates
    }
};

sql.connect(config)
    .then(() => console.log("Connected to MSSQL using Windows Authentication"))
    .catch(err => console.error("Connection error:", err));