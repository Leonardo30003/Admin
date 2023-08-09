<?php

include ('../../dll/config.php');
include ('../../dll/funciones.php');
extract($_POST);
if (!$mysqli = getConectionDb())
    return errorLogin($MSJ_ERROR_CONEXION);
if (isset($usuario)) {
    $sql = "SELECT count(*) as total FROM $DB_NAME.usuario a WHERE a.usuario = '$usuario' LIMIT 1; ";
    $result = $mysqli->query($sql);

    if (!isset($result->num_rows)) {
        echo json_encode(array('success' => false, 'message' => "NO EXISTEN RESULTADOS", "sql" => $sql));
        return $mysqli->close();
    }
    $myrow_read = $result->fetch_assoc();
    $total = intval($myrow_read['total']);

    if ($total > 0) {
        echo json_encode(array('success' => true, 'message' => "USUARIO ENCONTRADO"));
        $mysqli->close();
    } else {
        echo json_encode(array('success' => false, 'message' => "NO EXISTEN RESULTADOS", "sql" => $sql));
        $mysqli->close();
    }
}
 