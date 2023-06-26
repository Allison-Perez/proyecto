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

// Obtener los datos del formulario de inicio de sesión
$correo = $_POST["correo"];
$contraseña = $_POST["password"];



// Consulta SQL para verificar las credenciales de inicio de sesión
$sql = "SELECT * FROM usuario WHERE correo = '$correo'";

// Ejecutar la consulta SQL
$resultado = $conexion->query($sql);

if ($resultado->num_rows == 1) {

    $row = $resultado->fetch_assoc();
    $contraseñaGuardada = $row['password'];

    if (password_verify($contraseña, $contraseñaGuardada)) {
        echo('se logueo');
    } else {
        echo('credenciales invalidas');
    }

} else {
    // Credenciales inválidas
    echo "El usuario no existe";
}

// Cerrar la conexión a la base de datos
$conexion->close();
?>
