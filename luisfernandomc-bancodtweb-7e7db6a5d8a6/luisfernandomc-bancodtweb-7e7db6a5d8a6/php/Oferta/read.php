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

$sql = "SELECT COUNT(sb.idOfertasDemandas) AS total FROM $DB_NAME.ofertas_demandas sb INNER JOIN $DB_NAME.categoria c ON c.idCategoria = sb.idCategoria WHERE TRUE ";

    if (isset($param)) {
        $sql .= " AND ((sb.descripcion_actividad) LIKE ('$param%') "
                //. "OR (sb.numero_horas) LIKE ('$param%')"
                . "OR (sb.numero_minutos) LIKE ('$param%'))";
    }
    if (isset($tipo) && $tipo != '' && $tipo != 0) {
            $sql .= " AND sb.tipo =  $tipo";
    }
    /* if (isset($numero_miembros) && $numero_miembros != '' && $numero_miembros != 0) {
            $sql .= " AND sb.numero_miembros =  '$numero_miembros'";
    } */
    
$result = $mysqli->query($sql);
if (!isset($result->num_rows)) {
    echo json_encode(array('success' => false, 'message' => "NO EXISTEN RESULTADOS", "sql" => $sql));
    return $mysqli->close();
}
$myrow_read = $result->fetch_assoc();
$total = intval($myrow_read['total']);
if ($total > 0) {
    $sql = "SELECT sb.idOfertasDemandas, sb.descripcion_actividad, sb.tipo, sb.idCategoria, sb.id_ofertante, "
            . " IF(MONTH(c.fecha_registro) < 10, DATE_FORMAT(c.fecha_registro, '%Y-0%c-%dT%H:%i:%s.000Z'), DATE_FORMAT(c.fecha_registro, '%Y-%c-%dT%H:%i:%s.000Z')) AS fecha_registro, c.categoria "
            . " FROM $DB_NAME.ofertas_demandas sb "
            . " INNER JOIN $DB_NAME.categoria c ON c.idCategoria = sb.idCategoria  WHERE TRUE ";

     if (isset($param)) {
        $sql .= " AND ((sb.descripcion_actividad) LIKE ('$param%') "
                //. "OR (sb.numero_horas) LIKE ('$param%')"
                . "OR (sb.numero_minutos) LIKE ('$param%'))";
    }
    if (isset($tipo) && $tipo != '' && $tipo != 0) {
            $sql .= " AND sb.tipo =  $tipo";
    }

    $sql .= " ORDER BY  sb.idOfertasDemandas ASC ";
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
            'id' => intval($myrow_read["idOfertasDemandas"]),
            'tipo' => intval($myrow_read["tipo"]),
           // 'numero_horas' => $myrow_read["numero_horas"],
            //'numero_minutos' => $myrow_read["numero_minutos"],
            'categoria' => $myrow_read["categoria"],
            'descripcion_actividad' => $myrow_read["descripcion_actividad"],
            'idCategoria' => $myrow_read["idCategoria"],
            'id_ofertante' => $myrow_read["id_ofertante"],
            'fecha_registro' => $myrow_read["fecha_registro"]
        );
    }
    echo json_encode(array('success' => true, 'ofertas' => $arreglo, 'total' => $total));
} else {
    echo json_encode(array('success' => true, 'ofertas' => [], 'total' => 0));
}
$mysqli->close();
