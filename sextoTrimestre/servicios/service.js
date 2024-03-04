const express = require("express");
const bodyParser = require("body-parser");
const mysql = require("mysql2/promise");
const bcrypt = require("bcrypt");
const multer = require('multer');
const cors = require('cors');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const path = require('path');
const { log } = require("console");
const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());

const dbConfig = {
  host: "localhost",
  user: "root",
  password: "111019As", //111019As
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

    const userInfo = {
      idUsuario: usuario.identificador,
      primerNombre: usuario.primerNombre,
      segundoNombre: usuario.segundoNombre,
      primerApellido: usuario.primerApellido,
      segundoApellido: usuario.segundoApellido,
      correo: usuario.correo,
    };

    // Obtener las fichas asociadas al usuario
    const [fichas] = await connection.execute("SELECT idFicha FROM usuarioFicha WHERE idUsuario = ?", [usuario.identificador]);
    const fichasUsuario = fichas.map(ficha => ficha.idFicha);

    // Generar el token con todas las fichas asignadas
    const token = jwt.sign({ idUsuario: usuario.identificador, fichas: fichasUsuario, correo: usuario.correo }, 'acanner', { expiresIn: '1h' });

    // Cerrar la conexión y enviar la respuesta con el token
    connection.end();
    res.status(200).json({ message: "Inicio de sesión exitoso", idRol: usuario.idRol, userInfo: userInfo, fichas: fichasUsuario, token: token });
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

// VERIFICA RESPUESTA Y MANDA CONTRASEÑA TEMPORAL

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

// MOSTRAR INFORMACIÓN EN EL PERFIL ADMIN

app.get('/api/obtener-usuario', async (req, res) => {
  const correo = req.query.correo;
  console.log(correo);
  const sql = `SELECT primerNombre, segundoNombre, primerApellido, segundoApellido, correo, password FROM usuario WHERE correo = ?`;

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

// Obtener un usuario por correo electrónico 
app.get("/api/obtenerUsuario", async (req, res) => {
  try {
    const { correo } = req.query;
    const connection = await mysql.createConnection(dbConfig);

    const sql = `SELECT * FROM usuario WHERE correo = ?`;
    const [rows] = await connection.execute(sql, [correo]);

    connection.end();
    if (rows.length > 0) {
      res.status(200).json(rows[0]);
    } else {
      res.status(404).json({ error: "Usuario no encontrado" });
    }
  } catch (error) {
    console.error("Error al obtener el usuario por correo:", error);
    res.status(500).json({ error: "Error al obtener el usuario por correo" });
  }
});

// EDITAR LA INFORMACIÓN DEL PERFIL

app.post('/api/actualizar-usuario', async (req, res) => {
  try {
    const connection = await mysql.createConnection(dbConfig);
    const { correo } = req.query;
    const userData = req.body;

    if (!userData.primerNombre || !userData.segundoNombre || !userData.primerApellido) {
      return res.status(400).json({ error: 'Campos obligatorios faltantes' });
    }

    const updateSql = `
      UPDATE usuario
      SET
        primerNombre = ?,
        segundoNombre = ?,
        primerApellido = ?,
        segundoApellido = ?
      WHERE correo = ?`; 
    const { primerNombre, segundoNombre, primerApellido, segundoApellido } = userData;
    const values = [primerNombre, segundoNombre, primerApellido, segundoApellido, correo];

    await connection.execute(updateSql, values);


    connection.end();
    res.status(200).json({ message: 'Los cambios se guardaron correctamente' });
  } catch (error) {
    console.error('Error al actualizar la información del usuario:', error);
    res.status(500).json({ error: 'Error al actualizar la información del usuario' });
  }
});

// CAMBIAR LA CONTRASEÑA ESTANDO LOGEADO

app.post("/api/cambiar-contrasena", async (req, res) => {
  try {
    const { correo, passwordAnterior, nuevaPassword } = req.body;
    const connection = await mysql.createConnection(dbConfig);

    // Consultar al usuario en la base de datos por correo
    const [rows] = await connection.execute("SELECT * FROM usuario WHERE correo = ?", [correo]);
    if (rows.length === 0) {
      return res.status(401).json({ message: "Usuario no encontrado" });
    }

    const usuario = rows[0];

    // Verificar la contraseña anterior
    const match = await bcrypt.compare(passwordAnterior, usuario.password);
    if (!match) {
      return res.status(401).json({ message: "La contraseña anterior es incorrecta" });
    }

    // Encriptar la nueva contraseña temporal
    const passwordEncriptado = await bcrypt.hash(nuevaPassword, 10);

    // Actualizar la contraseña en la base de datos
    const updateSql = "UPDATE usuario SET password = ? WHERE correo = ?";
    await connection.execute(updateSql, [passwordEncriptado, correo]);

    // Cerrar la conexión y enviar la respuesta
    connection.end();
    res.status(200).json({ message: "Contraseña cambiada con éxito", nuevaPassword });
  } catch (error) {
    console.error("Error al cambiar la contraseña:", error);
    res.status(500).json({ error: "Error al cambiar la contraseña" });
  }
});


// ADMIN LISTA USUARIOS

app.get("/api/usuarios", async (req, res) => {
  try {
    const connection = await mysql.createConnection(dbConfig);
    const [rows] = await connection.execute(`
      SELECT
        u.identificador,
        u.documento,
        u.primerNombre,
        u.primerApellido,
        f.numeroFicha,
        u.correo,
        r.nombre as rol
      FROM
        usuario u
      JOIN
        usuarioFicha uf ON u.identificador = uf.idUsuario
      JOIN
        ficha f ON uf.idFicha = f.identificador
      JOIN
        rol r ON u.idRol = r.identificador
    `);

    connection.end();
    res.status(200).json(rows);
  } catch (error) {
    console.error("Error al obtener usuarios:", error);
    res.status(500).json({ error: "Error al obtener usuarios" });
  }
});

// FUNCIÓN PARA REALIZAR UN INSERT A LA TABLA DETALLE USUARIO SOLO SI EL USUARIO NO EXISTE

async function insertarDetalleUsuarioPredeterminado(correo) {
  try {
    const connection = await mysql.createConnection(dbConfig);

    const esInstructorQuery = `
      SELECT idRol FROM usuario
      WHERE correo = ?`;

    const [esInstructorResult] = await connection.execute(esInstructorQuery, [correo]);

    if (esInstructorResult[0].idRol === 1) {
      const existeRegistroQuery = `
        SELECT COUNT(*) AS count
        FROM detalleusuario
        WHERE idUsuario = (SELECT identificador FROM usuario WHERE correo = ? AND idRol = 1)`;

      const [existeRegistroResult] = await connection.execute(existeRegistroQuery, [correo]);

      if (existeRegistroResult[0].count === 0) {
        // Inserta en detalleusuario con datos predeterminados
        const insertDetalleUsuarioQuery = `
          INSERT INTO detalleusuario (fechaIngreso, celular, informacionAcademica, informacionAdicional, idUsuario)
          VALUES (?, ?, ?, ?, (SELECT identificador FROM usuario WHERE correo = ? AND idRol = 1))`;

        const fechaIngresoPredeterminada = '2022-01-01';
        const celularPredeterminado = '123456789';
        const informacionAcademicaPredeterminada = 'Sin información académica';
        const informacionAdicionalPredeterminada = 'Sin información adicional';

        await connection.execute(insertDetalleUsuarioQuery, [
          fechaIngresoPredeterminada,
          celularPredeterminado,
          informacionAcademicaPredeterminada,
          informacionAdicionalPredeterminada,
          correo
        ]);
      }
    }
    else{
      const eliminarDetalleUsuarioQuery = `
        DELETE FROM detalleusuario
        WHERE idUsuario = (SELECT identificador FROM usuario WHERE correo = ?)`;

      await connection.execute(eliminarDetalleUsuarioQuery, [correo]);
    }

    connection.end();
  } catch (error) {
    console.error("Error al insertar en detalleusuario con datos predeterminados:", error);
  }
}

// ADMIN MODIFICA USUARIOS

app.post('/api/modificar-usuarios', async (req, res) => {
  try {
    // Asegúrate de que req.body y req.body.email estén definidos
    if (!req.body || !req.body.email) {
      return res.status(400).json({ error: 'Correo electrónico no proporcionado en la solicitud' });
    }

    const connection = await mysql.createConnection(dbConfig);
    const userEmail = req.body.email;
    const userData = req.body.updatedUser;

    console.log('Datos del usuario a actualizar:', userData);

    // Verificar si el usuario existe
    const [userIdResult] = await connection.execute('SELECT identificador FROM usuario WHERE correo = ?', [userEmail]);

    if (userIdResult.length === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    const userId = userIdResult[0].identificador;

    const [fichaExists] = await connection.execute('SELECT * FROM ficha WHERE identificador = ?', [userData.numeroFicha]);

    if (fichaExists.length === 0) {
      return res.status(404).json({ error: 'Ficha no encontrada' });
    }

    const updateSql = `
      UPDATE usuario
      SET
        primerNombre = ?,
        primerApellido = ?,
        idRol = ?
      WHERE correo = ?`;

    const values = [
      userData.primerNombre,
      userData.primerApellido,
      userData.rol,
      userEmail
    ];

    const updateFichaSql = `
    UPDATE usuarioFicha
    SET idFicha = ?
    WHERE idUsuario = ?`;
  
  const fichaValues = [
    userData.numeroFicha,
    userId
  ];

    console.log('Consulta SQL (Usuario):', updateSql);
    console.log('Valores (Usuario):', values);

    console.log('Consulta SQL (Ficha):', updateFichaSql);
    console.log('Valores (Ficha):', fichaValues);

    await connection.execute(updateSql, values);
    await connection.execute(updateFichaSql, fichaValues);

    // INSERTA A LA TABLA DETALLE USUARIO

    await insertarDetalleUsuarioPredeterminado(userEmail);
    
    connection.end();
    res.status(200).json({ message: 'Los cambios se guardaron correctamente' });
  } catch (error) {
    console.error('Error al actualizar el usuario:', error);
    res.status(500).json({ error: 'Error interno en el servidor' });
  }
});


// LISTADO DE INSTRUCTORES EN ADMIN

app.get('/api/staticsinstructores', async (req, res) => {
  const sql = `
  SELECT
  u.documento,
  u.primerNombre,
  u.segundoNombre,
  u.primerApellido,
  u.segundoApellido,
  u.fechaNacimiento,
  f.numeroFicha,
  u.correo,
  du.celular,
  du.fechaIngreso
FROM
  usuario u
JOIN usuarioFicha uf ON u.identificador = uf.idUsuario
JOIN ficha f ON uf.idFicha = f.identificador
JOIN detalleusuario du ON u.identificador = du.idUsuario;
`
  try {
    const connection = await mysql.createConnection(dbConfig);

    const [rows] = await connection.execute(sql);

    await connection.end();

    if (rows.length > 0) {
      res.json(rows);
    } else {
      res.status(404).json({ error: 'Usuarios no encontrados' });
    }
  } catch (error) {
    console.error('Error al obtener los usuarios: ' + error);
    res.status(500).json({ error: 'Error al obtener los usuarios' });
  }
});

// ADMIN ASIGNA FICHAS

// Lista las fichas

app.get('/api/fichas', async (req, res) => {
  try {
    const connection = await mysql.createConnection(dbConfig);
    const [rows] = await connection.execute('SELECT * FROM ficha');
    connection.end();
    res.status(200).json(rows);
  } catch (error) {
    console.error('Error al obtener la lista de fichas:', error);
    res.status(500).json({ error: 'Error al obtener la lista de fichas' });
  }
});

// Lista a los instructores

app.get('/api/instructores', async (req, res) => {
  try {
    const connection = await mysql.createConnection(dbConfig);
    const [rows] = await connection.execute('SELECT identificador, primerNombre, primerApellido FROM usuario WHERE idRol = 1');
    connection.end();
    res.json(rows);
  } catch (error) {
    console.error('Error al obtener la lista de instructores:', error);
    res.status(500).json({ error: 'Error al obtener la lista de instructores' });
  }
});


// Agregar ficha a un instructor
app.post('/api/asignar-ficha', async (req, res) => {
  try {
    const { idUsuario, idFicha } = req.body;
    console.log(idUsuario, idFicha );
    if (!idUsuario || !idFicha) {
      return res.status(400).json({ error: 'Se requieren idUsuario e idFicha' });
    }

    const connection = await mysql.createConnection(dbConfig);
    const [existingRecord] = await connection.execute(
      'SELECT * FROM usuarioFicha WHERE idUsuario = ? AND idFicha = ?',
      [idUsuario, idFicha]
    );

    if (existingRecord.length > 0) {
      return res.status(400).json({ error: 'Ya existe un registro para este usuario y ficha' });
    }

    const result = await connection.execute('INSERT INTO usuarioFicha (idUsuario, idFicha) VALUES (?, ?)', [idUsuario, idFicha]);
    connection.end();

    res.status(200).json({ message: 'Ficha asignada correctamente' });

  } catch (error) {
    console.error('Error al asignar la ficha al usuario:', error);
    res.status(500).json({ error: 'Error al asignar la ficha al usuario' });
  }
});


// DONA INSTRUCTORES FICHAS

app.get('/api/fichasInstructores', async (req, res) => {
  const sql = `
    SELECT
      f.numeroFicha,
      COUNT(u.idRol) as totalInstructores,
      COUNT(u.idRol) / (SELECT COUNT(*) FROM usuario WHERE idRol = 1) * 100 as porcentajeInstructores
    FROM
      usuario u
    JOIN usuarioFicha uf ON u.identificador = uf.idUsuario
    JOIN ficha f ON uf.idFicha = f.identificador
    WHERE u.idRol = 1
    GROUP BY f.numeroFicha;
  `;

  try {
    const connection = await mysql.createConnection(dbConfig);
    const [rows] = await connection.execute(sql);
    await connection.end();

    if (rows.length > 0) {
      res.json(rows);
    } else {
      res.status(404).json({ error: 'Datos de instructores no encontrados' });
    }
  } catch (error) {
    console.error('Error al obtener datos de instructores: ' + error);
    res.status(500).json({ error: 'Error al obtener datos de instructores' });
  }
});


// ESTADISTICAS ANTIGUEDAD

app.get('/api/antiguedadInstructores', async (req, res) => {
  const sql = `
    SELECT U.identificador AS ID_Instructor, U.primerNombre, U.primerApellido,
             DATEDIFF(CURDATE(), DU.fechaIngreso) AS Antiguedad_Dias
    FROM usuario U
    JOIN detalleusuario DU ON U.identificador = DU.idUsuario
    WHERE U.idRol = 1
    ORDER BY Antiguedad_Dias DESC;
  `;

  try {
    const connection = await mysql.createConnection(dbConfig);

    const [rows] = await connection.execute(sql);

    await connection.end();

    if (rows.length > 0) {
      res.json({ rows });
    } else {
      res.status(404).json({ error: 'Datos de instructores no encontrados' });
    }
  } catch (error) {
    console.error('Error al obtener datos de instructores: ' + error);
    res.status(500).json({ error: 'Error al obtener datos de instructores' });
  }
});


// DONA APRENDICES

app.get('/api/fichasAprendices', async (req, res) => {
  console.log('Entra mi perro');
  const sql = `
    SELECT
      f.numeroFicha,
      COUNT(u.idRol) as totalAprendices,
      COUNT(u.idRol) / (SELECT COUNT(*) FROM usuario WHERE idRol = 2) * 100 as porcentajeAprendices
    FROM
      usuario u
    JOIN usuarioFicha uf ON u.identificador = uf.idUsuario
    JOIN ficha f ON uf.idFicha = f.identificador
    WHERE u.idRol = 2
    GROUP BY f.numeroFicha;
  `;

  try {
    const connection = await mysql.createConnection(dbConfig);
    const [rows] = await connection.execute(sql);
    await connection.end();

    if (rows.length > 0) {
      res.json(rows);
    } else {
      res.status(404).json({ error: 'Datos de instructores no encontrados' });
    }
  } catch (error) {
    console.error('Error al obtener datos de instructores: ' + error);
    res.status(500).json({ error: 'Error al obtener datos de instructores' });
  }
});


//MARLON



// OBTENER INFORMACIÓN DEL PERFIL

app.get("/api/obtenerInstructor", async (req, res) => {
  try {

    const { correo } = req.query;
    const connection = await mysql.createConnection(dbConfig);

    const sql = `
      SELECT
        u.documento,
        u.primerNombre,
        u.segundoNombre,
        u.primerApellido,
        u.segundoApellido,
        u.fechaNacimiento,
        f.numeroFicha,
        u.correo,
        du.celular,
        du.fechaIngreso
      FROM
        usuario u
        JOIN usuarioFicha uf ON u.identificador = uf.idUsuario
        JOIN ficha f ON uf.idFicha = f.identificador
        JOIN detalleusuario du ON u.identificador = du.idUsuario
        WHERE u.idRol = 1 AND u.correo = ?
    `;
    const [rows] = await connection.execute(sql, [correo]);

    connection.end();
    if (rows.length > 0) {
      res.status(200).json(rows[0]);
    } else {
      res.status(404).json({ error: "Usuario no encontrado" });
    }
  } catch (error) {
    console.error("Error al obtener el usuario por correo:", error);
    res.status(500).json({ error: "Error al obtener el usuario por correo" });
  }
});

// EDITAR LA INFORMACIÓN DEL INSTRUCTOR

app.put("/api/actualizarInstructor", async (req, res) => {
  let connection;
  try {
    const { correo } = req.query;
    const userData = req.body;

    if (!userData.primerNombre || !userData.primerApellido || !userData.fechaIngreso || !userData.celular ) {
      return res.status(400).json({ error: 'Todos los campos obligatorios son necesarios' });
    }
    connection = await mysql.createConnection(dbConfig);

    // Actualiza la información en la tabla 'usuario'
    const updateUsuarioSql = `
      UPDATE usuario
      SET
        primerNombre = ?,
        segundoNombre = ?,
        primerApellido = ?,
        segundoApellido = ?
      WHERE correo = ?`;

    const { primerNombre, segundoNombre, primerApellido, segundoApellido } = userData;
    const usuarioValues = [primerNombre, segundoNombre, primerApellido, segundoApellido, correo];

    const [usuarioResult] = await connection.execute(updateUsuarioSql, usuarioValues);

    if (usuarioResult.affectedRows === 0) {
      return res.status(404).json({ error: "Usuario no encontrado o no es un instructor" });
    }

    const detailUser = `
    SELECT identificador FROM detalleusuario
    WHERE idUsuario = (SELECT identificador FROM usuario WHERE correo = ? AND idRol = 1)`
    const dataDatailUser = [correo]

    const resultDetailUser = await connection.execute(detailUser, dataDatailUser)

    if (resultDetailUser) {
      console.log("entra a actualizar")

      const fechaIngreso = new Date(userData.fechaIngreso);
      const fechaIngresoFormateada = fechaIngreso.toISOString().split('T')[0];
      


      const updateDetalleUsuarioSql = `
      UPDATE detalleusuario
      SET
        fechaIngreso = ?,
        celular = ?,
        informacionAcademica = ?,
        informacionAdicional = ?
      WHERE idUsuario = (SELECT identificador FROM usuario WHERE correo = ? AND idRol = 1)`;
    
      const {celular, informacionAcademica, informacionAdicional } = userData; 
      const detalleUsuarioValues = [fechaIngresoFormateada, celular, informacionAcademica, informacionAdicional, correo];


console.log(fechaIngresoFormateada);

      // Ejecuta la actualización en la tabla 'detalleUsuario'
      await connection.execute(updateDetalleUsuarioSql, detalleUsuarioValues);
    }

    // Si llega aquí, las actualizaciones fueron exitosas
    res.status(200).json({ message: 'Los cambios se guardaron correctamente' });
  } catch (error) {
    console.error("Error al editar la información del instructor:", error);
    res.status(500).json({ error: "Error al editar la información del instructor" });
  } finally {
    if (connection) {
      connection.end();
    }
  }
});


// Configuración de multer para manejar archivos adjuntos
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const extname = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + Date.now() + extname);
  }
});

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const upload = multer({ storage: storage }); 

