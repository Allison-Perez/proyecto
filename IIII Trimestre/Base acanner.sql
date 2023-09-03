create database acanner;
	use acanner;
    
CREATE TABLE TipoDocumento(
    id_tipo int NOT NULL,
    nombre VARCHAR(45) NOT NULL,
    PRIMARY KEY (id_tipo)
);

CREATE TABLE PreguntaSeguridad(
    id_pregunta INT  NOT NULL AUTO_INCREMENT,
    descripcionP VARCHAR(45) NOT NULL,
    PRIMARY KEY (id_pregunta)
);

CREATE TABLE rol(
    id_rol int NOT NULL,
    rol VARCHAR(30) NOT NULL,
    PRIMARY KEY (id_rol)
);

CREATE TABLE usuario (
  id_usuario INT NOT NULL,
  tipo_documento int not null, 
  primer_nombre VARCHAR(45) NOT NULL,
  segundo_nombre VARCHAR(45),
  primer_apellido VARCHAR(45) NOT NULL,
  segundo_apellido VARCHAR(45) NOT NULL,
  fecha_nacimiento DATE NOT NULL,
  ficha INT NOT NULL,
  correo VARCHAR(64) NOT NULL,
  password VARCHAR(64) NOT NULL,
  pregunta_seguridad int not null,
  respuesta_seguridad varchar(45) not null, 
  rol int not null,
  PRIMARY KEY (id_usuario, tipo_documento)
);

ALTER TABLE usuario
ADD FOREIGN KEY (tipo_documento)
REFERENCES TipoDocumento (id_tipo);

ALTER TABLE usuario
ADD FOREIGN KEY (pregunta_seguridad)
REFERENCES PreguntaSeguridad (id_pregunta);

ALTER TABLE usuario
ADD FOREIGN KEY (rol)
REFERENCES rol (id_rol);

CREATE TABLE instructor(
    id_instructor INTEGER NOT NULL, 
    tipo_instructor INTEGER NOT NULL,
    PRIMARY KEY (id_instructor, tipo_instructor)
);

ALTER TABLE instructor
ADD FOREIGN KEY (id_instructor, tipo_instructor)
REFERENCES usuario (id_usuario, tipo_documento);

CREATE TABLE aprendiz(
    id_aprendiz INTEGER NOT NULL, 
    tipo_aprendiz INTEGER NOT NULL,
    PRIMARY KEY (id_aprendiz, tipo_aprendiz)
);

ALTER TABLE aprendiz
ADD FOREIGN KEY (id_aprendiz, tipo_aprendiz)
REFERENCES usuario (id_usuario, tipo_documento);

create table trimestre(
	id_trimestre int not null primary key,
	trimestre varchar (45) not null);

CREATE TABLE ficha(
    id_ficha INTEGER NOT NULL,
    id_aprendiz  INTEGER NOT NULL,
    numero_ficha INT NOT NULL,
	trimestre INT NOT NULL,
    PRIMARY KEY (id_ficha)
);

alter table ficha 
add FOREIGN KEY (id_aprendiz)
REFERENCES aprendiz (id_aprendiz);

ALTER TABLE ficha
ADD FOREIGN KEY (trimestre)
REFERENCES trimestre(id_trimestre);
 

CREATE TABLE instructor_ficha (
  id_instructor int NOT NULL,
  id_ficha int NOT NULL,
  estado boolean not null,
  PRIMARY KEY (id_instructor, id_ficha),
  FOREIGN KEY (id_instructor) REFERENCES instructor (id_instructor),
  FOREIGN KEY (id_ficha) REFERENCES ficha (id_ficha)
);

create  table guias(
id_guia int not null,
nombre_guia varchar (45) not null,
fecha date not null,
ruta_archivo varchar (45) not null,
instructor int not null,
ficha int not null, 
PRIMARY KEY (id_guia)
);

alter table guias
add FOREIGN KEY (instructor, ficha)
REFERENCES instructor_ficha (id_instructor, id_ficha);

create table noticias(
id_noticias int not null,
instructor int not null,
contenido longtext not null,
ruta_imagen varchar (45) not null,
ficha int not null,
PRIMARY KEY (id_noticias)
);

alter table noticias
add FOREIGN KEY (instructor, ficha)
REFERENCES instructor_ficha (id_instructor, id_ficha);

