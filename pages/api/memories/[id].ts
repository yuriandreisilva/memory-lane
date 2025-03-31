import { NextApiRequest, NextApiResponse } from 'next';
import pool from '../../../lib/db';
import fs from 'fs';
import path from 'path';
import { IncomingForm } from 'formidable';

export const config = {
  api: {
    bodyParser: false,
  },
};


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (req.method === 'GET') {
    try {
      const result = await pool.query('SELECT * FROM memory WHERE id = $1', [id]);
      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Memória não encontrada' });
      }
      res.status(200).json(result.rows[0]);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: 'Erro ao buscar memória' });
    }
  } else if (req.method === 'PUT') {
    
    
    const form = new IncomingForm({ uploadDir: false, keepExtensions: false });
    console.log(form);
    console.log('request:', req.headers);

    form.parse(req, async (err, fields, files) => {
      if (err) {
        return res.status(500).json({ error: 'Erro ao processar os dados' });
      }
    
      let { title, description, date_memory } = fields;
    
      if (typeof title !== 'string') {
        title = String(title);
      }
    
      if (typeof description !== 'string') {
        description = String(description);
      }
    
      console.log('campos:', title, description, date_memory)
      console.log('types:', typeof title, typeof description, typeof date_memory)
      
      if (!title || !description || !date_memory) {
        return res.status(400).json({ error: 'Todos os campos são obrigatórios: título, descrição e data.' });
      }
    
      try {
        
        const updateResult = await pool.query(
          'UPDATE memory SET title = $1, description = $2, date_memory = $3, updated_at = CURRENT_TIMESTAMP WHERE id = $4 RETURNING *',
          [title, description, date_memory, id]
        );
    
        
        if (updateResult.rows.length === 0) {
          return res.status(404).json({ error: 'Memória não encontrada' });
        }
    
        res.status(200).json(updateResult.rows[0]);
      } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Erro ao editar a memória' });
      }
    });   
  } else if (req.method === 'DELETE') {
    
    try {
      const result = await pool.query('SELECT * FROM memory WHERE id = $1', [id]);
      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Memória não encontrada' });
      }

      const imagePath = result.rows[0].image;
      
      if (fs.existsSync(path.join('public/images', imagePath))) {
        fs.unlinkSync(path.join('public/images', imagePath));
      }
      
      const deleteResult = await pool.query('DELETE FROM memory WHERE id = $1 RETURNING *', [id]);

      console.log(deleteResult);

      res.status(200).json({ message: 'Memória excluída com sucesso' });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: 'Erro ao excluir memória' });
    }
  } else {
    res.status(405).json({ error: 'Método não permitido' });
  }
}
