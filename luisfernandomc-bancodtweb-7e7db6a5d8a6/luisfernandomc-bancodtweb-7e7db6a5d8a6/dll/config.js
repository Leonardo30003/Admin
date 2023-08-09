//VARIABLES DEL SISTEMA
var SISTEMA = 1; //SI ES: 1 CLIPP Y SI ES: 2 OTRA
var APP = "";
var TITULO_LOGIN = "";
var TITULO_MAIN_APP = "";
/* --------------------------------------- */
//Obtiene la URL en que se encuentra el usuario
var URL_ACTUAL = window.location;
/* --------------------------------------- */
var TIEMPO_INACTIVIDAD = 1800000; //TIEMPO DE INACTIVIDAD QUE SOPORTA EL SISTEMA EN MILISEGUNDOS 300000 = 5 MINUTOS o 1800000 = 30 MINUTOS
var TITULO_MAIN_APP = "MEJORANDO LA CALIDAD DE VIDA Y EXPERIENCIA  DE LAS PERSONAS";
switch (SISTEMA) {
    case 1:
        break;
        APP = "";
        TITULO_LOGIN = "Bienvenido a " + APP;
        //MAIN
        TITULO_MAIN_APP = APP + " de estacionamiento rotativo tarifario";
    case 2:
        APP = "";
        TITULO_LOGIN = "Bienvenido a " + APP;
        //MAIN
        TITULO_MAIN_APP = APP + "";
        break;
}
var USUARIO = {};
var MODULOS = [];
var FECHA_ACTUAL = new Date();
var WIDTH_NAVEGACION = 220;
var HEIGT_VIEWS = 0;
var WIDTH_VIEWS = 0;
if (document.body) {
    WIDTH_VIEWS = (document.body.clientWidth);
    HEIGT_VIEWS = (document.body.clientHeight);
} else {
    WIDTH_VIEWS = (window.innerWidth);
    HEIGT_VIEWS = (window.innerHeight);
}
HEIGT_VIEWS = HEIGT_VIEWS - 65;
var COLOR_SISTEMA = '#3ed3bc';
var TIEMPOMIN = 30; //Cambiar colores de fechas en ficha de pedido
var TIPO = 2; //1 APP MOVIL | 2 APP WEB
//====VARIABLES IMPORTANTES====
var COLOR_SISTEMA2 = '#3ed3bc';
var TOKEN_MAPBOX = "pk.eyJ1Ijoia2F0aWVuY2lhcCIsImEiOiJjamN1a3VkbTUxMHllMnduemQ3OTh1ajB5In0.DDiBB1jMawcG_4IRpHNjiQ";
//URL DE LOS SERVICIOS 
var PUERTO = 3001;
var PUERTO_NODE = '91';
var URL_SERVICIO = '';
var URL_REST_SOLICITUD = "169.62.217.189:" + PUERTO + "/";
var URL_SERVICIO_NODE = 'https://clipp.kradac.com/';
var URL_SERVICIO_INVESTIGACION = 'https://investigacion.kradac.com/';
var IP_IMAGENES = 'https://sweb.ktaxi.com.ec';
var URL_IMAGENES = '/clippweb/';
var DOMINIO = 'https://app.clipp.eco';
var LINK_PROFUNDO = 'https://clipp.eco/delivery/';
var LINK_ANDROID = 'com.kradac.clipp_maas';
var LINK_IOS = 'com.kradac.clipp-maas';
//var URL_RECURSO_IMAGENES = 'http://169.62.217.178:80/';
var URL_RECURSO_IMAGENES = 'https://archivo.kradac.com/';
var URL_SERVIDOR_IMAGENES = 'clipp/';
var URL_IMG_CHAT_PEDIDO = "";

if (AMBIENTE === 1) { //PRODUCCION
    PUERTO = 80;
    URL_IMG_CHAT_PEDIDO = "http://clipp.kradac.com:8080/clipp/media/chat/imagen/";
} else { //DESARROLLO
    APP = "DESARROLLO";
    PUERTO = 3001;
    URL_REST_SOLICITUD = '169.62.217.189:' + PUERTO + '/';
    //    URL_REST_SOLICITUD = 'http://169.62.217.189:8080/';
    URL_SERVICIO = 'http://testktaxi.kradac.com:' + PUERTO + '/';
    //    URL_SERVICIO_NODE = 'http://169.62.217.189:' + PUERTO_NODE + '/';
    IP_IMAGENES = 'https://sweb.ktaxi.com.ec';
    URL_IMAGENES = '/DES/clippweb/';
    URL_SERVIDOR_IMAGENES = 'test/';
    URL_IMG_CHAT_PEDIDO = "http://169.62.217.189:91/clipp/media/chat/imagen/";
}