CREATE TABLE asistencia (
    id_asistencia INT NOT NULL,
    fecha DATE NOT NULL,
    confirmación BOOLEAN NOT NULL,
    ficha INT NOT NULL,
    instructor int not null,
	aprendiz int not null,
    PRIMARY KEY (id_asistencia)
);

alter table asistencia
add foreign key (instructor)
references instructor(id_instructor);

alter table asistencia
add foreign key (aprendiz)
references aprendiz(id_aprendiz);

create table horario(
id_horario int not null,
hora_entrada time not null,
hora_descanso time not null,
hora_salida time not null,
ficha int not null,
instructor int not null,

PRIMARY KEY(id_horario)
);

alter table horario
add FOREIGN KEY (ficha)
REFERENCES ficha (id_ficha);

alter table horario
add FOREIGN KEY (instructor)
REFERENCES instructor (id_instructor);

INSERT INTO TipoDocumento (id_tipo, nombre) VALUES (1, 'Tarjeta de Identidad');
INSERT INTO TipoDocumento (id_tipo, nombre) VALUES (2, 'Cédula de Ciudadanía');
INSERT INTO TipoDocumento (id_tipo, nombre) VALUES (3, 'Cédula de Extranjería');

INSERT INTO rol (id_rol, rol) VALUES (1, 'Administrador');
INSERT INTO rol (id_rol, rol) VALUES (2, 'Aprendiz');
INSERT INTO rol (id_rol, rol) VALUES (3, 'Instructor');

INSERT INTO PreguntaSeguridad (descripcionP) VALUES ('¿Cuál es el nombre de su primera mascota?');
INSERT INTO PreguntaSeguridad (descripcionP) VALUES ('¿Cuál es su color favorito?');
INSERT INTO PreguntaSeguridad (descripcionP) VALUES ('¿En qué ciudad nació?');

INSERT INTO usuario (id_usuario, tipo_documento, primer_nombre, segundo_nombre, primer_apellido, segundo_apellido, fecha_nacimiento, ficha, correo, password, pregunta_seguridad, respuesta_seguridad, rol)
VALUES
  (1, 1, 'John', NULL, 'Doe', 'Smith', '1990-01-01', 2558104, 'john.doe@example.com', 'password1', 1, 'Maxi', 1),
  (2, 2, 'Jane', NULL, 'Smith', 'Doe', '1992-05-15', 2558104, 'jane.smith@example.com', 'password2', 1, 'luna', 1),
  (3, 1, 'Michael', NULL, 'Johnson', 'Brown', '1985-07-10', 2558104, 'michael.johnson@example.com', 'password3', 1, 'lulu', 1),
  (4, 2, 'Emily', NULL, 'Davis', 'Wilson', '1988-09-20', 2558104, 'emily.davis@example.com', 'password4', 1, 'copito', 1),
  (5, 1, 'David', NULL, 'Miller', 'Taylor', '1994-03-05', 2558104, 'david.miller@example.com', 'password5', 1, 'bigotes', 1),
  (6, 2, 'Sarah', NULL, 'Anderson', 'Clark', '1998-11-30', 2558104, 'sarah.anderson@example.com', 'password6', 1, 'bestia', 1),
  (7, 1, 'Jessica', NULL, 'Wilson', 'White', '1982-12-12', 2558104, 'jessica.wilson@example.com', 'password7', 1, 'Max', 1),
  (8, 2, 'Daniel', NULL, 'Taylor', 'Robinson', '1991-06-25', 2558104, 'daniel.taylor@example.com', 'password8', 1, 'minnie', 1),
  (9, 1, 'Lauren', NULL, 'Brown', 'Anderson', '1987-04-17', 2558104, 'lauren.brown@example.com', 'password9', 1, 'nachita', 1),
  (10, 2, 'Andrew', NULL, 'Wilson', 'Johnson', '1996-08-08', 2558104, 'andrew.wilson@example.com', 'password10', 1, 'lilo', 1);


INSERT INTO instructor (id_instructor, tipo_instructor) VALUES (1, 1);
INSERT INTO instructor (id_instructor, tipo_instructor) VALUES (2, 2);
INSERT INTO instructor (id_instructor, tipo_instructor) VALUES (3, 1);
INSERT INTO instructor (id_instructor, tipo_instructor) VALUES (4, 2);
INSERT INTO instructor (id_instructor, tipo_instructor) VALUES (5, 1);
INSERT INTO instructor (id_instructor, tipo_instructor) VALUES (6, 2);
INSERT INTO instructor (id_instructor, tipo_instructor) VALUES (7, 1);
INSERT INTO instructor (id_instructor, tipo_instructor) VALUES (8, 2);
INSERT INTO instructor (id_instructor, tipo_instructor) VALUES (9, 1);
INSERT INTO instructor (id_instructor, tipo_instructor) VALUES (10, 2);

