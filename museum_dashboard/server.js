const express = require('express');
const { Pool } = require('pg');

const app = express();
const port = 3000;

const cors = require('cors');
app.use(cors());

// db connection
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'museum',
    password: 'admin',
    port: 5432,
});


// create API endpoint
app.get('/api/top-mediums', async (req, res) => {
    try {
        // run querry
        const result = await pool.query(`
            SELECT medium, COUNT(*) as total_items
            FROM raw_met_objects
            WHERE medium IS NOT NULL AND medium != ''
            GROUP BY medium
            ORDER BY total_items DESC
            LIMIT 30;            
            `);

        // Send data back as JSON
        res.json(result.rows);
    } catch (err) {
        console.error('Error executing query', err.stack);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


// start server
app.listen(port, () => {
    console.log(`Dashboard API running at http://localhost:${port}`);
});
