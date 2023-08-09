<?php
include 'isLogin.php'; 
include '../../dll/config.php';
include '../../dll/funciones.php';
if (!$mysqli = getConectionDb())
    return errorLogin($MSJ_ERROR_CONEXION);
extract($_POST);
if ($idAdministrador === "") {
    echo json_encode(array('success' => false, 'message' => "EL USUARIO QUE HA INGRESADO ES INCORRECTO."));
    return;
}
$sql = "SELECT a.idAdministrador, a.usuario, a.nombres, a.apellidos, a.celular, a.cedula, a.correo,"
        . " a.imagen, if(a.bloqueado = 1,1,0) AS bloqueado "
        . " FROM $DB_NAME.administrador a"
        . " WHERE a.idAdministrador = $idAdministrador AND a.usuario = '$usuario' LIMIT 1;";
//echo $sql;
$result = $mysqli->query($sql);
if ($result->num_rows > 0) {
    $myrow = $result->fetch_assoc();
    $_SESSION["IS_SESSION_BANCODT"] = 1;
    $_SESSION["ID_ADMINISTRADOR"] = intval($myrow["idAdministrador"]);
    $_SESSION["USUARIO"] = ($myrow["usuario"]);
    $_SESSION["NOMBRES"] = ($myrow["nombres"]);
    $_SESSION["APELLIDOS"] = ($myrow["apellidos"]);
    $_SESSION["CELULAR"] = $myrow["celular"];
    $_SESSION["CEDULA"] = $myrow["cedula"];
    $_SESSION["CORREO"] = $myrow["correo"];
    $_SESSION["PERSONA"] = ($myrow["apellidos"] . " " . $myrow["nombres"]);
    $_SESSION["IMAGEN"] = $myrow["imagen"];
    $_SESSION["BLOQUEADO"] = intval($myrow["bloqueado"]);
    $_SESSION["URL_SISTEMA"] = $path;

    $sqlModulos = "SELECT ma.idModulo, m.modulo, m.path, m.vista, m.icono, m.idModuloPadre, mp.padre, mp.icono as iconoPadre, "
            . "IF(ma.leer = 0, 0, 1) AS leer, IF(ma.crear = 0, 0, 1) AS crear, IF(ma.editar = 0, 0, 1) AS editar, IF(ma.eliminar = 0, 0, 1) AS eliminar "
            . "FROM $DB_NAME.modulo_perfil mpa "
            . "INNER JOIN $DB_NAME.moduloAdministrador ma ON ma.idModulo = mpa.idModulo AND ma.idAdministrador = " . intval($myrow["idAdministrador"]) . "
                            AND ma.leer = 1 "
            . "INNER JOIN $DB_NAME.perfil_administrador pa ON pa.idPerfil = mpa.idPerfil
                            AND pa.idAdministrador = " . intval($myrow["idAdministrador"]) . "
                            AND pa.habilitado = 1 "
            . "INNER JOIN $DB_NAME.modulo m ON ma.idModulo = m.idModulo AND m.tipo=1 "
            . "LEFT JOIN $DB_NAME.moduloPadre mp ON mp.idModuloPadre = m.idModuloPadre GROUP BY mpa.idModulo ORDER BY m.orden ASC;";
            //. "WHERE ma.leer = 1 AND ma.idAdministrador=" . intval($myrow["idAdministrador"]) . ";";
//            echo $sqlModulos;
    $resultModulos = $mysqli->query($sqlModulos);
    if ($resultModulos->num_rows <= 0) {
        echo json_encode(array('success' => false, 'message' => "SU USUARIO NO TIENE ASIGNADO MÓDULOS POR FAVOR LLAMAR A SOPORTE TÉCNICO PARA QUE SOLVENTE EL PROBLEMA"));
    } else {
        $_SESSION["IS_SESSION_BANCODT"] = 1;
        $arrPadres = $arrHijos = [];
        while ($myrowModulos = $resultModulos->fetch_assoc()) {
            $permisos = array('leer' => intval($myrowModulos['leer']), 
                'crear' => intval($myrowModulos['crear']), 
                'editar' => intval($myrowModulos['editar']), 
                'eliminar' => intval($myrowModulos['eliminar']));
            
            if (isset($myrowModulos['idModuloPadre'])) {
                $arrHijos[] = array(
                    'id' => $myrowModulos['vista'],
                    'iconCls' => $myrowModulos['icono'],
                    'viewType' => $myrowModulos['vista'],
                    'text' => $myrowModulos['modulo'],
                    'name' => $myrowModulos['modulo'],
                    'PATH' => $myrowModulos['path'],
                    'padre' => $myrowModulos['padre'],
                    'leaf' => true,
                    'rowCls' => 'nav-tree-badge',
                    'permisos' => $permisos);

                $arrPadres[$myrowModulos['padre']] = array(
                    'id' => $myrowModulos['idModuloPadre'],
                    'iconCls' => $myrowModulos['iconoPadre'],
                    'text' => $myrowModulos['padre'],
                    'rowCls' => 'nav-tree-badge',
                    'selectable' => false);
            } else {
                $arraModulos[] = array(
                    'id' => $myrowModulos['vista'],
                    'iconCls' => $myrowModulos['icono'],
                    'viewType' => $myrowModulos['vista'],
                    'text' => $myrowModulos['modulo'],
                    'name' => $myrowModulos['modulo'],
                    'PATH' => $myrowModulos['path'],
                    'leaf' => true,
                    'rowCls' => 'nav-tree-badge',
                    'permisos' => $permisos);
            }
        }
        foreach ($arrHijos as $hijo) {
            $arrPadres[$hijo['padre']]['children'][] = $hijo;
        }
        foreach ($arrPadres as $padre) {
            $arraModulos[] = $padre;
        }
        
        //Cargar perfiles  
        $sqlPerfiles = "SELECT pa.idPerfil, p.perfil, IF(pa.habilitado = 1, 1, 0) AS habilitado"
                    . " FROM $DB_NAME.perfil_administrador pa"
                    . " INNER JOIN $DB_NAME.perfil p ON pa.idPerfil = p.idPerfil"
                    . " WHERE pa.idAdministrador = $idAdministrador AND pa.habilitado = 1 ";
//            echo $sqlPerfiles;    
        $resultPerfiles = $mysqli->query($sqlPerfiles);
            $arrayPerfiles = [];
            if ($resultPerfiles->num_rows > 0) {
                while ($myrowPerfiles = $resultPerfiles->fetch_assoc()) {
                    $arrayPerfiles[] = array(
                        'idPerfil' => (int) $myrowPerfiles['idPerfil'],
                        'perfil' => $myrowPerfiles['perfil'],
                        'habilitado' => $myrowPerfiles['habilitado']
                    );
                }
            }
            $_SESSION["PERFILES"] = $arrayPerfiles;
            $PERFIL_ASIGNADO = [];
            foreach ($_SESSION["PERFILES"] AS $data) {
                $PERFIL_ASIGNADO[] = $data['idPerfil'];
            }
            $_SESSION['PERFILES_ASIGNADOS'][1] = array_search(1, $PERFIL_ASIGNADO);
            $_SESSION['PERFILES_ASIGNADOS'][2] = array_search(2, $PERFIL_ASIGNADO);
            $_SESSION['PERFILES_ASIGNADOS'][3] = array_search(3, $PERFIL_ASIGNADO);
            $_SESSION['PERFILES_ASIGNADOS'][4] = array_search(4, $PERFIL_ASIGNADO);
//            $sqlConfiguraciones = "SELECT ae.idEtiqueta, ae.valor "
//                    . " FROM $DB_NAME.administrador_etiqueta ae "
//                    . " WHERE ae.idAdministrador = $idAdministrador AND ae.habilitado = 1 ";
//            echo $sqlConfiguraciones;
//            $resultConfiguraciones = $mysqli->query($sqlConfiguraciones);
//            $arrayConfiguraciones = [];
//            if ($resultConfiguraciones->num_rows > 0) {
//                while ($myrowConfiguraciones = $resultConfiguraciones->fetch_assoc()) {
//                    $arrayConfiguraciones[] = array(
//                        'idEtiqueta' => (int) $myrowConfiguraciones['idEtiqueta'],
//                        'valor' => $myrowConfiguraciones['valor']
//                    );
//                }
//            }
        
        
        
        echo json_encode(array('success' => true, 'children' => $arraModulos, 'message' => "BIENVENIDO " . strtoupper($_SESSION["PERSONA"]) . " AL SISTEMA DE $NOMBRE_APP",
            'usuario' => array('ID_ADMINISTRADOR' => $_SESSION["ID_ADMINISTRADOR"], 'USUARIO' => $_SESSION["USUARIO"], 'NOMBRES' => $_SESSION["NOMBRES"],
                'APELLIDOS' => $_SESSION["APELLIDOS"], 'CELULAR' => $_SESSION["CELULAR"], 'CEDULA' => $_SESSION["CEDULA"], 'CORREO' => $_SESSION["CORREO"],
                'PERSONA' => $_SESSION["PERSONA"], 'IMAGEN' => $_SESSION["IMAGEN"], 'BLOQUEADO' => $_SESSION["BLOQUEADO"], 'URL_SISTEMA' => $_SESSION["URL_SISTEMA"])));
    }
} else
    echo json_encode(array('success' => false, 'message' => "EL USUARIO QUE HA INGRESADO ES INCORRECTO."));
$mysqli->close();
