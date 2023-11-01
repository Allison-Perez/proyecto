const express = require("express");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const cors = require('cors');
const crypto = require('crypto');
const mysql = require('mysql2/promise');
const multer = require('multer');
const path = require('path');

const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());

const dbConfig = {
  host: "localhost",
  user: "root",
  password: "",
  database: "acanner",
};

let connection;

const initializeConnection = async () => {
  connection = await mysql.createConnection(dbConfig);
};

initializeConnection();

function generarContrasenaTemporal() {
  const longitud = 12;
  return crypto.randomBytes(Math.ceil(longitud / 2))
    .toString('hex')
    .slice(0, longitud);
}

app.post("/login", async (req, res) => {
  try {
    const connection = await mysql.createConnection(dbConfig);
    const { correo, password } = req.body;

    // Consultar al usuario en la base de datos por correo
    const [rows] = await connection.execute("SELECT * FROM usuario WHERE correo = ?", [correo]);
    if (rows.length === 0) {
      return res.status(401).json({ message: "Correo o contraseña incorrectos" });
    }

    const usuario = rows[0];


    const match = await bcrypt.compare(password, usuario.password);
    if (!match) {
      return res.status(401).json({ message: "Correo o contraseña incorrectos" });
    }

    // Cerrar la conexión y enviar la respuesta
    connection.end();
    res.status(200).json({ message: "Inicio de sesión exitoso" });
  } catch (error) {
    console.error("Error en el inicio de sesión:", error);
    res.status(500).json({ error: "Error en el inicio de sesión" });
  }
});

