const sql = require('mssql');

// Database Configuration (uses hardcoded config or optionally process.env)
const dbConfig = {
    server: "DESKTOP-UD05JRG\\MSSQLSERVER01", // Or use process.env.DB_SERVER
    database: "job",
    user: "myuser",
    password: "password",
    options: {
        encrypt: false,
        enableArithAbort: true,
        trustServerCertificate: true
    }
};

const connectDB = async () => {
    try {
        await sql.connect(dbConfig);
        console.log("✅ Connected to MSSQL successfully");
    } catch (err) {
        console.error("❌ Database connection error:", err);
        process.exit(1);
    }
};

module.exports = { connectDB, sql };