INSERT INTO aprendiz (id_aprendiz, tipo_aprendiz) VALUES (1, 1);
INSERT INTO aprendiz (id_aprendiz, tipo_aprendiz) VALUES (2, 2);
INSERT INTO aprendiz (id_aprendiz, tipo_aprendiz) VALUES (3, 1);
INSERT INTO aprendiz (id_aprendiz, tipo_aprendiz) VALUES (4, 2);
INSERT INTO aprendiz (id_aprendiz, tipo_aprendiz) VALUES (5, 1);
INSERT INTO aprendiz (id_aprendiz, tipo_aprendiz) VALUES (6, 2);
INSERT INTO aprendiz (id_aprendiz, tipo_aprendiz) VALUES (7, 1);
INSERT INTO aprendiz (id_aprendiz, tipo_aprendiz) VALUES (8, 2);
INSERT INTO aprendiz (id_aprendiz, tipo_aprendiz) VALUES (9, 1);
INSERT INTO aprendiz (id_aprendiz, tipo_aprendiz) VALUES (10, 2);

INSERT INTO ficha (id_ficha, id_aprendiz, numero_ficha, trimestre) VALUES (1, 1, 2558104, 1);
INSERT INTO ficha (id_ficha, id_aprendiz, numero_ficha, trimestre) VALUES (2, 2, 2558104, 1);
INSERT INTO ficha (id_ficha, id_aprendiz, numero_ficha, trimestre) VALUES (3, 3, 2558104, 1);
INSERT INTO ficha (id_ficha, id_aprendiz, numero_ficha, trimestre) VALUES (4, 4, 2558104, 1);
INSERT INTO ficha (id_ficha, id_aprendiz, numero_ficha, trimestre) VALUES (5, 5, 2558104, 1);
INSERT INTO ficha (id_ficha, id_aprendiz, numero_ficha, trimestre) VALUES (6, 6, 2558104, 1);
INSERT INTO ficha (id_ficha, id_aprendiz, numero_ficha, trimestre) VALUES (7, 7, 2558104, 1);
INSERT INTO ficha (id_ficha, id_aprendiz, numero_ficha, trimestre) VALUES (8, 8, 2558104, 1);
INSERT INTO ficha (id_ficha, id_aprendiz, numero_ficha, trimestre) VALUES (9, 9, 2558104, 1);
INSERT INTO ficha (id_ficha, id_aprendiz, numero_ficha, trimestre) VALUES (10, 10, 2558104, 1);

INSERT INTO instructor_ficha (id_instructor, id_ficha, estado) VALUES (1, 1, true);
INSERT INTO instructor_ficha (id_instructor, id_ficha, estado) VALUES (2, 2, false);
INSERT INTO instructor_ficha (id_instructor, id_ficha, estado) VALUES (3, 3, true);
INSERT INTO instructor_ficha (id_instructor, id_ficha, estado) VALUES (4, 4, false);
INSERT INTO instructor_ficha (id_instructor, id_ficha, estado) VALUES (5, 5, true);
INSERT INTO instructor_ficha (id_instructor, id_ficha, estado) VALUES (6, 6, true);
INSERT INTO instructor_ficha (id_instructor, id_ficha, estado) VALUES (7, 7, false);
INSERT INTO instructor_ficha (id_instructor, id_ficha, estado) VALUES (8, 8, true);
INSERT INTO instructor_ficha (id_instructor, id_ficha, estado) VALUES (9, 9, true);
INSERT INTO instructor_ficha (id_instructor, id_ficha, estado) VALUES (10, 10, false);

