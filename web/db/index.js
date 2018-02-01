import { Pool } from 'pg';

const pool = new Pool({
  database: 'todo',
  host: '127.0.0.1',
  password: 'todo',
  port: 5432,
  user: 'todoadmin',
});

module.exports = {
  query: (text, params) => pool.query(text, params),
};