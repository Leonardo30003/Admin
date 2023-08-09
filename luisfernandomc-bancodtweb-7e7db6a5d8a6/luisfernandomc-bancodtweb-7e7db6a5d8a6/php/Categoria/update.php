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
    
    $sql_update = "UPDATE $DB_NAME.categoria SET ";
    $sql_update .= (isset($data->categoria)) ? "categoria = '" . $mysqli->real_escape_string($data->categoria) . "', " : "";
    $sql_update .= (isset($data->descripcion)) ? "descripcion = '" . $mysqli->real_escape_string($data->descripcion) . "', " : "";
    $sql_update .= (isset($data->imgCategoria)) ? "logo = '" . $mysqli->real_escape_string($data->imgCategoria) . "', " : "";
    if (isset($data->habilitado)) {
        $sql_update .= (isset($data->habilitado)) ? " habilitado = b'" . (int) ($data->habilitado) . "', " : "";
        if ((bool) $data->habilitado) {
            $sql_update .= 'fecha_habilitado = NOW(), ';
        } else {
            $sql_update .= 'fecha_deshabilitado = NOW(), ';
        }
    }
    $sql_update .= 'fecha_actualizacion = NOW() ';
    $sql_update .= 'WHERE idCategoria = ' . $data->id;
    $sql_update .= ';';
    //echo $sql_update;
    echo json_encode(EJECUTAR_SQL($mysqli, $sql_update, $AMBIENTE));
    $mysqli->close();
} else {
    echo json_encode(array('success' => false, 'message' => "FALTAN PARÁMETROS"));
}