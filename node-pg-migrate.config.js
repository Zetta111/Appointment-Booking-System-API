require('dotenv').config();
const path = require('path');

module.exports = {
    migrationsTable: 'pgmigrations',
    dir: path.join(__dirname, 'db', 'migrations'),
    databaseUrl: process.env.DATABASE_URL,
};
