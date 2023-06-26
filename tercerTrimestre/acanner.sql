CREATE DATABASE acanner;

USE acanner;

CREATE TABLE usuarios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  primer_nombre VARCHAR(50) NOT NULL,
  segundo_nombre VARCHAR(50),
  primer_apellido VARCHAR(50) NOT NULL,
  segundo_apellido VARCHAR(50) NOT NULL,
  tipo_documento VARCHAR(50) NOT NULL,
  numero_documento VARCHAR(50) NOT NULL,
  fecha_nacimiento DATE NOT NULL,
  correo VARCHAR(100) NOT NULL,
  numero_ficha VARCHAR(50) NOT NULL,
  contrasena VARCHAR(100) NOT NULL,
  rol VARCHAR(50) NOT NULL
);