var REST_EDITAR_PROFESIONAL = 'a/reserva/reasignar';
var SOCKET;
//EMITS
var EMIT_AUTENTICAR = "";
var EMIT_A_REG_UNICO_RASTREO = ""; //a_registrar_rastreo
//IMAGENES LOGIN
var URL_IMG = "img/";
var URL_IMG_SISTEMA = URL_IMG + "sistema/";
var URL_IMG_UPLOADS = URL_IMG + "uploads/";
var URL_IMG_ICON = URL_IMG + "iconos/";
var URL_IMG_UPLOADS_ADMINS = URL_IMG_UPLOADS + "admins/";
var URL_IMG_UPLOADS_LUGARES = URL_IMG_UPLOADS + "puntosLugares/";
var URL_IMG_ICONOS = URL_IMG + "iconos/menu/";
//IMAGENES CHAT
var URL_IMG_
    //SUBIR IMAGENES
var URL_SUBIR_IMG_ADMINS = "../../" + URL_IMG_UPLOADS + "admins/";
var URL_SUBIR_IMG_CARACTERISTICAS = "../../" + URL_IMG_UPLOADS + "caracteristicas/";
var URL_SUBIR_IMG_PUNTOS_LUGARES = "../../" + URL_IMG_UPLOADS + "puntosLugares/";
var URL_SUBIR_IMG_CONTROLADOR = "../../" + URL_IMG_UPLOADS + "controladores/";
var URL_SUBIR_IMG_TABLETS = "../../" + URL_IMG_UPLOADS + "tablet/";
var URL_SUBIR_IMG_SERVICIO = "../../" + URL_IMG_UPLOADS + "servicio/";
var URL_SUBIR_IMG_CATEGORIA = "../../" + URL_IMG_UPLOADS + "categoria/";
var URL_SUBIR_IMG_DEPARTAMENTO = "../../" + URL_IMG_UPLOADS + "departamento/";
var URL_SUBIR_IMG_BOTON = "../../" + URL_IMG_UPLOADS + "boton/";
var URL_SUBIR_IMG_BOTON_SUCURSAL = "../../" + URL_IMG_UPLOADS + "botonSucursal/";
var URL_SUBIR_IMG_BOLETO_GRANDE = "../../" + URL_IMG_UPLOADS + "boleto/grande/";
var URL_SUBIR_IMG_PRODUCTO_GRANDE = "../../" + URL_IMG_UPLOADS + "producto/grande/";
var URL_SUBIR_IMG_BOLETO_PEQUENO = "../../" + URL_IMG_UPLOADS + "boleto/pequeno/";
var URL_SUBIR_IMG_PRODUCTO_PEQUENO = "../../" + URL_IMG_UPLOADS + "producto/pequeno/";
var URL_SUBIR_IMG_PRODUCTOPROMOCION_GRANDE = "../../" + URL_IMG_UPLOADS + "producto/promocionGrande/";
var URL_SUBIR_IMG_PRODUCTOPROMOCION_PEQUENO = "../../" + URL_IMG_UPLOADS + "producto/promocionPequeno/";
var URL_SUBIR_IMG_PUBLICIDAD = "../../" + URL_IMG_UPLOADS + "publicidadSucursal/";
var URL_SUBIR_IMG_EMPRESA = "../../" + URL_IMG_UPLOADS + "empresa/";
var URL_SUBIR_IMG_FORMA_PAGO = "../../" + URL_IMG_UPLOADS + "formaPago/";
var URL_SUBIR_ICON_FORMA_PAGO = "../../" + URL_IMG_UPLOADS + "iconFormaPago/";
var URL_SUBIR_IMG_SUCESO = "../../" + URL_IMG_UPLOADS + "suceso/";
var URL_SUBIR_IMG_SUCURSAL = "../../" + URL_IMG_UPLOADS + "sucursal/";
var URL_SUBIR_IMG_BIBLIOTECA_GRANDE = "../../" + URL_IMG_UPLOADS + "biblioteca/grande/";
var URL_SUBIR_IMG_BIBLIOTECA_PEQUENIA = "../../" + URL_IMG_UPLOADS + "biblioteca/pequenia/";
var URL_SUBIR_IMG_TIPO_COMPANIA = "../../" + URL_IMG_UPLOADS + "tipoCompania/";
var URL_SUBIR_ICON_SERVICIO = "../../" + URL_IMG_ICON + "servicio/";
var URL_SUBIR_ICON_CATEGORIA = "../../" + URL_IMG_ICON + "categoria/";
var URL_SUBIR_ICON_DEPARTAMENTO = "../../" + URL_IMG_ICON + "departamento/";
var URL_SUBIR_ICON_BOTON = "../../" + URL_IMG_ICON + "boton/";
var URL_SUBIR_ICON_BOTON_SUCURSAL = "../../" + URL_IMG_ICON + "botonSucursal/";
var URL_SUBIR_ICON_CAMPO = "../../" + URL_IMG_ICON + "campo/";
var URL_SUBIR_ICON_TIPO_COMPANIA = "../../" + URL_IMG_ICON + "tipoCompania/";
var URL_SUBIR_ICON_ESTADOPEDIDO = "../../" + URL_IMG_ICON + "estadoPedido/";
var URL_SUBIR_ICON_CALIFICACIONPEDIDO = "../../" + URL_IMG_ICON + "calificacionPedido/";
var URL_SUBIR_ICON_PUBLICIDAD = "../../" + URL_IMG_ICON + "publicidadSucursal/";
var URL_ICON_ESTADOPEDIDO = URL_IMG_ICON + "estadoPedido/";
var URL_ICON_CALIFICACIONPEDIDO = URL_IMG_ICON + "calificacionPedido/";
var URL_IMG_SERVICIO = URL_IMG_UPLOADS + "servicio/";
var URL_IMG_CATEGORIA = URL_IMG_UPLOADS + "categoria/";
var URL_IMG_BOTON = URL_IMG_UPLOADS + "boton/";
var URL_IMG_BOTON_SUCURSAL = URL_IMG_UPLOADS + "botonSucursal/";
var URL_ICON_SERVICIO = URL_IMG_ICON + "servicio/";
var URL_ICON_CATEGORIA = URL_IMG_ICON + "categoria/";
var URL_ICON_BOTON = URL_IMG_ICON + "boton/";
var URL_ICON_BOTON_SUCURSAL = URL_IMG_ICON + "botonSucursal/";
var URL_ICON_CAMPO = URL_IMG_ICON + "campo/";
var URL_ICON_PUBLICIDAD = URL_IMG_ICON + "publicidadSucursal/";
var URL_IMAGEN_PEQUENA = URL_IMG + 'uploads/boleto/pequeno/';
var URL_IMAGEN_CATEGORIA= URL_IMG + 'uploads/categoria/';
var URL_IMAGEN_PRODUCTO_PEQUENA = URL_IMG + 'uploads/producto/pequeno/';
var URL_IMAGEN_GRANDE = URL_IMG + 'uploads/boleto/grande/';
var URL_IMAGEN_PRODUCTO_GRANDE = URL_IMG + 'uploads/producto/grande/';
var URL_IMAGEN_PRODUCTOPROMOCION_PEQUENA = URL_IMG + 'uploads/producto/promocionPequeno/';
var URL_IMAGEN_PRODUCTOPROMOCION_GRANDE = URL_IMG + 'uploads/producto/promocionGrande/';
var URL_IMAGEN_PUBLICIDAD = URL_IMG + 'uploads/publicidadSucursal/';
var URL_IMAGEN_ENPRESA = URL_IMG + 'uploads/empresa/';
var URL_IMAGEN_SUCESO = URL_IMG + 'uploads/suceso/';
var URL_IMAGEN_SUCURSAL = URL_IMG + 'uploads/sucursal/';
var URL_IMAGEN_ADMINS = URL_IMG + 'uploads/admins/';
var URL_IMAGEN_DEPARTAMENTO = URL_IMG + 'uploads/departamento/';
var URL_IMAGEN_TIPO_COMPANIA = URL_IMG + 'uploads/tipoCompania/';
var URL_ICON_DEPARTAMENTO = URL_IMG_ICON + "departamento/";
var URL_ICON_TIPO_COMPANIA = URL_IMG_ICON + "tipoCompania/";
var URL_IMAGEN_FORMA_PAGO = URL_IMG + 'uploads/formaPago/';
var URL_ICONO_FORMA_PAGO = URL_IMG + 'uploads/iconFormaPago/';

