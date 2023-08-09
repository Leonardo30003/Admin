<?php

include '../../dll/config.php';
include '../../dll/funciones.php';
extract($_GET);
extract($_POST);
if (!$_SESSION["IS_SESSION_BANCODT"]) {
    echo 'ok';
     header("Location: php/Login/logout.php");
    return;
}
if (!$mysqli = getConectionDb())
    return $mysqli;

$sql = "SELECT u.idUsuario"
        . " FROM $DB_NAME.usuario u WHERE u.id_persona = $idUsuario AND id_rol = 2 ";


//echo $sql;
$result = $mysqli->query($sql);
if (!isset($result->num_rows)) {
    echo json_encode(array('success' => false, 'message' => "NO EXISTEN RESULTADOS"));
    return $mysqli->close();
}
$arreglo = [];
while ($myrow_read = $result->fetch_assoc()) {
    $arreglo[] = array(
        'id' => intval($myrow_read["idUsuario"])
    );
}
$mysqli->close();
echo json_encode(array('success' => true, 'data' => $arreglo));
