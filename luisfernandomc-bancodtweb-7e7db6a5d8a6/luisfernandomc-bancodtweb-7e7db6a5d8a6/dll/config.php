<?php

include 'version.php';
$AMBIENTE = 0; // 0 DESARROLLO | 1 PRODUCCION
$DB_NAME = "bancodt";
//$DB_NAME_HISTORICO = "clipphistorico";
if (!isset($_SESSION)) {
    session_start();
}
if (isset($_SESSION["AMBIENTE"])) {
    $_SESSION["AMBIENTE"] = $AMBIENTE;
} else {
    $_SESSION["AMBIENTE"] = $AMBIENTE;
    $_SESSION["IS_SESSION_BANCODT"] = 0;
    $_SESSION["URL_SISTEMA"] = "";
}

function getConectionDb() {
    /* Datos de servidor de base de datos */
    $DB_NAME = "bancodtuser";
    if ($_SESSION["AMBIENTE"] === 0) {
        $db_host = "167.99.191.140"; //DESARROLLO
        $db_user = "bancodtuser";  
        $db_password = "fq9!4R!G6feHJ^8x"; // usuario con acceso a base historica
//        $db_user = "LfIGfI4Nhv!SmhGU3";
//        $db_password = "hGfIU3hGfI7ZGrNhfI4342Gfn8LGfIUHg%mhG65Sl3N";
        return conectBase($db_host, $db_user, $db_password, $DB_NAME, 3306);
    } else if ($_SESSION["AMBIENTE"] === 1) {
        $db_host = "167.99.191.140"; 
        $db_user = "bancodtuser";  
        $db_password = "fq9!4R!G6feHJ^8x";
        echo "true";
        return conectBase($db_host, $db_user, $db_password, $DB_NAME, 3306);
    } else {
        echo json_encode(array('success' => false, 'message' => 'EL AMBIENTE DE FUNCIONAMIENTO NO ESTÁ CONFIGURADO CORRECTAMENTE.', 'url' => '../../index.php'));
        return;
    }
}

function conectBase($db_host, $db_user, $db_password, $DB_NAME, $puerto) {
    $mysqli = new mysqli($db_host, $db_user, $db_password, $DB_NAME, $puerto);
    $mysqli->set_charset("utf8mb4");
    if ($mysqli->connect_errno) {
        echo json_encode(array('success' => false, 'message' => "ERROR EN LA CONEXION A BASE DE DATOS"));
        return false;
    }
    return $mysqli;
}
