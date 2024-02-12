const express = require("express");
const bodyParser = require("body-parser");
const mysql = require("mysql2/promise");
const bcrypt = require("bcrypt");
const multer = require('multer');
const cors = require('cors');
const crypto = require('crypto');
const path = require('path');
const { log } = require("console");
const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());

const dbConfig = {
  host: "localhost",
  user: "root",
  password: "111019As",
  database: "acanner",
};

function generarContrasenaTemporal() {
  const longitud = 12;
  return crypto.randomBytes(Math.ceil(longitud / 2))
    .toString('hex')
    .slice(0, longitud);
}

// REGISTRO

app.post("/registro", async (req, res) => {
  try {
    const connection = await mysql.createConnection(dbConfig);

    console.log("Datos del cuerpo de la solicitud:", req.body);


    const {
      primerNombre,
      primerApellido,
      tipoDocumento,
      fechaNacimiento,
      correo,
      segundoNombre,
      segundoApellido,
      documento,
      ficha,
      password,
      idPregunta,
      respuestaPregunta,
    } = req.body;

    const passwordEncriptado = await bcrypt.hash(password, 10);
    console.log("Contraseña encriptada:", passwordEncriptado);


    const sql = `INSERT INTO usuario (primerNombre , primerApellido, tipoDocumento, fechaNacimiento, correo, segundoNombre, segundoApellido, documento, password, idPregunta, respuestaPregunta, idRol, fotoPerfil )
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?)`;

    await connection.execute(sql, [
      primerNombre ,
      primerApellido ,
      tipoDocumento ,
      fechaNacimiento ,
      correo,
      segundoNombre ,
      segundoApellido ,
      documento ,
      passwordEncriptado,
      idPregunta,
      respuestaPregunta,
      2,
      'ruta/a/la/foto.png',
    ]);

    console.log("Usuario creado exitosamente");

    const [lastInsertRow] = await connection.execute("SELECT LAST_INSERT_ID() as lastId");
    const idUsuario = lastInsertRow[0].lastId;

    await connection.execute("INSERT INTO usuarioFicha (idUsuario, idFicha) VALUES (?, ?)", [idUsuario, ficha]);
    console.log("Usuario y ficha registrados exitosamente");


    connection.end();
    res.status(201).json({ message: "Usuario creado exitosamente" });
  } catch (error) {
    console.error("Error al insertar el registro:", error);
    res.status(500).json({ error: "Error al insertar el registro" });
  }
});

// LOGEO

app.post("/login", async (req, res) => {
  try {
    const connection = await mysql.createConnection(dbConfig);
    const { correo, password } = req.body;

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
    res.status(200).json({ message: "Inicio de sesión exitoso",idRol: usuario.idRol });
  } catch (error) {
    console.error("Error en el inicio de sesión:", error);
    res.status(500).json({ error: "Error en el inicio de sesión" });
  }
});


// RECUPERAR CORREO (VERIFICANDO SI EXISTE)

app.post("/recuperar", async (req, res) => {
  try {
    const connection = await mysql.createConnection(dbConfig);
    const { correo } = req.body;

    const [rows] = await connection.execute("SELECT * FROM usuario WHERE correo = ?", [correo]);

    if (rows.length === 0) {
      return res.status(404).json({ message: "Correo no encontrado en la base de datos" });
    }

    connection.end();
    res.status(200).json({ message: "El correo se encuentra registrado en la base de datos" });
  } catch (error) {
    console.error("No se ha podido encontrar el correo ingresado", error);
    res.status(500).json({ error: "Error en la recuperación de contraseña" });
  }
});

// TRAE LA PREGUNTA DE SEGURIDAD

app.get('/api/preguntaSeguridad/:correo', async (req, res) => {
  const correo = req.params.correo;

  console.log(correo);

  try {
    const connection = await mysql.createConnection(dbConfig);

    const sql = `
      SELECT u.idPregunta, p.pregunta
      FROM usuario u
      LEFT JOIN preguntaSeguridad p ON u.idPregunta = p.identificador
      WHERE u.correo = ?`;

    const [rows] = await connection.execute(sql, [correo]);

    await connection.end();

    if (rows.length > 0) {
      const preguntaSeguridad = rows[0].idPregunta;
      const pregunta = rows[0].pregunta;
      res.json({ idPregunta: preguntaSeguridad, pregunta: pregunta });
    } else {
      res.status(404).json({ mensaje: 'Correo no encontrado' });
    }
  } catch (error) {
    console.error('Error al consultar la pregunta de seguridad:', error);
    res.status(500).json({ mensaje: 'Error al consultar la pregunta de seguridad' });
  }
});


