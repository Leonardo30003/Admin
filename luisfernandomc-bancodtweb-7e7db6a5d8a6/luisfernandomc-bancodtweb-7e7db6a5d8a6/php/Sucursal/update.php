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
if (isset($data->id)) {
    if (!$mysqli = getConectionDb())
        return $mysqli;
    
    $sql_update = "UPDATE $DB_NAME.banco SET ";
    $sql_update .= (isset($data->nombres)) ? "nombre = '" . $mysqli->real_escape_string($data->nombres) . "', " : "";;
    $sql_update .= (isset($data->latitud)) ? "latitud = $data->latitud, " : "";
    $sql_update .= (isset($data->longitud)) ? "longitud = $data->longitud, " : "";
    $sql_update .= (isset($data->descripcion)) ? "descripcion = '" . $mysqli->real_escape_string($data->descripcion) . "', " : "";
    $sql_update .= (isset($data->numeroM)) ? "numero_miembros = '" . $data->numeroM . "', ": "";
    $sql_update .= (isset($data->imgBanco)) ? "logo = '$data->imgBanco', " : "";
    $sql_update .= 'fecha_actualizacion = NOW() ';
    $sql_update .= 'WHERE id_banco = ' . $data->id;
    $sql_update .= ';';
//    echo $sql_update;
    echo json_encode(EJECUTAR_SQL($mysqli, $sql_update, $AMBIENTE));
    $mysqli->close();
} else {
    echo json_encode(array('success' => false, 'message' => "FALTAN PARÁMETROS"));
}