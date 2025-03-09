require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");
const path = require("path");

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// PostgreSQL Connection
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

// Create table if not exists
pool.query(`
    CREATE TABLE IF NOT EXISTS students (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100),
        email VARCHAR(100) UNIQUE,
        age INTEGER,
        course VARCHAR(50)
    )
`);

// ✅ Serve static HTML files
app.use(express.static("public"));

// ✅ Home Page (Displays Register Button)
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.get("/register", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "register.html"));
});

// Register Student API
app.post("/register", async (req, res) => {
    const { name, email, age, course } = req.body;
    try {
        await pool.query(
            "INSERT INTO students (name, email, age, course) VALUES ($1, $2, $3, $4)",
            [name, email, age, course]
        );
        res.json({ message: "Registration successful!" });
    } catch (err) {
        res.status(500).json({ error: "Error registering student" });
    }
});

// ✅ Use process.env.PORT for Render
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

