const sql = require('mssql');

const config = {
    server: 'DESKTOP-UD05JRG\\MSSQLSERVER01',  // Your SQL Server instance
    database: 'job',  // Your database name
    driver: 'ODBC Driver 17 for SQL Server',  // Correct driver name
    options: {
        encrypt: false,  // Set to true if using Azure SQL
        enableArithAbort: true
    }
};

sql.connect(config)
    .then(() => console.log("Connected to MSSQL using SQL Server Authentication"))
    .catch(err => console.error("Connection error:", err));