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
if (isset($data)) {
    if (!$mysqli = getConectionDb())
        return $mysqli;

    $sql_crear = "INSERT INTO $DB_NAME.persona "
            . "(nombres, apellidos, edad, documento_identificacion, telefono, direccion, imagen, eliminado, usuario_creacion, fecha_creacion) "
            . "VALUES "
            . "('" . $mysqli->real_escape_string($data->nombres) . "'"
            . ", '" . $mysqli->real_escape_string($data->apellidos) . "'"
            . ", " . $data->edad
            . ", '" . $data->identificativo . "'"
            . ", '" . $data->telefono . "'"
            . ", '" . $data->direccion . "'"
            . ", '" . $data->imgPersona . "'"
            . ", b'" . intval($data->eliminado) . "'"
            . ", b'" . 0 . "'"
            . ", NOW());";
    //echo $sql_crear;
    //echo json_encode(EJECUTAR_SQL($mysqli, $sql_crear, $AMBIENTE));
    $res = EJECUTAR_SQL($mysqli, $sql_crear, $AMBIENTE);
    $ins = 0;
    if (isset($res['id'])) {
        if (intval($res['id']) > 0) {
            $listaUsuario = json_decode($listaTipoUsuario);
            if (count($listaUsuario) > 0) {
                foreach ($listaUsuario as $v) {
                    if ((bool) $v->nuevo) {
                        if ((bool) $v->habilitado) {
                        $sql_create_usuario = "INSERT INTO $DB_NAME.usuario"
                        . "(id_rol, id_persona, usuario, password, habilitado) "
                        . "VALUES (" . $v->id_rol . "," . $res['id'] . ""
                        . ", '" . $v->usuario . "'"
                        . ", MD5(CONCAT('" . $v->password . "' , '$TOKEN_LOGIN'))"
                        . ", " . $v->habilitado . ""
                        . ");";
                        } else {
                            $sql_create_usuario = "INSERT INTO $DB_NAME.usuario"
                        . "(id_rol, id_persona, usuario, password, habilitado) "
                        . "VALUES (" . $v->id_rol . "," . $res['id'] . ""
                        . ", '" . $v->usuario . "'"
                        . ", MD5(CONCAT('" . $v->password . "' , '$TOKEN_LOGIN'))"
                        . ", " . $v->habilitado . ""
                        . ");";
                        }
                    }
                    //echo $sql_create_usuario;
                    EJECUTAR_SQL($mysqli, $sql_create_usuario, $AMBIENTE);
                }
            }

            $sql_banco = "INSERT INTO $DB_NAME.banco_persona"
            . "(id_banco, id_persona )"
            . "VALUES (" . $data->id_banco . "," . $res['id'] . ");";

             EJECUTAR_SQL($mysqli, $sql_banco, $AMBIENTE);

            echo json_encode($res, $ins);
        } else {
            echo json_encode(array('success' => false, 'message' => "NO SE PUDO INSERTAR LA PERSONA" . (($AMBIENTE == 0) ? $sql_crear : "")));
        }
    } else {
        echo json_encode(array('success' => false, 'message' => "NO SE PUDO INSERTAR LA PERSONA" . (($AMBIENTE == 0) ? $sql_crear : "")));
    }
    $mysqli->close();
} else {
    echo json_encode(array('success' => false, 'message' => "FALTAN PARÁMETROS"));
}
