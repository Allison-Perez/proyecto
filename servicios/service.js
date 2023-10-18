const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const app = express();

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'acanner'
});

app.use(bodyParser.json());
app.use(cors());

connection.connect((err) => {
  if (err) {
    console.error('Error al conectar a la base de datos MySQL:', err);
    return;
  }
  console.log('Conexión a MySQL establecida');
});

// Ruta para crear un blog
app.post('/api/blog/create', (req, res) => {
  const { titulo, contenido } = req.body;
  const insertQuery = 'INSERT INTO noticias (titulo, contenido) VALUES (?, ?)';
  connection.query(insertQuery, [titulo, contenido], (err, result) => {
    if (err) {
      console.error('Error al insertar la noticia en la base de datos:', err);
      res.status(500).json({ error: 'No se pudo crear la noticia' });
    } else {
      res.status(200).json({ message: 'Noticia creada exitosamente' });
    }
  });
});

// Ruta para actualizar una noticia por su ID
app.put('/api/blog/update/:id', (req, res) => {
  const { titulo, contenido } = req.body;
  const { id } = req.params;
  const updateQuery = 'UPDATE noticias SET titulo = ?, contenido = ? WHERE id_noticias = ?';
  connection.query(updateQuery, [titulo, contenido, id], (err, result) => {
    if (err) {
      console.error('Error al actualizar la noticia en la base de datos:', err);
      res.status(500).json({ error: 'No se pudo actualizar la noticia' });
    } else {
      res.status(200).json({ message: 'Noticia actualizada exitosamente' });
    }
  });
});

// Ruta para eliminar una noticia por su ID
app.delete('/api/blog/delete/:id', (req, res) => {
  const { id } = req.params;
  const deleteQuery = 'DELETE FROM noticias WHERE id_noticias = ?';
  connection.query(deleteQuery, [id], (err, result) => {
    if (err) {
      console.error('Error al eliminar la noticia de la base de datos:', err);
      res.status(500).json({ error: 'No se pudo eliminar la noticia' });
    } else {
      res.status(200).json({ message: 'Noticia eliminada exitosamente' });
    }
  });
});

// Ruta para obtener la lista de blogs
app.get('/api/blog/list', (req, res) => {
  const selectQuery = 'SELECT * FROM noticias';
  connection.query(selectQuery, (err, results) => {
    if (err) {
      console.error('Error al obtener la lista de noticias:', err);
      res.status(500).json({ error: 'No se pudo obtener la lista de noticias' });
    } else {
      res.status(200).json(results);
    }
  });
});

//ACTIVIDAD

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); 
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); 
  },
});

app.use('/uploads', express.static('uploads'));

const upload = multer({ storage });

// Ruta para subir una actividad con archivo y comentario
app.post('/api/actividad/create', upload.single('archivo'), (req, res) => {
  const { nombreArchivo, comentario } = req.body;
  const archivoUrl = req.file ? `/uploads/${req.file.filename}` : '';

  if (!req.file) {
    console.error('No se ha proporcionado un archivo para subir.');
    res.status(400).json({ error: 'No se ha proporcionado un archivo para subir' });
    return;
  }

  const insertQuery = 'INSERT INTO guias (nombreArchivo, comentario, archivoUrl) VALUES (?, ?, ?)';
  connection.query(insertQuery, [nombreArchivo, comentario, archivoUrl], (err, result) => {
    if (err) {
      console.error('Error al insertar la actividad en la base de datos:', err);
      res.status(500).json({ error: 'No se pudo crear la actividad' });
    } else {
      console.log('http://localhost:3000',archivoUrl)
      res.status(200).json({ message: 'Actividad creada exitosamente: ' });
    }
  });
});


