
function run(callback) {
	return callback(1);
    /* $.ajax({
	type: "POST",
	url: 'php/Login/getUserLogin.php',
	data: {idAdministrador: getCookie('ID_ADMINISTRADOR_BANCODT'), usuario: getCookie('USUARIO_BANCODT'), latitud: getCookie('LATITUD_BANCODT'), longitud: getCookie('LONGITUD_BANCODT'), path: getCookie('PATH_bancodt')},
	success: function (response) {
	    var data = JSON.parse(response);
	    if (data.success === false) {
		borrarCookies();
		alert(data.message);
		window.location = 'php/Login/logout.php';
		return callback(-1);
	    } else {
		USUARIO = data.usuario;
		MODULOS = data.children;
		if (USUARIO.BLOQUEADO === 1) {
		    borrarCookies();
		    window.location = 'php/Login/logout.php';
		    return callback(-1);
		} 
//		else {
//		    CONFIGURACIONES = data.configuraciones;
		    addConfiguraciones();
//		}
		notificaciones(data.message, 1);
		inicializarEntorno();
		return callback(1);
	    }
	},
	error: function (xhr, ajaxOptions, thrownError) {
	    notificaciones(MENSAJE_ERROR, 2);
	}
    }); */
}

function addConfiguraciones() {
    if (comprobarCookie("FORMATO_FECHA")) {
        CONFIGURACIONES["FORMATO_FECHA"] = getCookie("FORMATO_FECHA");
        CONFIGURACIONES["FORMATO_HORA"] = getCookie("FORMATO_HORA");
        CONFIGURACIONES["MOSTRAR_SECTORS"] = getCookie("MOSTRAR_SECTORS");
    } else {
        createCookie("FORMATO_FECHA", 0, 1000);
        createCookie("FORMATO_HORA", 0, 1000);
        createCookie("MOSTRAR_SECTORS", 0, 1000);
        CONFIGURACIONES["FORMATO_FECHA"] = 0;
        CONFIGURACIONES["FORMATO_HORA"] = 0;
        CONFIGURACIONES["MOSTRAR_SECTORS"] = 0;
    }
}