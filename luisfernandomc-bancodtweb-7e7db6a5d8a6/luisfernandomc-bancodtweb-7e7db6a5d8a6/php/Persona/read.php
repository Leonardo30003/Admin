<?php

include '../../dll/config.php';
include '../../dll/funciones.php';
if (!$_SESSION["IS_SESSION_BANCODT"]) {
    echo 'ok';
         header("Location: php/Login/logout.php");

    return;
}
extract($_GET);
if (!$mysqli = getConectionDb())
    return $mysqli;

$sql = "SELECT COUNT(p.id_persona) AS total FROM $DB_NAME.persona p "
            . " INNER JOIN $DB_NAME.banco_persona bp ON bp.id_persona = p.id_persona  "
            . " INNER JOIN $DB_NAME.banco b ON bp.id_banco = b.id_banco  "
            . " WHERE TRUE ";

$result = $mysqli->query($sql);
if (!isset($result->num_rows)) {
    echo json_encode(array('success' => false, 'message' => "NO EXISTEN RESULTADOS", "sql" => $sql));
    return $mysqli->close();
}
$myrow_read = $result->fetch_assoc();
$total = intval($myrow_read['total']);
if ($total > 0) {
    $sql = "SELECT p.id_persona, p.documento_identificacion, p.nombres, p.apellidos, p.edad, p.direccion, p.telefono, p.usuario_creacion, p.eliminado, "
            . " p.fecha_creacion, IF(MONTH(p.fecha_creacion) < 10, DATE_FORMAT(p.fecha_creacion, '%Y-0%c-%dT%H:%i:%s.000Z'), DATE_FORMAT(p.fecha_creacion, '%Y-%c-%dT%H:%i:%s.000Z')) AS fecha_registro, bp.id_banco, b.nombre, p.imagen"
            . " FROM $DB_NAME.persona p "
            . " INNER JOIN $DB_NAME.banco_persona bp ON bp.id_persona = p.id_persona  "
            . " INNER JOIN $DB_NAME.banco b ON bp.id_banco = b.id_banco  "
            . " WHERE TRUE ";

    if (isset($param)) {
        $sql .= " AND ((p.nombres) LIKE ('$param%') "
                . "OR (p.apellidos) LIKE ('$param%') "
                . "OR (p.telefono LIKE '$param%')) ";
    }
    if (isset($id_persona) && $id_persona != '' && $id_persona != 0) {
            $sql .= " AND p.id_persona =  $id_persona";
    }
    if (isset($edad) && $edad != '' && $edad != 0) {
            $sql .= " AND p.edad =  $edad";
    }

    $sql .= " ORDER BY  p.id_persona ASC ";
    if (isset($limit)) {
        $inicio = intval($limit) * (intval($page) - 1);
        $sql .= " LIMIT $inicio, $limit ";
    } else {
        $sql .= " LIMIT $LIMITE_REGISTROS";
    }
// echo $sql; 

    $result = $mysqli->query($sql);
    if (!isset($result->num_rows)) {
        echo json_encode(array('success' => false, 'message' => "NO EXISTEN RESULTADOS", "sql" => $sql));
        return $mysqli->close();
    }
    $arreglo = [];
    while ($myrow_read = $result->fetch_assoc()) {
        $sql_usuarios = "SELECT u.idUsuario, u.id_rol, u.id_persona, u.usuario, u.password, u.habilitado, r.nombre_rol"
                . " FROM $DB_NAME.usuario u"
                . " INNER JOIN $DB_NAME.rol r ON r.id_rol = u.id_rol"
                . " WHERE u.id_persona = " . intval($myrow_read["id_persona"])
                . " ORDER BY u.id_persona DESC;";
        $resultUsuarios = $mysqli->query($sql_usuarios);
        $usuarios = [];

        while ($myrow_read_u = $resultUsuarios->fetch_assoc()) {
                 $usuarios[] = array(
                'id' => intval($myrow_read_u["idUsuario"]),
                'id_rol' => intval($myrow_read_u["id_rol"]),
                'id_persona' => intval($myrow_read_u["id_persona"]),
                'habilitado' => intval($myrow_read_u["habilitado"]),
                'usuario' => $myrow_read_u["usuario"],
                'password' => $myrow_read_u["password"],
                'nombre_rol' => $myrow_read_u["nombre_rol"]
            );
        }
        $arreglo[] = array(
            'id' => intval($myrow_read["id_persona"]),
            'id_persona' => intval($myrow_read["id_persona"]),
            'identificativo' => $myrow_read["documento_identificacion"],
            'nombres' => $myrow_read["nombres"],
            'apellidos' => $myrow_read["apellidos"],
            'edad' => $myrow_read["edad"],
            'direccion' => $myrow_read["direccion"],
            'telefono' => $myrow_read["telefono"],
            'id_banco' => intval($myrow_read["id_banco"]),
            'banco' => $myrow_read["nombre"],
            'imagen' => $myrow_read["imagen"],
            'usuario_creacion' => intval($myrow_read["usuario_creacion"]),
            'eliminado' => intval($myrow_read["eliminado"]),
            'fecha_registro' => $myrow_read["fecha_registro"],
            'usuarios' => $usuarios
        );
    }
    echo json_encode(array('success' => true, 'personas' => $arreglo, 'total' => $total));
} else {
    echo json_encode(array('success' => true, 'personas' => [], 'total' => 0));
}
$mysqli->close();