INSERT INTO guias (id_guia, nombre_guia, fecha, ruta_archivo, instructor, ficha) VALUES (1, 'Guía 1', '2023-01-01', '/ruta/archivo1.pdf', 1, 1);
INSERT INTO guias (id_guia, nombre_guia, fecha, ruta_archivo, instructor, ficha) VALUES (2, 'Guía 2', '2023-02-01', '/ruta/archivo2.pdf', 2,2 );
INSERT INTO guias (id_guia, nombre_guia, fecha, ruta_archivo, instructor, ficha) VALUES (3, 'Guía 3', '2023-03-01', '/ruta/archivo3.pdf', 3, 3);
INSERT INTO guias (id_guia, nombre_guia, fecha, ruta_archivo, instructor, ficha) VALUES (4, 'Guía 4', '2023-04-01', '/ruta/archivo4.pdf', 4,4 );
INSERT INTO guias (id_guia, nombre_guia, fecha, ruta_archivo, instructor, ficha) VALUES (5, 'Guía 5', '2023-05-01', '/ruta/archivo5.pdf', 5, 5);
INSERT INTO guias (id_guia, nombre_guia, fecha, ruta_archivo, instructor, ficha) VALUES (6, 'Guía 6', '2023-06-01', '/ruta/archivo6.pdf', 6, 6);
INSERT INTO guias (id_guia, nombre_guia, fecha, ruta_archivo, instructor, ficha) VALUES (7, 'Guía 7', '2023-07-01', '/ruta/archivo7.pdf', 7,7 );
INSERT INTO guias (id_guia, nombre_guia, fecha, ruta_archivo, instructor, ficha) VALUES (8, 'Guía 8', '2023-08-01', '/ruta/archivo8.pdf', 8,8 );
INSERT INTO guias (id_guia, nombre_guia, fecha, ruta_archivo, instructor, ficha) VALUES (9, 'Guía 9', '2023-09-01', '/ruta/archivo9.pdf', 9,9 );
INSERT INTO guias (id_guia, nombre_guia, fecha, ruta_archivo, instructor, ficha) VALUES (10, 'Guía 10', '2023-10-01', '/ruta/archivo10.pdf', 10, 10);

INSERT INTO noticias (id_noticias, instructor, contenido, ruta_imagen, ficha) VALUES (1, 1, 'Contenido de la noticia 1', '/ruta/imagen1.jpg', 1);
INSERT INTO noticias (id_noticias, instructor, contenido, ruta_imagen, ficha) VALUES (2, 2, 'Contenido de la noticia 2', '/ruta/imagen2.jpg', 2);
INSERT INTO noticias (id_noticias, instructor, contenido, ruta_imagen, ficha) VALUES (3, 3, 'Contenido de la noticia 3', '/ruta/imagen3.jpg', 3);
INSERT INTO noticias (id_noticias, instructor, contenido, ruta_imagen, ficha) VALUES (4, 4, 'Contenido de la noticia 4', '/ruta/imagen4.jpg', 4);
INSERT INTO noticias (id_noticias, instructor, contenido, ruta_imagen, ficha) VALUES (5, 5, 'Contenido de la noticia 5', '/ruta/imagen5.jpg', 5);
INSERT INTO noticias (id_noticias, instructor, contenido, ruta_imagen, ficha) VALUES (6, 6, 'Contenido de la noticia 6', '/ruta/imagen6.jpg', 6);
INSERT INTO noticias (id_noticias, instructor, contenido, ruta_imagen, ficha) VALUES (7, 7, 'Contenido de la noticia 7', '/ruta/imagen7.jpg', 7);
INSERT INTO noticias (id_noticias, instructor, contenido, ruta_imagen, ficha) VALUES (8, 8, 'Contenido de la noticia 8', '/ruta/imagen8.jpg', 8);
INSERT INTO noticias (id_noticias, instructor, contenido, ruta_imagen, ficha) VALUES (9, 9, 'Contenido de la noticia 9', '/ruta/imagen9.jpg', 9);
INSERT INTO noticias (id_noticias, instructor, contenido, ruta_imagen, ficha) VALUES (10, 10, 'Contenido de la noticia 10', '/ruta/imagen10.jpg', 10);