//IMAGENES POR DEFECTO
var ICO = URL_IMG + "launcher.png";
var IMG_BANNER = URL_IMG + "login/encabezado.png";
var LOGO = URL_IMG_SISTEMA + "logo_bancodt.png";
var IMG_LOGO = URL_IMG_SISTEMA + "bancotiempo1.jpeg";
var LOGO_PDF = URL_IMG_SISTEMA + "logo_bancodt_pdf.png";
var IMG_USUARIO_DEFECTO = URL_IMG + "defecto/usuario.png";
var IMG_USUARIO_DEFECTO_INCOGNITO = URL_IMG + "defecto/usuario_incognito.png";
var IMG_VEHICULO_INCOGNITO = URL_IMG + "defecto/vehiculo_incognito.png";
//MENSAJES PREDETERMINADOS
var E_R_R = 'POR EL MOMENTO NO CUENTA CON CONEXIÓN A INTERNET.';
var CAMPO_INFO_OBLIGATORIO = 'ESTE CAMPO ES OBLIGATORIO';
var MENSAJE_ERROR = 'PROBLEMA EN LA COMUNICACIÓN CON EL SERVIDOR.';
var MENSAJE_ERROR_CREAR = 'EL REGISTRO NO SE HA GUARDADO';
var MENSAJE_SUCCESS_CREAR = 'EL REGISTRO SE HA GUARDADO CORRECTAMENTE';
var MENSAJE_NO_INICIO = 'NO TIENE ASIGNADO UN MODULO, POR FAVOR SOLICITAR UNO AL ADMINISTRADOR DEL SISTEMA';
var MENSAJE_NO_TIENE_ASIGNADO_URL = 'EL MODULO DE INICIO NO TIENE ASIGNADO UNA RUTA DE ARRANQUE';
var MENSAJE_NO_EXISTEN_VEHICULOS_REPORTANDO = 'NO EXISTEN VEHICULOS REPORTANDO';
var MENSAJE_NO_EXISTEN_TRAMAS = 'NO EXISTEN TRAMAS REPORTADAS';
var MENSAJE_CAMPOS_OBLIGATORIOS = 'LOS CAMPOS SON OBLIGATORIOS';
var MENSAJE_NO_EXISTEN_RESULTADOS = '<div class="grid-data-empty"><h3><center>NO EXISTEN RESULTADOS.</center></h3></div>';
var EMPTY_GRID_LOAD = '<center><div class="grid-data-empty"><h3><span style="font-size: 100px;" class="x-fa fa-frown-o" aria-hidden="true"></span><br>Lo sentimos, no se han podido cargar los datos<br>Por favor compruebe su conexión a internet e inténtelo nuevamente.</h3></div></center>';
var INFOMESSAGEREQUERID = '<span style="color:red;font-weight:bold" data-qtip="Obligatorio">*</span>';
var INFOMESSAGEBLANKTEXT = 'DEBE INGRESAR UN VALOR';
var MINIMUMMESSAGUEREQUERID = "Este campo requiere un mínimo de {0} caracteres";
var MAXIMUMMESSAGUEREQURID = "Este campo acepta un máximo de {0} caracteres";
var INFOMESSAGEMAXVALUE = 'El valor máximo para este campo es {0}';
var INFOMESSAGEMINVALUE = 'El valor mínimo para este campo es {0}';
var INFOMESSAGECLOSE = 'Permite cerrar la ventana';
var INFOMESSAGECOLLAPSE = "Permite minimizar el panel";
var INFOMESSAGEEXPAND = "Permite maximizar el panel";
/*TIPOS DE SINCRONIZAR*/
var TIPO_ADMINISTRADOR = 1;
var URL_REST_SERVICIOS = "https://ktaxifacilsegurorapido.kradac.com";
var URL_REST_UTPL_EMPLEADO = "https://srv-si-001.utpl.edu.ec/apim/netcore/1.0/api/services/app/Empleado/Get?id=";
var URL_REST_UTPL_ESTUDIANTE = "https://srv-si-001.utpl.edu.ec/apim/netcore/1.0/api/services/app/Persona/Get?id=";
//	"http://www.karview.kradac.com:8080";//Consulta datos de registro civil
var USUARIOSRI = "KARVIEW"
var CLAVESRI = 1234567890
var IDCOMPANIASRI = 1

var EMPTY_CARA = '';
//ID MAPAS
var ID_MAPA_COMPANIA = 'map_compania';
var ID_MAPA_SUCESO = 'map_suceso';
var ID_MAPA_SUCURSAL = 'map_sucursal';
var ID_MAPA_PRE_REGISTRO = 'map_pre_registro';
var ID_MAPA_EMPRESA = 'map_empresa';
var ID_MAPA_CIUDAD = 'map_ciudad';
var ID_MAPA_LUGAR = 'map_lugar';
var ID_MAPA_SECTOR = 'map_sector';
var ID_MAPA_CLIENTE = 'map_cliente';
var ID_MAPA_ADMINISTRACION = "mapa_administracion";
var ID_MAPA_RASTREO = 'map_rastreo';
var STORE_FORMATO_FECHA;
var CONFIGURACIONES = [];
var cat_reverso = '#WEB_PAGO_REVERSO';
var cat_pago = '#WEB_PAGO';
//RECURSOS REST

//globales

var ID_USUARIO_PAGA = 1;