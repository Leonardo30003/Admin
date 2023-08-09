<?php
//include 'isLogin.php';
include '../../dll/config.php';
include ('../../dll/funciones.php');

extract($_GET);
if (!$mysqli = getConectionDb())
    return errorLogin($MSJ_ERROR_CONEXION);

$idAdmin = $_COOKIE["ID_ADMINISTRADOR_BANCODT"];
$user = $_COOKIE["USUARIO_BANCODT"];
$latitud=  $_COOKIE["LATITUD_BANCODT"];
$longitud= $_COOKIE["LONGITUD_BANCODT"];

$sql = "SELECT a.id_persona, a.id_rol, a.usuario, a.password "
        . " FROM $DB_NAME.usuario a"
        . " WHERE a.id_persona = $idAdmin AND a.usuario = '$user' ";
$sql .= " LIMIT 1;";

//echo $sql;
$result = $mysqli->query($sql);
if (!isset($result->num_rows)) {
    echo json_encode(array('success' => false, 'message' => "NO EXISTEN RESULTADOS"));
    return $mysqli->close();
}
$arreglo = [];
while ($myrow_read_administrador = $result->fetch_assoc()) {
    $_SESSION["IS_SESSION_BANCODT"] = 1;
    $_SESSION["ID_ADMINISTRADOR"] = intval($myrow_read_administrador["id_persona"]);
    $_SESSION["USUARIO"] = ($myrow_read_administrador["usuario"]);
  /*   $_SESSION["NOMBRES"] = ($myrow_read_administrador["nombres"]);
    $_SESSION["APELLIDOS"] = ($myrow_read_administrador["apellidos"]);
    $_SESSION["CELULAR"] = $myrow_read_administrador["celular"];
    $_SESSION["CEDULA"] = $myrow_read_administrador["cedula"];
    $_SESSION["CORREO"] = $myrow_read_administrador["correo"];
    $_SESSION["PERSONA"] = ($myrow_read_administrador["apellidos"] . " " . $myrow_read_administrador["nombres"]);
    $_SESSION["IMAGEN"] = $myrow_read_administrador["imagen"];
    $_SESSION["BLOQUEADO"] = intval($myrow_read_administrador["bloqueado"]); */
    //$_SESSION["URL_SISTEMA"] = $path;
    $arreglo[] = array(
        'id' => intval($myrow_read_administrador["id_persona"]),
        'usuario' => ($myrow_read_administrador["usuario"]),
        'contrasenia' => ($myrow_read_administrador["password"]),
        'latitud' => $latitud,
        'longitud' => $longitud
    );
}
$mysqli->close();
echo json_encode(array('success' => true, 'data' => $arreglo));
