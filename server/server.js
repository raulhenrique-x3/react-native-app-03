// cloudinary-server.js
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const cloudinary = require('cloudinary').v2;

// Configure sua conta do Cloudinary
cloudinary.config({
  cloud_name: 'dxfdy9lxc',
  api_key: '459962585235771',
  api_secret: 'eQqI2IDyLTKJQTEfvC4ACir-Jvo',
});

const app = express();
const PORT = 3001;

app.use(cors());
app.use(bodyParser.json());

// ✅ Listar imagens com uma tag (usa o upload_preset como tag)
app.get('/images', async (req, res) => {
  const { tag = 'aula8ifpe' } = req.query;

  try {
    const result = await cloudinary.api.resources_by_tag(tag, {
      type: 'upload',
      prefix: '',
      max_results: 100,
    });
    res.json(result.resources);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao buscar imagens' });
  }
});

// ✅ Deletar imagem por public_id
app.delete('/delete-image', async (req, res) => {
  const { public_id } = req.body;

  if (!public_id) {
    return res.status(400).json({ error: 'public_id é obrigatório' });
  }

  try {
    const result = await cloudinary.uploader.destroy(public_id);
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao deletar imagem' });
  }
});

// Inicia o servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://10.31.88.99:${PORT}`);
});