const express = require("express");
const bodyParser = require("body-parser");
const mysql = require("mysql2/promise");
const bcrypt = require("bcrypt");
const cors = require('cors');

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

    // Verificar la contraseña
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

    const sql = `INSERT INTO usuario (primer_nombre, primer_apellido, tipo_documento, fecha_nacimiento, correo, segundo_nombre, segundo_apellido, id_usuario, ficha, password, pregunta_seguridad, respuesta_seguridad)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

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
    ]);

    connection.end();
    res.status(201).json({ message: "Usuario creado exitosamente" });
  } catch (error) {
    console.error("Error al insertar el registro:", error);
    res.status(500).json({ error: "Error al insertar el registro" });
  }
});

app.listen(port, () => {
  console.log(`Servidor en ejecución en http://localhost:${port}`);
});

