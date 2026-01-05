const mysql = require('mysql2/promise');
require('dotenv').config();

async function getPersonsNames(page = 1, limit = 10) {
    let connection;
    
    try {
        // Basic parameter validation
        page = parseInt(page, 10);
        limit = parseInt(limit, 10);

        if (isNaN(page) || page < 1) {
            page = 1;
        }
        if (isNaN(limit) || limit < 1) {
            limit = 10;
        }

        connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
            port: process.env.DB_PORT || 3306
        });

        const [results] = await connection.execute(
            'CALL sp_get_persons_names(?, ?, @total)',
            [page, limit]
        );

        const [totalResult] = await connection.execute('SELECT @total as total');
        const total = totalResult[0].total;

        const data = results[0];

        return {
            success: true,
            data: {
                persons: data,
                pagination: {
                    page: page,
                    limit: limit,
                    total: total,
                    totalPages: Math.ceil(total / limit)
                }
            },
            error: null
        };
    } catch (error) {
        return {
            success: false,
            data: null,
            error: error.message
        };
    } finally {
        if (connection) {
            await connection.end();
        }
    }
}
module.exports = {getPersonsNames};

