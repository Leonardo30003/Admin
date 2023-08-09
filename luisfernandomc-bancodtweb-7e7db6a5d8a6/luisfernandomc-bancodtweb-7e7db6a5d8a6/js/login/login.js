
var map;
var marcador;
var latitud = "";
var longitud = "";
var latA;
var lngA;
var idPais = "";
var idProvincia = "";
var calleP = "";
var calleS = "";

$(document).ready(function () {

 // cargarMapa();
    $('input[type=password]').keyup(function (e) {
        if (e.keyCode === 13) {
            login();
        }
    });
    $('#bnt-login').click(function () {
        login();
    });

});

function mostrarClave(isSelect, id) {
    if (isSelect) {
        document.getElementById(id).type = "text";
    } else {
        document.getElementById(id).type = "password";
    }
}
function login() {
//    $('#cargandoModal').modal('show');

    //location.href = 'admin.php'; 

    $.ajax({
        type: "POST",
        url: 'php/Login/login.php',
        //data: {usuario: $('#usuario').val(), contrasenia: hex_md5($('#contrasenia').val()), latitud: $('#latitud').val(), longitud: $('#longitud').val()},
        data: { usuario: $('#usuario').val(), contrasenia: $('#contrasenia').val(), latitud: $('#latitud').val(), longitud: $('#longitud').val()},
        success: function (response) {
            var data = JSON.parse(response);
            if (data.success === true) {
                createCookie("ID_ADMINISTRADOR_BANCODT", data.sesion.ID_ADMINISTRADOR, 1);
                createCookie("LONGITUD_BANCODT", data.sesion.LNG_U, 1);
                createCookie("LATITUD_BANCODT", data.sesion.LAT_U, 1);
                createCookie("USUARIO_BANCODT", data.sesion.USUARIO, 1);
               /*  createCookie("INICIO_bancodt", data.MODULO.INICIO, 1);
                createCookie("PATH_bancodt", data.MODULO.PATH, 1);
                createCookie("MODULO_bancodt", data.MODULO.MODULO, 1); */
                //if (data.MODULO.PATH.length > 0)
                    location.href = 'admin.php';
                /* else
                    notificaciones(MENSAJE_NO_TIENE_ASIGNADO_URL, 2); */
            } else
                notificaciones(data.message, 2);
        },
        error: function (xhr, ajaxOptions, thrownError) {
            notificaciones(MENSAJE_ERROR, 2);
        }
    });
}
