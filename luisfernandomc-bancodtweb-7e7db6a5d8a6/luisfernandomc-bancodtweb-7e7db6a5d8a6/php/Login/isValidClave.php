<?php
include ('../../dll/config.php');
include ('../../dll/funciones.php');
extract($_POST);
if (!$mysqli = getConectionDb())
    return errorLogin($MSJ_ERROR_CONEXION);
if (isset($contrasenia)) {
    $sql = "SELECT * FROM $DB_NAME.administrador a WHERE a.contrasenia = MD5(CONCAT('$contrasenia' , 'd2be0658f23e36fdf58c408302faabbb'))  AND a.usuario = '$usuario'  LIMIT 1; ";
    $result = EJECUTAR_SELECT($mysqli, $sql);
    if ($result->num_rows > 0)
        echo json_encode(array('success' => true, 'html' => '<div id="Success"><i class="fa fa-check" aria-hidden="true"></i></i><strong> Contraseña Correcta.<strong></div>'));
    else
        echo json_encode(array('success' => false, 'html' => '<div id="Error" ><i class="fa fa-times" aria-hidden="true"><strong> Contraseña Incorrecta.</strong></div>'));
    $mysqli->close();
}
 