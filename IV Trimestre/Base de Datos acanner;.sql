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


SELECT *
FROM usuario
WHERE rol = (SELECT id_rol FROM rol WHERE rol = 'instructor');

show table asistencia;

describe table guias;

SELECT * FROM rol;