// app.get('/api/preguntaSeguridad/:correo', async (req, res) => {
//   const correo = req.params.correo;

//   console.log(correo);

//   try {
//     const connection = await mysql.createConnection(dbConfig);

//     const sql = `
//       SELECT u.idPregunta, p.pregunta
//       FROM usuario u
//       LEFT JOIN preguntaSeguridad p ON u.idPregunta = p.identificador
//       WHERE u.correo = ?`;

//     const [rows] = await connection.execute(sql, [correo]);

//     await connection.end();

//     if (rows.length > 0) {
//       const preguntaSeguridad = rows[0].idPregunta;
//       const pregunta = rows[0].pregunta;
//       res.json({ pregunta: preguntaSeguridad, pregunta: pregunta });
//     } else {
//       res.status(404).json({ mensaje: 'Correo no encontrado' });
//     }
//   } catch (error) {
//     console.error('Error al consultar la pregunta de seguridad:', error);
//     res.status(500).json({ mensaje: 'Error al consultar la pregunta de seguridad' });
//   }
// });


// VERIFICA LA RESPUESTA DE SEGURIDAD Y ASIGNACIÓN DE CONTRASEÑA TEMPORAL

app.post('/api/verificarRespuesta', async (req, res) => {
  try {
    const { correo, respuesta } = req.body;
    console.log('Correo recibido:', correo);
    console.log('Respuesta recibida:', respuesta);

    const connection = await mysql.createConnection(dbConfig);

    const consultaSQL = "SELECT respuestaPregunta FROM usuario WHERE correo = ?";

    const [rows] = await connection.execute(consultaSQL, [correo]);

    if (rows.length > 0) {
      const respuestaCorrecta = rows[0].respuestaPregunta;
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


// MOSTRAR INFORMACIÓN EN EL PERFIL

// app.get('/api/obtener-usuario', async (req, res) => {
//   const correo = req.query.correo;
//   console.log(correo);
//   const sql = `SELECT primer_nombre, segundo_nombre, primer_apellido, segundo_apellido, ficha, correo, password FROM usuario WHERE correo = ?`;

//   try {
//     const connection = await mysql.createConnection(dbConfig);

//     const [rows] = await connection.execute(sql, [correo]);

//     await connection.end();

//     if (rows.length === 1) {
//       const usuario = rows[0];
//       res.json(usuario);
//     } else {
//       res.status(404).json({ error: 'Usuario no encontrado' });
//     }
//   } catch (error) {
//     console.error('Error al obtener el usuario: ' + error);
//     res.status(500).json({ error: 'Error al obtener el usuario' });
//   }
// });


// EDITAR LA INFORMACIÓN DEL PERFIL


// app.post('/api/actualizar-usuario', async (req, res) => {
//   try {
//     const connection = await mysql.createConnection(dbConfig);
//     const { correo } = req.query;
//     const userData = req.body;

//     if (!userData.primerNombre || !userData.segundoNombre || !userData.primerApellido) {
//       return res.status(400).json({ error: 'Campos obligatorios faltantes' });
//     }

//     // Realiza la actualización en la base de datos utilizando el correo
//     const updateSql = `
//       UPDATE usuario
//       SET
//         primer_nombre = ?,
//         segundo_nombre = ?,
//         primer_apellido = ?,
//         segundo_apellido = ?
//       WHERE correo = ?`; // Eliminado "ficha" de la consulta SQL
//     const { primerNombre, segundoNombre, primerApellido, segundoApellido } = userData;
//     const values = [primerNombre, segundoNombre, primerApellido, segundoApellido, correo];

//     await connection.execute(updateSql, values);

//     // Cerrar la conexión y enviar la respuesta
//     connection.end();
//     res.status(200).json({ message: 'Los cambios se guardaron correctamente' });
//   } catch (error) {
//     console.error('Error al actualizar la información del usuario:', error);
//     res.status(500).json({ error: 'Error al actualizar la información del usuario' });
//   }
// });


// CAMBIAR LA CONTRASEÑA ESTANDO LOGEADO


// app.post("/api/cambiar-contrasena", async (req, res) => {
//   try {
//     const { correo, passwordAnterior, nuevaPassword } = req.body;
//     const connection = await mysql.createConnection(dbConfig);

//     // Consultar al usuario en la base de datos por correo
//     const [rows] = await connection.execute("SELECT * FROM usuario WHERE correo = ?", [correo]);
//     if (rows.length === 0) {
//       return res.status(401).json({ message: "Usuario no encontrado" });
//     }

//     const usuario = rows[0];

//     // Verificar la contraseña anterior
//     const match = await bcrypt.compare(passwordAnterior, usuario.password);
//     if (!match) {
//       return res.status(401).json({ message: "La contraseña anterior es incorrecta" });
//     }

//     // Encriptar la nueva contraseña temporal
//     const passwordEncriptado = await bcrypt.hash(nuevaPassword, 10);

//     // Actualizar la contraseña en la base de datos
//     const updateSql = "UPDATE usuario SET password = ? WHERE correo = ?";
//     await connection.execute(updateSql, [passwordEncriptado, correo]);

//     // Cerrar la conexión y enviar la respuesta
//     connection.end();
//     res.status(200).json({ message: "Contraseña cambiada con éxito", nuevaPassword });
//   } catch (error) {
//     console.error("Error al cambiar la contraseña:", error);
//     res.status(500).json({ error: "Error al cambiar la contraseña" });
//   }
// });

// BLOG

// Creación de un nuevo blog
app.post("/crearBlog", async (req, res) => {
  try {
    const { titulo, urlImagen, comentario, fecha, idUsuario, idFicha } = req.body;

    if (titulo && urlImagen && comentario && fecha && idUsuario && idFicha) {
      const connection = await mysql.createConnection(dbConfig);

      const sql = `INSERT INTO blog (nombre, urlImagen, comentario, fecha, idUsuario, idFicha)
                   VALUES (?, ?, ?, ?, ?, ?)`;

      await connection.execute(sql, [titulo, urlImagen, comentario, fecha, idUsuario, idFicha]);
      connection.end();

      res.status(201).json({ message: "Blog creado exitosamente" });
    } else {
      res.status(400).json({ error: "Faltan campos obligatorios para crear el blog" });
    }
  } catch (error) {
    console.error("Error al crear el blog:", error);
    res.status(500).json({ error: "Error al crear el blog" });
  }
});

// Obtener blogs por ficha
app.get("/blogsPorFicha/:idFicha", async (req, res) => {
  try {
    const { idFicha } = req.params;
    const connection = await mysql.createConnection(dbConfig);

    const sql = `SELECT * FROM blog WHERE idFicha = ?`;
    const [rows] = await connection.execute(sql, [idFicha]);

    connection.end();
    res.status(200).json(rows);
  } catch (error) {
    console.error("Error al obtener los blogs por ficha:", error);
    res.status(500).json({ error: "Error al obtener los blogs por ficha" });
  }
});

// Editar y eliminar un blog específico
app.put("/editarBlog/:idBlog", async (req, res) => {
  try {
    const { idBlog } = req.params;
    const { titulo, urlImagen, comentario, fecha } = req.body;
    const connection = await mysql.createConnection(dbConfig);

    const sql = `UPDATE blog SET nombre = ?, urlImagen = ?, comentario = ?, fecha = ? WHERE identificador = ?`;
    await connection.execute(sql, [titulo, urlImagen, comentario, fecha, idBlog]);

    connection.end();
    res.status(200).json({ message: "Blog actualizado exitosamente" });
  } catch (error) {
    console.error("Error al editar el blog:", error);
    res.status(500).json({ error: "Error al editar el blog" });
  }
});

app.delete("/eliminarBlog/:idBlog", async (req, res) => {
  try {
    const { idBlog } = req.params;
    const connection = await mysql.createConnection(dbConfig);

    const sql = `DELETE FROM blog WHERE identificador = ?`;
    await connection.execute(sql, [idBlog]);

    connection.end();
    res.status(200).json({ message: "Blog eliminado exitosamente" });
  } catch (error) {
    console.error("Error al eliminar el blog:", error);
    res.status(500).json({ error: "Error al eliminar el blog" });
  }
});


/// Ruta para crear un blog
// app.post('/api/blog/create', async (req, res) => {
//   try {
//     const connection = await mysql.createConnection(dbConfig); // Crear una nueva conexión

//     const { titulo, contenido } = req.body;
//     const insertQuery = 'INSERT INTO noticias (titulo, contenido) VALUES (?, ?)';

//     await connection.execute(insertQuery, [titulo, contenido]); // Usar la conexión para realizar la consulta

//     // Cerrar la conexión y enviar la respuesta
//     connection.end();
//     res.status(200).json({ message: 'Noticia creada exitosamente' });
//   } catch (error) {
//     console.error('Error al insertar la noticia en la base de datos:', error);
//     res.status(500).json({ error: 'No se pudo crear la noticia' });
//   }
// });

// Ruta para actualizar una noticia por su ID
// app.put('/api/blog/update/:id_noticias', async (req, res) => {
//   try {
//     const connection = await mysql.createConnection(dbConfig); 

//     const { titulo, contenido } = req.body;
//     const { id_noticias } = req.params;
//     const updateQuery = 'UPDATE noticias SET titulo = ?, contenido = ? WHERE id_noticias = ?';

//     await connection.execute(updateQuery, [titulo, contenido, id_noticias]); 

    
//     connection.end();
//     res.status(200).json({ message: 'Noticia actualizada exitosamente' });
//   } catch (error) {
//     console.error('Error al actualizar la noticia en la base de datos:', error);
//     res.status(500).json({ error: 'No se pudo actualizar la noticia' });
//   }
// });

// Ruta para eliminar una noticia por su ID
// app.delete('/api/blog/delete/:id_noticias', async (req, res) => {
//   try {
//     const connection = await mysql.createConnection(dbConfig);

//     const { id_noticias } = req.params;
//     const deleteQuery = 'DELETE FROM noticias WHERE id_noticias = ?';

//     await connection.execute(deleteQuery, [id_noticias]); // Usar la conexión para realizar la consulta

//     // Cerrar la conexión y enviar la respuesta
//     connection.end();
//     res.status(200).json({ message: 'Noticia eliminada exitosamente', id_noticias });
//   } catch (error) {
//     console.error('Error al eliminar la noticia de la base de datos:', error);
//     res.status(500).json({ error: 'No se pudo eliminar la noticia' });
//   }
// });

// Ruta para obtener la lista de blogs
// app.get('/api/blog/list', async (req, res) => {
//   try {
//     const connection = await mysql.createConnection(dbConfig);
//     const selectQuery = 'SELECT * FROM noticias';

//     const [results] = await connection.execute(selectQuery);

//     connection.end();
//     res.status(200).json(results);
//   } catch (error) {
//     console.error('Error al obtener la lista de noticias:', error);
//     res.status(500).json({ error: 'No se pudo obtener la lista de noticias' });
//   }
// });

// Subir Archivos

// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, 'uploads/');
//   },
//   filename: function (req, file, cb) {
//     cb(null, Date.now() + path.extname(file.originalname));
//   },
// });

// app.use('/uploads', express.static('uploads'));
// const upload = multer({ storage });

// ACTIVIDAD

// Ruta para crear una actividad
// app.post('/api/actividad/create', upload.single('archivo'), async (req, res) => {
//   try {
//     const connection = await mysql.createConnection(dbConfig);

//     const { nombreArchivo, comentario } = req.body;
//     const archivoUrl = req.file ? `/uploads/${req.file.filename}` : '';

//     if (!req.file) {
//       console.error('No se ha proporcionado un archivo para subir.');
//       res.status(400).json({ error: 'No se ha proporcionado un archivo para subir' });
//       return;
//     }

//     const insertQuery = 'INSERT INTO guias (nombreArchivo, comentario, archivoUrl) VALUES (?, ?, ?)';

//     await connection.execute(insertQuery, [nombreArchivo, comentario, archivoUrl]);

//     connection.end();
//     res.status(200).json({ message: 'Actividad creada exitosamente' });
//   } catch (error) {
//     console.error('Error al insertar la actividad en la base de datos:', error);
//     res.status(500).json({ error: 'No se pudo crear la actividad' });
//   }
// });

// Ruta para actualizar una actividad por su ID
// app.put('/api/actividad/update/:id_guia', upload.single('archivo'), async (req, res) => {
//   try {
//     const connection = await mysql.createConnection(dbConfig);

//     const { nombreArchivo, comentario } = req.body;
//     const { id_guia } = req.params;
//     const archivoUrl = req.file ? `/uploads/${req.file.filename}` : null;

//     if (!nombreArchivo || !comentario || !id_guia) {
//       return res.status(400).json({ error: 'Campos obligatorios faltantes' });
//     }

//     let updateQuery;
//     let queryParams;

//     if (archivoUrl) {
//       updateQuery = 'UPDATE guias SET nombreArchivo = ?, comentario = ?, archivoUrl = ? WHERE id_guia = ?';
//       queryParams = [nombreArchivo, comentario, archivoUrl, id_guia];
//     } else {
//       updateQuery = 'UPDATE guias SET nombreArchivo = ?, comentario = ? WHERE id_guia = ?';
//       queryParams = [nombreArchivo, comentario, id_guia];
//     }

//     await connection.execute(updateQuery, queryParams);

//     connection.end();
//     res.status(200).json({ message: 'Actividad actualizada exitosamente' });
//   } catch (error) {
//     console.error('Error al actualizar la actividad en la base de datos:', error);
//     res.status(500).json({ error: 'No se pudo actualizar la actividad' });
//   }
// });


// Ruta para eliminar una actividad por su ID
// app.delete('/api/actividad/delete/:id_guia', async (req, res) => {
//   try {
//     const connection = await mysql.createConnection(dbConfig);

//     const { id_guia } = req.params;
//     const deleteQuery = 'DELETE FROM guias WHERE id_guia = ?';

//     await connection.execute(deleteQuery, [id_guia]);

//     connection.end();
//     res.status(200).json({ message: 'Actividad eliminada exitosamente' });
//   } catch (error) {
//     console.error('Error al eliminar la actividad de la base de datos:', error);
//     res.status(500).json({ error: 'No se pudo eliminar la actividad' });
//   }
// });


// Ruta para obtener la lista de actividades
// app.get('/api/actividad/list', async (req, res) => {
//   try {
//     const connection = await mysql.createConnection(dbConfig);
//     const selectQuery = 'SELECT * FROM guias';

//     const [results] = await connection.execute(selectQuery);

//     connection.end();
//     res.status(200).json(results);
//   } catch (error) {
//     console.error('Error al obtener la lista de actividades:', error);
//     res.status(500).json({ error: 'No se pudo obtener la lista de actividades' });
//   }
// });

// ASISTENCIA

// Ruta para crear una asistencia
// app.post('/api/asistencia/create', upload.single('archivo'), async (req, res) => {
//   try {
//     const connection = await mysql.createConnection(dbConfig);

//     const { nombreArchivo, comentario } = req.body;
//     const archivoUrl = req.file ? `/uploads/${req.file.filename}` : '';

//     if (!req.file) {
//       console.error('No se ha proporcionado un archivo para subir.');
//       res.status(400).json({ error: 'No se ha proporcionado un archivo para subir' });
//       return;
//     }

//     const insertQuery = 'INSERT INTO asistencia (nombreArchivo, comentario, archivoUrl) VALUES (?, ?, ?)';

//     await connection.execute(insertQuery, [nombreArchivo, comentario, archivoUrl]);

//     connection.end();
//     res.status(200).json({ message: 'Asistencia creada exitosamente' });
//   } catch (error) {
//     console.error('Error al insertar la asistencia en la base de datos:', error);
//     res.status(500).json({ error: 'No se pudo crear la asistencia' });
//   }
// });

// Ruta para actualizar una asistencia por su ID
// app.put('/api/asistencia/update/:id_asistencia', upload.single('archivo'), async (req, res) => {
//   try {
//     const connection = await mysql.createConnection(dbConfig);

//     const { nombreArchivo, comentario } = req.body;
//     const { id_asistencia } = req.params;
//     const archivoUrl = req.file ? `/uploads/${req.file.filename}` : null;

//     let updateQuery;
//     let queryParams;

//     if (archivoUrl !== null) {
//       updateQuery = 'UPDATE asistencia SET nombreArchivo = ?, comentario = ?, archivoUrl = ? WHERE id_asistencia = ?';
//       queryParams = [nombreArchivo, comentario, archivoUrl, id_asistencia];
//     } else {
//       updateQuery = 'UPDATE asistencia SET nombreArchivo = ?, comentario = ? WHERE id_asistencia = ?';
//       queryParams = [nombreArchivo, comentario, id_asistencia];
//     }

//     await connection.execute(updateQuery, queryParams);

//     connection.end();
//     res.status(200).json({ message: 'Asistencia actualizada exitosamente' });
//   } catch (error) {
//     console.error('Error al actualizar la asistencia en la base de datos:', error);
//     res.status(500).json({ error: 'No se pudo actualizar la asistencia' });
//   }
// });


// Ruta para eliminar una asistencia por su ID
// app.delete('/api/asistencia/delete/:id_asistencia', async (req, res) => {
//   try {
//     const connection = await mysql.createConnection(dbConfig);

//     const { id_asistencia } = req.params;
//     const deleteQuery = 'DELETE FROM asistencia WHERE id_asistencia = ?';

//     await connection.execute(deleteQuery, [id_asistencia]);

//     connection.end();
//     res.status(200).json({ message: 'Asistencia eliminada exitosamente' });
//   } catch (error) {
//     console.error('Error al eliminar la asistencia de la base de datos:', error);
//     res.status(500).json({ error: 'No se pudo eliminar la asistencia' });
//   }
// });

// Ruta para obtener la lista de asistencia
// app.get('/api/asistencia/list', async (req, res) => {
//   try {
//     const connection = await mysql.createConnection(dbConfig);
//     const selectQuery = 'SELECT * FROM asistencia';

//     const [results] = await connection.execute(selectQuery);

//     connection.end();
//     res.status(200).json(results);
//   } catch (error) {
//     console.error('Error al obtener la lista de asistencia:', error);
//     res.status(500).json({ error: 'No se pudo obtener la lista de asistencia' });
//   }
// });


// Descargar archivos de asistencia
// app.get('/api/asistencia/download/:archivo', (req, res) => {
//   const archivo = req.params.archivo;
//   const rutaArchivo = path.join(__dirname, 'uploads', archivo);
//   console.log('Ruta del archivo a descargar:', rutaArchivo);

//   res.download(rutaArchivo, (err) => {
//     if (err) {
//       console.error('Error al descargar el archivo:', err);
//       res.status(500).end();
//     }
//   });
// });

// HORARIOS

// app.post('/api/horario/create',upload.single('archivo'), async (req, res) => {
//   try {
//     const connection = await mysql.createConnection(dbConfig);

//     const { nombreArchivo, comentario } = req.body;
//     const archivoUrl = req.file ? `/uploads/${req.file.filename}` : '';

//     if (!req.file) {
//       console.error('No se ha proporcionado un archivo para subir.');
//       res.status(400).json({ error: 'No se ha proporcionado un archivo para subir' });
//       return;
//     }

//     const insertQuery = 'INSERT INTO horario (nombreArchivo, comentario, archivoUrl) VALUES (?, ?, ?)';

//     await connection.execute(insertQuery, [nombreArchivo, comentario, archivoUrl]);

//     connection.end();
//     res.status(200).json({ message: 'Horario creado exitosamente' });
//   } catch (error) {
//     console.error('Error al insertar el horario en la base de datos:', error);
//     res.status(500).json({ error: 'No se pudo crear el horario' });
//   }
// });

// Ruta para actualizar un horario por su ID
// app.put('/api/horario/update/:id_horario', upload.single('archivo'), async (req, res) => {
//   try {
//     const connection = await mysql.createConnection(dbConfig);

//     const { nombreArchivo, comentario } = req.body;
//     const { id_horario } = req.params;
//     const archivoUrl = req.file ? `/uploads/${req.file.filename}` : null;

//     let updateQuery = 'UPDATE horario SET ';
//     let queryParams = [];

//     if (nombreArchivo !== undefined) {
//       updateQuery += 'nombreArchivo = ?, ';
//       queryParams.push(nombreArchivo);
//     }

//     if (comentario !== undefined) {
//       updateQuery += 'comentario = ?, ';
//       queryParams.push(comentario);
//     }

//     if (archivoUrl !== undefined) {
//       updateQuery += 'archivoUrl = ? ';
//       queryParams.push(archivoUrl);
//     }

//     updateQuery += 'WHERE id_horario = ?';
//     queryParams.push(id_horario);

//     await connection.execute(updateQuery, queryParams);

//     connection.end();
//     res.status(200).json({ message: 'Horario actualizado exitosamente' });
//   } catch (error) {
//     console.error('Error al actualizar el horario en la base de datos:', error);
//     res.status(500).json({ error: 'No se pudo actualizar el horario' });
//   }
// });

// Ruta para eliminar un horario por su ID
// app.delete('/api/horario/delete/:id_horario', async (req, res) => {
//   try {
//     const connection = await mysql.createConnection(dbConfig);

//     const { id_horario } = req.params;
//     const deleteQuery = 'DELETE FROM horario WHERE id_horario = ?';

//     await connection.execute(deleteQuery, [id_horario]);

//     connection.end();
//     res.status(200).json({ message: 'Horario eliminado exitosamente' });
//   } catch (error) {
//     console.error('Error al eliminar el horario de la base de datos:', error);
//     res.status(500).json({ error: 'No se pudo eliminar el horario' });
//   }
// });

// Ruta para obtener la lista de horarios
// app.get('/api/horario/list', async (req, res) => {
//   try {
//     const connection = await mysql.createConnection(dbConfig);
//     const selectQuery = 'SELECT * FROM horario';

//     const [results] = await connection.execute(selectQuery);

//     connection.end();
//     res.status(200).json(results);
//   } catch (error) {
//     console.error('Error al obtener la lista de horarios:', error);
//     res.status(500).json({ error: 'No se pudo obtener la lista de horarios' });
//   }
// });

// app.get("/api/usuarios", async (req, res) => {
//   try {
//     const connection = await mysql.createConnection(dbConfig);
//     const [rows] = await connection.execute("SELECT * FROM usuario");
//     connection.end();
//     res.status(200).json(rows);
//   } catch (error) {
//     console.error("Error al obtener usuarios:", error);
//     res.status(500).json({ error: "Error al obtener usuarios" });
//   }
// });

// ADMIN EDITA USUARIOS

// INTENTO 1, FUNCIONA SI EDITO TODOS LOS CAMPOS

// app.post('/api/modificar-usuarios', async (req, res) => {
//   try {
//     console.log('Entro a la ruta de modificación de usuarios');

//     // Asegúrate de que req.body y req.body.email estén definidos
//     if (!req.body || !req.body.email) {
//       return res.status(400).json({ error: 'Correo electrónico no proporcionado en la solicitud' });
//     }

//     const connection = await mysql.createConnection(dbConfig);
//     const userEmail = req.body.email;
//     const userData = req.body.updatedUser;

//     console.log('Datos del usuario a actualizar:', userData);

//     const [userExists] = await connection.execute('SELECT * FROM usuario WHERE correo = ?', [userEmail]);

//     if (userExists.length === 0) {
//       return res.status(404).json({ error: 'Usuario no encontrado' });
//     }

//     // Realiza la actualización en la base de datos utilizando el correo del usuario
//     const updateSql = `
//       UPDATE usuario
//       SET
//         primer_nombre = ?,
//         primer_apellido = ?,
//         ficha = ?,
//         rol = ?
//       WHERE correo = ?`;

//     const values = [
//       userData.primer_nombre,
//       userData.primer_apellido,
//       userData.ficha,
//       userData.rol,
//       userEmail
//     ];

//     console.log('Consulta SQL:', updateSql);
//     console.log('Valores:', values);

//     await connection.execute(updateSql, values);

//     // Cerrar la conexión y enviar la respuesta
//     connection.end();
//     res.status(200).json({ message: 'Los cambios se guardaron correctamente' });
//   } catch (error) {
//     console.error('Error al actualizar el usuario:', error);
//     res.status(500).json({ error: 'Error interno en el servidor' });
//   }
// });

// app.get('/api/staticsInstructores', async (req, res) => {
//   const sql = `SELECT id_usuario, primer_nombre, segundo_nombre, primer_apellido, segundo_apellido, fecha_nacimiento, ficha, correo FROM usuario WHERE rol = 1`;

// try {
//   const connection = await mysql.createConnection(dbConfig);

//   const [rows] = await connection.execute(sql);

//   await connection.end();

//   if (rows.length > 0) {
//     res.json(rows);
//   } else {
//     res.status(404).json({ error: 'Usuarios no encontrados' });
//   }
// } catch (error) {
//   console.error('Error al obtener los usuarios: ' + error);
//   res.status(500).json({ error: 'Error al obtener los usuarios' });
// }

// });


app.listen(port, () => {
  console.log(`Servidor en ejecución en http://localhost:${port}`);
});
