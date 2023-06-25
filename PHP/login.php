<?php
session_start();

$servername = "localhost";
$username = "root";
$password = "";
$dbname = "acanner";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die("Error de conexión a la base de datos: " . $conn->connect_error);
}

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $correo = $_POST["email"];
    $contrasena = $_POST["password"];

    $sql = "SELECT * FROM usuarios WHERE correo = '$correo' AND contrasena = '$contrasena'";
    $result = $conn->query($sql);

    if ($result->num_rows == 1) {
        $row = $result->fetch_assoc();
        $rol = $row['rol'];
        $rolLogin = $_POST['rol'];

        if ($rol == $rolLogin) {
            if ($rol == 'instructor') {
                $_SESSION['rol'] = $rol;
                header("Location: Instructor.html");
                exit();
            } elseif ($rol == 'aprendiz') {
                $_SESSION['rol'] = $rol;
                header("Location: Aprendiz.html");
                exit();
            }
        } else {
            echo '<script>alert("El rol ingresado no coincide con el rol registrado.");</script>';
            header("Location: login.html");
            exit();
        }
    } else {
        echo '<script>alert("Credenciales incorrectas.");</script>';
        header("Location: login.html");
        exit();
    }
}

$conn->close();
?>
