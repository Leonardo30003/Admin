<?php

include '../../dll/config.php';
include '../../dll/funciones.php';
if (!$mysqli = getConectionDb())
    return errorLogin($MSJ_ERROR_CONEXION);
extract($_POST);
$sqlU = "SELECT u.id_persona FROM $DB_NAME.usuario u WHERE u.usuario = '$usuario' AND u.id_rol = 1 LIMIT 1;";
$resultU = $mysqli->query($sqlU);
if ($resultU->num_rows > 0) {
    $myrowU = $resultU->fetch_assoc();
    if (isset($_GET['ps'])) {
        /* $sqlC = "SELECT a.idAdministrador,a.usuario, a.contrasenia, 
            IF(a.bloqueado=0,0,1) AS bloqueado 
            FROM $DB_NAME.administrador a 
            WHERE a.contrasenia = '$contrasenia' 
            AND a.idAdministrador = '" . $myrowU['idAdministrador'] . "' 
            LIMIT 1;"; */
         $sqlC = "SELECT u.id_persona, u.id_rol, u.usuario
            FROM $DB_NAME.usuario u 
            WHERE u.password = ('$contrasenia') 
            AND u.id_persona = '" . $myrowU['id_persona'] . "' 
            AND u.id_rol = 1
            LIMIT 1;";
             //echo $sqlC;
    } else{
       /*  $sqlC = "SELECT a.idAdministrador,a.usuario, a.contrasenia, 
            IF(a.bloqueado=0,0,1) AS bloqueado 
            FROM $DB_NAME.administrador a 
            WHERE a.contrasenia = MD5(CONCAT('$contrasenia' , '$TOKEN_LOGIN')) 
            AND a.idAdministrador = '" . $myrowU['idAdministrador'] . "' 
            LIMIT 1;"; */
        $sqlC = "SELECT u.id_persona, u.id_rol, u.usuario
            FROM $DB_NAME.usuario u 
            WHERE u.password = MD5(CONCAT('$contrasenia' , '$TOKEN_LOGIN')) 
            AND u.id_persona = '" . $myrowU['id_persona'] . "' 
            AND u.id_rol = 1
            LIMIT 1;";
            //echo $sqlC;
    }
    $result = $mysqli->query($sqlC);
    if ($result->num_rows > 0) {
        $myrow = $result->fetch_assoc();
        /* if (intval($myrow['bloqueado']) == 1) {
            echo json_encode(array('success' => FALSE, 'message' => "Lo sentimos pero el adminsitrador que proporcionaste se encuentra bloqueado."));
        } else {
            $sqlModulos = "SELECT IF(ma.inicio=1,1,0) AS inicio, m.modulo,m.path, m.vista, m.tipo 
                FROM $DB_NAME.moduloAdministrador ma 
                INNER JOIN $DB_NAME.modulo m ON ma.idModulo = m.idModulo AND m.tipo=1
                WHERE ma.leer = 1 
                AND ma.idAdministrador=" . intval($myrow["idAdministrador"]) . " ORDER BY ma.inicio DESC LIMIT 1;";
            $sqlViewModulos = "SELECT IF(ma.inicio=1,1,0) AS inicio, m.modulo, m.path, m.vista, m.vistaPath, m.tipo  
                FROM $DB_NAME.moduloAdministrador ma 
                INNER JOIN $DB_NAME.modulo m ON ma.idModulo = m.idModulo AND m.tipo=1
                WHERE ma.leer = 1 
                AND ma.idAdministrador=" . intval($myrow["idAdministrador"]) . " ORDER BY ma.inicio DESC;";
            $resultModulos = $mysqli->query($sqlModulos);
            $resultViewModulos = $mysqli->query($sqlViewModulos);

            $sqlModulosId = "SELECT mo.modulo, ma.idModulo, ma.leer, ma.crear, ma.editar, ma.eliminar, mo.tipo 
                FROM $DB_NAME.moduloAdministrador ma  
                INNER JOIN $DB_NAME.modulo mo ON ma.idModulo = mo.idModulo AND mo.tipo=1
                WHERE idAdministrador = " . intval($myrow["idAdministrador"]) . "";
            $resultModulosId = $mysqli->query($sqlModulosId);

            $objJson = "[";
            $objJson .= "'Ext.button.Segmented',";
            $objJson .= "'Ext.list.Tree',";
            $objJson .= "'bancodt.view.main.c_Main',";
            $objJson .= "'bancodt.view.main.MainContainerWrap',";
            $objJson .= "'bancodt.view.main.MainModel',";
            $objJson .= "'bancodt.view.404.v_SinModulo',";
            while ($myrowViewModulos = $resultViewModulos->fetch_assoc()) {
                if ($myrowViewModulos["vistaPath"] !== '' ) { 
                    $objJson .= "'" . $myrowViewModulos["vistaPath"] . "',";
                }
            }
            $objJson .= "]";

            $arreglo = array();
            while ($myrowModulosId = $resultModulosId->fetch_assoc()) {
                    $arreglo[] = array(
                        'Modulo' => $myrowModulosId["modulo"],
                        'IdModulo' => intval($myrowModulosId["idModulo"]),
                        'leer' => $myrowModulosId["leer"],
                        'crear' => $myrowModulosId["crear"],
                        'editar' => $myrowModulosId["editar"],
                        'eliminar' => $myrowModulosId["eliminar"]
                    );
            }
            $_SESSION["arreglo"] = $arreglo;

            if ($resultModulos->num_rows <= 0) {
                echo json_encode(
                        array('success' => false, 'message' => "SU USUARIO NO TIENE ASIGNADO MÓDULOS POR FAVOR LLAMAR A SOPORTE TÉCNICO PARA QUE SOLVENTE EL PROBLEMA"));
            } else {
                $myrowModulos = $resultModulos->fetch_assoc();
                $_SESSION["IS_SESSION_BANCODT"] = 1;
                $_SESSION["URL_SISTEMA"] = $myrowModulos['path'];
                $_SESSION["VIEW_bancodt"] = $objJson;
                echo json_encode(
                        array('success' => true,
                            'VIEW_bancodt' => $objJson,
                            'MODULO' => array('INICIO' => intval($myrowModulos['inicio']),
                                'MODULO' => $myrowModulos['modulo'],
                                'PATH' => $myrowModulos['path'],
                                'VISTA' => $myrowModulos['vista']
                            ),
                            'sesion' => array('ID_ADMINISTRADOR' => intval($myrow["idAdministrador"]),
                                'USUARIO' => $myrow["usuario"],
                                'LAT_U' => $latitud,
                                'LNG_U' => $longitud
                            )
                        )
                );
            }
        } */
         $_SESSION["IS_SESSION_BANCODT"] = 1;
        $_SESSION["URL_SISTEMA"] = 'admin.php';
        //$_SESSION["VIEW_bancodt"] = $objJson;
        echo json_encode(
                        array('success' => true, 'sesion' => array('ID_ADMINISTRADOR' => intval($myrow["id_persona"]),
                                'USUARIO' => $myrow["usuario"],
                                'LAT_U' => $latitud,
                                'LNG_U' => $longitud
                            ))
                );
    } else
        echo json_encode(array('success' => false, 'message' => "LA CONTRASEÑA QUE HA INGRESADO ES INCORRECTA."));
} else
    echo json_encode(array('success' => false, 'message' => "EL USUARIO QUE HA INGRESADO ES INCORRECTO."));
$mysqli->close();