app.post("/registro", async (req, res) => {
  try {
    const connection = await mysql.createConnection(dbConfig);

    const {
      primer_nombre,
      primer_apellido,
      tipo_documento,
      fecha_nacimiento,
      correo,
      segundo_nombre,
      segundo_apellido,
      id_usuario,
      ficha,
      password,
      pregunta_seguridad,
      respuesta_seguridad,
    } = req.body;

    const passwordEncriptado = await bcrypt.hash(password, 10);

    const sql = `INSERT INTO usuario (primer_nombre, primer_apellido, tipo_documento, fecha_nacimiento, correo, segundo_nombre, segundo_apellido, id_usuario, ficha, password, pregunta_seguridad, respuesta_seguridad, rol)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    await connection.execute(sql, [
      primer_nombre,
      primer_apellido,
      tipo_documento,
      fecha_nacimiento,
      correo,
      segundo_nombre,
      segundo_apellido,
      id_usuario,
      ficha,
      passwordEncriptado,
      pregunta_seguridad,
      respuesta_seguridad,
      2
    ]);

    connection.end();
    res.status(201).json({ message: "Usuario creado exitosamente" });
  } catch (error) {
    console.error("Error al insertar el registro:", error);
    res.status(500).json({ error: "Error al insertar el registro" });
  }
});


app.post("/recuperar", async (req, res) => {
  try {
    const connection = await mysql.createConnection(dbConfig);
    const { correo } = req.body;

    const [rows] = await connection.execute("SELECT * FROM usuario WHERE correo = ?", [correo]);

    if (rows.length === 0) {
      return res.status(404).json({ message: "Correo no encontrado en la base de datos" });
    }

    connection.end();
    res.status(200).json({ message: "Correo de recuperación enviado" });
  } catch (error) {
    console.error("Error en la recuperación de contraseña:", error);
    res.status(500).json({ error: "Error en la recuperación de contraseña" });
  }
});


app.get('/api/preguntaSeguridad/:correo', async (req, res) => {
  const correo = req.params.correo;

  console.log(correo);

  try {
    const connection = await mysql.createConnection(dbConfig);

    const sql = `
      SELECT u.pregunta_seguridad, p.descripcionP
      FROM usuario u
      LEFT JOIN preguntaseguridad p ON u.pregunta_seguridad = p.id_pregunta
      WHERE u.correo = ?`;

    const [rows] = await connection.execute(sql, [correo]);

    await connection.end();

    if (rows.length > 0) {
      const preguntaSeguridad = rows[0].pregunta_seguridad;
      const descripcionP = rows[0].descripcionP;
      res.json({ pregunta: preguntaSeguridad, descripcion: descripcionP });
    } else {
      res.status(404).json({ mensaje: 'Correo no encontrado' });
    }
  } catch (error) {
    console.error('Error al consultar la pregunta de seguridad:', error);
    res.status(500).json({ mensaje: 'Error al consultar la pregunta de seguridad' });
  }
});


app.post('/api/verificarRespuesta', async (req, res) => {
  try {
    const { correo, respuesta } = req.body;
    console.log('Correo recibido:', correo);
    console.log('Respuesta recibida:', respuesta);

    const connection = await mysql.createConnection(dbConfig);

    const consultaSQL = "SELECT respuesta_seguridad FROM usuario WHERE correo = ?";

    const [rows] = await connection.execute(consultaSQL, [correo]);

    if (rows.length > 0) {
      const respuestaCorrecta = rows[0].respuesta_seguridad;
      if (respuesta === respuestaCorrecta) {

        const nuevaContrasenaTemporal = generarContrasenaTemporal();
        const passwordEncriptado = await bcrypt.hash(nuevaContrasenaTemporal, 10);

        const actualizacionSQL = "UPDATE usuario SET password = ? WHERE correo = ?";
        const [result] = await connection.execute(actualizacionSQL, [passwordEncriptado, correo]);

        if (result.affectedRows === 1) {
          // Actualización exitosa
          res.json({ esValido: true, contrasenaTemporal: nuevaContrasenaTemporal });
        } else {
          // No se actualizó ninguna fila (posible problema en la consulta SQL)
          res.status(500).json({ error: "Error al actualizar la contraseña temporal" });
        }

      } else {
        // Respuesta incorrecta
        res.json({ esValido: false });
      }
    } else {
      // Correo no encontrado
      res.status(404).json({ mensaje: 'Correo no encontrado' });
    }

    connection.end();
  } catch (error) {
    console.error('Error al verificar la respuesta:', error);
    res.status(500).json({ error: "Error al verificar la respuesta" });
  }
});


app.get('/api/obtener-usuario', async (req, res) => {
  const correo = req.query.correo;
  console.log(correo);
  const sql = `SELECT primer_nombre, segundo_nombre, primer_apellido, segundo_apellido, ficha, correo, password FROM usuario WHERE correo = ?`;

  try {
    const connection = await mysql.createConnection(dbConfig);

    const [rows] = await connection.execute(sql, [correo]);

    await connection.end();

    if (rows.length === 1) {
      const usuario = rows[0];
      res.json(usuario);
    } else {
      res.status(404).json({ error: 'Usuario no encontrado' });
    }
  } catch (error) {
    console.error('Error al obtener el usuario: ' + error);
    res.status(500).json({ error: 'Error al obtener el usuario' });
  }
});



app.post('/api/actualizar-usuario', async (req, res) => {
  try {
    const connection = await mysql.createConnection(dbConfig);
    const { correo } = req.query;
    const userData = req.body;

    // Realiza la actualización en la base de datos utilizando el correo
    const updateSql = `
      UPDATE usuario
      SET
        primer_nombre = ?,
        segundo_nombre = ?,
        primer_apellido = ?,
        segundo_apellido = ?
      WHERE correo = ?`; // Eliminado "ficha" de la consulta SQL
    const { primerNombre, segundoNombre, primerApellido, segundoApellido } = userData;
    const values = [primerNombre, segundoNombre, primerApellido, segundoApellido, correo];

    await connection.execute(updateSql, values);

    // Cerrar la conexión y enviar la respuesta
    connection.end();
    res.status(200).json({ message: 'Los cambios se guardaron correctamente' });
  } catch (error) {
    console.error('Error al actualizar la información del usuario:', error);
    res.status(500).json({ error: 'Error al actualizar la información del usuario' });
  }
});


// HORARIOS, BLOG, ACTIVIDADES , ASISTENCIAS 


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


app.listen(port, () => {
  console.log(`Servidor en ejecución en http://localhost:${port}`);
});