<?php
$VERSION = "0.0.3";
$APP = 1; //SI ES: 1 CLIPP Y SI ES: 2 OTRA
$URL_IMG = "img/";
$LIMITE_REGISTROS = 50;
$LIMITE_COMBOS = 50;
$LIMITE_REGISTROS_COMBO=10;
$TITULO_SISTEMA = "Banco Tiempo";
$DESCRIPCION_SISTEMA = "Sistema de administración del Banco del tiempo";
//Ponemos la BD historica
$TOKEN_LOGIN = 'sasabbbbc12341234sasa';
//VARIABLES DE LOGIN
switch ($APP) {
    case 1:
	$BANNER = $URL_IMG . "BancoT.png";
	$APP_ICONO = $URL_IMG . "sistema/sistema_logo.png";
	$NOMBRE_APP = "UTPL PARQUEADEROS";
	break;
    case 2:
	$BANNER = $URL_IMG . "";
	$APP_ICONO = $URL_IMG . "";
	$NOMBRE_APP = "";
	break;
}

//NAVS
$NAV_1 = "";
$NAV_2 = "";
$NAV_3 = "";
/* PERFILES */
$PERFIL_CEO = 1;
$PERFIL_EMPRESARIAL = 2;
$PERFIL_CLIENTE = 3;
//$PERFIL_DISTRIBUCION = 4;
// VARIABLES DE ERROR
$MSJ_NO_EXIST_RESULT = "NO EXISTEN RESULTADOS";
$MSJ_ERROR_CONEXION = "PROBLEMAS DE CONEXIÓN CON EL SERVIDOR";
?>
