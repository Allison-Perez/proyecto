const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mysql = require('mysql');

const app = express();

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'acanner',
});

db.connect((err) => {
  if (err) {
    console.error('Error al conectar a la base de datos: ' + err.stack);
    return;
  }
  console.log('Conexión a la base de datos establecida');
});

app.use(cors());
app.use(bodyParser.json());

app.get('/api/perfiles', (req, res) => {
  const sql = 'SELECT * FROM perfiles';
  db.query(sql, (err, result) => {
    if (err) {
      console.error('Error al obtener perfiles: ' + err.message);
      res.status(500).json({ error: 'Error interno del servidor' });
      return;
    }
    res.status(200).json({ message: 'Datos de perfil obtenidos correctamente', perfiles: result });
  });
});

app.post('/api/perfiles', (req, res) => {
  const { nombre, foto, numero_ficha, correo_electronico, trimestre } = req.body;
  const sql = 'INSERT INTO perfiles (nombre, foto, numero_ficha, correo_electronico, trimestre) VALUES (?, ?, ?, ?, ?)';
  db.query(sql, [nombre, foto, numero_ficha, correo_electronico, trimestre], (err, result) => {
    if (err) {
      console.error('Error al insertar perfil: ' + err.message);
      res.status(500).json({ error: 'Error interno del servidor' });
      return;
    }
    res.status(201).json({ message: 'Perfil creado con éxito' });
  });
});
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Servidor en funcionamiento en el puerto ${port}`);
});
