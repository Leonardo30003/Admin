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
$sql = "SELECT r.id_rol, r.nombre_rol"
        . " FROM $DB_NAME.rol r WHERE TRUE ";

if (isset($param) && $param !== '') {
    $sql .= " AND (r.nombre_rol) LIKE ('%$param%') ";
}


$sql .= " ORDER BY r.id_rol DESC ";

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
        'id' => intval($myrow_read["id_rol"]),
        'text' => $myrow_read["nombre_rol"]
    );
}
$mysqli->close();
echo json_encode(array('success' => true, 'data' => $arreglo));