// Ruta para manejar la carga de archivos
app.post('/upload', upload.single('imagenOpcional'), function (req, res) {
  // Procesar la solicitud aquí
  res.send('Archivo subido exitosamente');
});


//BLOG

// Ruta para crear un nuevo blog

app.post("/crearBlog", upload.single('imagenOpcional'), async (req, res) => {
  try {
    const { nombre, comentario, idUsuario, idFicha } = req.body;
    let urlImagen = ''; 

    if (req.file) { 
      urlImagen = req.file.path; 
    } else {
      urlImagen = '/uploads/Blog.png'; 
    }

    if (nombre && comentario && idUsuario && idFicha) {
      const connection = await mysql.createConnection(dbConfig);
      const fechaPublicacion = new Date().toISOString()
      const fechaFormateada = fechaPublicacion.replace('T', ' ').substring(0, 19);


      const sql = `INSERT INTO blog (nombre, urlImagen, imagenOpcional, comentario, fechaPublicacion, idUsuario, idFicha)
                   VALUES (?, ?, ?, ?, ?, ?, ?)`;

      await connection.execute(sql, [nombre, urlImagen, null, comentario, fechaFormateada, idUsuario, idFicha]);
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

//Ruta para traer noticias segun la ficha
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


//Editar un blog específico
app.put("/editarBlog/:idBlog", async (req, res) => {
  try {
    const { idBlog } = req.params;
    const { nombre, imagenOpcional, comentario } = req.body;
    const connection = await mysql.createConnection(dbConfig);

    const sql = `UPDATE blog SET nombre = ?, imagenOpcional = ?, comentario = ? WHERE identificador = ?`;
    await connection.execute(sql, [nombre, imagenOpcional, comentario, idBlog]);

    connection.end();
    res.status(200).json({ message: "Blog actualizado exitosamente" });
  } catch (error) {
    console.error("Error al editar el blog:", error);
    res.status(500).json({ error: "Error al editar el blog" });
  }
});

//Eliminar noticia segun el id
app.delete("/eliminarBlog/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const connection = await mysql.createConnection(dbConfig);
    
    const sql = "DELETE FROM blog WHERE identificador = ?";
    const [result] = await connection.execute(sql, [id]);

    connection.end();

    if (result.affectedRows > 0) {
      res.status(200).json({ message: "Blog eliminado correctamente" });
    } else {
      res.status(404).json({ error: "Blog no encontrado" });
    }
  } catch (error) {
    console.error("Error al eliminar el blog:", error);
    res.status(500).json({ error: "Error al eliminar el blog" });
  }
});

// HORARIOS

// Ruta para obtener horarios
app.get('/obtenerHorarios/:idFicha', async (req, res) => {
  try {
    const { idFicha } = req.params;
    const connection = await mysql.createConnection(dbConfig);

    const sql = `SELECT * FROM horario WHERE idFicha = ?`;
    const [rows] = await connection.execute(sql, [idFicha]);

    connection.end();
    res.status(200).json(rows);
  } catch (error) {
    console.error('Error al obtener horarios:', error);
    res.status(500).json({ error: 'Error al obtener horarios' });
  }
});

// Ruta para crear un nuevo horario
app.post('/crearHorario', upload.single('archivo'), async (req, res) => {
  try {
    const { nombre, comentario, idUsuario, idFicha } = req.body;
    let urlArchivo = '';

    if (req.file) {
      urlArchivo = req.file.filename;
    } else {
      return res.status(400).json({ error: 'El archivo es obligatorio' });
    }

    urlArchivo = '/uploads/' + req.file.filename;

    if (nombre && comentario && idUsuario && idFicha) {
      const connection = await mysql.createConnection(dbConfig);
      const fecha = new Date().toISOString();

      const sql = `INSERT INTO horario (nombre, urlArchivo, comentario, fecha, idUsuario, idFicha)
                   VALUES (?, ?, ?, ?, ?, ?)`;

      await connection.execute(sql, [nombre, urlArchivo, comentario, fecha, idUsuario, idFicha]);
      connection.end();

      res.status(201).json({ message: 'Horario creado exitosamente' });
    } else {
      res.status(400).json({ error: 'Faltan campos obligatorios para crear el horario' });
    }
  } catch (error) {
    console.error('Error al crear el horario:', error);
    res.status(500).json({ error: 'Error al crear el horario' });
  }
});

// Ruta para actualizar un horario existente
app.put('/editarHorario/:identificador', async (req, res) => {
  try {
    const { nombre, comentario } = req.body;
    const { identificador } = req.params;

    if (nombre && comentario) {
      const connection = await mysql.createConnection(dbConfig);
      const sql = 'UPDATE horario SET nombre = ?, comentario = ? WHERE identificador = ?';
      await connection.execute(sql, [nombre, comentario, identificador]);
      connection.end();
      res.json({ message: 'Horario actualizado exitosamente' });
    } else {
      res.status(400).json({ error: 'Faltan campos obligatorios para actualizar el horario' });
    }
  } catch (error) {
    console.error('Error al actualizar el horario:', error);
    res.status(500).json({ error: 'Error al actualizar el horario' });
  }
});

// Ruta para eliminar un horario por su ID
app.delete('/eliminarHorario/:identificador', async (req, res) => {
  try {
    const { identificador } = req.params;
    const connection = await mysql.createConnection(dbConfig);
    const sql = 'DELETE FROM horario WHERE identificador = ?';
    await connection.execute(sql, [identificador]);
    connection.end();
    res.json({ message: 'Horario eliminado exitosamente' });
  } catch (error) {
    console.error('Error al eliminar el horario:', error);
    res.status(500).json({ error: 'Error al eliminar el horario' });
  }
});

// ACTIVIDAD

// Ruta para crear una nueva actividad
app.post('/crearActividad', upload.single('archivo'), async (req, res) => {
  try {
    const { nombre, comentario, fechaInicio, fechaFinal, idUsuario, idFicha } = req.body;
    let urlArchivo = '';

    if (req.file) {
      urlArchivo = req.file.filename;
    } else {
      return res.status(400).json({ error: 'El archivo es obligatorio' });
    }

    urlArchivo = '/uploads/' + req.file.filename;

    if (nombre && comentario && fechaInicio && fechaFinal && idUsuario && idFicha) {
      const connection = await mysql.createConnection(dbConfig);
      const sql = `INSERT INTO guias (nombre, urlImagen, comentario, fechaInicio, fechaFinal, idUsuario, idFicha)
                   VALUES (?, ?, ?, ?, ?, ?, ?)`;
      await connection.execute(sql, [nombre, urlArchivo, comentario, fechaInicio, fechaFinal, idUsuario, idFicha]);
      connection.end();
      res.status(201).json({ message: 'Actividad creada exitosamente' });
    } else {
      res.status(400).json({ error: 'Faltan campos obligatorios para crear la actividad' });
    }
  } catch (error) {
    console.error('Error al crear la actividad:', error);
    res.status(500).json({ error: 'Error al crear la actividad' });
  }
})

// Ruta para obtener todas las actividades
app.get('/listarActividades/:idFicha', async (req, res) => {
  try {
    const { idFicha } = req.params;
    const connection = await mysql.createConnection(dbConfig);

    const sql = 'SELECT * FROM guias WHERE idFicha = ?';
    const [rows] = await connection.execute(sql, [idFicha]);
    connection.end();
    res.status(200).json(rows);
  } catch (error) {
    console.error('Error al obtener las actividades:', error);
    res.status(500).json({ error: 'Error al obtener las actividades' });
  }
});

// Ruta para editar una actividad específica
app.put('/editarActividad/:identificador', async (req, res) => {
  try {
    const { nombre, comentario, fechaInicio, fechaFinal } = req.body;
    const { identificador } = req.params;

    if (nombre && comentario && fechaInicio && fechaFinal) {
      const connection = await mysql.createConnection(dbConfig);
      const sql = 'UPDATE guias SET nombre = ?, comentario = ?, fechaInicio = ?, fechaFinal = ? WHERE identificador = ?';
      await connection.execute(sql, [nombre, comentario, fechaInicio, fechaFinal, identificador]);
      connection.end();
      res.json({ message: 'Actividad actualizada exitosamente' });
    } else {
      res.status(400).json({ error: 'Faltan campos obligatorios para actualizar la actividad' });
    }
  } catch (error) {
    console.error('Error al actualizar la actividad:', error);
    res.status(500).json({ error: 'Error al actualizar la actividad' });
  }
});

// Ruta para eliminar una actividad por su ID
app.delete('/eliminarActividad/:identificador', async (req, res) => {
  try {
    const { identificador } = req.params;
    const connection = await mysql.createConnection(dbConfig);
    const sql = 'DELETE FROM guias WHERE identificador = ?';
    await connection.execute(sql, [identificador]);
    connection.end();
    res.json({ message: 'Actividad eliminada exitosamente' });
  } catch (error) {
    console.error('Error al eliminar la actividad:', error);
    res.status(500).json({ error: 'Error al eliminar la actividad' });
  }
});


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



app.listen(port, () => {
  console.log(`Servidor en ejecución en http://localhost:${port}`);
});
