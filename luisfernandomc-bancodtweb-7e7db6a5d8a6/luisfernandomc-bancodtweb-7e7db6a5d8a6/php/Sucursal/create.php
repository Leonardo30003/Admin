<?php

include '../../dll/config.php';
include '../../dll/funciones.php';
if (!$_SESSION["IS_SESSION_BANCODT"]) {
    echo 'ok';
         header("Location: php/Login/logout.php");
    return;
}
extract($_GET);
extract($_POST);
$arrayData = array();
$data = json_decode(file_get_contents('php://input'));
if (isset($data)) {
    if (!$mysqli = getConectionDb())
        return $mysqli;

    $sql_crear = "INSERT INTO $DB_NAME.banco "
            . "(nombre, latitud, longitud, descripcion, logo, numero_miembros, fecha_registro) "
            . "VALUES "
            . "('" . $mysqli->real_escape_string($data->nombres) . "'"
            . ", " . $data->latitud 
            . ", " . $data->longitud 
            . ", '" . $data->descripcion . "'"
            . ", '" . $data->imgBanco . "'"
            . ", '" . $data->numeroM . "'"
            . ", NOW());";
    //echo $sql_crear;
    echo json_encode(EJECUTAR_SQL($mysqli, $sql_crear, $AMBIENTE));
    $mysqli->close();
} else {
    echo json_encode(array('success' => false, 'message' => "FALTAN PARÁMETROS"));
}
