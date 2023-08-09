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

    $habilitado = 0;
    $habil = "";
    $varhabil = "";
    if (isset($data->habilitado)) {
        if ((bool) $data->habilitado) {
            $habilitado = 1;
            $habil = ' fecha_habilitado';
            $varhabil = ',NOW()';
        } else {
            $habil = 'fecha_deshabilitado';
            $varhabil = ',NOW()';
        }
    }

    $sql_crear = "INSERT INTO $DB_NAME.categoria "
            . "(categoria, descripcion, logo, habilitado, $habil, fecha_registro) "
            . "VALUES "
            . "('" . $mysqli->real_escape_string($data->categoria) . "'"
            . ", '" . $mysqli->real_escape_string($data->descripcion) . "'"
            . ", '" . $data->imgCategoria . "'"
            . ", b'" . intval($data->habilitado) . "'"
            . $varhabil
            . ", NOW());";
    //echo $sql_crear;
    echo json_encode(EJECUTAR_SQL($mysqli, $sql_crear, $AMBIENTE));
    //$res = EJECUTAR_SQL($mysqli, $sql_crear, $AMBIENTE);
    $mysqli->close();
} else {
    echo json_encode(array('success' => false, 'message' => "FALTAN PARÁMETROS"));
}
