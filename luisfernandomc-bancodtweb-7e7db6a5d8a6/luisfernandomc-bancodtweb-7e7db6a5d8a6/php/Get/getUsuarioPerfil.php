<?php

include '../../dll/config.php';
include '../../dll/funciones.php';
//extract($_GET);
extract($_POST);
if (!$_SESSION["IS_SESSION_BANCODT"]) {
    echo 'ok';
     header("Location: php/Login/logout.php");
    return;
}
if (!$mysqli = getConectionDb())
    return $mysqli;

$usuario = $_COOKIE["USUARIO_BANCODT"];

$sql_perfil_administrador = "SELECT id_rol, nombre_rol  FROM bancodt.rol r
INNER JOIN bancodt.persona_has_rol  pr ON pr.rol_id_rol = r.id_rol
WHERE pr.usuario = '$usuario';";

if (isset($limite)) {
    $sql_perfil_administrador .= " LIMIT $limite";
} else {
    $sql_perfil_administrador .= " LIMIT $LIMITE_REGISTROS";
}
$sql_perfil_administrador .=";";

$result = $mysqli->query($sql_perfil_administrador);
if (!isset($result->num_rows)) {
    echo json_encode(array('success' => false, 'message' => "NO EXISTEN RESULTADOS", 'sql' => $sql_perfil_administrador));
    return $mysqli->close();
}
$arreglo = [];
while ($myrow_read_perfilAdministrador = $result->fetch_assoc()) {

    $arreglo[] = array(
        'idPerfil' => intval($myrow_read_perfilAdministrador["id_rol"]),
        'perfil' => ($myrow_read_perfilAdministrador["nombre_rol"])
    );
}
$mysqli->close();
echo json_encode(array('success' => TRUE, 'data' => $arreglo));

