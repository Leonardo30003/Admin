<?php

include ('../../dll/config.php');
include ('../../dll/funciones.php');
extract($_POST);
if (!$mysqli = getConectionDb())
    return errorLogin($MSJ_ERROR_CONEXION);
if (isset($usuario)) {
    $sql = "SELECT * FROM $DB_NAME.administrador a WHERE a.usuario = '$usuario' LIMIT 1; ";
    $result = $mysqli->query($sql);
    if ($result->num_rows > 0) {
        echo json_encode(array('success' => true, 'html' => '<div id="Success"><i class="fa fa-check" aria-hidden="true"></i></i><strong> Usuario Correcto<strong></div>'));
    } else {
        echo json_encode(array('success' => false, 'html' => '<div id="Error" ><i class="fa fa-times" aria-hidden="true"><strong> Usuario Incorrecto</strong></div>'));
    }
    $mysqli->close();
}
 