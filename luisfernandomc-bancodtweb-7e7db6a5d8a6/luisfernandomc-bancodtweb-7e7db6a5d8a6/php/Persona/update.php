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
if (isset($data->id)) {
    if (!$mysqli = getConectionDb())
        return $mysqli;
    
    $sql_update = "UPDATE $DB_NAME.persona SET ";
    $sql_update .= (isset($data->nombres)) ? "nombres = '" . $mysqli->real_escape_string($data->nombres) . "', " : "";
    $sql_update .= (isset($data->apellidos)) ? "apellidos = '" . $mysqli->real_escape_string($data->apellidos) . "', " : "";
    $sql_update .= (isset($data->telefono)) ? "telefono = '$data->telefono', " : "";
    $sql_update .= (isset($data->direccion)) ? "direccion = '" . $mysqli->real_escape_string($data->direccion) . "', " : "";
    $sql_update .= (isset($data->edad)) ? "edad = $data->edad, " : "";
    $sql_update .= (isset($data->imgPersona)) ? "imagen = '" . $data->imgPersona. "',  " : "";
    $sql_update .= (isset($data->identificativo)) ? "documento_identificacion = '$data->identificativo', " : "";
    $sql_update .= (isset($data->eliminado)) ? "eliminado = b'" . intval($data->eliminado) . "', " : "";
    $sql_update .= 'fecha_actualizacion = NOW() ';
    $sql_update .= 'WHERE id_persona = ' . $data->id;
    $sql_update .= ';';
//    echo $sql_update;
    echo json_encode(EJECUTAR_SQL($mysqli, $sql_update, $AMBIENTE));

    $listaUsuarios = json_decode($listaUsuarios);

    if (count($listaUsuarios) > 0) {
        foreach ($listaUsuarios as $v) {
            if ((bool) $v->nuevo) {
                if ((bool) $v->habilitado) {
                    $sql_create_update = "INSERT INTO $DB_NAME.usuario "
                        . " (id_rol, id_persona, habilitado, usuario, password) "
                        . "VALUES (" . $v->id_rol . ", " . $data->id . ""
                            . ", " . $v->habilitado . "" . ", '" . $v->usuario . "'"
                            . ", MD5(CONCAT('" . $v->password . "' , '$TOKEN_LOGIN'))" . ");";

                            //echo $sql_create_update;
                } else {
                    $sql_create_update = "INSERT INTO $DB_NAME.usuario "
                        . " (id_rol, id_persona, habilitado, usuario, password) "
                        . "VALUES (" . $v->id_rol . ", " . $data->id . ""
                            . ", " . $v->habilitado . "" . ", '" . $v->usuario . "'"
                            . ", MD5(CONCAT('" . $v->password . "' , '$TOKEN_LOGIN'))" . ");";
                }
            } else {
                if ((bool) $v->habilitado) {
                    $sql_create_update = "UPDATE $DB_NAME.usuario SET "
                            . " habilitado = b'$v->habilitado', "
                            . " id_rol = $v->id_rol, "
                            . " usuario = '$v->usuario', "
                            . " password = MD5(CONCAT('" . $v->password . "' , '$TOKEN_LOGIN')) "
                            . " WHERE idUsuario = $v->id ;";
                            //echo $sql_create_update;
                } else {
                    $sql_create_update = "UPDATE $DB_NAME.usuario SET "
                            . " habilitado = b'$v->habilitado', "
                            . " id_rol = $v->id_rol, "
                            . " usuario = '$v->usuario', "
                            . " password = MD5(CONCAT('" . $v->password . "' , '$TOKEN_LOGIN')) "
                            . " WHERE idUsuario = $v->id ;";
                }
            }
            //echo $sql_create_update;
            EJECUTAR_SQL($mysqli, $sql_create_update, $AMBIENTE);
        }
    }

    if(isset($idBancoA)){
        $sql_update_banco = "UPDATE $DB_NAME.banco_persona SET ";
        $sql_update_banco .= (isset($data->id_banco)) ? "id_banco = " . $data->id_banco . " " : "";
        $sql_update_banco .= 'WHERE id_persona = ' . $data->id . ' AND id_banco = ' . $idBancoA;
        $sql_update_banco .= ';';
        //echo $sql_update_banco;
        EJECUTAR_SQL($mysqli, $sql_update_banco, $AMBIENTE);
    }

    $mysqli->close();
} else {
    echo json_encode(array('success' => false, 'message' => "FALTAN PARÁMETROS"));
}