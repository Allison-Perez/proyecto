CREATE database acanner;
USE acanner;

CREATE TABLE rol (
    identificador INT AUTO_INCREMENt PRIMARY KEY,
    nombre VARCHAR(30) NOT NULL
);

INSERT INTO rol (identificador, nombre)
VALUES
    (1, 'Instructor'),
    (2, 'Aprendiz'),
    (3, 'Administrador');


create table preguntaSeguridad(
	identificador int AUTO_INCREMENt PRIMARY KEY,
    pregunta varchar(200) not null
);

INSERT INTO preguntaSeguridad (identificador, pregunta)
VALUES
    (1, 'Cuál es el nombre de tu primera mascota'),
    (2, 'En qué ciudad naciste'),
    (3, 'Nombre de tu mejor amigo'),
    (4, 'Nombre de tu cantante favorito'),
    (5, 'Cuál es tu comida favorita'),
    (6, 'Nombre de tu profesor favorito');


CREATE TABLE ficha (
    identificador INT AUTO_INCREMENT PRIMARY KEY,
    numeroFicha INT NOT NULL,
    fechaInicio DATE NOT NULL,
    fechaFinal DATE NOT NULL,
    trimestre INT NULL

);


INSERT INTO ficha (identificador, numeroFicha, fechaInicio, fechaFinal)
VALUES
	(1, 2558104, '2022-07-18', '2024-04-17'),
    (2, 1800002, '2024-10-06', '2026-07-05'),
    (3, 11231236, '2023-01-22', '2025-10-21'),
    (4, 2634256, '2022-04-18', '2024-04-17'),
    (5, 2789008, '2023-04-28', '2025-10-27');



CREATE TABLE usuario (
    identificador INT AUTO_INCREMENT PRIMARY KEY,
    tipoDocumento VARCHAR(10) NOT NULL,
    documento INT NOT NULL,
    primerNombre VARCHAR(45) NOT NULL,
    segundoNombre VARCHAR(45) NULL,
    primerApellido VARCHAR(45) NOT NULL,
    segundoApellido VARCHAR(45) NULL,
    fechaNacimiento DATE NOT NULL,
    correo VARCHAR(250) NOT NULL UNIQUE,
    password VARCHAR(100) NOT NULL,
    idPregunta INT NOT NULL,
    respuestaPregunta VARCHAR(45) NOT NULL,
    idRol INT NOT NULL,
    fotoPerfil varchar (200) not null,
    FOREIGN KEY (idRol) REFERENCES rol(identificador),
    FOREIGN KEY (idPregunta) REFERENCES preguntaSeguridad(identificador)
   
);

CREATE TABLE detalleUsuario (
    identificador INT AUTO_INCREMENT PRIMARY KEY,
    fechaIngreso DATE NOT NULL,
    celular BIGINT(10) NOT NULL,
    informacionAcademica VARCHAR(500),
    informacionAdicional VARCHAR(500),
    idUsuario INT NOT NULL,
    FOREIGN KEY (idUsuario) REFERENCES usuario(identificador)
);


create table usuarioFicha(
 identificador INT AUTO_INCREMENT PRIMARY KEY,
 idUsuario INT NOT NULL,
 idFicha int not null,

 FOREIGN KEY (idUsuario) REFERENCES usuario(identificador),
  FOREIGN KEY (idFicha) REFERENCES ficha(identificador)
);

CREATE TABLE horario (
    identificador INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(45) NOT NULL,
    urlArchivo VARCHAR(200) NOT NULL,
    comentario VARCHAR(200),
    fecha DATE NOT NULL,
    idUsuario INT NOT NULL,
    idFicha INT NOT NULL,
    FOREIGN KEY (idUsuario) REFERENCES usuario(identificador),
	FOREIGN KEY (idFicha) REFERENCES ficha(identificador)
);

CREATE TABLE guias (
    identificador INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(45) NOT NULL,
    urlImagen VARCHAR(200) NOT NULL,
    comentario VARCHAR(200),
    fechaInicio DATE NOT NULL,
    fechaFinal DATE NOT NULL,
    idUsuario INT NOT NULL,
    idFicha INT NOT NULL,
    FOREIGN KEY (idUsuario) REFERENCES usuario(identificador),
	FOREIGN KEY (idFicha) REFERENCES ficha(identificador)
);

  CREATE TABLE blog (
      identificador INT AUTO_INCREMENT PRIMARY KEY,
      nombre VARCHAR(45) NOT NULL,
      urlImagen VARCHAR(200),
      imagenOpcional VARCHAR(200),
      comentario VARCHAR(200),
      fechaPublicacion DATE,
      idUsuario INT NOT NULL,
      idFicha INT NOT NULL,
      FOREIGN KEY (idUsuario) REFERENCES usuario(identificador),
      FOREIGN KEY (idFicha) REFERENCES ficha(identificador)
  );

create table asistencia (
    identificador INT AUTO_INCREMENT PRIMARY KEY,
    fecha DATE NOT NULL,
    status varchar (30) not null,
    fallaJustificada varchar (30) null,
    idAprendiz INT NOT NULL,
    idFicha INT NOT NULL,
    idInstructor INT NOT NULL,
    FOREIGN KEY (idAprendiz) REFERENCES usuario(identificador),
    FOREIGN KEY (idInstructor) REFERENCES usuario(identificador),
	FOREIGN KEY (idFicha) REFERENCES ficha(identificador)
);
