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
$sql = "SELECT b.id_banco, b.nombre, b.montoInicial"
        . " FROM $DB_NAME.banco b WHERE TRUE ";

if (isset($param) && $param !== '') {
    $sql .= " AND (b.nombre) LIKE ('%$param%') ";
}
if (isset($id_banco) && $id_banco !== '' && $id_banco > 0) {
    $sql .= " AND b.id_banco = $id_banco ";
}

$sql .= " ORDER BY b.id_banco DESC ";

if (isset($limite)) {
    $sql .= " LIMIT $limite";
} else {
    $sql .= " LIMIT $LIMITE_REGISTROS";
}
//echo $sql;
$result = $mysqli->query($sql);
if (!isset($result->num_rows)) {
    echo json_encode(array('success' => false, 'message' => "NO EXISTEN RESULTADOS"));
    return $mysqli->close();
}
$arreglo = [];
while ($myrow_read = $result->fetch_assoc()) {
    $arreglo[] = array(
        'id' => intval($myrow_read["id_banco"]),
        'text' => $myrow_read["nombre"],
        'montoInicial' =>  intval($myrow_read["montoInicial"]),
    );
}
$mysqli->close();
echo json_encode(array('success' => true, 'data' => $arreglo));
