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

$sql = "SELECT COUNT(c.idCategoria) AS total FROM $DB_NAME.categoria c WHERE TRUE ";

    if (isset($param)) {
        $sql .= " AND ((c.categoria) LIKE ('$param%') "
                . "OR (c.descripcion) LIKE ('$param%')) ";
    }
    if (isset($idCategoria) && $idCategoria != '' && $idCategoria != 0) {
            $sql .= " AND c.idCategoria =  $idCategoria";
    }
    
    
$result = $mysqli->query($sql);
if (!isset($result->num_rows)) {
    echo json_encode(array('success' => false, 'message' => "NO EXISTEN RESULTADOS", "sql" => $sql));
    return $mysqli->close();
}
$myrow_read = $result->fetch_assoc();
$total = intval($myrow_read['total']);
if ($total > 0) {
    $sql = "SELECT c.idCategoria, c.categoria, IF(MONTH(c.fecha_registro) < 10, DATE_FORMAT(c.fecha_registro, '%Y-0%c-%dT%H:%i:%s.000Z'), DATE_FORMAT(c.fecha_registro, '%Y-%c-%dT%H:%i:%s.000Z')) AS fecha_registro, c.logo, c.descripcion, c.habilitado"
            . " FROM $DB_NAME.categoria c WHERE TRUE ";

    if (isset($param)) {
        $sql .= " AND ((c.categoria) LIKE ('$param%') "
                . "OR (c.descripcion) LIKE ('$param%')) ";
    }
    
    if (isset($idCategoria) && $idCategoria != '' && $idCategoria != 0) {
            $sql .= " AND c.idCategoria =  $idCategoria";
    }
    

    $sql .= " ORDER BY  c.idCategoria ASC ";
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
            'id' => intval($myrow_read["idCategoria"]),
            'categoria' => $myrow_read["categoria"],
            'descripcion' => $myrow_read["descripcion"],
             'habilitado' => intval($myrow_read["habilitado"]),
            'logo' => $myrow_read["logo"],
            'fecha_registro' => $myrow_read["fecha_registro"]
        );
    }
    echo json_encode(array('success' => true, 'categorias' => $arreglo, 'total' => $total));
} else {
    echo json_encode(array('success' => true, 'categorias' => [], 'total' => 0));
}
$mysqli->close();