// Ruta para actualizar una actividad por su ID
app.put('/api/actividad/update/:id', upload.single('archivo'), (req, res) => {
  const { nombreArchivo, comentario } = req.body;
  const { id } = req.params;
  const archivoUrl = req.file ? `/uploads/${req.file.filename}` : null; // Manejar la actualización del archivo

  // Verificar si se debe actualizar el archivoUrl
  let updateQuery;
  let queryParams;

  if (archivoUrl) {
    updateQuery = 'UPDATE guias SET nombreArchivo = ?, comentario = ?, archivoUrl = ? WHERE id_guia = ?';
    queryParams = [nombreArchivo, comentario, archivoUrl, id];
  } else {
    updateQuery = 'UPDATE guias SET nombreArchivo = ?, comentario = ? WHERE id_guia = ?';
    queryParams = [nombreArchivo, comentario, id];
  }

  connection.query(updateQuery, queryParams, (err, result) => {
    if (err) {
      console.error('Error al actualizar la actividad en la base de datos:', err);
      res.status(500).json({ error: 'No se pudo actualizar la actividad' });
    } else {
      res.status(200).json({ message: 'Actividad actualizada exitosamente' });
    }
  });
});

// Ruta para eliminar una actividad por su ID
app.delete('/api/actividad/delete/:id', (req, res) => {
  const { id } = req.params;

  const deleteQuery = 'DELETE FROM guias WHERE id_guias = ?';
  connection.query(deleteQuery, [id], (err, result) => {
    if (err) {
      console.error('Error al eliminar la actividad de la base de datos:', err);
      res.status(500).json({ error: 'No se pudo eliminar la actividad' });
    } else {
      res.status(200).json({ message: 'Actividad eliminada exitosamente' });
    }
  });
});

// Ruta para obtener la lista de actividades
app.get('/api/actividad/list', (req, res) => {
  const selectQuery = 'SELECT * FROM guias';
  connection.query(selectQuery, (err, results) => {
    if (err) {
      console.error('Error al obtener la lista de actividades:', err);
      res.status(500).json({ error: 'No se pudo obtener la lista de actividades' });
    } else {
      res.status(200).json(results);
    }
  });
});


//ASISTENCIA


// Ruta para subir una asistencia con archivo y comentario
app.post('/api/asistencia/create', upload.single('archivo'), (req, res) => {
  const { nombreArchivo, comentario } = req.body;
  const archivoUrl = req.file ? `/uploads/${req.file.filename}` : '';

  if (!req.file) {
    console.error('No se ha proporcionado un archivo para subir.');
    res.status(400).json({ error: 'No se ha proporcionado un archivo para subir' });
    return;
  }

  const insertQuery = 'INSERT INTO asistencia (nombreArchivo, comentario, archivoUrl) VALUES (?, ?, ?)';
  connection.query(insertQuery, [nombreArchivo, comentario, archivoUrl], (err, result) => {
    if (err) {
      console.error('Error al insertar la asistencia en la base de datos:', err);
      res.status(500).json({ error: 'No se pudo crear la actividad' });
    } else {
      console.log('http://localhost:3000',archivoUrl)
      res.status(200).json({ message: 'Asistencia creada exitosamente: ' });
    }
  });
});


// Ruta para actualizar una asistencia por su ID
app.put('/api/asistencia/update/:id', upload.single('archivo'), (req, res) => {
  const { nombreArchivo, comentario } = req.body;
  const { id } = req.params;
  const archivoUrl = req.file ? `/uploads/${req.file.filename}` : null; 

  let updateQuery;
  let queryParams;

  if (archivoUrl) {
    updateQuery = 'UPDATE asistencia SET nombreArchivo = ?, comentario = ?, archivoUrl = ? WHERE id_asistencia = ?';
    queryParams = [nombreArchivo, comentario, archivoUrl, id];
  } else {
    updateQuery = 'UPDATE asistencia SET nombreArchivo = ?, comentario = ? WHERE id_asistencia = ?';
    queryParams = [nombreArchivo, comentario, id];
  }

  connection.query(updateQuery, queryParams, (err, result) => {
    if (err) {
      console.error('Error al actualizar la asistencia en la base de datos:', err);
      res.status(500).json({ error: 'No se pudo actualizar la actividad' });
    } else {
      res.status(200).json({ message: 'Asistencia actualizada exitosamente' });
    }
  });
});

// Ruta para eliminar una asistencia por su ID
app.delete('/api/asistencia/delete/:id', (req, res) => {
  const { id } = req.params;

  const deleteQuery = 'DELETE FROM asistencia WHERE id_asistencia = ?';
  connection.query(deleteQuery, [id], (err, result) => {
    if (err) {
      console.error('Error al eliminar la asistencia de la base de datos:', err);
      res.status(500).json({ error: 'No se pudo eliminar la actividad' });
    } else {
      res.status(200).json({ message: 'Asistencia eliminada exitosamente' });
    }
  });
});

