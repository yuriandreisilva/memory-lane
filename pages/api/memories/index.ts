import { IncomingForm } from 'formidable';
import fs from 'fs';
import path from 'path';
import { NextApiRequest, NextApiResponse } from 'next';
import pool from '../../../lib/db';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const form = new IncomingForm();

  form.parse(req, async (err, fields, files) => {
    if (err) {
      return res.status(500).json({ error: 'Erro ao processar o arquivo' });
    }

    let { title, description, date_memory } = fields;
    const file = files.image && files.image[0];

    if (typeof title !== 'string') {
      title = String(title);
    }

    if (typeof description !== 'string') {
      description = String(description);
    }

    console.log(title, description, date_memory);
    console.log(typeof title, typeof description, typeof date_memory);

    if (!title || !description || !date_memory || !file) {
      return res.status(400).json({ error: 'Todos os campos são obrigatórios: título, descrição, data e imagem.' });
    }

    if (file) {
      const filePath = path.join('images', file.originalFilename);
      fs.renameSync(file.filepath, `public/${filePath}`);
  
      try {
        console.log('INSERT INTO memory (title, description, date_memory, image, created_at, updated_at) VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP) RETURNING *',
          [title, description, date_memory, filePath])
        const result = await pool.query(
          'INSERT INTO memory (title, description, date_memory, image, created_at, updated_at) VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP) RETURNING *',
          [title, description, date_memory, filePath]
        );
  
        res.status(201).json(result.rows[0]);
      } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Erro ao criar memória' });
      }
    }
  });
}
