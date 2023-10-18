create database acanner;
use acanner;

CREATE TABLE `aprendiz` (
  `id_aprendiz` int(11) NOT NULL,
  `tipo_aprendiz` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `asistencia`
--

CREATE TABLE asistencia (
  id_asistencia int(11) AUTO_INCREMENT PRIMARY KEY,
  nombreArchivo VARCHAR(255) NOT NULL,
  comentario TEXT,
  archivoUrl VARCHAR(255)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `ficha`
--

CREATE TABLE `ficha` (
  `id_ficha` int(11) NOT NULL,
  `id_aprendiz` int(11) NOT NULL,
  `numero_ficha` int(11) NOT NULL,
  `trimestre` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `guias`
--

CREATE TABLE `guias` (
  id_guia int(11) AUTO_INCREMENT PRIMARY KEY,
  nombreArchivo VARCHAR(255) NOT NULL,
  comentario TEXT,
  archivoUrl VARCHAR(255)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `horario`
--

CREATE TABLE `horario` (
  id_horario int(11) AUTO_INCREMENT PRIMARY KEY,
  nombreArchivo VARCHAR(255) NOT NULL,
  comentario TEXT,
  archivoUrl VARCHAR(255)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `instructor`
--

CREATE TABLE `instructor` (
  `id_instructor` int(11) NOT NULL,
  `tipo_instructor` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `instructor_ficha`
--

CREATE TABLE `instructor_ficha` (
  `id_instructor` int(11) NOT NULL,
  `id_ficha` int(11) NOT NULL,
  `estado` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `noticias`
--

CREATE TABLE `noticias` (
  id_noticias int(11) AUTO_INCREMENT PRIMARY KEY,
  titulo varchar (255) NOT NULL,
  contenido TEXT,
  fecha_publicacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `preguntaseguridad`
--

CREATE TABLE `preguntaseguridad` (
  `id_pregunta` int(11) NOT NULL,
  `descripcionP` varchar(45) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `preguntaseguridad`
--

INSERT INTO `preguntaseguridad` (`id_pregunta`, `descripcionP`) VALUES
(1, 'Nombre de tu primera mascota'),
(2, 'Ciudad donde naciste'),
(3, 'Nombre de tu mejor amigo'),
(4, 'ciudad donde nacio'),
(5, 'Comida favorita'),
(6, 'Nombre de tu profesor favorito');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `rol`
--

CREATE TABLE `rol` (
  `id_rol` int(11) NOT NULL,
  `rol` varchar(30) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `rol`
--

INSERT INTO `rol` (`id_rol`, `rol`) VALUES
(1, 'instructor'),
(2, 'aprendiz'),
(3, 'administrador');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tipodocumento`
--

CREATE TABLE `tipodocumento` (
  `id_tipo` int(11) NOT NULL,
  `nombre` varchar(45) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `tipodocumento`
--

INSERT INTO `tipodocumento` (`id_tipo`, `nombre`) VALUES
(1, 'CC'),
(2, 'TI'),
(3, 'CE');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `trimestre`
--

CREATE TABLE `trimestre` (
  `id_trimestre` int(11) NOT NULL,
  `trimestre` varchar(45) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuario`
--

CREATE TABLE `usuario` (
  `id_usuario` int(11) NOT NULL,
  `tipo_documento` int(11) NOT NULL,
  `primer_nombre` varchar(45) NOT NULL,
  `segundo_nombre` varchar(45) DEFAULT NULL,
  `primer_apellido` varchar(45) NOT NULL,
  `segundo_apellido` varchar(45) NOT NULL,
  `fecha_nacimiento` date NOT NULL,
  `ficha` int(11) NOT NULL,
  `correo` varchar(64) NOT NULL,
  `password` varchar(64) NOT NULL,
  `pregunta_seguridad` int(11) DEFAULT NULL,
  `respuesta_seguridad` varchar(45) NOT NULL,
  `rol` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `usuario`
--

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `aprendiz`
--
ALTER TABLE `aprendiz`
  ADD PRIMARY KEY (`id_aprendiz`,`tipo_aprendiz`);



--
-- Indices de la tabla `ficha`
--
ALTER TABLE `ficha`
  ADD PRIMARY KEY (`id_ficha`),
  ADD KEY `id_aprendiz` (`id_aprendiz`),
  ADD KEY `trimestre` (`trimestre`);


-- Indices de la tabla `instructor`
--
ALTER TABLE `instructor`
  ADD PRIMARY KEY (`id_instructor`,`tipo_instructor`);

--
-- Indices de la tabla `instructor_ficha`
--
ALTER TABLE `instructor_ficha`
  ADD PRIMARY KEY (`id_instructor`,`id_ficha`),
  ADD KEY `id_ficha` (`id_ficha`);

--
-- Indices de la tabla `preguntaseguridad`
--
ALTER TABLE `preguntaseguridad`
  ADD PRIMARY KEY (`id_pregunta`);

--
-- Indices de la tabla `rol`
--
ALTER TABLE `rol`
  ADD PRIMARY KEY (`id_rol`);

--
-- Indices de la tabla `tipodocumento`
--
ALTER TABLE `tipodocumento`
  ADD PRIMARY KEY (`id_tipo`);

--
-- Indices de la tabla `trimestre`
--
ALTER TABLE `trimestre`
  ADD PRIMARY KEY (`id_trimestre`);

--
-- Indices de la tabla `usuario`
--
ALTER TABLE `usuario`
  ADD PRIMARY KEY (`id_usuario`,`tipo_documento`),
  ADD KEY `tipo_documento` (`tipo_documento`),
  ADD KEY `pregunta_seguridad` (`pregunta_seguridad`),
  ADD KEY `rol` (`rol`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `preguntaseguridad`
--
ALTER TABLE `preguntaseguridad`
  MODIFY `id_pregunta` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `aprendiz`
--
ALTER TABLE `aprendiz`
  ADD CONSTRAINT `aprendiz_ibfk_1` FOREIGN KEY (`id_aprendiz`,`tipo_aprendiz`) REFERENCES `usuario` (`id_usuario`, `tipo_documento`);

--
-- Filtros para la tabla `ficha`
--
ALTER TABLE `ficha`
  ADD CONSTRAINT `ficha_ibfk_1` FOREIGN KEY (`id_aprendiz`) REFERENCES `aprendiz` (`id_aprendiz`),
  ADD CONSTRAINT `ficha_ibfk_2` FOREIGN KEY (`trimestre`) REFERENCES `trimestre` (`id_trimestre`);


--
-- Filtros para la tabla `instructor`
--
ALTER TABLE `instructor`
  ADD CONSTRAINT `instructor_ibfk_1` FOREIGN KEY (`id_instructor`,`tipo_instructor`) REFERENCES `usuario` (`id_usuario`, `tipo_documento`);

--
-- Filtros para la tabla `instructor_ficha`
--
ALTER TABLE `instructor_ficha`
  ADD CONSTRAINT `instructor_ficha_ibfk_1` FOREIGN KEY (`id_instructor`) REFERENCES `instructor` (`id_instructor`),
  ADD CONSTRAINT `instructor_ficha_ibfk_2` FOREIGN KEY (`id_ficha`) REFERENCES `ficha` (`id_ficha`);


--
-- Filtros para la tabla `usuario`
--
ALTER TABLE `usuario`
  ADD CONSTRAINT `usuario_ibfk_1` FOREIGN KEY (`tipo_documento`) REFERENCES `tipodocumento` (`id_tipo`),
  ADD CONSTRAINT `usuario_ibfk_2` FOREIGN KEY (`pregunta_seguridad`) REFERENCES `preguntaseguridad` (`id_pregunta`),
  ADD CONSTRAINT `usuario_ibfk_3` FOREIGN KEY (`rol`) REFERENCES `rol` (`id_rol`);
COMMIT;
