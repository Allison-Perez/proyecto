CREATE DATABASE  acanner;
USE acanner;

CREATE TABLE perfiles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    foto VARCHAR(255),
    nombre VARCHAR(255) NOT NULL,
    numero_ficha VARCHAR(255) NOT NULL,
    correo_electronico VARCHAR(255) NOT NULL,
    trimestre VARCHAR(255) NOT NULL
);
