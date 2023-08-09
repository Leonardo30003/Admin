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

$sql = "SELECT COUNT(sb.id_banco) AS total FROM $DB_NAME.banco sb WHERE TRUE ";

    if (isset($param)) {
        $sql .= " AND ((sb.nombre) LIKE ('$param%') "
                . "OR (sb.descripcion) LIKE ('$param%'))";
    }
    if (isset($idsucursal_banco) && $idsucursal_banco != '' && $idsucursal_banco != 0) {
            $sql .= " AND sb.id_banco =  $idsucursal_banco";
    }
    if (isset($numero_miembros) && $numero_miembros != '' && $numero_miembros != 0) {
            $sql .= " AND sb.numero_miembros =  '$numero_miembros'";
    }
    
$result = $mysqli->query($sql);
if (!isset($result->num_rows)) {
    echo json_encode(array('success' => false, 'message' => "NO EXISTEN RESULTADOS", "sql" => $sql));
    return $mysqli->close();
}
$myrow_read = $result->fetch_assoc();
$total = intval($myrow_read['total']);
if ($total > 0) {
    $sql = "SELECT sb.id_banco, sb.nombre, sb.latitud, sb.longitud, sb.descripcion, sb.logo, sb.numero_miembros"
            . " FROM $DB_NAME.banco sb WHERE TRUE ";

    if (isset($param)) {
        $sql .= " AND ((sb.nombre) LIKE ('$param%') "
                . "OR (sb.descripcion) LIKE ('$param%'))";
    }
    if (isset($idsucursal_banco) && $idsucursal_banco != '' && $idsucursal_banco != 0) {
            $sql .= " AND sb.id_banco =  $idsucursal_banco";
    }
    if (isset($numero_miembros) && $numero_miembros != '' && $numero_miembros != 0) {
            $sql .= " AND sb.numero_miembros =  '$numero_miembros'";
    }

    $sql .= " ORDER BY  sb.id_banco ASC ";
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
        $arreglo[] = array(
            'id' => intval($myrow_read["id_banco"]),
            'id_persona' => intval($myrow_read["id_banco"]),
            'nombres' => $myrow_read["nombre"],
            'latitud' => $myrow_read["latitud"],
            'longitud' => $myrow_read["longitud"],
            'descripcion' => $myrow_read["descripcion"],
            'logo' => $myrow_read["logo"],
            'numeroM' => $myrow_read["numero_miembros"]
        );
    }
    echo json_encode(array('success' => true, 'sucursales' => $arreglo, 'total' => $total));
} else {
    echo json_encode(array('success' => true, 'sucursales' => [], 'total' => 0));
}
$mysqli->close();
