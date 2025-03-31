import { Pool } from 'pg';

const pool = new Pool({
  user: 'test',
  host: 'localhost',
  database: 'memory_lane',
  password: 'test123',
  port: 5436,
});

pool.connect()
  .then(client => {
    return client.query("SET CLIENT_ENCODING TO 'UTF8'")
      .then(() => client.release());
  })
  .catch(err => console.error('Erro ao configurar a codificação:', err));

export default pool;
