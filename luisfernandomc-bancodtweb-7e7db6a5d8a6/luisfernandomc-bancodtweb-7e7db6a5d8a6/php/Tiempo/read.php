<?php

include '../../dll/config.php';
include '../../dll/funciones.php';
if (!$_SESSION['IS_SESSION_BANCODT']) {
    echo 'ok';
    header('Location: php/Login/logout.php');
    return;
}
extract($_GET);
if (!($mysqli = getConectionDb())) {
    return $mysqli;
}

$sql = "SELECT COUNT(t.id_transaccion) AS total FROM $DB_NAME.transacciones_tiempo t INNER JOIN $DB_NAME.usuario p ON p.idUsuario = t.id_ofertante INNER JOIN $DB_NAME.usuario p1 ON p1.idUsuario = t.id_demandante WHERE TRUE ";

if (isset($param)) {
    $sql .=
        " AND ((t.descripcion_actividad) LIKE ('$param%') " .
        "OR (t.numero_horas) LIKE ('$param%')" .
        "OR (t.numero_minutos) LIKE ('$param%'))";
}
if (isset($tipo) && $tipo != '' && $tipo != 0) {
    $sql .= " AND sb.tipo =  $tipo";
}
/* if (isset($numero_miembros) && $numero_miembros != '' && $numero_miembros != 0) {
            $sql .= " AND sb.numero_miembros =  '$numero_miembros'";
    } */

$result = $mysqli->query($sql);
if (!isset($result->num_rows)) {
    echo json_encode([
        'success' => false,
        'message' => 'NO EXISTEN RESULTADOS',
        'sql' => $sql,
    ]);
    return $mysqli->close();
}
$myrow_read = $result->fetch_assoc();
$total = intval($myrow_read['total']);
if ($total > 0) {
    $sql = "SELECT t.id_transaccion, t.numero_horas, t.numero_minutos, t.descripcion_actividad, t.valoracion, t.tiempo_minutos, p.usuario AS ofertante, p1.usuario AS demandante FROM $DB_NAME.transacciones_tiempo t INNER JOIN $DB_NAME.usuario p ON p.idUsuario = t.id_ofertante INNER JOIN $DB_NAME.usuario p1 ON p1.idUsuario = t.id_demandante WHERE TRUE ";

    if (isset($param)) {
        $sql .=
            " AND ((t.descripcion_actividad) LIKE ('$param%') " .
            "OR (t.numero_horas) LIKE ('$param%')" .
            "OR (t.numero_minutos) LIKE ('$param%'))";
    }
    if (isset($tipo) && $tipo != '' && $tipo != 0) {
        $sql .= " AND sb.tipo =  $tipo";
    }

    $sql .= ' ORDER BY  t.id_transaccion ASC ';
    if (isset($limit)) {
        $inicio = intval($limit) * (intval($page) - 1);
        $sql .= " LIMIT $inicio, $limit ";
    } else {
        $sql .= " LIMIT $LIMITE_REGISTROS";
    }
    // echo $sql;

    $result = $mysqli->query($sql);
    if (!isset($result->num_rows)) {
        echo json_encode([
            'success' => false,
            'message' => 'NO EXISTEN RESULTADOS',
            'sql' => $sql,
        ]);
        return $mysqli->close();
    }
    $arreglo = [];
    while ($myrow_read = $result->fetch_assoc()) {
        $arreglo[] = [
            'id' => intval($myrow_read['id_transaccion']),
            //'tipo' => intval($myrow_read["tipo"]),
            // 'numero_horas' => $myrow_read["numero_horas"],
            'numero_minutos' => $myrow_read['numero_minutos'],
            'numero_horas' => $myrow_read['numero_horas'],
            'categoria' => $myrow_read['categoria'],
            'descripcion_actividad' => $myrow_read['descripcion_actividad'],
            'idCategoria' => $myrow_read['idCategoria'],
            'ofertante' => $myrow_read['ofertante'],
            'demandante' => $myrow_read['demandante'],
            'valoracion' => $myrow_read['valoracion'],
        ];
    }
    echo json_encode([
        'success' => true,
        'tiempos' => $arreglo,
        'total' => $total,
    ]);
} else {
    echo json_encode(['success' => true, 'tiempos' => [], 'total' => 0]);
}
$mysqli->close();
