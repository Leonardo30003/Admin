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


if (!$mysqli = getConectionDb())
        return $mysqli;

    $sql_crear = "INSERT INTO $DB_NAME.transacciones_tiempo (numero_horas, descripcion_actividad, id_ofertante, id_demandante, valoracion) VALUES "
                . "(" . $monto . ","
                .  "'" . $detalle . "',"
                .  1 . ","
                .  $idUsuarioRecibe . ","
                .  $valoracion 
                . ");";
    //echo $sql_crear;
    echo json_encode(EJECUTAR_SQL($mysqli, $sql_crear, $AMBIENTE));
    $mysqli->close();
    

?>