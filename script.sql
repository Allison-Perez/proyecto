CREATE DATABASE acanner1;

USE acanner1;

CREATE TABLE usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    primer_nombre VARCHAR(255),
    numero_ficha INT,
    descripcion TEXT,
    correo VARCHAR(255),
    telefono VARCHAR(20)
);

CREATE TABLE guias (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255),
    content TEXT
);

CREATE TABLE asistencias (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT,
    fecha DATE,
    estado VARCHAR(20),
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
);

CREATE TABLE horarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT,
    dia_semana VARCHAR(20),
    hora_inicio TIME,
    hora_fin TIME,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
);

CREATE TABLE blog_posts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255),
    content TEXT
);