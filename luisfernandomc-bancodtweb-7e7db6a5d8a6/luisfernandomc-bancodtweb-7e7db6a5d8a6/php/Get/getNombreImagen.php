<?php

include '../../dll/config.php';
if (!$_SESSION["IS_SESSION_BANCODT"]) {
    echo 'ok';
     header("Location: php/Login/logout.php");
    return;
}
include '../../dll/funciones.php';
extract($_GET);
extract($_POST);
if (!$mysqli = getConectionDb())
    return;

$tabla;
$id;

$sql = "SELECT MAX($id) AS id"
    . " FROM $DB_NAME.$tabla "
    . " WHERE TRUE";

//echo $sql;
$result = EJECUTAR_SELECT($mysqli, $sql);
if (!isset($result->num_rows)) {
    echo json_encode(array('success' => false, 'message' => "NO EXISTEN RESULTADOS"));
    return $mysqli->close();
}
$myrow_read = $result->fetch_assoc();
$id = intval($myrow_read['id']);
$mysqli->close();
echo json_encode(array('success' => true, 'id' => $id));

