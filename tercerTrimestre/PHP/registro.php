<?php
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "acanner";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die("Error de conexión a la base de datos: " . $conn->connect_error);
}

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $primerNombre = $_POST["primer_nombre"];
    $segundoNombre = $_POST["segundo_nombre"];
    $primerApellido = $_POST["primer_apellido"];
    $segundoApellido = $_POST["segundo_apellido"];
    $tipoDocumento = $_POST["tipo_documento"];
    $numeroDocumento = $_POST["numero_documento"];
    $fechaNacimiento = $_POST["fecha_nacimiento"];
    $correo = $_POST["correo"];
    $numeroFicha = $_POST["numero_ficha"];
    $contrasena = $_POST["password"];
    $rol = $_POST["rol"];

    $sql = "INSERT INTO usuarios (primer_nombre, segundo_nombre, primer_apellido, segundo_apellido, tipo_documento, numero_documento, fecha_nacimiento, correo, numero_ficha, contrasena, rol) VALUES ('$primerNombre', '$segundoNombre', '$primerApellido', '$segundoApellido', '$tipoDocumento', '$numeroDocumento', '$fechaNacimiento', '$correo', '$numeroFicha', '$contrasena', '$rol')";

    if ($conn->query($sql) === TRUE) {
        echo '<script>alert("Registro exitoso!🤖");</script>';
        if ($rol == 'aprendiz') {
            header("Location: login.html");
            exit();
        } elseif ($rol == 'instructor') {
            header("Location: login.html");
            exit();
        } else {
            echo '<script>alert("Error: Rol desconocido.");</script>';
            header("Location: registro.html");
            exit();
        }
    } else {
        echo "Error: " . $sql . "<br>" . $conn->error;
    }
}

$conn->close();
?>