INSERT INTO asistencia (id_asistencia, fecha, confirmación, ficha, instructor, aprendiz) VALUES (1, '2023-01-01', true, 1, 1, 1);
INSERT INTO asistencia (id_asistencia, fecha, confirmación, ficha, instructor, aprendiz) VALUES (2, '2023-01-02', false, 2, 2, 2);
INSERT INTO asistencia (id_asistencia, fecha, confirmación, ficha, instructor, aprendiz) VALUES (3, '2023-01-03', true, 3, 3, 3);
INSERT INTO asistencia (id_asistencia, fecha, confirmación, ficha, instructor, aprendiz) VALUES (4, '2023-01-04', false, 4, 4, 4);
INSERT INTO asistencia (id_asistencia, fecha, confirmación, ficha, instructor, aprendiz) VALUES (5, '2023-01-05', true, 5, 5, 5);
INSERT INTO asistencia (id_asistencia, fecha, confirmación, ficha, instructor, aprendiz) VALUES (6, '2023-01-06', false, 6, 6, 6);
INSERT INTO asistencia (id_asistencia, fecha, confirmación, ficha, instructor, aprendiz) VALUES (7, '2023-01-07', true, 7, 7, 7);
INSERT INTO asistencia (id_asistencia, fecha, confirmación, ficha, instructor, aprendiz) VALUES (8, '2023-01-08', false, 8, 8, 8);
INSERT INTO asistencia (id_asistencia, fecha, confirmación, ficha, instructor, aprendiz) VALUES (9, '2023-01-09', true, 9, 9, 9);
INSERT INTO asistencia (id_asistencia, fecha, confirmación, ficha, instructor, aprendiz) VALUES (10, '2023-01-10', false, 10, 10, 10);


INSERT INTO horario (id_horario, hora_entrada, hora_descanso, hora_salida, ficha, instructor) VALUES (1, '08:00:00', '12:00:00', '17:00:00', 1, 1);
INSERT INTO horario (id_horario, hora_entrada, hora_descanso, hora_salida, ficha, instructor) VALUES (2, '09:00:00', '13:00:00', '18:00:00', 2, 2);
INSERT INTO horario (id_horario, hora_entrada, hora_descanso, hora_salida, ficha, instructor) VALUES (3, '07:30:00', '12:30:00', '16:30:00', 3, 3);
INSERT INTO horario (id_horario, hora_entrada, hora_descanso, hora_salida, ficha, instructor) VALUES (4, '08:30:00', '13:30:00', '17:30:00', 4, 4);
INSERT INTO horario (id_horario, hora_entrada, hora_descanso, hora_salida, ficha, instructor) VALUES (5, '08:00:00', '12:00:00', '17:00:00', 5, 5);
INSERT INTO horario (id_horario, hora_entrada, hora_descanso, hora_salida, ficha, instructor) VALUES (6, '09:00:00', '13:00:00', '18:00:00', 6, 6);
INSERT INTO horario (id_horario, hora_entrada, hora_descanso, hora_salida, ficha, instructor) VALUES (7, '07:30:00', '12:30:00', '16:30:00', 7, 7);
INSERT INTO horario (id_horario, hora_entrada, hora_descanso, hora_salida, ficha, instructor) VALUES (8, '08:30:00', '13:30:00', '17:30:00', 8, 8);
INSERT INTO horario (id_horario, hora_entrada, hora_descanso, hora_salida, ficha, instructor) VALUES (9, '08:00:00', '12:00:00', '17:00:00', 9, 9);
INSERT INTO horario (id_horario, hora_entrada, hora_descanso, hora_salida, ficha, instructor) VALUES (10, '09:00:00', '13:00:00', '18:00:00', 10, 10);

--Consultas--

SELECT * FROM TipoDocumento;

SELECT * FROM asistencia;

SELECT * FROM trimestre;


SELECT primer_nombre, segundo_nombre, primer_apellido, segundo_apellido FROM usuario;

SELECT primer_nombre, segundo_nombre, primer_apellido, segundo_apellido 
FROM usuario 
WHERE rol = 2;

SELECT primer_nombre, segundo_nombre, primer_apellido, segundo_apellido 
FROM usuario 
WHERE primer_nombre LIKE 'A%';



SELECT primer_nombre, segundo_nombre, primer_apellido, segundo_apellido 
FROM usuario 
WHERE correo LIKE '%john.doe@example.com';

SELECT *
FROM aprendiz
WHERE tipo_aprendiz = '1';

SELECT primer_nombre, segundo_nombre, primer_apellido, segundo_apellido 
FROM usuario 
WHERE id_usuario = “4”;

SELECT *
FROM asistencia
WHERE fecha = '2023-06-25';

SELECT *
FROM asistencia
WHERE ficha = 123456;



SELECT id_pregunta, descripcionP
FROM PreguntaSeguridad
WHERE id_pregunta = 2;