// Ruta para obtener la lista de asistencia
app.get('/api/asistencia/list', (req, res) => {
  const selectQuery = 'SELECT * FROM asistencia';
  connection.query(selectQuery, (err, results) => {
    if (err) {
      console.error('Error al obtener la lista de asistencia:', err);
      res.status(500).json({ error: 'No se pudo obtener la lista de asistencia' });
    } else {
      res.status(200).json(results);
    }
  });
});


//Descargar archivos de asistencia
app.get('/api/asistencia/download/:archivo', (req, res) => {
  const archivo = req.params.archivo;
  const rutaArchivo = path.join(__dirname, 'uploads', archivo);
  console.log('Ruta del archivo a descargar:', rutaArchivo);

  res.download(rutaArchivo, (err) => {
    if (err) {
      console.error('Error al descargar el archivo:', err);
      res.status(500).end();
    }
  });
});



//HORARIOS

// Ruta para subir una horarios con archivo y comentario
app.post('/api/horario/create', upload.single('archivo'), (req, res) => {
  const { nombreArchivo, comentario } = req.body;
  const archivoUrl = req.file ? `/uploads/${req.file.filename}` : '';

  if (!req.file) {
    console.error('No se ha proporcionado un archivo para subir.');
    res.status(400).json({ error: 'No se ha proporcionado un archivo para subir' });
    return;
  }

  const insertQuery = 'INSERT INTO horario (nombreArchivo, comentario, archivoUrl) VALUES (?, ?, ?)';
  connection.query(insertQuery, [nombreArchivo, comentario, archivoUrl], (err, result) => {
    if (err) {
      console.error('Error al insertar el horario en la base de datos:', err);
      res.status(500).json({ error: 'No se pudo crear el horario' });
    } else {
      console.log('http://localhost:3000',archivoUrl)
      res.status(200).json({ message: 'Horario creada exitosamente: ' });
    }
  });
});


// Ruta para actualizar un horario por su ID
app.put('/api/horario/update/:id', upload.single('archivo'), (req, res) => {
  const { nombreArchivo, comentario } = req.body;
  const { id } = req.params;
  const archivoUrl = req.file ? `/uploads/${req.file.filename}` : null; 

  let updateQuery;
  let queryParams;

  if (archivoUrl) {
    updateQuery = 'UPDATE horario SET nombreArchivo = ?, comentario = ?, archivoUrl = ? WHERE id_horario = ?';
    queryParams = [nombreArchivo, comentario, archivoUrl, id];
  } else {
    updateQuery = 'UPDATE horario SET nombreArchivo = ?, comentario = ? WHERE id_horario = ?';
    queryParams = [nombreArchivo, comentario, id];
  }

  connection.query(updateQuery, queryParams, (err, result) => {
    if (err) {
      console.error('Error al actualizar el horario en la base de datos:', err);
      res.status(500).json({ error: 'No se pudo actualizar la actividad' });
    } else {
      res.status(200).json({ message: 'Horario actualizada exitosamente' });
    }
  });
});

// Ruta para eliminar una actividad por su ID
app.delete('/api/horario/delete/:id', (req, res) => {
  const { id } = req.params;

  const deleteQuery = 'DELETE FROM horario WHERE id_horario = ?';
  connection.query(deleteQuery, [id], (err, result) => {
    if (err) {
      console.error('Error al eliminar la horario de la base de datos:', err);
      res.status(500).json({ error: 'No se pudo eliminar la actividad' });
    } else {
      res.status(200).json({ message: 'Horario eliminada exitosamente' });
    }
  });
});

// Ruta para obtener la lista de actividades
app.get('/api/horario/list', (req, res) => {
  const selectQuery = 'SELECT * FROM horario';
  connection.query(selectQuery, (err, results) => {
    if (err) {
      console.error('Error al obtener la lista de horarios:', err);
      res.status(500).json({ error: 'No se pudo obtener la lista de horario' });
    } else {
      res.status(200).json(results);
    }
  });
});


app.listen(3000, () => {
  console.log('Todo bien, corriendo en el puerto 3000!');
});
