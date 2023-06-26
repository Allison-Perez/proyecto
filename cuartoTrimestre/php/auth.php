<?php
$host = "localhost"; 
$usuario = "root";
$contraseña = "";
$base_de_datos = "acanner";

// Crear una conexión a la base de datos
$conexion = new mysqli($host, $usuario, $contraseña, $base_de_datos);

// Verificar si hubo algún error en la conexión
if ($conexion->connect_error) {
    die("Error en la conexión a la base de datos: " . $conexion->connect_error);
}

// Obtener los datos del formulario
$primerNombre = $_POST["primer_nombre"];
$primerApellido = $_POST["primer_apellido"];
$tipoDocumento = $_POST["tipo_documento"];
$fechaNacimiento = $_POST["fecha_nacimiento"];
$correo = $_POST["correo"];
$segundoNombre = $_POST["segundo_nombre"];
$segundoApellido = $_POST["segundo_apellido"];
$numeroDocumento = $_POST["id_usuario"];
$ficha = $_POST["ficha"];
$password = $_POST["password"];

$passwordEncript =  password_hash($password, PASSWORD_DEFAULT);

// Preparar la consulta SQL para insertar los datos en la tabla
$sql = "INSERT INTO usuario (primer_nombre, primer_apellido, tipo_documento, fecha_nacimiento, correo, segundo_nombre, segundo_apellido, id_usuario, ficha, password)
        VALUES ('$primerNombre', '$primerApellido', '$tipoDocumento', '$fechaNacimiento', '$correo', '$segundoNombre', '$segundoApellido', '$numeroDocumento', '$ficha', '$passwordEncript')";


// Ejecutar la consulta SQL
if ($conexion->query($sql) === TRUE) {
    header("Location: ../login.html");
} else {
    echo "Error al insertar el registro: " . $conexion->error;
}

// Cerrar la conexión a la base de datos
$conexion->close();

?>
