import { NextApiRequest, NextApiResponse } from 'next';
import pool from '../../../lib/db';
// import fs from 'fs';
// import path from 'path';

export const config = {
  api: {
    bodyParser: true,
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { order = 'ASC', limit = 10 } = req.query;

  console.log(req.query);

  if (order.toUpperCase() !== 'ASC' && order.toUpperCase() !== 'DESC') {
    return res.status(400).json({ error: 'Ordenação inválida' });
  }

  if (req.method === 'GET') {
    try {
      console.log(order);
      const result = await pool.query(`SELECT * FROM memory ORDER BY date_memory ${order} LIMIT $1`, [limit]);
      if (result.rows.length === 0) {
        return res.status(204).json({ error: 'Memória não encontrada' });
      }
      res.status(200).json(result.rows);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: 'Erro ao buscar memória' });
    }
  } else {
    res.status(405).json({ error: 'Método não permitido' });
  }
}
