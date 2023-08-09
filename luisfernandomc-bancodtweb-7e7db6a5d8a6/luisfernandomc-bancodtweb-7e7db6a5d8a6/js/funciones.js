/* global Ext, MENSAJE_ERROR_SOLICITUD_CLIENTE, MENSAJE_ERROR, MENSAJE_RESPUESTA_ERROR, MENSAJE_ESPERA, TITULO_ESPERA, google, storeGenero, mapGoogle, RUTA_IMAGEN_INCOGNITO, infoWindowMarcador, listaMarcadoresPersona, storePrivacidad, storeRecorridoPosicion, colores, rutaMapa, marcadorInicio, marcadorFin, sizeImagen, storePersona, configGrid, RUTA_IMAGEN, MENSAJE_POSICION_INVALIDA, storeDecision, storePosicion, MENSAJE_NO_DATOS_IMAGEN, listaRutaMapa, MAPA_MAPBOX, RUTAS_ANIMADAS, TIEMPO_VELOCIDAD, storeDetallePosicion, storeRecorrido, ol, LISTA_MARCADORES_VEHICULOS_OSM, MAPA_OSM, CONTENT_INFO_WINDOW, OVERLAY_INFO_WINDOW, OVERLAY_OSM, TOOLTIP_OSM, ICONO_VEHICULO_ROL, BANDERA_SEGUIR_MARCADOR, storeVehiculo, ICONO_PERSONA_ROL, ICONO_FIN_RUTA_ROL, ICONO_INICIO_RUTA_ROL, alertify, PANELLOAD, ID_MAPA_CIUDAD, LIST_MAPS, moment, PUERTO_IMAGENES, PUERTO_NODE, DOMINIO, LINK_PROFUNDO, LINK_ANDROID, LINK_IOS, URL_SERVICIO_NODE, IP_IMAGENES, URL_IMAGEN_PRODUCTO_GRANDE, URL_REST_LINKPROFUNDO, URL_IMAGENES, URL_IMAGEN_SUCURSAL, INFOMESSAGECLOSE, TIEMPOMIN, URL_SERVICIO */
var DIAS = ["Lunes", "Martes", "Miercoles", "Jueves", "Viernes", "Sabado", "Domingo"],
        MESES = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto',
            'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
        ];
var listaDatos = [];
var ventanaInformativaCompra;
var winReporteSanitizacionControl;

function parsearFechaUTC(fecha) {
    return new Date(fecha.getUTCFullYear(), fecha.getUTCMonth(), fecha.getUTCDate(), fecha.getUTCHours(), fecha.getUTCMinutes(), fecha.getUTCSeconds());
}

function inicializarEntorno() {
    Ext.Date.dayNames = ['Domingo', 'Lunes', 'Martes', 'Miercoles',
        'Jueves', 'Viernes', 'Sabado'
    ];
    Ext.Date.monthNames = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo',
        'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre',
        'Diciembre'
    ];
    if (Ext.grid.RowEditor) {
        Ext.apply(Ext.grid.RowEditor.prototype, {
            saveBtnText: "Guardar",
            cancelBtnText: "Cancelar",
            errorsText: "Errores",
            dirtyText: "Debe guardar o cancelar sus cambios"
        });
    }
    applicateVTypes();
}
/**
 * Presenta un mensaje tipo informativo con efecto deslizante
 * @param {String} mensaje
 * @param {int} tipo
 * @returns {undefined}
 */
function notificaciones(mensaje, tipo) {
    var posicion = 'bottom-right';
    alertify.set('notifier', 'position', posicion);
    switch (tipo) {
        case 1: //succes
            alertify.success(mensaje);
            break;
        case 2: //error
            alertify.error(mensaje);
            break;
        case 3: //message
            alertify.message(mensaje);
            break;
        case 4: //notificacion
            alertify.notify(mensaje);
            break;
        case 5: //warning
            alertify.warning(mensaje);
            break;
        default:
            alertify.custom = alertify.extend("custom");
            alertify.custom("<table><tr><td><img class='icono' src='" + ICO + "'/></td><td>   </td><td><center>    " + mensaje + "</center></td></tr></table>");
            break;
    }
}

function alertaSalir() {
    Ext.MessageBox.buttonText = {
        yes: "Sí",
        no: "No"
    };
    Ext.MessageBox.confirm('Salir', '¿Desea salir del sistema?', function (choice) {
        if (choice === 'yes') {
            borrarCookies();
            window.location = 'php/Login/logout.php';
        }
    });
}
//Cookie
function createCookie(name, value, days) {
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        var expires = "; expires=" + date.toGMTString();
    } else
        var expires = "";
    document.cookie = name + "=" + value + expires + "; path=/";
}

function eraseCookie(name) {
    createCookie(name, "", 0);
}

function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ')
            c = c.substring(1);
        if (c.indexOf(name) == 0)
            return c.substring(name.length, c.length);
    }
    return "";
}

function comprobarCookie(clave) {
    if (getCookie(clave) === "") {
        return false;
    } else {
        return true;
    }
}


function borrarCookies() {
    eraseCookie("ID_ADMINISTRADOR_BANCODT");
    eraseCookie("ID_MODULO_bancodt");
    eraseCookie("LONGITUD_BANCODT");
    eraseCookie("LATITUD_BANCODT");
    eraseCookie("USUARIO_BANCODT");
    eraseCookie("INICIO_bancodt");
    eraseCookie("MODULO_bancodt");
    eraseCookie("PATH_bancodt");
}

function mostrarBarraProgreso(mensaje) {
    Ext.MessageBox.show({
        title: "Espere",
        msg: mensaje,
        wait: true,
        waitConfig: {interval: 200}
    });
}

function ocultarBarraProgreso() {
    Ext.MessageBox.hide();
}

function alterna_modo_de_pantalla(val) {
    if (val) {
        salirPantallaCompleta();
    }
    if ((document.fullScreenElement && document.fullScreenElement !== null) || // metodo alternativo
            (!document.mozFullScreen && !document.webkitIsFullScreen)) { // metodos actuales
        if (document.documentElement.requestFullScreen) {
            document.documentElement.requestFullScreen();
        } else if (document.documentElement.mozRequestFullScreen) {
            document.documentElement.mozRequestFullScreen();
        } else if (document.documentElement.webkitRequestFullScreen) {
            document.documentElement.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT);
        }
    } else {
        salirPantallaCompleta();
    }
}

function salirPantallaCompleta() {
    if (document.cancelFullScreen) {
        document.cancelFullScreen();
    } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
    } else if (document.webkitCancelFullScreen) {
        document.webkitCancelFullScreen();
    }
}

function get_Ajax(url, params, timeout, callback, headers) {
    if (timeout === undefined || timeout === 0)
        timeout = 5 * 1000 * 60;
    Ext.Ajax.request({
        url: url,
        params: params,
        timeout: timeout,
        headers: headers,
        success: function (response, opts) {
            if (response.status === 200) {
                var obj = {};
                if (isJsonString(response.responseText)) {
                    if (response.responseText.length > 2) {
                        obj = JSON.parse(response.responseText);
                        obj.resAjax = 1;
                    } else
                        obj.resAjax = -1;
                    obj.respuesta = {
                        status: response.status
                    };
                } else {
                    obj.resAjax = -2;
                    obj['error'] = "Exite un error al crear el JSON";
                    obj['message'] = "Lamentamos los inconvenientes por favor comunícate con Kradac.";
                }
                return callback(obj);
            } else {
                console.error('Respuesta: ');
                console.error(response);
                console.error('Parámetros');
                console.error(params);
                return callback({
                    resAjax: -1,
                    respuesta: response,
                    metadata: opts
                });
            }
        },
        failure: function (response, opts) {
            var obj = {
                resAjax: -2
            };
            if (response.status === 0) {
                obj['error'] = "No existe conexión a internet.";
                obj['message'] = "No existe conexión a internet.";
            } else if (response.status === 500) {
                if (isJsonString(response.responseText)) {
                    var json = JSON.parse(response.responseText);
                    obj = {
                        resAjax: -1,
                        m: json.message,
                        message: json.message,
                        respuesta: {
                            status: response.status
                        }
                    };
                    return callback(obj);
                } else {
                    obj.resAjax = -2;
                    obj['error'] = "Exite un error al crear el JSON";
                    obj['message'] = "Lamentamos los inconvenientes por favor comunícate con Kradac.";
                }
            } else {
                console.error('Respuesta: ');
                console.error(response);
                console.error('Parámetros');
                console.error(params);
                return callback({
                    resAjax: -2,
                    respuesta: response,
                    metadata: opts
                });
            }
        }
    });
}

//function get_Ajax(url, params, timeout, callback, headers) {
//    if (timeout === undefined || timeout === 0)
//	timeout = 5 * 1000 * 60;
//    Ext.Ajax.request({
//	url: url,
//	params: params,
//	timeout: timeout,
//	headers: headers,
//	success: function (response, opts) {
//	    if (response.status === 200) {
//		var obj = {};
//		if (isJsonString(response.responseText)) {
//		    if (response.responseText.length > 2) {
//			obj = JSON.parse(response.responseText);
//			obj.resAjax = 1;
//		    } else {
//			obj.resAjax = -1;
//		    }
//		} else {
//		    obj.resAjax = 2;
//		    obj.error = "Exite un error al crear el JSON";
//		    obj.message = "Lamentamos los inconvenientes por favor comunícate con Kradac.";
//		    obj.response = response.responseText;
//		}
//		return callback(obj);
//	    } else {
//		console.error('Respuesta: ');
//		console.error(response);
//		console.error('Parámetros');
//		console.error(params);
//		return callback({resAjax: -1, respuesta: response, metadata: opts});
//	    }
//	}, failure: function (response, opts) {
//	    console.error('Respuesta: ');
//	    console.error(response);
//	    console.error('Parámetros');
//	    console.error(params);
//	    return callback({resAjax: -2, respuesta: response, metadata: opts});
//	}
//    });
//}
//CONECTAR SOCKET
function conectarSocket() {
    SOCKET = io.connect(URL_SERVICIO, {'forceNew': false});
    SOCKET.on('connect', function () {
        SOCKET.emit(EMIT_AUTENTICAR, {idAdministrador: USUARIO.ID_ADMINISTRADOR, imei: USUARIO.ID_ADMINISTRADOR}, function (response) {
            if (response.en === 1) {
                console.log("%c MUY BIEN CONECTADO", "background: green; color: white");
            } else {
                desconectarSocket(0);
            }
        });
    });
}

function desconectarSocket(estado) { //0: NO HAY INRERNET | 1: SI HAY INTERNET NO HAY SERVIDOR
    console.log("%c desconectarSocket", "background: red; color: white");
    if (estado === 0) {
        notificaciones(E_R_R, 2);
        $('#cargandoModal').modal('show');
    } else {
        notificaciones(MENSAJE_ERROR, 2);
    }
    if (SOCKET !== undefined)
        SOCKET.disconnect();
}
//FUNCIONES DE SOCKETS
function registrarUnicoRastreo(idEquipo, idVehiculo, info, data) {
    SOCKET.emit(EMIT_A_REG_UNICO_RASTREO, {idAdministrador: USUARIO.ID_ADMINISTRADOR, idEquipo: idEquipo, imei: USUARIO.ID_ADMINISTRADOR, idVehiculo: idVehiculo}, function (response) {
        console.log(response);
        if (response.en === 1) {
            graficarMarcadorRastreo(LIST_MAPS[ID_MAPA_RASTREO], response.lR[0].latitud, response.lR[0].longitud, data, info);
        }
    });
}
//bateria: Estado la bateria 
//estado: Estado del vehiculo
//g1:
//g2:
//gps:
//gsm:
//idEvento:
//ign:
//ign:
//latitud: posicion de la trama
//longitud:
//rumbo:
//sal:
//v1:
//v2:
//velocidad:
function obtenerTramasRastreo(fecha, horaInicio, horaFin, idEquipo) {
    console.log(horaInicio);
    console.log(horaFin);
    get_Ajax(URL_SERVICIO + REST_RASTREO, {anio: fecha.getFullYear(), mes: (fecha.getMonth() + 1), dia: fecha.getDate(), idEquipo: idEquipo, desde: horaInicio, hasta: horaFin}, 600000, function (response) {
        console.log('obtenerTramasRastreo');
        console.log(response);
        if (response < 0) {
            desconectarSocket(1);
        } else
        if (response.en < 0)
            return notificaciones(MENSAJE_ERROR, 2);
        else if (response.rastreo.length < 0) {
            return notificaciones(MENSAJE_NO_EXISTEN_TRAMAS, 2);
        } else {
            Ext.getStore('s_Rastreo').setData(response.rastreo);
            var coordenadas = [];
            for (var i = 0; i < response.rastreo.length; i++)
                coordenadas.push([response.rastreo[i].p[0], response.rastreo[i].p[1]]);
            graficarRuta(LIST_MAPS[ID_MAPA_RASTREO], coordenadas);
        }
    });
}


function obtenerCoordenadas() {
    addClickPoint(LIST_MAPS[ID_MAPA_CIUDAD], PANELLOAD, true);
}

function getNombrePais(id) {
    if (Number.isInteger(id)) {
        var pais = Ext.getStore('s_Paises_Combo').findRecord('idPais', id);
        return pais.data.pais;
    }
    return id;
}

///Recibe el item a buscar, el store en que se buscara.. 
///y los parametros que se enviaran en caso que el store este vacio o no contenga el item a buscar.
function checkStore(item, store, param) {
    if (storeEmpty(store)) {
        store.load({
            params: param
        });
    } else {
        if (!isInStore(store, item, 'id')) {
            store.removeAll();
            store.load({
                params: param
            });
        }
    }
}

function storeEmpty(store) {
    var val = store.data.items.length;
    if (val === 0) {
        return true;
    } else {
        return false;
    }
}

function isInStore(store, item, label, type) {
    switch (type) {
        case 'exact':
            var exist = store.findExact(label, item);
            if (exist !== -1) {
                exist = store.data.items[exist];
            } else {
                exist = null;
            }
            break;
        default:
            var exist = store.findRecord(label, item);
            break;
    }
    if (exist !== null) {
        return exist;
    } else {
        return false;
    }
}

//function isInStore(store, item, label) {
//    var exist = store.getById(item);
////    var exist = store.findRecord(label, item);//devuelve una coincidencia 
//    if (exist !== null) {
//        //return exist;
//        return true;
//    } else {
//        return false;
//    }
//}

function formatHora(val) {
    if (val === null || val === "") {
        return "";
    } else {
        if (Ext.Date.format(val, 'H:i:s')) {
            return Ext.Date.format(val, 'H:i:s');
        } else {
            return '<span style="color:#FF0000;">SIN FORMATO</span>';
        }
    }
}

function runReloj() {
    FECHA_ACTUAL = new Date();
    var hora = FECHA_ACTUAL.getHours();
    var minuto = FECHA_ACTUAL.getMinutes();
    var segundo = FECHA_ACTUAL.getSeconds();
    var str_segundo = new String(segundo);
    if (str_segundo.length == 1)
        segundo = "0" + segundo
    var str_minuto = new String(minuto);
    if (str_minuto.length == 1)
        minuto = "0" + minuto;
    var str_hora = new String(hora)
    if (str_hora.length == 1)
        hora = "0" + hora;
    document.getElementById("reloj").innerHTML = hora + " : " + minuto + " : " + segundo;
    setTimeout("runReloj()", 1000);
}

function asignarDatosMain() {
    var tolbarMain = Ext.getCmp('toolbarMain');
    tolbarMain.down('[name=FOTO_PERFIL]').setSrc(URL_IMG_UPLOADS_ADMINS + USUARIO.IMAGEN);
    tolbarMain.down('[name=NOMBRE_USUARIO]').setText(USUARIO.PERSONA);
    Ext.Ajax.request({
        async: true,
        url: 'php/Get/getUsuarioPerfil.php',
        callback: function (callback, e, response) {
            var res = JSON.parse(response.request.result.responseText);
            if (res.success) {
                var perfiles = res.data;
                for (var perfil in perfiles) {
                    tolbarMain.down('[name=' + perfiles[perfil].perfil + ']').setHidden(false);
                }
            }
        }
    });
}
/*function asignarDatosMain() {
 var storeNavegacion = Ext.getStore('Navegacion');
 var tolbarMain = Ext.getCmp('toolbarMain');
 //console.log(storeNavegacion);
 if (tolbarMain) {
 tolbarMain.down('[name=FOTO_PERFIL]').setSrc(URL_IMG_UPLOADS_ADMINS + USUARIO.IMAGEN);
 tolbarMain.down('[name=NOMBRE_USUARIO]').setText(USUARIO.PERSONA);
 for (var perfil in PERFILES) {
 console.log(PERFILES);
 tolbarMain.down('[name=' + perfiles[perfil].perfil + ']').setHidden(false);
 }
 }
 }*/
function validarPermisosGeneral(panel) {
    var moduloActual = Ext.getStore('Navegacion').byIdMap[panel.xtype].getData();
    var permisos = moduloActual.permisos;
    var formsPanel = panel.query('form');
    var gridsPanel = panel.query('grid');
    for (var i in formsPanel) {
        var btnCrear = formsPanel[i].down('[name=btnCrear]');
        var btnEditar = formsPanel[i].down('[name=btnEditar]');
        var checkHabilitar = formsPanel[i].down('[name=habilitado]');
        if (btnCrear && btnEditar) {
            if (!permisos.crear && !permisos.editar) {
                formsPanel[i].getForm().getFields().each(function (field) {
                    field.setReadOnly(true);
                });
            }
        }
        if (btnCrear) {
            if (!permisos.crear) {
                btnCrear.hide();
            } else {
                btnCrear.enable();
            }
        }
        if (btnEditar) {
            if (!permisos.editar) {
                btnEditar.hide();
            }
        }
        /* if (checkHabilitar) {
         if (!permisos.habilitar) {
         checkHabilitar.setReadOnly(true);
         checkHabilitar.disable();
         }
         } */
    }
    /* if (!permisos.habilitar) {
     for (var i in gridsPanel) {
     var habilitadoColumn = getColumnByDataIndex(gridsPanel[i], 'habilitado');
     if (habilitadoColumn.getEditor) {
     habilitadoColumn.getEditor().setReadOnly(true);
     habilitadoColumn.getEditor().disable();
     }
     }
     } */
}

function validarPermisos(panel) {
    var moduloActual = Ext.getStore('Navegacion').byIdMap[panel.xtype].getData();
    var permisos = moduloActual.permisos;
    var formsPanel = panel.query('form');
    var gridsPanel = panel.query('grid');
    for (var i in formsPanel) {
        var btnCrear = formsPanel[i].down('[name=btnCrear]');
        var btnEditar = formsPanel[i].down('[name=btnEditar]');
        //var checkHabilitar = formsPanel[i].down('[name=habilitado]');
        if (btnCrear && btnEditar) {
            if (!permisos.crear && !permisos.editar) {
                formsPanel[i].getForm().getFields().each(function (field) {
                    field.setReadOnly(true);
                });
            }
        }
        if (btnCrear) {
            if (!permisos.crear) {
                btnCrear.hide();
            } else {
                btnCrear.enable();
            }
        }
        if (btnEditar) {
            if (!permisos.editar) {
                btnEditar.hide();
            }
        }
    }
}

function showTipConten(value, metaData, record, rowIdx, colIdx, store) {
    if ((value && value !== '') || value == 0) {
        metaData.tdAttr = 'data-qtip="' + value + '"';
        value = (value !== '') ? value : '<span style="color:red">s/n</span>';
        return value;
    }
    return "<center><span style='color:red;'>s/n</span></center>";
}

function formatInformacionCliente(value, p, record) {
    var celda = '<table class="table"> <tbody>' +
            '<tr><th>Nombres:</th> <td><input type="text" size="auto" value="{0}" readonly></td></tr>' +
            '<tr><th>Cédula:</th> <td><input type="text" size="auto" value="{1}" readonly></td></tr>' +
            '<tr><th>Celular:</th> <td><input type="text" size="auto" value="{2}" readonly></td></tr>' +
            '</tbody> </table>';
    return Ext.String.format(celda, record.data.cliente, record.data.cedulaCliente, record.data.celularCliente);
}

function ventanaInformativaPedidoRC(idPedido, numChats) {
    var text = "";
    if (numChats !== 0 && numChats !== "" && numChats !== undefined) {
        text = '<spam style="color:green; background: red;' +
                '  border-radius: 0.8em;  -moz-border-radius: 0.8em;  ' +
                '-webkit-border-radius: 0.8em;  color: #fff;  display: inline-block;  ' +
                'font-weight: bold;  line-height: 1.2em;  margin-right: 5px;' +
                '  text-align: center;  width: 1.2em; ">' + numChats + '</spam>';
    }
    var ventanaCompra = new Ext.Window({
        width: '98%',
        height: 550,
        title: 'Información de la compra',
        autoScroll: true,
        constrain: true,
        closable: true,
        closeToolText: INFOMESSAGECLOSE,
        modal: true,
        items: [{
                name: "textoFicha",
                html: ''
            }],
        buttons: ['->',
            {
                xtype: 'button',
                iconCls: 'fa fa-commenting-o',
                iconAlign: 'right',
                width: 110,
                text: text + ' Chat',
                tooltip: 'Chat',
                handler: function () {
                    extrarerInfoHistorialChatPedido(idPedido);
                }
            },
            {
                xtype: 'button',
                iconCls: 'fa fa-times-circle',
                width: 110,
                iconAlign: 'right',
                text: 'Cerrar',
                tooltip: 'Cerrar',
                style: {
                    background: COLOR_SISTEMA,
                    border: '1px solid #36beb3',
                    '-webkit-border-radius': '5px 5px',
                    '-moz-border-radius': '5px 5px'
                },
                handler: function () {
                    ventanaCompra.close();
                }
            }
        ]
    });
    var box = Ext.MessageBox.wait('Obteniendo información de la compra', 'Espere por favor ');
    Ext.Ajax.request({
        async: true,
        url: 'php/Informacion/getInformacionCompra.php',
        params: {
            idPedido: idPedido
        },
        callback: function (callback, e, response) {
            var res = JSON.parse(response.request.result.responseText);
            if (res.success) {
                var link = 'https://api.whatsapp.com/send?phone=' + res.data[0].codigoPais + res.data[0].celularCliente + '&text=Saludos%20' + res.data[0].cliente.replace(/ /g, '%20');
                var link2 = 'https://api.whatsapp.com/send?phone=' + res.data[0].codigoPais + res.data[0].contactoSucursal;
                var link3 = 'https://api.whatsapp.com/send?phone=' + res.data[0].codigoPais;
                var linkMaps = 'https://www.google.com/maps/dir/' + res.data[0].latitud + ',' + res.data[0].longitud + '/' + res.data[0].latCliente + ',' + res.data[0].lngCliente + '/';
                var dataHtml = "<table width='100%'>" +
                        "<tr>" +
                        "<th colspan='8' style='text-align:center; background-color:#003F72; color:white;'>Compra con ID: " + idPedido + "</th>" +
                        "</tr>" +
                        "</table>" +
                        "<div>" +
                        //TABLA DETALLES DE LA COMPRA          
                        " <table style='float: left; font-family:Sans-serif; font-size:10;' width='45%' cellpadding='0.5'  >" +
                        detallesCompra(res.data[0], link, link2, linkMaps) +
                        presentaInfoProductos(res.data[0].listaProducto) +
                        "</table>" +
                        //TABLA FECHAS                                               
                        "<table style='float: left; font-family:Sans-serif; font-size:10;'' width='35%'>" +
                        detallesFechas(res.data[0]) +
                        "<tr> " +
                        " <th  colspan='3'  style='text-align:center;  background-color:orange;'>Solicitud ktaxi" +
                        "</th>" +
                        "</tr>" +
                        presentaInfoIdSolicitudProducto(res.data[0].idSolicitud, link3) +
                        "</table>" +
                        //TABLA CALIFICACIONES                       
                        "<table style='float: left;font-family:Sans-serif; font-size:10;' width='20%' >" +
                        "<tr>" +
                        "<th colspan='2' style='text-align:center; background-color:#F1F2F3;'>Calificación</th>" +
                        "</tr>" +
                        "<td colspan='2'>" + presentaCalificacionProducto(res.data[0].calificacionPedido) + "</td>" +
                        " <tr>" +
                        "<th colspan='2' style='text-align:center; background-color:#003F72; color:white; '>Datos del móvil</th>" +
                        "</tr>" +
                        detallesMovil(res.data[0]) +
                        "</table>";
                box.hide();
                ventanaCompra.down('[name=textoFicha]').setHtml(dataHtml);
                ventanaCompra.show().removeCls("x-unselectable");
            } else {
                box.hide();
            }
        }
    });
}

function ventanaInformativaPedidos(fechaInicio, fechaFin) {
    var ventanaResumen = new Ext.Window({
        width: '90%',
        title: 'Resumen de pedidos',
        bodyPadding: 10,
        constrain: true,
        closable: true,
        closeToolText: INFOMESSAGECLOSE,
        //layout: 'fit',
        modal: true,
        items: [{
                html: '<center style="background-color:#003F72; color:white;"> Resumen General desde: ' + fechaInicio + ' hasta: ' + fechaFin + '</center>'
            },
            {
                xtype: 'form',
                width: '100%',
                bodyPadding: 5,
                frame: false,
                layout: {
                    type: 'hbox',
                    //align: 'center'
                },
                defaults: {
                    style: 'border-color: #5ECAC2!important;',
                    defaults: {
                        border: 0,
                        defaults: {
                            labelWidth: 80
                        }
                    }
                }
            },
        ],
        buttons: ['->',
            {
                xtype: 'button',
                iconCls: 'fa fa-times-circle',
                width: 90,
                iconAlign: 'right',
                text: 'Cerrar',
                tooltip: 'Cerrar',
                style: {
                    background: COLOR_SISTEMA,
                    border: '1px solid #36beb3',
                    '-webkit-border-radius': '5px 5px',
                    '-moz-border-radius': '5px 5px'
                },
                handler: function () {
                    ventanaResumen.close();
                }
            }
        ]
    });
    var box = Ext.MessageBox.wait('Obteniendo información de los pedidos', 'Espere por favor ');
    Ext.Ajax.request({
        async: true,
        url: 'php/Informacion/getResumenGeneral.php',
        params: {
            fechaDesde: fechaInicio,
            fechaHasta: fechaFin,
            horasUtc: moment().utcOffset() / 60
        },
        callback: function (callback, e, response) {
            ventanaResumen.down('form').removeAll();
            var res = JSON.parse(response.request.result.responseText);
            if (res.success) {
                var panelDetallesCompra = {
                    xtype: 'panel',
                    width: '100%',
                    height: 400,
                    layout: 'hbox',
                    defaults: {
                        style: 'border-color: #5ECAC2!important;',
                        defaults: {
                            border: 0,
                            defaults: {
                                labelWidth: 80
                            }
                        }
                    },
                    items: [{
                            xtype: 'fieldset',
                            width: '100%',
                            bodyPadding: 5,
                            height: 400,
                            autoScroll: true,
                            layout: 'hbox',
                            items: [{
                                    width: '20%',
                                    style: 'margin-right:5px',
                                    title: 'Sucursal - Pedidos',
                                    html: detallesSucursalesPedidos(res.data[0].pedidosPorSucursal, res.data[0].total)
                                },
                                {
                                    width: '20%',
                                    style: 'margin-right:5px',
                                    title: 'Tipo Pedido',
                                    html: detallesTipoPedidos(res.data[0].pedidosPorTipo, res.data[0].total)
                                },
                                {
                                    width: '20%',
                                    style: 'margin-right:5px',
                                    title: 'Formas de Pago',
                                    html: detallesFormaPagoPedidos(res.data[0].pedidosPorFormaPago, res.data[0].total)
                                },
                                {
                                    width: '20%',
                                    style: 'margin-right:5px',
                                    title: 'Costo de envío',
                                    html: detallesCostoPedidos(res.data[0].pedidosPorCosto, res.data[0].total)
                                },
                                {
                                    width: '20%',
                                    style: 'margin-right:5px',
                                    title: 'Estado',
                                    html: detallesEstadoPedidos(res.data[0].pedidosPorEstado, res.data[0].total)
                                },
                            ]
                        }, ]
                }
                box.hide();
                (fechaInicio !== '') ? ventanaResumen.down('form').add(panelDetallesCompra) : '';
                ventanaResumen.show().removeCls("x-unselectable");
            } else {
                box.hide();
            }
        }
    });
}

function panelPresentacionDatosHistorialChat(datos) {
    var dataHistorialChat =
            '<div>' +
            '<table style="width: 100%;"class="table table-bordered" style="display: inline-block;">' +
            '<tr>' +
            '<th class="row" style="width: 20%; background-color: #A9D0F5; text-align:center">Aplicativo</th>' +
            '<th class="row" style="width: 20%; background-color: #A9D0F5; text-align:center">Usuario</th>' +
            '<th class="row" style="width: 20%; background-color: #A9D0F5; text-align:center">Estado</th>' +
            '<th class="row" style="width: 80px; background-color: #A9D0F5; text-align:center">Fecha Recibido</th>' +
            '<th class="row" style="width: 20%; background-color: #A9D0F5; text-align:center">Fecha Leído</th>' +
            '</tr>';
    for (var i = 0; i < datos.length; i++) {
        var estado = "";
        dataHistorialChat += '<tr>' +
                '<td>' + datos[i].app + '</th>' +
                '<td>' + datos[i].usuarioRecibe + '</th>';
        if (datos[i].estadoEnvia == 3) {
            estado = "Leído";
        } else {
            estado = "Recibido";
        }
        dataHistorialChat += '<td>' + estado + '</th>';
        dataHistorialChat += '<td>' + Ext.Date.format(new Date(datos[i].fechaRecibido), 'Y-m-d H:i:s') + '</th>';
        if (datos[i].fechaLeido && datos[i].fechaLeido !== "") {
            dataHistorialChat += '<td>' + Ext.Date.format(new Date(datos[i].fechaLeido), 'Y-m-d H:i:s') + '</th>';
        } else {
            dataHistorialChat += '<td> s/n </th>';
        }
        dataHistorialChat += '</tr>';
    }

    dataHistorialChat += '</table>' +
            "</div>";
    return dataHistorialChat;
}

function detallesCompra(data, link, link2, linkMaps) {
    var html = "<tr>" +
            "<th colspan='4' style='text-align:center; background-color:#F1F2F3;  '>Detalles de la compra </th>" +
            "</tr> " +
            "<tr>" +
            "<th  colspan='2' width='50%' style='text-align:center;  background-color:#003F72;  color:white;'>Cliente</th>" +
            "<th colspan='2' width='50%' style='text-align:center;  background-color:#003F72;  color:white;'>Sucursal</th>" +
            "</tr>" +
            //DETALLES DEL CLIENTE Y SUCURSAL
            "<tr>" +
            "<td><b>Cliente:</b></td>" + "<td>" + data.cliente + "</td>" + //https://web.clipp.eco/DES/clippweb/admin.php#usuario
            "<td  width='20%'><b>Nombre:</b></td>" + "<td>" + data.sucursal + "</td>" + //https://web.clipp.eco/DES/clippweb/admin.php#sucursal
            "</tr>" +
            "<tr>" +
            "<td><b>Cédula:</b></td>" + "<td>" + data.cedulaCliente + "</td>" +
            "<td><b>Contacto:</b></td>" + "<td>" + data.contactoSucursal + '<a href="' + link2 + '" target="_blank"><img border="0" src="img/wh.png" width="15px" title="Comunicar vía whatsapp"' + '")></a><button onclick="copiarTexto(' + "'" + link2 + "'" + ')">Copiar</button>' + "</td>" +
            "</tr>" +
            "<tr>" +
            "<td><b>Celular:</b></td>" + "<td>" + data.celularCliente + '<a href="' + link + '" target="_blank"><img border="0" src="img/wh.png" width="15px" title="Comunicar vía whatsapp"' + '")></a><button onclick="copiarTexto(' + "'" + link + "'" + ')">Copiar</button>' + "</td>" +
            "<td><b>Correo:</b></td>" + "<td>" + data.correoSucursal + "</td>" +
            "</tr>" +
            "<tr>" +
            "<td><b>Correo:</b></td>" + "<td>" + data.correoCliente + "</td>" +
            "<td  width='17%' ><b>Calle principal:</b></td>" + "<td>" + data.callePrincipalSucursal + "</td>" +
            "</tr>" +
            "<tr>" +
            "<td ><b>Ciudad:</b></td>" + "<td>" + data.ciudad + "</td>" +
            "<td  width='17%'><b>Calle secundaria:</b></td>" + "<td>" + data.calleSecundariaSucursal + "</td>" +
            "</tr>" +
            "<tr>" +
            "<td rowspan=2><b>Dirección:</b></td>" + "<td rowspan=2>" + data.direccion + "</td>" +
            "<th colspan='2' width='50%' style='text-align:center;  background-color:#003F72;  color:white;'>Compañía</th>" +
            "</tr>" +
            "<tr>" +
            "<td><b>Nombre:</b></td>" + " <td>" + data.compania + "</td>" + //https://web.clipp.eco/DES/clippweb/admin.php#compania
            "</tr>" +
            "<tr>" +
            "<td><b>Referencia:</b></td>" + "<td>" + data.referencia + "</td>" +
            "<td><b>Contacto:</b></td>" + " <td>" + data.contactoCompania + "</td>" +
            "</tr>" +
            "<tr>" +
            "</tr>" +
            "<tr>" +
            "<td><b>Ubicación:</b></td>" + "<td><a href='" + linkMaps + "' target='_blank'><button><i class='fa fa-map-marker' aria-hidden='true'></i></button></a></td>" +
            "<td width='17%'><b>Calle secundaria:</b></td>" + " <td>" + data.callePrincipalCompania + "</td>" +
            "</tr>" +
            "<tr>" +
            "<td> </td>" + "<td> </td>" +
            "<td><b>Calle secundaria:</b></td>" + " <td>" + data.calleSecundariaCompania + "</td>" +
            "</tr>" +
            //DETALLES DEL PEDIDO Y COMPAÑIA   
            "<tr>" +
            "<th colspan='4' width='50%' style='text-align:center;  background-color:#003F72;  color:white;'>Pedido</th>" +
            "</tr>" +
            "<tr>" +
            "<td width='17%'><b>App - idPedido:</b></td>" + "<td>" + data.aplicativo + " - " + data.id + "</td>" +
            "<td width='17%'><b># Orden:</b></td>" + "<td > " + data.numeroOrden + "</td>" +
            "</tr>" +
            "<tr>" +
            "<td width='17%'><b>Estado pedido:</b></td>" + "<td style='text-align:center;  background-color:" + data.estadoPedidoColor + ";'><b>" + data.estadoPedido + "</b></td>" +
            "<td><b>Tipo pedido:</b></td>" + "<td>" + data.tipoEstadoPedido + "</td>" +
            "</tr>" +
            "<tr>" +
            "<td><b>Forma de pago:</b></td>" + "<td>" + data.forma + "</td>" +
            "<td><b>Costo Envio:$</b></td>" + "<td>" + data.costoEnvio + "</td>" +
            "</tr>" +
            "<tr>" +
            "<td><b>Distancia:</b></td>" + "<td>" + data.distancia + " Km</td>" +
            " <td><b>Descuento Envio:$</b></td>" + "<td>" + data.descuentoEnvio + "</td>" +
            "</tr>" +
            "<tr>" +
            " <td><b>Tiempo:</b></td>" + "<td>" + parseInt(data.tiempo) + " min.</td>" +
            "<td><b>Código Descuento:</b></td>" + "<td>" + data.codigoDescuento + "</td>" +
            "</tr>" +
            "<tr>" +
            "<th colspan='4'  style='text-align:center;  background-color:#003F72;  color:white;'>Detalles de productos" +
            "</th>" +
            "</tr>" +
            "<tr>" +
            "<td style='text-align:center;  background-color:#949CD6;'><b>Cantidad</b></td>" +
            "<td style='text-align:center;  background-color:#949CD6;'><b>Producto</b></td>" +
            "<td style='text-align:center;  background-color:#949CD6;'><b>V.U</b></td>" +
            "<td rowspan='" + (data.listaProducto.length + 1) + "'><b>&nbsp&nbsp&nbsp Precio:</b>" + data.precio + " <br><b>&nbsp&nbsp&nbsp IVA:</b>" + data.iva * 100 + "% <br>" +
            "<b>&nbsp&nbsp&nbsp Costo total:</b>" + data.costo + "</td>" +
            " </tr>";
    return html;
}

function detallesFechas(data) {
    var html = " <tr>" +
            " <th colspan='3' style='text-align:center; background-color:#F1F2F3;  '>Fechas y horas</th>" +
            "</tr>  " +
            "<tr> " +
            "<td  width='35%'><b> Reserva de la compra: </b></td>" + "<td colspan='2' >" + data.fechaReserva + "</td>" +
            "</tr>" +
            "<tr> " +
            "<td ><b> Registro de la compra:</b></td>" + "<td colspan='2' >" + data.fechaRegistro + "</td>" +
            "</tr>" +
            presentaFechasHorasProducto(data.fechasHorasPedido) + "</td>";
    return html;
}

function detallesMovil(data) {
    var html = "<tr>" +
            "<td width='30%'><b>Plataforma: </b></td><td>" + data.plataforma + "</td>" +
            "</tr>" +
            "<tr>" +
            "<td width='30%'><b>Versión APP: </b></td><td>" + data.version_bancodt + "</td>" +
            "</tr>" +
            "<tr>" +
            "<td width='30%'><b>Versión SO: </b></td><td>" + data.version_so + "</td>" +
            "</tr>" +
            "<tr>" +
            "<td width='30%'><b>Marca: </b></td><td>" + data.marca + "</td>" +
            "</tr>" +
            "<tr>" +
            "<td width='30%'><b>Modelo: </b></td><td>" + data.modelo + "</td>" +
            "</tr>";
    return html;
}

function copiarTexto(texto) {
    var aux = document.createElement("input");
    aux.setAttribute("value", texto);
    document.body.appendChild(aux);
    aux.select();
    document.execCommand("copy");
    document.body.removeChild(aux);
    mensajeInformativoEfecto("Texto copiado: <b>" + texto + "</b>");
}

function mensajeInformativoEfecto(mensaje) {
    Ext.toast(mensaje, 'Información', 't', 'x-fa fa-info-circle');
}

function presentaInfoProductos(value) {
    var html = "";
    if (value.length == 0) {
        html += "<tr>" +
                "<td colspan='3'><span style='color:red;'>No se han encontrado registros de productos solicitados en la compra</span></td>" +
                "</tr>";
    }
    for (i = 0; i < value.length; i++) {
        html += "<tr>" +
                "<td  style='text-align:center;'>" + value[i].cantidad + "</td>" +
                "<td  >" + value[i].producto + "</td>" +
                "<td  style='text-align:right;'>" + value[i].costoTotal + "</td>" +
                "</tr>";
    }
    return html;
}

function detallesSucursalesPedidos(value, total) {
    var html = "";
    html += "<table class='table' style = 'width:100%'>";
    //            "<tr>" +
    //            "<th colspan='6' style='text-align:center;  background-color:#949CD6; margin: 0 5px 5px 0;width:50%'>Producto</th>" +
    //            //"<th colspan='4' style='text-align:center;  background-color:#949CD6;'>V. Unitario</th>" +
    //            "<th colspan='3' style='text-align:center;  background-color:#949CD6;margin: 0 5px 5px 0;width:25%'>Cantidad</th>" +
    //            "<th colspan='3' style='text-align:center;  background-color:#949CD6;margin: 0 5px 5px 0;width:25%'>V.U</th>" +
    //            "</tr>";
    html += "<tr>" +
            "<th colspan='12' style='text-align:center;  background-color:#003F72; margin: 0 5px 5px 0; width:50%;color:white;'>Total Pedidos: " + total + "</th>" +
            "</tr>";
    if (value.length == 0) {
        html += "<tr>" +
                "<td colspan='12'><span style='color:red;'>No se han encontrado registros</span></td>" +
                "</tr>";
    }
    for (i = 0; i < value.length; i++) {
        html += "<tr>" +
                "<td colspan='6'>" + value[i].sucursal + "</td>" +
                "<td colspan='3' style='text-align:right;'>" + value[i].total + "</td>" +
                "</tr>";
    }
    html += "</table><hr>";
    return html;
}

function detallesTipoPedidos(value, total) {
    var html = "";
    html += "<table class='table' style = 'width:100%'>";
    //            "<tr>" +
    //            "<th colspan='6' style='text-align:center;  background-color:#949CD6; margin: 0 5px 5px 0;width:50%'>Producto</th>" +
    //            //"<th colspan='4' style='text-align:center;  background-color:#949CD6;'>V. Unitario</th>" +
    //            "<th colspan='3' style='text-align:center;  background-color:#949CD6;margin: 0 5px 5px 0;width:25%'>Cantidad</th>" +
    //            "<th colspan='3' style='text-align:center;  background-color:#949CD6;margin: 0 5px 5px 0;width:25%'>V.U</th>" +
    //            "</tr>";
    html += "<tr>" +
            "<th colspan='12' style='text-align:center;  background-color:#003F72; margin: 0 5px 5px 0; width:50%;color:white;'>Total Pedidos: " + total + " -> 100 %</th>" +
            "</tr>";
    if (value.length == 0) {
        html += "<tr>" +
                "<td colspan='12'><span style='color:red;'>No se han encontrado registros</span></td>" +
                "</tr>";
    }
    for (i = 0; i < value.length; i++) {
        html += "<tr>" +
                "<td colspan='8'>" + value[i].titulo + "</td>" +
                //                "<td colspan='2' > -> </td>" +
                "<td colspan='2' style='text-align:right;'>" + value[i].total + "</td>" +
                "<td colspan='2' style='text-align:right;'>" + Math.round(value[i].total / total * 100) + " %</td>" +
                "</tr>";
    }
    html += "</table><hr>";
    return html;
}

function detallesCostoPedidos(value, total) {
    var html = "";
    html += "<table class='table' style = 'width:100%'>";
    //            "<tr>" +
    //            "<th colspan='6' style='text-align:center;  background-color:#949CD6; margin: 0 5px 5px 0;width:50%'>Producto</th>" +
    //            //"<th colspan='4' style='text-align:center;  background-color:#949CD6;'>V. Unitario</th>" +
    //            "<th colspan='3' style='text-align:center;  background-color:#949CD6;margin: 0 5px 5px 0;width:25%'>Cantidad</th>" +
    //            "<th colspan='3' style='text-align:center;  background-color:#949CD6;margin: 0 5px 5px 0;width:25%'>V.U</th>" +
    //            "</tr>";
    html += "<tr>" +
            "<th colspan='12' style='text-align:center;  background-color:#003F72; margin: 0 5px 5px 0; width:50%;color:white;'>Total Pedidos: " + total + " -> 100 %</th>" +
            "</tr>";
    if (value.length == 0) {
        html += "<tr>" +
                "<td colspan='12'><span style='color:red;'>No se han encontrado registros</span></td>" +
                "</tr>";
    }
    for (i = 0; i < value.length; i++) {
        html += "<tr>" +
                "<td colspan='8'>" + value[i].costoEnvio + "</td>" +
                //                "<td colspan='2' > -> </td>" +
                "<td colspan='2' style='text-align:right;'>" + value[i].total + "</td>" +
                "<td colspan='2' style='text-align:right;'>" + Math.round(value[i].total / total * 100) + " %</td>" +
                "</tr>";
    }
    html += "</table><hr>";
    return html;
}

function detallesEstadoPedidos(value, total) {
    var html = "";
    html += "<table class='table' style = 'width:100%'>";
    //            "<tr>" +
    //            "<th colspan='6' style='text-align:center;  background-color:#949CD6; margin: 0 5px 5px 0;width:50%'>Producto</th>" +
    //            //"<th colspan='4' style='text-align:center;  background-color:#949CD6;'>V. Unitario</th>" +
    //            "<th colspan='3' style='text-align:center;  background-color:#949CD6;margin: 0 5px 5px 0;width:25%'>Cantidad</th>" +
    //            "<th colspan='3' style='text-align:center;  background-color:#949CD6;margin: 0 5px 5px 0;width:25%'>V.U</th>" +
    //            "</tr>";
    html += "<tr>" +
            "<th colspan='12' style='text-align:center;  background-color:#003F72; margin: 0 5px 5px 0; width:50%;color:white;'>Total Pedidos: " + total + " -> 100 %</th>" +
            "</tr>";
    if (value.length == 0) {
        html += "<tr>" +
                "<td colspan='12'><span style='color:red;'>No se han encontrado registros</span></td>" +
                "</tr>";
    }
    for (i = 0; i < value.length; i++) {
        html += "<tr>" +
                "<td colspan='8'>" + formatEstadoFinalizado(value[i].estadoFinalizado) + "</td>" +
                //                "<td colspan='2' > -> </td>" +
                "<td colspan='2' style='text-align:right;'>" + value[i].total + "</td>" +
                "<td colspan='2' style='text-align:right;'>" + Math.round(value[i].total / total * 100) + " %</td>" +
                "</tr>";
    }
    html += "</table><hr>";
    return html;
}

function detallesFormaPagoPedidos(value, total) {
    var html = "";
    html += "<table class='table' style = 'width:100%'>";
    //            "<tr>" +
    //            "<th colspan='6' style='text-align:center;  background-color:#949CD6; margin: 0 5px 5px 0;width:50%'>Producto</th>" +
    //            //"<th colspan='4' style='text-align:center;  background-color:#949CD6;'>V. Unitario</th>" +
    //            "<th colspan='3' style='text-align:center;  background-color:#949CD6;margin: 0 5px 5px 0;width:25%'>Cantidad</th>" +
    //            "<th colspan='3' style='text-align:center;  background-color:#949CD6;margin: 0 5px 5px 0;width:25%'>V.U</th>" +
    //            "</tr>";
    html += "<tr>" +
            "<th colspan='12' style='text-align:center;  background-color:#003F72; margin: 0 5px 5px 0; width:50%;color:white;'>Total Pedidos: " + total + " -> 100 %</th>" +
            "</tr>";
    if (value.length == 0) {
        html += "<tr>" +
                "<td colspan='12'><span style='color:red;'>No se han encontrado registros</span></td>" +
                "</tr>";
    }
    for (i = 0; i < value.length; i++) {
        html += "<tr>" +
                "<td colspan='8'>" + value[i].forma + "</td>" +
                //                "<td colspan='2' > -> </td>" +
                "<td colspan='2' style='text-align:right;'>" + value[i].total + "</td>" +
                "<td colspan='2' style='text-align:right;'>" + Math.round(value[i].total / total * 100) + " %</td>" +
                "</tr>";
    }
    html += "</table><hr>";
    return html;
}

function formatEstadoFinalizado(value) {
    if (value == 1) {
        return "Proceso";
    } else if (value == 2) {
        return "Correcto";
    } else {
        return "Cancelado"
    }
}

function presentaFechasHorasProducto(value) {
    var html = "";
    var tiempo = "";
    if (value.length == 0) {
        html += "<tr>" +
                "<td colspan='3'><span style='color:red;'>No hay registros de estados en la compra</span></td>" +
                "</tr>";
    }
    for (i = 0; i < value.length; i++) {
        if (i == 0) {
            rangoTiempo = 0;
            tiempo = "<span style='color:#186A3B'>" + "00:00:00 | 00:00:00</span>";
        } else {
            fechaPosicionActual = moment(value[i].fecha_registro, "YYYY-MM-DD HH:mm:ss");
            fechaAnteriorInicial = moment(value[i - 1].fecha_registro, "YYYY-MM-DD HH:mm:ss");
            rangoTiempoSegundosInicial = fechaPosicionActual.diff(fechaAnteriorInicial, 's');
            rangoTiempoMinutosInicial = fechaPosicionActual.diff(fechaAnteriorInicial, 'm');
            rangoTiempoHorasInicial = fechaPosicionActual.diff(fechaAnteriorInicial, 'h');
            rangoTiempoDiasInicial = fechaPosicionActual.diff(fechaAnteriorInicial, 'd');
            fechaAnterior = moment(value[0].fecha_registro, "YYYY-MM-DD HH:mm:ss");
            rangoTiempoSegundos = fechaPosicionActual.diff(fechaAnterior, 's');
            rangoTiempoMinutos = fechaPosicionActual.diff(fechaAnterior, 'm');
            rangoTiempoHoras = fechaPosicionActual.diff(fechaAnterior, 'h');
            rangoTiempoDias = fechaPosicionActual.diff(fechaAnterior, 'd');
            var tiempoMinComparar = TIEMPOMIN * 60;
            var colorInicial = "#186A3B";
            var colorFinal = "#186A3B";
            if (rangoTiempoSegundosInicial > tiempoMinComparar && rangoTiempoSegundos > tiempoMinComparar) {
                var colorInicial = "red";
                var colorFinal = "red";
            } else if (rangoTiempoSegundosInicial > tiempoMinComparar)
                colorInicial = "red";
            else if (rangoTiempoSegundos > tiempoMinComparar)
                colorFinal = "red";

            if (rangoTiempoSegundos >= 0 && rangoTiempoSegundos <= 59) {
                tiempo = "<span style='color:" + colorInicial + "'>" + ("0" + rangoTiempoHorasInicial).slice(-2) + ":" + ("0" + rangoTiempoMinutosInicial).slice(-2) + ":" + ("0" + rangoTiempoSegundosInicial).slice(-2) + "</span><span style='color:" + colorFinal + ";'> | " + ("0" + rangoTiempoHoras).slice(-2) + ":" + ("0" + rangoTiempoMinutos).slice(-2) + ":" + ("0" + rangoTiempoSegundos).slice(-2) + "</span>";
            } else {
                if (rangoTiempoMinutos >= 0 && rangoTiempoMinutos <= 59) {
                    rangoTiempoSegundos = (rangoTiempoSegundos - (rangoTiempoMinutos * 60));
                    rangoTiempoSegundosInicial = (rangoTiempoSegundosInicial - (rangoTiempoMinutosInicial * 60));
                    tiempo = "<span style='color:" + colorInicial + ";'>" + ("0" + rangoTiempoHorasInicial).slice(-2) + ":" + ("0" + rangoTiempoMinutosInicial).slice(-2) + ":" + ("0" + rangoTiempoSegundosInicial).slice(-2) + "</span><span style='color:" + colorFinal + ";'> | " + ("0" + rangoTiempoHoras).slice(-2) + ":" + ("0" + rangoTiempoMinutos).slice(-2) + ":" + ("0" + rangoTiempoSegundos).slice(-2) + "</span>";
                } else {
                    if (rangoTiempoHoras >= 1 && rangoTiempoHoras <= 23) {
                        rangoTiempoSegundos = (rangoTiempoSegundos - (rangoTiempoMinutos * 60));
                        rangoTiempoMinutos = (rangoTiempoMinutos - (rangoTiempoHoras * 60));
                        rangoTiempoSegundosInicial = (rangoTiempoSegundosInicial - (rangoTiempoMinutosInicial * 60));
                        rangoTiempoMinutosInicial = (rangoTiempoMinutosInicial - (rangoTiempoHorasInicial * 60));
                        tiempo = "<span style='color:" + colorInicial + ";'>" + ("0" + rangoTiempoHorasInicial).slice(-2) + ":" + ("0" + rangoTiempoMinutosInicial).slice(-2) + ":" + ("0" + rangoTiempoSegundosInicial).slice(-2) + "</span><span style='color:" + colorFinal + ";'> | " + ("0" + rangoTiempoHoras).slice(-2) + ":" + ("0" + rangoTiempoMinutos).slice(-2) + ":" + ("0" + rangoTiempoSegundos).slice(-2) + "</span>";
                    } else {
                        if (rangoTiempoDias >= 1 && rangoTiempoDias <= 28) {
                            rangoTiempoSegundos = (rangoTiempoSegundos - (rangoTiempoMinutos * 60));
                            rangoTiempoMinutos = (rangoTiempoMinutos - (rangoTiempoHoras * 60));
                            rangoTiempoHoras = (rangoTiempoHoras - (rangoTiempoDias * 24));
                            rangoTiempoSegundosInicial = (rangoTiempoSegundosInicial - (rangoTiempoMinutosInicial * 60));
                            rangoTiempoMinutosInicial = (rangoTiempoMinutosInicial - (rangoTiempoHorasInicial * 60));
                            rangoTiempoHorasInicial = (rangoTiempoHorasInicial - (rangoTiempoDiasInicial * 24));
                            tiempo = "<span style='color:" + colorInicial + ";'>" + ("0" + rangoTiempoHorasInicial).slice(-2) + ":" + ("0" + rangoTiempoMinutosInicial).slice(-2) + ":" + ("0" + rangoTiempoSegundosInicial).slice(-2) + "</span><span style='color:" + colorFinal + ";'> | " + ("0" + rangoTiempoHoras).slice(-2) + ":" + ("0" + rangoTiempoMinutos).slice(-2) + ":" + ("0" + rangoTiempoSegundos).slice(-2) + "</span>";
                        }
                    }
                }
            }
        }
        if (value[i].idEstado == 4) {
            value[i].estado = "Clipper irá a buscar orden";
        }
        html += "<tr>" +
                "<th style='text-align:left;'>" + value[i].estado + ": </th>" +
                "<td>" + value[i].fecha_registro + " " + value[i].aplicativo + "</td><td> " + tiempo + " </td>" +
                "</tr>";
    }
    return html;
}

function presentaCalificacionProducto(value) {
    var html = "";
    if (value.length == 0) {
        html = '<span style="color:red;">La compra no tiene registros de calificación</span>';
    }
    for (i = 0; i < value.length; i++) {
        if (value[i].calificacion == 0) {
            html += "Calificación " + value[i].aplicativo + ":<br>" +
                    "<img src='img/calificacion0.png' width=80; heigth=16;><br>";
        }
        if (value[i].calificacion == 1) {
            html += "Calificación " + value[i].aplicativo + ":<br>" +
                    "<img src='img/calificacion1.png' width=80; heigth=16;><br>";
        }
        if (value[i].calificacion == 2) {
            html += "Calificación " + value[i].aplicativo + ":<br>" +
                    "<img src='img/calificacion2.png' width=80; heigth=16;><br>";
        }
        if (value[i].calificacion == 3) {
            html += "Calificación " + value[i].aplicativo + ":<br>" +
                    "<img src='img/calificacion3.png' width=80; heigth=16;><br>";
        }
        if (value[i].calificacion == 4) {
            html += "Calificación " + value[i].aplicativo + ":<br>" +
                    "<img src='img/calificacion4.png' width=80; heigth=16;><br>";
        }
        if (value[i].calificacion == 5) {
            html += "Calificación " + value[i].aplicativo + ":<br>" +
                    "<img src='img/calificacion5.png' width=80; heigth=16;><br>";
        }
        if (value[i].nota) {
            html += "<b>Nota: </b>" + value[i].nota + "<br>";
        } else {
            html += '<b>Nota: </b> <span style="color:red;"> s/n </span><br>';
        }
    }

    html += "<hr>";
    return html;
}

function presentaInfoIdSolicitudProducto(value, link3) {
    var html = "";
    var contCero = 0,
            contMayorCero = 0;
    for (i = 0; i < value.length; i++) {
        if (value[i].idSolicitud == 0) {
            contCero++;
        }
        if (value[i].idSolicitud > 0) {
            html += "<tr>";
            if (AMBIENTE == 1) {
                html += '<td colspan="3"><a href="' + IP_IMAGENES + '/ktaxi/admin/?idsr=' + value[i].idSolicitud + '" target="_blank"">' + value[i].idSolicitud + '</a>';
            } else {
                html += '<td colspan="3"><a href="' + IP_IMAGENES + '/DES/ktaxi/admin/?idsr=' + value[i].idSolicitud + '" target="_blank"">' + value[i].idSolicitud + '</a>';
            }
            if (value[i].nombres) {
                if (value[i].estadoKtaxi != 7)
                    html += ' - <span style="color:#1AA616"><b>' + value[i].nombres + ' - ' + value[i].telefono + '</b></span> ' + ((value[i].telefono != null) ? ('<a href="' + link3 + value[i].telefono + '" target="_blank"><img border="0" src="img/wh.png" width="15px" title="Comunicar vía whatsapp"' + '")></a><button onclick="copiarTexto(' + "'" + link3 + value[i].telefono + "'" + ')">Copiar</button>' + "</td>") : value[i].telefono) + '</td>';
                else
                    html += ' - ' + value[i].nombres + ' - ' + value[i].telefono + ' ' + ((value[i].telefono != null) ? ('<a href="' + link3 + value[i].telefono + '" target="_blank"><img border="0" src="img/wh.png" width="15px" title="Comunicar vía whatsapp"' + '")></a><button onclick="copiarTexto(' + "'" + link3 + value[i].telefono + "'" + ')">Copiar</button>' + "</td>") : value[i].telefono) + '</td>';
            }

            html += "</tr>";
            contMayorCero++;
        }
    }
    if (contCero > 0 && contMayorCero == 0) {
        html += "<tr>" +
                "<td colspan='3'><span style='color:red;'>La compra no tiene registros con ID de solicitud</span></td>" +
                "</tr>";
    }
    return html;
}

function textoTituloCompra(titulo, ancho) {
    var html = "";
    html += "<table class='table' style = 'width:" + ancho + "px'>" +
            "<tr'>" +
            "<th colspan='12' style='text-align:center;  background-color:#003F72; color: white;'>" + titulo + "</th>" +
            "</tr>";
    return html;
}

function formatMensajeVisto(value) {
    var htmlEstado = '';
    if (value == 3) {
        htmlEstado = '<span style="color:green;" title="Habilitado">Si</span>';
    } else {
        htmlEstado = '<span style="color:red;f" title="Habilitado">No</span>';
    }
    return htmlEstado;
}

function extrarerInfoHistorialChatPedido(idPedido) {
    var STORE_CHAT_PEDIDO = Ext.create('bancodt.store.reporteCompra.s_ChatCompra');
    params = {
        idPedido: idPedido
    }
    STORE_CHAT_PEDIDO.proxy.extraParams = params;
    var ventanaChatPedido = new Ext.Window({
        width: '70%',
        height: '80%',
        title: 'Historial de chat en este pedido',
        bodyPadding: 10,
        constrain: true,
        closable: true,
        //layout: 'fit',
        modal: true,
        autoScroll: true,
        style: 'margin-top:5%;',
        items: [{
                name: 'gridChatPedido',
                columnLines: true,
                xtype: 'grid',
                autoScroll: true,
                plugins: [{
                        //                        ptype: 'gridfilters',
                        ptype: 'rowexpander',
                        rowBodyTpl: new Ext.XTemplate(
                                '<table style="width: 100%;" >',
                                '  <tr>',
                                '   <td WIDTH="100px" ><p><center><b></b>{mensaje:this.formatMensaje}</center></p></td>',
                                '<td >{leido:this.formatLeido}</td>',
                                '  </tr>',
                                '</table>', {
                                    formatMensaje: function (v) {
                                        var mensaje = v.substring(0, 1) === "0" ? "" : '<img src="' + URL_IMG_CHAT_PEDIDO + v.substring(1, v.length) + '" width="80" height="80" ><hr>';
                                        return mensaje;
                                    },
                                    formatLeido: function (v) {
                                        return panelPresentacionDatosHistorialChat(v);
                                    }
                                })
                    }],
                bufferedRenderer: false,
                store: STORE_CHAT_PEDIDO,
                viewConfig: {
                    preserveScrollOnRefresh: true,
                    enableTextSelection: true,
                    loadMask: false,
                    emptyText: '<center>No existe historial de chat en la compra.</center>'
                },
                columns: [
                    Ext.create('Ext.grid.RowNumberer', {header: '#', width: 50, align: 'center'}),
                    {tooltip: "Aplicativo", text: "Aplicativo", flex: 1, dataIndex: 'app', sortable: true, renderer: showTipConten},
                    {tooltip: "Envía", text: "Envía", flex: 1, dataIndex: 'usuarioEnvia', sortable: true, renderer: showTipConten},
                    {tooltip: "Mensaje", text: "Mensaje", flex: 2, dataIndex: 'mensaje', cellWrap: true, sortable: true, renderer: formatImagenMensaje},
                    //                    {tooltip: "Imagen", text: "Imagen", flex: 1, dataIndex: 'imagen', sortable: true, renderer: formatImagenMensaje, align: 'center'},
                    //                    {tooltip: "Recibe", text: "Recibe", flex: 2, dataIndex: 'usuarioRecibe', sortable: true, renderer: showTipConten},
                    //                    {tooltip: "Visto <br> enviado", text: "Visto <br> enviado", flex: 1, dataIndex: 'estadoEnvia', sortable: true, renderer: formatMensajeVisto, align: 'center'},
                    //                    {tooltip: "Visto <br> recibido", text: "Visto <br> recibido", flex: 1, dataIndex: 'estadoRecibe', sortable: true, renderer: formatMensajeVisto, align: 'center'},
                    //                    {tooltip: "Fecha y hora enviado", text: "Fecha y hora <br> enviado", flex: 2, dataIndex: 'fechaEnvia', sortable: true, renderer: showTipConten},
                    {tooltip: "Fecha y hora Registro", text: "Fecha y hora <br> Registro", flex: 2, dataIndex: 'fecha', sortable: true, renderer: setFormatFechaHora},
                ],
            }]
    });
    ventanaChatPedido.show();
}

function formatImagenMensaje(value) {
    var html = "";
    if (value.substring(0, 1) === "0") {
        html = value.substring(1, value.length);
    } else {
        html = '<button onclick="verImagenMensaje(' + "'" + value.substring(1, value.length) + "'" + ')" title="Ver imagen" style="background-color:#003F72;border:none; color:white;"><i class="fa fa-eye" aria-hidden="true"></i></button>';
    }
    return html;
}

function verImagenMensaje(value) {
    var ventanaImagenMensaje = Ext.create('Ext.window.Window', {
        layout: 'fit',
        title: 'Vista del mensaje',
        iconCls: 'icon-vista-previa',
        closable: true, //Presiona esc y se cierra la ventana
        scrollable: true,
        width: 500,
        closeAction: 'hide',
        modal: true,
        items: [{
                xtype: 'form',
                width: '100%',
                bodyPadding: 5,
                frame: false,
                layout: {
                    type: 'hbox',
                    align: 'center'
                },
                defaults: {
                    //style: 'border-color: #5ECAC2!important;',
                    defaults: {
                        border: 0,
                        defaults: {
                            labelWidth: 80
                        }
                    }
                },
                items: [{
                        xtype: 'panel',
                        width: '100%',
                        height: 400,
                        layout: 'vbox',
                        defaults: {
                            style: 'border-color: #5ECAC2!important;text-align:center',
                            defaults: {
                                border: 0,
                                defaults: {
                                    labelWidth: 80
                                }
                            }
                        },
                        items: [{
                                width: '100%',
                                height: '100%',
                                style: 'margin-right:5px;text-align:center',
                                title: 'Imagen',
                                html: presentaImagenMensaje(value)
                            }, ]
                    }]
            }, ],
        buttons: [{
                xtype: 'button',
                iconCls: 'fa fa-eye',
                iconAlign: 'right',
                text: 'Ver',
                style: 'width:80',
                tooltip: 'Ver imagen en directorio',
                handler: function () {
                    window.open(URL_IMG_CHAT_PEDIDO + value);
                }
            }, ]
    });
    ventanaImagenMensaje.show();
}

function presentaImagenMensaje(value) {
    var html = "";
    html = '<img src="' + URL_IMG_CHAT_PEDIDO + value + '" width="300" height="350" style="margin-top:10px;">';
    return html;
}

function formatNumString(value, metaData, record, rowIdx, colIdx, store) {
    console.log(value);
    if (value && value !== '') {
        metaData.tdAttr = 'data-qtip="' + value + '"';
        value = (value !== '') ? value : '<span style="color:red">s/n</span>';
        return value;
    }
    return "<center><span style='color:red;'>s/n</span></center>";
}

function showTipContenNumero(value, metaData, record, rowIdx, colIdx, store) {
    console.log(value);
    if (value == null) {
        numero = '0.0'
    } else {
        var numero = parseFloat(value).toFixed(2);
        metaData.tdAttr = 'data-qtip="' + numero.toString() + '"';
    }
    return numero.toString();
}


function showTipContenNumeroEntero(value, metaData, record, rowIdx, colIdx, store) {
    console.log(value);
    if (value == null) {
        var numero = 0;
    } else {
        var numero = parseInt(value);
        metaData.tdAttr = 'data-qtip="' + numero.toString() + '"';
    }
    return '<center>' + numero.toString() + '</center>';
}

function showTipContenDia(value, metaData, record, rowIdx, colIdx, store) {
    var html = '';
    if (value == 0) {
        html = '<span>Domingo</span>';
    } else if (value == 1) {
        html = '<span>Lunes</span>';
    } else if (value == 2) {
        html = '<span>Martes</span>';
    } else if (value == 3) {
        html = '<span>Miercoles</span>';
    } else if (value == 4) {
        html = '<span>Jueves</span>';
    } else if (value == 5) {
        html = '<span>Viernes</span>';
    } else if (value == 6) {
        html = '<span>Sabado</span>';
    }
    return html;
}

function showTipEstado(value, metaData, record, rowIdx, colIdx, store) {
    var color = record.data.color;
    metaData.style = "background-color:" + color + ";";
    return '<b>' + value + '</b>';
}

function showTipHabilitado(value, metaData, record, rowIdx, colIdx, store) {
    if (estado == 1) {
        htmlEstado = '<span style="color:green;" title="Habilitado">SI</span>';
    } else {
        htmlEstado = '<span style="color:red;" title="Deshabilitado">NO</span>';
    }
    return htmlEstado;
}

function showTipTiempoRestante(value, metaData, record, rowIdx, colIdx, store) {
    var fecha1 = moment(value);
    var fecha2 = moment();
    var timeinmilli = fecha2.diff(fecha1);
    var seconds = parseInt(timeinmilli = timeinmilli / 1000) % 60;
    var minutes = parseInt(timeinmilli = timeinmilli / 60) % 60;
    var hours = parseInt(timeinmilli = timeinmilli / 60) % 24;
    //return hours + ':' + minutes + ':' + seconds;
    console.log(setInterval('calcularTiempo(' + "'" + value + "'" + ')', 1000));
}

function calcularTiempo(value) {
    console.log('tiempo');
    var fecha1 = moment(value);
    var fecha2 = moment();
    var timeinmilli = fecha2.diff(fecha1);
    var seconds = parseInt(timeinmilli = timeinmilli / 1000) % 60;
    var minutes = parseInt(timeinmilli = timeinmilli / 60) % 60;
    var hours = parseInt(timeinmilli = timeinmilli / 60) % 24;
    /*  console.log(hours + ":" + minutes + ":" + seconds); */
    return hours + ':' + minutes;
}

function showTipoServicio(idTipo, metaData, record, rowIdx, colIdx, store) {
    if (idTipo > 0) {
        var tipo = Ext.create('bancodt.store.stores.s_TipoServicio').findRecord('idTipo', idTipo);
        return tipo.data.text;
    } else {
        return idTipo;
    }
}

function formatMonitores(records, metaData, record, rowIdx, colIdx, store) {
    if (records) {
        if (records.length > 0) {
            var htmlMonitores = '<table>';
            for (var i in records) {
                htmlMonitores += '</tr>';
                htmlMonitores += '<td>' + records[i].nombres + ' (' + records[i].rol + ')</td>';
                htmlMonitores += '</tr>';
            }
            htmlMonitores += '</table>';
            metaData.tdAttr = 'data-qtip="' + htmlMonitores + '"';
            return htmlMonitores;
        } else {
            return '<span style="color:red;">Sin Monitores</span>';
        }
    } else {
        return '<span style="color:red;">Sin Monitores</span>';
    }
}

function formatEstado(validado) {
    var estado = '';
    (validado) ? estado = '<center style=\"color:green;font-size:20px;\" title=\"Validado\">&#8226;</center>' : estado = '<center style=\"color:red;font-size:20px;\" title=\"Sin Validar\">&#8226;</center>';
    return estado;
}

function formatEstadoInverso(validado) {
    var estado = '';
    (!validado) ? estado = '<center style="color:green;font-size:20px;" title="Validado">&#8226;</center>' : estado = '<center style="color:red;font-size:20px;" title="Sin Validar">&#8226;</center>';
    return estado;
}

function formatColor(color, metaData, record) {
    if (record) {
        var title = (record.get('estadoText')) ? record.get('estadoText') : color;
    }
    var htmlColor = '';
    htmlColor = (color !== '') ? '<center><span style="color:' + color + ';" title="' + title + '"><i class="fa fa-certificate" aria-hidden="true"></i><span></center>' : '';
    if (metaData === 'excel') {
        htmlColor = (color !== '') ? '<center><span style="color:' + color + ';">' + title + '<span></center>' : '';
    }
    return htmlColor;
}

function formatoSiNo(val) {
    var dat = Ext.create('bancodt.store.combos.s_Si_No').getById(val);
    if (dat !== null) {
        return '<b><span style="color:' + dat.get('color') + ';">' + dat.get('text') + '</span></b>';
    } else {
        console.log('Error revisar id: ' + val);
        return '<b><span style="color:#FF0000;">Unknown</span></b>';
    }
}

function formatEstadoFecha(value, metaData, record) {
    var htmlEstado = '';
    if (record.data.habilitado) {
        htmlEstado = '<span style="color:green;">' + value + '</span>';
        metaData.tdAttr = "data-qtip='Habilitado el: " + value + "'";
    } else {
        htmlEstado = '<span style="color:red;">' + value + '</span>';
        metaData.tdAttr = "data-qtip='Deshabilitado el: " + value + "'";
    }
    return htmlEstado;
}

function formatIdentificativoSucursal(identificativo) {
    var htmlEstado = '';
    if (identificativo === 0) {
        htmlEstado = '<span title="Departamentos">Departamentos</span>';
    }
    if (identificativo === 1) {
        htmlEstado = '<span title="Botones">Botones</span>';
    }
    if (identificativo === 2) {
        htmlEstado = '<span title="Próximamente">Próximamente</span>';
    }
    if (identificativo === 10) {
        htmlEstado = '<span title="Productos">Productos</span>';
    }
    if (identificativo === 11) {
        htmlEstado = '<span title="Solicitud compra">Solicitud compra</span>';
    }
    return htmlEstado;
}

function formatEstadoSancion(estado) {
    var htmlEstado = '';
    if (estado == true) {
        htmlEstado = '<span style="color:green;" title="Sin sanción">Sin sanción</span>';
    } else {
        htmlEstado = '<span style="color:red;" title="Con sanción">Con sanción</span>';
    }
    return htmlEstado;
}

function formatSiNo(estado) {
    var htmlEstado = '';
    if (estado == true) {
        htmlEstado = '<span style="color:green;" title="Si">Si</span>';
    } else {
        htmlEstado = '<span style="color:red;" title="No">No</span>';
    }
    return htmlEstado;
}

function formatEstadoTrasnportePedido(estado) {
    var htmlEstado = '';
    if (estado === 1) {
        htmlEstado = '<span style="color:green;" title="Se muestra y está activo">Se muestra y está activo</span>';
    } else if (estado === 2) {
        htmlEstado = '<span style="color:orange;" title="Se muestra y está desactivado">Se muestra y está desactivado</span>';
    } else {
        htmlEstado = '<span style="color:red;" title="No se muestra">No se muestra</span>';
    }
    return htmlEstado;
}

function formatTipoTrasnportePedido(estado) {
    var htmlEstado = '';
    if (estado === 1) {
        htmlEstado = '<span style="color:green;" title="Pedidos">Pedidos</span>';
    } else if (estado === 2) {
        htmlEstado = '<span style="color:blue;" title="Encomiendas">Encomiendas</span>';
    } else {
        htmlEstado = '<span style="color:red;" title="Desconocido">Desconocido</span>';
    }
    return htmlEstado;
}

function formatTipoParqueo(estado) {
    var htmlEstado = '';
    if (estado == 1) {
        htmlEstado = '<span style="color:green;" title="Tag">Tag</span>';
    } else if (estado == 2) {
        htmlEstado = '<span style="color:blue;" title="Ticket">Ticket</span>';
    } else {
        htmlEstado = '<span style="color:orange;" title="Tag Admin">Tag Admin</span>';
    }
    return htmlEstado;
}
function formatMetodoParqueo(estado) {
    var htmlEstado = '';
    if (estado == 1) {
        htmlEstado = '<span style="color:green;" title="Tag">Tag</span>';
    } else if (estado == 2) {
        htmlEstado = '<span style="color:blue;" title="Ticket">Cámara</span>';

    } else if (estado == 3) {
        htmlEstado = '<span style="color:black;" title="Ticket">QR</span>';
    } else if (estado == 4) {
        htmlEstado = '<span style="color:orange;" title="App">App</span>';
    } else if (estado == 5) {
        htmlEstado = '<span style="color:brown;" title="Ticket">Ticket</span>';
    } else {
        htmlEstado = '<span style="color:red;" title="Desconocido">Desconocido</span>';
    }
    return htmlEstado;
}

function formatEstadoParqueo(estado) {
    var htmlEstado = '';
    if (estado == 1) {
        htmlEstado = '<span style="color:green;" title="Ingresó">Ingresó</span>';
    } else if (estado == 2) {
        htmlEstado = '<span style="color:blue;" title="Salió">Salió</span>';
    }
    return htmlEstado;
}

function formatTipoCaracteristicas(estado) {
    var htmlEstado = '';
    if (estado === 1) {
        htmlEstado = '<span style="color:green;" title="Sucursales">Sucursales</span>';
    } else if (estado === 2) {
        htmlEstado = '<span style="color:blue;" title="Productos">Productos</span>';
    } else if (estado === 3) {
        htmlEstado = '<span style="color:orange;" title="Biblioteca">Biblioteca</span>';
    } else {
        htmlEstado = '<span style="color:red;" title="Desconocido">Desconocido</span>';
    }
    return htmlEstado;
}

function formatEstadoRegistro(estado) {
    var htmlEstado = '';
    if (estado == true) {
        htmlEstado = '<span style="color:green;" title="Habilitado">Habilitado</span>';
    } else {
        htmlEstado = '<span style="color:red;f" title="Habilitado">Deshabilitado</span>';
    }
    return htmlEstado;
}

function formatisSubproducto(estado) {
    var htmlEstado = '';
    if (estado == 1) {
        htmlEstado = '<span style="color:green;" title="Normal">Normal</span>';
    } else {
        htmlEstado = '<span style="color:blue;f" title="Subproducto">Subproducto</span>';
    }
    return htmlEstado;
}

function formatEstadoTipo(estado) {
    var htmlEstado = '';
    if (estado == 'INGRESO') {
        htmlEstado = '<span style="color:green;" title="INGRESO">INGRESO</span>';
    } else {
        htmlEstado = '<span style="color:red;f" title="EGRESO">EGRESO</span>';
    }
    return htmlEstado;
}

function formatFecha(fecha, metaData) {
    if (fecha) {
        fecha = Ext.Date.format(fecha, 'Y-m-d');
        (metaData.tdAttr) ? metaData.tdAttr = "data-qtip=\'" + fecha + "\'" : '';
        return fecha;
    } else {
        return 's/n';
    }

}

function formatMedidasExtras(value, metaData, record, rowIdx, colIdx, store) {
    var htmlMedidas = '<table>';
    for (var i in value) {
        if (value[i].valor === '1') {
            var estado = '<span style="color:green;font-size:20px;" title="' + value[i].medida + '">&#8226;</span>';
        } else if (value[i].valor === '0') {
            var estado = '<span style="color:red;font-size:20px;" title="' + value[i].medida + '">&#8226;</span>';
        } else {
            var estado = '<span style="color:gray;font-size:20px;" title="' + value[i].medida + '">&#8226;</span>';
        }

        htmlMedidas += '<tr>';
        htmlMedidas += '<td title="' + value[i].medida + '">' + estado + ' ' + value[i].medida + '</td>';
        htmlMedidas += '</tr>';
    }
    htmlMedidas += '</table>';
    //    metaData.tdAttr = 'data-qtip="#Plaza: ' + value[i].numero + '| ' + value[i].zonaMotorizado + '"';
    return htmlMedidas;
}

function formatFechaHora(fecha, metaData) {
    //    console.log(fecha);
    if (fecha) {
        fecha = Ext.Date.format(fecha, 'Y-m-d H:i:s');
        (metaData.tdAttr) ? metaData.tdAttr = "data-qtip=\'" + fecha + "\'" : '';
        return fecha;
    } else {
        return 's/n';
    }

}

function showTipContenPorcentaje(value, metaData, record, rowIdx, colIdx, store) {
    var numero = parseFloat(value).toFixed(2);
    metaData.tdAttr = 'data-qtip="' + numero.toString() + '%"';
    return numero.toString() + '%';
}

function formatTimeReporte(value) {
    if (value && value !== '') {
        return value.substr(0, 5);
    }
    return '00:00';
}

function formatFechaReporte(value) {
    if (value && value !== '') {
        return value;
    }
    return 'S/N';
}

function showAuditoria(grid, record, extra) {
    console.log(record.data);
    var idColumn = grid.eventPosition.column.dataIndex;
    if (idColumn === 'id' || idColumn === 'idAdmin' || extra === 'gridAux') {
        var registro = (record.data.idUserCreate && record.data.idUserCreate !== '') ? record.data.idUserCreate : 0;
        var actualizo = (record.data.idUserUpdate && record.data.idUserUpdate !== '') ? record.data.idUserUpdate : 0;
        var cambio = (record.data.idUserChange && record.data.idChange !== '') ? record.data.idUserChange : 0;
        var window = new Ext.Window({
            width: 450,
            title: 'Auditoría',
            bodyPadding: 10,
            constrain: true,
            closable: true,
            closeToolText: INFOMESSAGECLOSE,
            modal: true,
            items: [{
                    html: '<center style="background-color:#003F72; color:white;">Registro con ID:' + record.id + '</center>'
                },
                {
                    xtype: 'form',
                    width: '100%',
                    bodyPadding: 5,
                    frame: false,
                    defaults: {
                        style: 'border-color: #5ECAC2!important;',
                        defaults: {
                            border: 0,
                            defaults: {
                                labelWidth: 80
                            }
                        }
                    }
                }
            ],
            buttons: ['->',
                {
                    xtype: 'button',
                    iconCls: 'fa fa-times-circle',
                    width: 90,
                    iconAlign: 'right',
                    text: 'Cerrar',
                    tooltip: 'Cerrar',
                    style: {
                        background: COLOR_SISTEMA,
                        border: '1px solid #36beb3',
                        '-webkit-border-radius': '5px 5px',
                        '-moz-border-radius': '5px 5px'
                    },
                    handler: function () {
                        window.close();
                    }
                }
            ]
        });
        Ext.Ajax.request({
            async: true,
            url: 'php/Get/getAuditoria.php',
            params: {
                idRegistro: registro,
                idActualizo: actualizo,
                idCambio: cambio
            },
            callback: function (callback, e, response) {
                window.down('form').removeAll();
                var res = JSON.parse(response.request.result.responseText);
                if (res.success) {
                    var panelCreate = {
                        xtype: 'fieldset',
                        title: 'Datos de creación',
                        width: '100%',
                        cls: 'panelesAuditoria',
                        layout: 'hbox',
                        items: [{
                                flex: 2,
                                defaultType: 'displayfield',
                                items: [{
                                        fieldLabel: '<b>Creado el</b>',
                                        bind: Ext.Date.format(new Date(record.data.dateCreate), 'j \\de F Y, \\a \\l\\a\\s H:i')
                                    }, {
                                        fieldLabel: '<b>Creado por</b>',
                                        bind: res.data.nombreReg
                                    }, {
                                        fieldLabel: '<b>C.I</b>',
                                        bind: res.data.cedulaReg
                                    }, {
                                        fieldLabel: '<b>Celular</b>',
                                        bind: res.data.celularReg
                                    }]
                            }, {
                                flex: 1,
                                xtype: 'image',
                                src: URL_IMG + 'uploads/admins/' + res.data.imagenReg,
                                style: 'border-radius: 50%; border: solid; border-color: #5ecac2;',
                                listeners: {
                                    render: function (me) {
                                        me.el.on({
                                            error: function (e, t, eOmpts) {
                                                me.setSrc(URL_IMG_SISTEMA + 'usuario.png');
                                            }
                                        });
                                    }
                                }
                            }

                        ]
                    };
                    var panelUpdate = {
                        xtype: 'fieldset',
                        title: 'Datos de edición',
                        width: '100%',
                        cls: 'panelesAuditoria',
                        layout: 'hbox',
                        items: [{
                                flex: 2,
                                defaultType: 'displayfield',
                                items: [{
                                        fieldLabel: '<b>Editado el</b>',
                                        bind: Ext.Date.format(new Date(record.data.dateUpdate), 'j \\de F Y, \\a \\l\\a\\s H:i')
                                    }, {
                                        fieldLabel: '<b>Editado por</b>',
                                        bind: res.data.nombreAct
                                    }, {
                                        fieldLabel: '<b>C.I</b>',
                                        bind: res.data.cedulaAct
                                    }, {
                                        fieldLabel: '<b>Celular</b>',
                                        bind: res.data.celularAct
                                    }]
                            },
                            {
                                flex: 1,
                                xtype: 'image',
                                src: URL_IMG + 'uploads/admins/' + res.data.imagenAct,
                                style: 'border-radius: 50%; border: solid; border-color: #5ecac2;',
                                listeners: {
                                    render: function (me) {
                                        me.el.on({
                                            error: function (e, t, eOmpts) {
                                                me.setSrc(URL_IMG_SISTEMA + 'usuario.png');
                                            }
                                        });
                                    }
                                }
                            }
                        ]
                    };
                    var fieldTextDate = '';
                    var fieldTextUser = '';
                    if (record.data.idUserChange && record.data.idChange !== '') {
                        console.log(!record.data.habilitado);
                        if (record.data.habilitado) {
                            if (record.data.cambiarBloquear && record.data.cambiarEliminar !== '') {
                                fieldTextDate = '<b>Bloqueado el</b>';
                                fieldTextUser = '<b>Bloqueado por</b>';
                            } else {
                                fieldTextDate = '<b>Habilitado el</b>';
                                fieldTextUser = '<b>Habilitado por</b>';
                            }
                        } else {
                            if (record.data.cambiarBloquear && record.data.cambiarEliminar !== '') {
                                fieldTextDate = '<b>Desbloqueado el</b>';
                                fieldTextUser = '<b>Desbloqueado por</b>';
                            } else {
                                fieldTextDate = '<b>Deshabilitado el</b>';
                                fieldTextUser = '<b>Deshabilitado por</b>';
                            }

                        }
                    }

                    var panelChange = {
                        xtype: 'fieldset',
                        title: 'Datos de estado',
                        width: '100%',
                        cls: 'panelesAuditoria',
                        layout: 'hbox',
                        items: [{
                                flex: 2,
                                defaultType: 'displayfield',
                                items: [{
                                        fieldLabel: fieldTextDate,
                                        bind: Ext.Date.format(new Date(record.data.dateChange), 'j \\de F Y, \\a \\l\\a\\s H:i')
                                    }, {
                                        fieldLabel: fieldTextUser,
                                        bind: res.data.nombreCamb
                                    }, {
                                        fieldLabel: '<b>C.I</b>',
                                        bind: res.data.cedulaCamb
                                    }, {
                                        fieldLabel: '<b>Celular</b>',
                                        bind: res.data.celularCamb
                                    }]
                            },
                            {
                                flex: 1,
                                xtype: 'image',
                                src: URL_IMG + 'uploads/admins/' + res.data.imagenCamb,
                                style: 'border-radius: 50%; border: solid; border-color: #5ecac2;',
                                listeners: {
                                    render: function (me) {
                                        me.el.on({
                                            error: function (e, t, eOmpts) {
                                                me.setSrc(URL_IMG_SISTEMA + 'usuario.png');
                                            }
                                        });
                                    }
                                }
                            }
                        ]
                    };

                    (record.data.idUserCreate && record.data.idUserCreate !== '') ? window.down('form').add(panelCreate) : '';
                    (record.data.idUserUpdate && record.data.idUserUpdate !== '') ? window.down('form').add(panelUpdate) : '';
                    (record.data.idUserChange && record.data.idUserChange !== '') ? window.down('form').add(panelChange) : '';
                    window.show();
                } else {
                    notificaciones(res.error, 2);
                }
            }
        });
    }
}

function showAuditoriaCompania(grid, record, extra) {
    var idColumn = grid.eventPosition.column.dataIndex;
    var STORE_AUDITORIA = Ext.create('bancodt.store.adminVoucher.s_Auditoria_Compania');
    if (idColumn === 'id' || idColumn === 'idAdmin' || extra === 'gridAux') {
        var window = new Ext.Window({
            width: 650,
            title: 'Auditoria',
            bodyPadding: 10,
            constrain: true,
            closable: true,
            layout: 'fit',
            modal: true,
            items: [{
                    html: '<center style="background-color:#003F72; color:white;">Registro con ID:' + record.id + '</center>'
                },
                {
                    xtype: 'form',
                    width: '100%',
                    bodyPadding: 5,
                    frame: false,
                    defaults: {
                        style: 'border-color: #5ECAC2!important;',
                        defaults: {
                            border: 0,
                            defaults: {
                                labelWidth: 80
                            }
                        }
                    },
                    items: [

                        {
                            xtype: 'grid',
                            height: 50,
                            width: '100%',
                            name: 'gridAuditoria',
                            autoScroll: true,
                            bufferedRenderer: false,
                            store: STORE_AUDITORIA,
                            columns: [
                                {header: '<b>Nombre</b>', flex: 2, dataIndex: 'nombreReg', filter: true},
                                {header: '<b>Cedula</b>', flex: 1, dataIndex: 'cedulaReg', align: 'center', filter: true},
                                {header: '<b>Celular</b>', flex: 1, dataIndex: 'celularReg', align: 'center', filter: true},
                                {header: '<b>Fecha</b>', flex: 1.5, dataIndex: 'fecha_registro', align: 'center', filter: true},
                                {header: '<b>Credito</b>', flex: 1, dataIndex: 'credito', xtype: 'numbercolumn', align: 'right', filter: true},
                            ],
                            minHeight: 150,
                            split: true,
                            region: 'north',
                            viewConfig: {
                                enableTextSelection: true,
                                emptyText: '<center>Sin datos..</center>',
                                getRowClass: function (record) {
                                    if (record.data.nuevo) {
                                        return 'newRowGrid';
                                    }
                                }
                            }
                        }

                    ]
                }
            ],
            buttons: ['->',
                {
                    xtype: 'button',
                    iconCls: 'fa fa-times-circle',
                    width: 90,
                    iconAlign: 'right',
                    text: 'Cerrar',
                    tooltip: 'Cerrar',
                    style: {
                        background: COLOR_SISTEMA,
                        border: '1px solid #36beb3',
                        '-webkit-border-radius': '5px 5px',
                        '-moz-border-radius': '5px 5px'
                    },
                    handler: function () {
                        window.close();
                    }
                }
            ]
        });
        var params = {idCompania: record.id, anio: (anio == null) ? 0 : anio, mes: (mes == null) ? 0 : mes};
        window.down('[name=gridAuditoria]').getStore().load({
            params: params,
            callback: function (records) {}
        });
        window.show();
    }
}

function validateRowEdit(value, metaData, record, rowIdx, colIdx, store, gridView) {
    var column = gridView.getGridColumns()[colIdx];
    if (value && value !== '') {
        switch (column.getEditor().xtype) {
            case 'datefield':
                value = Ext.Date.format(new Date(value), 'Y/m/d');
                break;
            case 'timefield':
                value = Ext.Date.format(new Date(value), 'H:i');
                break;
            case 'checkbox':
                value = formatEstado(value);
                break;
        }
        metaData.tdAttr = "data-qtip=\'" + value + "\'";
        return value;
    }
    if (column.getEditor().xtype === 'checkbox') {
        value = formatEstado(value);
        return value;
    }
    return "<center><span style='color:gray;'>" + column.text + "...</span></center>";
}

function getColumnByDataIndex(grid, dataIndex) {
    for (var i in grid.getColumns()) {
        if (grid.getColumns()[i].dataIndex === dataIndex) {
            return grid.getColumns()[i];
        }
    }
    return false;
}

function isJsonString(texto) {
    texto = texto.toString();
    if (texto[0] === "{" && texto[texto.length - 1] === "}")
        return true;
    if (texto[0] === "[" && texto[texto.length - 1] === "]")
        return true;
    return false;
}

function formatEstadoPunto(estado, metaData) {
    var htmlEstado = '';
    if (estado) {
        htmlEstado = '<span style="color:green;" title="Habilitado">';
    } else {
        htmlEstado = '<span style="color:red;" title="Deshabilitado">';
    }
    if (metaData === 'excel') {
        htmlEstado += '&#8226;</span>';
        return htmlEstado;
    }
    return htmlEstado + '<i class="fa fa-certificate" aria-hidden="true"></i></span>';
}
function formatEstadoPuntoBloqueado(estado, metaData) {
    var htmlEstado = '';
    if (estado == 0) {
        htmlEstado = '<span style="color:green;" title="Habilitado">';
    } else {
        htmlEstado = '<span style="color:red;" title="Deshabilitado">';
    }
    if (metaData === 'excel') {
        htmlEstado += '&#8226;</span>';
        return htmlEstado;
    }
    return htmlEstado + '<i class="fa fa-certificate" aria-hidden="true"></i></span>';
}

function formatEsPorcentaje(estado, metaData) {
    var htmlEstado = '';
    if (estado) {
        htmlEstado = '<span style="color:green;" title="Es porcentaje">';
    } else {
        htmlEstado = '<span style="color:red;" title="No es porcentaje">';
    }
    if (metaData === 'excel') {
        htmlEstado += '&#8226;</span>';
        return htmlEstado;
    }
    return htmlEstado + '<i class="fa fa-certificate" aria-hidden="true"></i></span>';
}

function formatDia(value) {
    //value = value + 1;
    if (value == 8) {
        value == 1;
    }
    var html = 'Sin estado';
    if (value == 1) {
        html = 'Domingo';
    } else
    if (value == 2) {
        html = 'Lunes';
    } else
    if (value == 3) {
        html = 'Martes';
    } else
    if (value == 4) {
        html = 'Miercoles';
    } else
    if (value == 5) {
        html = 'Jueves';
    } else
    if (value == 6) {
        html = 'Viernes';
    } else
        html = 'Sábado';

    return html;
}

function setMensajeGridEmptyText(grid, mensaje) {
    grid.getStore().removeAll();
    grid.getView().setEmptyText('<center>' + mensaje + '</center>');
}

function showTipContenID(value, metaData, record, rowIdx, colIdx, store) {
    if (metaData) {
        metaData.tdAttr = 'data-qtip="' + value + '"';
        metaData.style = 'text-align:center !important; cursor: pointer;';
    }
    return value;
}

function showTipContenProductos(value) {
    var nombre = "";
    for (var i = 0; i < value.length; i++) {
        var ultimo = i + 1;
        if (ultimo == value.length) {
            nombre = nombre + value[i].nombre;
        } else
            nombre = nombre + value[i].nombre + ',';
    }
    return String(nombre);
}

function showTipContenIDSolicitud(value, metaData) {
    /* var valor = "";
     if (value.length >= 2) {
     if (value.length > 7) {
     valor += "<select>" +
     " <option>Id solicitud</option>";
     }
     
     for (i = 0; i < value.length; i++) {
     valorAux = value[i].idSolicitud;
     if (value.length > 7) {
     valor += "<option>" + valorAux + "</option>";
     } else {
     valor += "<table><tr>";
     if (AMBIENTE == 1) {
     valor += '<td><a href="' + IP_IMAGENES + '/ktaxi/admin/?idsr=' + valorAux + '" target="_blank"">' + valorAux + '</a></td>'
     } else {
     valor += '<td><a href="' + IP_IMAGENES + '/DES/ktaxi/admin/?idsr=' + valorAux + '" target="_blank"">' + valorAux + '</a></td>'
     }
     valor += "</tr></table>";
     //valor = valor.concat(valorAux) + "<br>";
     }
     }
     if (value.length > 7) {
     valor += "</select>";
     }
     } else {
     if (value[0].idSolicitud > 0) {
     valor += "<table><tr>";
     if (AMBIENTE == 1) {
     valor += '<td><a href="' + IP_IMAGENES + '/ktaxi/admin/?idsr=' + value[0].idSolicitud + '" target="_blank"">' + value[0].idSolicitud + '</a></td>'
     } else {
     valor += '<td><a href="' + IP_IMAGENES + '/DES/ktaxi/admin/?idsr=' + value[0].idSolicitud + '" target="_blank"">' + value[0].idSolicitud + '</a></td>'
     }
     valor += "</tr></table>";
     } else {
     valor = value[0].idSolicitud;
     }
     }
     return valor; */
    return value;
}

function mensajesValidacionForms(fields) {
    fields.each(function (field) {
        if (!field.isValid()) {
            switch (field.name) {
                case 'compania':
                    if (field.getErrors()[0] === "ESTE CAMPO NO PUEDE SER VACÍO" || field.getErrors()[0] === "DEBE INGRESAR UN VALOR") {
                        return notificaciones("Seleccione o ingrese una compañia", 2);
                    } else if (field.getErrors()[0].includes("minimo")) {
                        return notificaciones("Ingrese los valores mínimos para la Compañia. Min. " + field.minLength, 2);
                    } else if (field.getErrors()[0].includes("maximo")) {
                        return notificaciones("Ingrese los valores máximos para el Compañia. Max. " + field.maxLength, 2);
                    }
                    break;
                case 'empresa':
                    if (field.getErrors()[0] === "ESTE CAMPO NO PUEDE SER VACÍO" || field.getErrors()[0] === "DEBE INGRESAR UN VALOR") {
                        return notificaciones("Seleccione o ingrese una empresa", 2);
                    } else if (field.getErrors()[0].includes("minimo")) {
                        return notificaciones("Ingrese los valores mínimos para la Empresa. Min. " + field.minLength, 2);
                    } else if (field.getErrors()[0].includes("maximo")) {
                        return notificaciones("Ingrese los valores máximos para el Empresa. Max. " + field.maxLength, 2);
                    }
                    break;
                case 'callePrin':
                    if (field.getErrors()[0] === "ESTE CAMPO NO PUEDE SER VACÍO" || field.getErrors()[0] === "DEBE INGRESAR UN VALOR") {
                        return notificaciones("Seleccione la calle principal", 2);
                    } else if (field.getErrors()[0].includes("minimo")) {
                        return notificaciones("Ingrese los valores mínimos para la calle principal. Min. " + field.minLength, 2);
                    } else if (field.getErrors()[0].includes("maximo")) {
                        return notificaciones("Ingrese los valores máximos para la calle principal. Max. " + field.maxLength, 2);
                    }
                    break;
                case 'calleSec':
                    if (field.getErrors()[0] === "ESTE CAMPO NO PUEDE SER VACÍO" || field.getErrors()[0] === "DEBE INGRESAR UN VALOR") {
                        return notificaciones("Seleccione la calle secundaria", 2);
                    } else if (field.getErrors()[0].includes("minimo")) {
                        return notificaciones("Ingrese los valores mínimos para la calle secundaria. Min. " + field.minLength, 2);
                    } else if (field.getErrors()[0].includes("maximo")) {
                        return notificaciones("Ingrese los valores máximos para la calle secundaria. Max. " + field.maxLength, 2);
                    }
                    break;
                case 'ruc':
                    if (field.getErrors()[0] === "DEBE INGRESAR UN VALOR") {
                        return notificaciones("Seleccione o ingrese un RUC", 2);
                    } else if (field.getErrors()[0].includes("mínimo")) {
                        return notificaciones("Ingrese los valores mínimos para el RUC. Min. " + field.minLength, 2);
                    } else if (field.getErrors()[0].includes("máximo")) {
                        return notificaciones("Ingrese los valores máximos para el RUC. Max. " + field.maxLength, 2);
                    }
                    break;
                case 'idDepartamento':
                    if (field.emptyText.includes("sucursal") || field.emptyText.includes("Sucursal")) {
                        if (field.getErrors()[0] === "DEBE INGRESAR UN VALOR") {
                            return notificaciones("Seleccione o ingrese una sucursal", 2);
                        }
                    } else {
                        //Mensaje de validación para departamento
                    }
                    break;
                case 'titulo':
                    if (field.emptyText.includes("nombre") || field.emptyText.includes("Nombre")) {
                        if (field.getErrors()[0] === "DEBE INGRESAR UN VALOR") {
                            return notificaciones("Seleccione o ingrese un nombre", 2);
                        } else if (field.getErrors()[0].includes("mínimo")) {
                            return notificaciones("Ingrese los valores mínimos para el nombre. Min. " + field.minLength, 2);
                        } else if (field.getErrors()[0].includes("máximo")) {
                            return notificaciones("Ingrese los valores máximos para el nombre. Max. " + field.maxLength, 2);
                        }
                    } else {
                        if (field.getErrors()[0] === "DEBE INGRESAR UN VALOR") {
                            return notificaciones("Seleccione o ingrese un título", 2);
                        } else if (field.getErrors()[0].includes("mínimo")) {
                            return notificaciones("Ingrese los valores mínimos para el título. Min. " + field.minLength, 2);
                        } else if (field.getErrors()[0].includes("máximo")) {
                            return notificaciones("Ingrese los valores máximos para el título. Max. " + field.maxLength, 2);
                        }
                    }
                    break;
                case 'subTitulo':
                    if (field.getErrors()[0] === "DEBE INGRESAR UN VALOR") {
                        return notificaciones("Seleccione o ingrese un subtítulo", 2);
                    } else if (field.getErrors()[0].includes("mínimo")) {
                        return notificaciones("Ingrese los valores mínimos para el subtítulo. Min. " + field.minLength, 2);
                    } else if (field.getErrors()[0].includes("máximo")) {
                        return notificaciones("Ingrese los valores máximos para el subtítulo. Max. " + field.maxLength, 2);
                    }
                    break;
                case 'subtitulo':
                    if (field.getErrors()[0] === "DEBE INGRESAR UN VALOR") {
                        return notificaciones("Seleccione o ingrese un subtítulo", 2);
                    } else if (field.getErrors()[0].includes("mínimo")) {
                        return notificaciones("Ingrese los valores mínimos para el subtítulo. Min. " + field.minLength, 2);
                    } else if (field.getErrors()[0].includes("máximo")) {
                        return notificaciones("Ingrese los valores máximos para el subtítulo. Max. " + field.maxLength, 2);
                    }
                    break;
                case 'descripccionLarga':
                    if (field.getErrors()[0] === "DEBE INGRESAR UN VALOR") {
                        return notificaciones("Seleccione o ingrese una descripción", 2);
                    } else if (field.getErrors()[0].includes("mínimo")) {
                        return notificaciones("Ingrese los valores mínimos para la descripción. Min. " + field.minLength, 2);
                    } else if (field.getErrors()[0].includes("máximo")) {
                        return notificaciones("Ingrese los valores máximos para la descripción. Max. " + field.maxLength, 2);
                    }
                    break;
                case 'identificativo':
                    if (field.getErrors()[0] === "DEBE INGRESAR UN VALOR") {
                        return notificaciones("Seleccione o ingrese un identificativo", 2);
                    }
                    break;
                case 'isSubproducto':
                    if (field.getErrors()[0] === "DEBE INGRESAR UN VALOR") {
                        return notificaciones("Seleccione o ingrese un subproducto", 2);
                    }
                    break;
                case 'codigoArea':
                    if (field.getErrors()[0].includes("minimo")) {
                        return notificaciones("Ingrese los valores mínimos para la Compañia. Min. " + field.minLength, 2);
                    } else if (field.getErrors()[0].includes("maximo")) {
                        return notificaciones("Ingrese los valores máximos para el Compañia. Max. " + field.maxLength, 2);
                    }
                    break;
                case 'callePrin':
                    if (field.getErrors()[0] === "DEBE INGRESAR UN VALOR") {
                        return notificaciones("Ingrese la calle pricipal", 2);
                    } else if (field.getErrors()[0].includes("mínimo")) {
                        return notificaciones("Ingrese los valores mínimos para la calle principal. Min. " + field.minLength, 2);
                    } else if (field.getErrors()[0].includes("máximo")) {
                        return notificaciones("Ingrese los valores máximos para la calle principal. Max. " + field.maxLength, 2);
                    }
                    break;
                case 'calleSec':
                    if (field.getErrors()[0] === "DEBE INGRESAR UN VALOR") {
                        return notificaciones("Ingrese la calle secundaria", 2);
                    } else if (field.getErrors()[0].includes("mínimo")) {
                        return notificaciones("Ingrese los valores mínimos para la calle secundaria. Min. " + field.minLength, 2);
                    } else if (field.getErrors()[0].includes("máximo")) {
                        return notificaciones("Ingrese los valores máximos para la calle secundaria. Max. " + field.maxLength, 2);
                    }
                    break;
                case 'contacto':
                    if (field.getErrors()[0] === "DEBE INGRESAR UN VALOR") {
                        return notificaciones("Ingrese el contacto", 2);
                    } else if (field.getErrors()[0].includes("mínimo")) {
                        return notificaciones("Ingrese los valores mínimos para el contacto. Min. " + field.minLength, 2);
                    } else if (field.getErrors()[0].includes("máximo")) {
                        return notificaciones("Ingrese los valores máximos para el contacto. Max. " + field.maxLength, 2);
                    }
                    break;
                case 'latitud':
                    if (field.getErrors()[0] === "DEBE INGRESAR UN VALOR") {
                        return notificaciones("Ingrese la latitud", 2);
                    } else if (field.getErrors()[0].includes("mínimo")) {
                        return notificaciones("Ingrese los valores mínimos para la latitud. Min. " + field.minLength, 2);
                    } else if (field.getErrors()[0].includes("máximo")) {
                        return notificaciones("Ingrese los valores máximos para la latitud. Max. " + field.maxLength, 2);
                    } else if (field.getErrors()[0].includes("incorrecta")) {
                        return notificaciones("Ingrese una latitud correcta", 2);
                    }
                    break;
                case 'longitud':
                    if (field.getErrors()[0] === "DEBE INGRESAR UN VALOR") {
                        return notificaciones("Ingrese la longitud", 2);
                    } else if (field.getErrors()[0].includes("mínimo")) {
                        return notificaciones("Ingrese los valores mínimos para la longitud. Min. " + field.minLength, 2);
                    } else if (field.getErrors()[0].includes("máximo")) {
                        return notificaciones("Ingrese los valores máximos para la longitud. Max. " + field.maxLength, 2);
                    } else if (field.getErrors()[0].includes("incorrecta")) {
                        return notificaciones("Ingrese una longitud correcta", 2);
                    }
                    break;
                case 'idSucursal':
                    if (field.getErrors()[0] === "DEBE INGRESAR UN VALOR") {
                        return notificaciones("Seleccione una sucursal", 2);
                    }
                    break;
                case 'idPais':
                    if (field.getErrors()[0] === "DEBE INGRESAR UN VALOR") {
                        return notificaciones("Seleccione un país", 2);
                    }
                    break;
                case 'idGenero':
                    if (field.getErrors()[0] === "DEBE INGRESAR UN VALOR") {
                        return notificaciones("Seleccione un género", 2);
                    }
                    break;
                case 'idVehiTipo':
                    if (field.getErrors()[0] === "DEBE INGRESAR UN VALOR") {
                        return notificaciones("Seleccione un tipo de vehículo", 2);
                    }
                    break;
                case 'orden':
                    if (field.getErrors()[0] === "DEBE INGRESAR UN VALOR") {
                        return notificaciones("Ingrese el orden", 2);
                    } else if (field.getErrors()[0].includes("mínimo")) {
                        return notificaciones("Ingrese los valores mínimos para el orden. Min. " + field.minLength, 2);
                    } else if (field.getErrors()[0].includes("máximo")) {
                        return notificaciones("Ingrese los valores máximos para el orden. Max. " + field.maxLength, 2);
                    }
                    break;
                case 'cedula':
                    if (field.getErrors()[0] === "DEBE INGRESAR UN VALOR") {
                        return notificaciones("Ingrese el número de cédula", 2);
                    } else if (field.getErrors()[0].includes("mínimo")) {
                        return notificaciones("Ingrese los valores mínimos para la cédula. Min. " + field.minLength, 2);
                    } else if (field.getErrors()[0].includes("máximo")) {
                        return notificaciones("Ingrese los valores máximos para la cédula. Max. " + field.maxLength, 2);
                    }
                    break;
                case 'nombres':
                    if (field.getErrors()[0] === "DEBE INGRESAR UN VALOR") {
                        return notificaciones("Ingrese el nombre", 2);
                    } else if (field.getErrors()[0].includes("mínimo")) {
                        return notificaciones("Ingrese los valores mínimos para el nombre. Min. " + field.minLength, 2);
                    } else if (field.getErrors()[0].includes("máximo")) {
                        return notificaciones("Ingrese los valores máximos para el nombre. Max. " + field.maxLength, 2);
                    }
                    break;
                case 'apellidos':
                    if (field.getErrors()[0] === "DEBE INGRESAR UN VALOR") {
                        return notificaciones("Ingrese el apellido", 2);
                    } else if (field.getErrors()[0].includes("mínimo")) {
                        return notificaciones("Ingrese los valores mínimos para el apellido. Min. " + field.minLength, 2);
                    } else if (field.getErrors()[0].includes("máximo")) {
                        return notificaciones("Ingrese los valores máximos para el apellido. Max. " + field.maxLength, 2);
                    }
                    break;
                case 'correoUTPL':
                    if (field.getErrors()[0] === "DEBE INGRESAR UN VALOR") {
                        return notificaciones("Ingrese un correo", 2);
                    } else if (field.getErrors()[0].includes("mínimo")) {
                        return notificaciones("Ingrese los valores mínimos para el correo. Min. " + field.minLength, 2);
                    } else if (field.getErrors()[0].includes("máximo")) {
                        return notificaciones("Ingrese los valores máximos para el correo. Max. " + field.maxLength, 2);
                    }
                    break;
                case 'codigoPais':
                    if (field.getErrors()[0] === "DEBE INGRESAR UN VALOR") {
                        return notificaciones("Ingrese el código del país", 2);
                    } else if (field.getErrors()[0].includes("mínimo")) {
                        return notificaciones("Ingrese los valores mínimos para el código del país. Min. " + field.minLength, 2);
                    } else if (field.getErrors()[0].includes("máximo")) {
                        return notificaciones("Ingrese los valores máximos para el código del país. Max. " + field.maxLength, 2);
                    } else if (field.getErrors()[0].includes("incorrecto")) {
                        return notificaciones("Código de país incorrecto ejm: +593", 2);
                    }
                    break;
                case 'celular':
                    if (field.getErrors()[0] === "DEBE INGRESAR UN VALOR") {
                        return notificaciones("Ingrese el celular", 2);
                    } else if (field.getErrors()[0].includes("mínimo")) {
                        return notificaciones("Ingrese los valores mínimos para el celular. Min. " + field.minLength, 2);
                    } else if (field.getErrors()[0].includes("máximo")) {
                        return notificaciones("Ingrese los valores máximos para el celular. Max. " + field.maxLength, 2);
                    }
                    break;
                case 'telefono':
                    if (field.getErrors()[0] === "DEBE INGRESAR UN VALOR") {
                        return notificaciones("Ingrese el teléfono", 2);
                    } else if (field.getErrors()[0].includes("mínimo")) {
                        return notificaciones("Ingrese los valores mínimos para el teléfono. Min. " + field.minLength, 2);
                    } else if (field.getErrors()[0].includes("máximo")) {
                        return notificaciones("Ingrese los valores máximos para el teléfono. Max. " + field.maxLength, 2);
                    }
                    break;
                case 'edad':
                    if (field.getErrors()[0] === "DEBE INGRESAR UN VALOR") {
                        return notificaciones("Ingrese la edad", 2);
                    } else if (field.getErrors()[0].includes("mínimo")) {
                        return notificaciones("Ingrese los valores mínimos para la edad. Min. " + field.minLength, 2);
                    } else if (field.getErrors()[0].includes("máximo")) {
                        return notificaciones("Ingrese los valores máximos para la edad. Max. " + field.maxLength, 2);
                    }
                    break;
                case 'direccion':
                    if (field.getErrors()[0] === "DEBE INGRESAR UN VALOR") {
                        return notificaciones("Ingrese una dirección", 2);
                    } else if (field.getErrors()[0].includes("mínimo")) {
                        return notificaciones("Ingrese los valores mínimos para la dirección. Min. " + field.minLength, 2);
                    } else if (field.getErrors()[0].includes("máximo")) {
                        return notificaciones("Ingrese los valores máximos para la dirección. Max. " + field.maxLength, 2);
                    }
                    break;
                case 'clave':
                    if (field.getErrors()[0] === "DEBE INGRESAR UN VALOR") {
                        return notificaciones("Ingrese la contraseña", 2);
                    } else if (field.getErrors()[0].includes("mínimo")) {
                        return notificaciones("Ingrese los valores mínimos para la contraseña. Min. " + field.minLength, 2);
                    } else if (field.getErrors()[0].includes("máximo")) {
                        return notificaciones("Ingrese los valores máximos para la contraseña. Max. " + field.maxLength, 2);
                    }
                    break;
                case 'correo':
                    if (field.getErrors()[0] === "DEBE INGRESAR UN VALOR") {
                        return notificaciones("Ingrese el correo", 2);
                    } else if (field.getErrors()[0].includes("mínimo")) {
                        return notificaciones("Ingrese los valores mínimos para el correo. Min. " + field.minLength, 2);
                    } else if (field.getErrors()[0].includes("máximo")) {
                        return notificaciones("Ingrese los valores máximos para el correo. Max. " + field.maxLength, 2);
                    }
                    break;
                case 'placa':
                    if (field.getErrors()[0] === "DEBE INGRESAR UN VALOR") {
                        return notificaciones("Ingrese una placa", 2);
                    } else if (field.getErrors()[0].includes("mínimo")) {
                        return notificaciones("Ingrese los valores mínimos para la placa. Min. " + field.minLength, 2);
                    } else if (field.getErrors()[0].includes("máximo")) {
                        return notificaciones("Ingrese los valores máximos para la placa. Max. " + field.maxLength, 2);
                    }
                    break;
                case 'ciudad':
                    if (field.getErrors()[0] === "DEBE INGRESAR UN VALOR") {
                        return notificaciones("Ingrese la ciudad", 2);
                    } else if (field.getErrors()[0].includes("mínimo")) {
                        return notificaciones("Ingrese los valores mínimos para la ciudad. Min. " + field.minLength, 2);
                    } else if (field.getErrors()[0].includes("máximo")) {
                        return notificaciones("Ingrese los valores máximos para la ciudad. Max. " + field.maxLength, 2);
                    }
                    break;
                case 'sucursal':
                    if (field.getErrors()[0] === "DEBE INGRESAR UN VALOR") {
                        return notificaciones("Ingrese la sucursal", 2);
                    } else if (field.getErrors()[0].includes("mínimo")) {
                        return notificaciones("Ingrese los valores mínimos para la sucursal. Min. " + field.minLength, 2);
                    } else if (field.getErrors()[0].includes("máximo")) {
                        return notificaciones("Ingrese los valores máximos para la sucursal. Max. " + field.maxLength, 2);
                    }
                    break;
                case 'color':
                    if (field.getErrors()[0] === "DEBE INGRESAR UN VALOR") {
                        return notificaciones("Ingrese el color", 2);
                    }
                    break;
                case 'barrio':
                    if (field.getErrors()[0] === "DEBE INGRESAR UN VALOR") {
                        return notificaciones("Ingrese el barrio", 2);
                    } else if (field.getErrors()[0].includes("mínimo")) {
                        return notificaciones("Ingrese los valores mínimos para el barrio. Min. " + field.minLength, 2);
                    } else if (field.getErrors()[0].includes("máximo")) {
                        return notificaciones("Ingrese los valores máximos para el barrio. Max. " + field.maxLength, 2);
                    }
                    break;
                case 'referencia':
                    if (field.getErrors()[0] === "DEBE INGRESAR UN VALOR") {
                        return notificaciones("Ingrese la referencia", 2);
                    } else if (field.getErrors()[0].includes("mínimo")) {
                        return notificaciones("Ingrese los valores mínimos para la referencia. Min. " + field.minLength, 2);
                    } else if (field.getErrors()[0].includes("máximo")) {
                        return notificaciones("Ingrese los valores máximos para la referencia. Max. " + field.maxLength, 2);
                    }
                    break;
                case 'descripcionCorta':
                    if (field.getErrors()[0] === "DEBE INGRESAR UN VALOR") {
                        return notificaciones("Ingrese la descripción corta", 2);
                    } else if (field.getErrors()[0].includes("mínimo")) {
                        return notificaciones("Ingrese los valores mínimos para la descripción corta. Min. " + field.minLength, 2);
                    } else if (field.getErrors()[0].includes("máximo")) {
                        return notificaciones("Ingrese los valores máximos para la descripción corta. Max. " + field.maxLength, 2);
                    }
                    break;
                case 'idTipoCalificacion':
                    if (field.getErrors()[0] === "DEBE INGRESAR UN VALOR") {
                        return notificaciones("Ingrese tipo de calificación", 2);
                    }
                    break;
                case 'idTipoCalificacionCliente':
                    if (field.getErrors()[0] === "DEBE INGRESAR UN VALOR") {
                        return notificaciones("Ingrese tipo de calificación cliente", 2);
                    }
                    break;
            }
        }
    });
}


function onProcesarPeticion(response, funcionLimpiar) {
    //console.log(response);
    if (response.operations.length > 0) {
        var obj = {};
        if (isJsonString(response.operations[0]._response.responseText)) {
            obj = JSON.parse(response.operations[0]._response.responseText);
            if (obj.success) {
                notificaciones(MENSAJE_SUCCESS_CREAR, 1);
                if (typeof funcionLimpiar === 'function')
                    funcionLimpiar();
            } else {
                if (obj.error)
                    notificaciones(obj.error, 2);
                else if (obj.message)
                    notificaciones(obj.message, 2);
                else
                    notificaciones(MENSAJE_ERROR_CRUD, 2);
            }
        } else {
            obj.resAjax = -2;
            obj['error'] = "Exite un error al crear el JSON";
            obj['message'] = "Exite un error al crear el JSON";
            notificaciones(obj.message, 2);
        }
    }
}

function check_cedula1(cedula) {
    var h = cedula.split("");
    var tamanoCedula = h.length;
    if (tamanoCedula === 10) {
        var digitoProvincia = cedula.substring(0, 2);
        var digitoTres = cedula.substring(2, 3);
        if ((digitoProvincia > 0 && digitoProvincia < 25) && digitoTres <= 6) {
            var f = 0;
            var a = (h[9] * 1);
            for (i = 0; i < (tamanoCedula - 1); i++) {
                var g = 0;
                if ((i % 2) !== 0) {
                    f = f + (h[i] * 1);
                } else {
                    g = h[i] * 2;
                    if (g > 9) {
                        f = f + (g - 9);
                    } else {
                        f = f + g;
                    }
                }
            }
            var e = f / 10;
            e = Math.floor(e);
            e = (e + 1) * 10;
            var d = (e - f);
            if ((d === 10 && a === 0) || (d === a)) {
                return true;
            } else {
                console.log("Cédula: " + cedula + " errónea, 10 dígito es: " + d);
                return false;
            }
        } else {
            console.log("Cédula: " + cedula + " errónea");
            return false;
        }
    } else {
        return false;
    }
}

function getChecksum(idCompania, ruc) {
    var rucmd5 = hex_md5(ruc);
    var checksum = hex_md5(idCompania + rucmd5);
    return checksum;
}

function getToken(usuario, idCompania) {
    var compania = idCompania.toString();
    var compmd5 = hex_md5(compania);
    var text = usuario + compmd5;
    token = sha256(text);
    return token;
}

function getKey(ruc, usuario) {
    var rucsha256 = sha256(ruc);
    var key = hex_md5(rucsha256 + usuario);
    return key;
}

function sha256(ascii) {
    function rightRotate(value, amount) {
        return (value >>> amount) | (value << (32 - amount));
    }
    var mathPow = Math.pow,
            maxWord = mathPow(2, 32),
            lengthProperty = 'length';
    var i, j, result = '',
            words = [],
            asciiBitLength = ascii[lengthProperty] * 8;
    var hash = sha256.h = sha256.h || [];
    var k = sha256.k = sha256.k || [];
    var primeCounter = k[lengthProperty];
    var isComposite = {};
    for (var candidate = 2; primeCounter < 64; candidate++) {
        if (!isComposite[candidate]) {
            for (i = 0; i < 313; i += candidate) {
                isComposite[i] = candidate;
            }
            hash[primeCounter] = (mathPow(candidate, .5) * maxWord) | 0;
            k[primeCounter++] = (mathPow(candidate, 1 / 3) * maxWord) | 0;
        }
    }
    ascii += '\x80';
    while (ascii[lengthProperty] % 64 - 56) {
        ascii += '\x00';
    }
    for (i = 0; i < ascii[lengthProperty]; i++) {
        j = ascii.charCodeAt(i);
        if (j >> 8) {
            return;
        }
        words[i >> 2] |= j << ((3 - i) % 4) * 8;
    }
    words[words[lengthProperty]] = ((asciiBitLength / maxWord) | 0);
    words[words[lengthProperty]] = (asciiBitLength);
    for (j = 0; j < words[lengthProperty]; ) {
        var w = words.slice(j, j += 16);
        var oldHash = hash;
        hash = hash.slice(0, 8);
        for (i = 0; i < 64; i++) {
            var i2 = i + j;
            var w15 = w[i - 15],
                    w2 = w[i - 2];
            var a = hash[0],
                    e = hash[4];
            var temp1 = hash[7] +
                    (rightRotate(e, 6) ^ rightRotate(e, 11) ^ rightRotate(e, 25)) +
                    ((e & hash[5]) ^ ((~e) & hash[6])) +
                    k[i] +
                    (w[i] = (i < 16) ? w[i] : (
                            w[i - 16] +
                            (rightRotate(w15, 7) ^ rightRotate(w15, 18) ^ (w15 >>> 3)) +
                            w[i - 7] +
                            (rightRotate(w2, 17) ^ rightRotate(w2, 19) ^ (w2 >>> 10))
                            ) | 0);
            var temp2 = (rightRotate(a, 2) ^ rightRotate(a, 13) ^ rightRotate(a, 22)) +
                    ((a & hash[1]) ^ (a & hash[2]) ^ (hash[1] & hash[2]));
            hash = [(temp1 + temp2) | 0].concat(hash);
            hash[4] = (hash[4] + temp1) | 0;
        }
        for (i = 0; i < 8; i++) {
            hash[i] = (hash[i] + oldHash[i]) | 0;
        }
    }
    for (i = 0; i < 8; i++) {
        for (j = 3; j + 1; j--) {
            var b = (hash[i] >> (j * 8)) & 255;
            result += ((b < 16) ? 0 : '') + b.toString(16);
        }
    }
    return result;
}
//function buscaPersonaRegCivil(formData) {
//    var form = Ext.create('Ext.form.Panel');
//    form.getForm().submit({
//	url: URL_REST_SERVICIOS + '/datos/persona',
////        url: URL_REST_SERVICIOS + '/registrocivil/webresources/servicios/consultarPost',
//	params: {
//	    cedula: formData.down('[name=cedula]').getValue(),
//	    usuario: USUARIOSRI,
//	    clave: CLAVESRI,
//	    idCompania: IDCOMPANIASRI,
//	    checksum: getChecksum(IDCOMPANIASRI, formData.down('[name=cedula]').getValue()),
//	    token: getToken(USUARIOSRI, IDCOMPANIASRI),
//	    key: getKey(formData.down('[name=cedula]').getValue(), USUARIOSRI)
//	},
//	success: function (form, action) {
//	    var data = action.result.data;
//	    if (data.nombres === '-') {
//		notificaciones("Revisar no existen registros de esta persona en registro civil", 2);
//	    } else if (data.apellidosNombres.split(" ").length === 3) {
//		notificaciones("Revisar nombres y apellidos y validar manualmente", 2);
//		formData.down('[name=nombres]').focus(true);
//	    }
//	    if (data.apellidosNombres !== '-') {
//		formData.down('[name=apellidos]').setValue(data.apellidos);
//		formData.down('[name=nombres]').setValue(data.nombres);
//		formData.down('[name=direccion]').setValue(data.direccion);
////                formData.down('[name=gen]').setValue(1);
////                if (data.genero === "F") {
////                    formData.down('[name=gen]').setValue(2);
////                }
//		formData.down('[name=fNacimiento]').setValue(Ext.Date.subtract(new Date(data.fechaNacimiento.substring(0, 10)), Ext.Date.DAY, -1));
//		formData.down('[name=celular]').focus(true);
//	    }
//	},
//	failure: function (form, action) {
//	    notificaciones("No se puso consultar datos de esta persona", 2);
//	}
//    });
//}
function obtieneDatosRegCivil(formData) {
    var cedula = formData.down('[name=cedula]').getValue();
    mostrarBarraProgreso('Consultando datos en registro civil.');
    Ext.Ajax.request({
        url: URL_REST_SERVICIOS + '/datos/persona',
        method: 'POST',
        dataType: 'json',
        contentType: "application/json; charset=utf-8",
        params: {
            usuario: USUARIOSRI,
            clave: CLAVESRI,
            idCompania: IDCOMPANIASRI,
            cedula: cedula,
            checksum: getChecksum(IDCOMPANIASRI, cedula),
            token: getToken(USUARIOSRI, IDCOMPANIASRI),
            key: getKey(cedula, USUARIOSRI)

        },
        success: function (response) {
            var obj = Ext.util.JSON.decode(response.responseText);
            if (obj.en === 1) {
                if (obj.p.n) {
                    var per = obj.p.n.split(' ');
                    var nom = '';
                    for (var i = 2; i < per.length; i++) {
                        nom += per[i] + ' ';
                        if (i < per.length - 1) {
                            nom += ' ';
                        }
                    }

                    formData.down('[name=apellidos]').setValue(per[0] + ' ' + per[1]);
                    formData.down('[name=nombres]').setValue(nom);
                    formData.down('[name=cedula]').setValue(obj.p.cd);
                    if (formData.down('[name=direccion]'))
                        formData.down('[name=direccion]').setValue(obj.p.dir);
                    //		formData.down('[name=gen]').setValue(1);
                    //		if (obj.p.g === "F") {
                    //		    formData.down('[name=gen]').setValue(2);
                    //		}
                    var nac = obj.p.fc.split('/');
                    if (formData.down('[name=fNacimiento]'))
                        formData.down('[name=fNacimiento]').setValue(Ext.Date.subtract(new Date(nac[2] + '-' + nac[1] + '-' + nac[0]), Ext.Date.DAY, -1));
                    ocultarBarraProgreso();
                    formData.down('[name=celular]').focus(true);
                } else
                    ocultarBarraProgreso();
            } else {
                console.log(response.responseText);
                ocultarBarraProgreso();
                //		messageInformation('Error revisar consola.');
            }
        },
        failure: function (response) {
            console.log(response);
            ocultarBarraProgreso();
            //	    messageInformation('Fallo consulta revisar consola');
        }
    });
}

function obtieneDatosUTPL(formData, identificativo) {
    var cedula = formData.down('[name=cedula]').getValue();
    mostrarBarraProgreso('Consultando datos en UTPL.');
    var URL_RECURSO_UTPL = "";
    if (identificativo == 1) {
        URL_RECURSO_UTPL = URL_REST_UTPL_EMPLEADO;
    } else {
        URL_RECURSO_UTPL = URL_REST_UTPL_ESTUDIANTE;
    }
    Ext.Ajax.request({
        useDefaultXhrHeader: false,
        url: URL_RECURSO_UTPL + cedula,
        method: 'GET',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            apikey: 'eyJ4NXQiOiJOVGRtWmpNNFpEazNOalkwWXpjNU1tWm1PRGd3TVRFM01XWXdOREU1TVdSbFpEZzROemM0WkE9PSIsImtpZCI6ImdhdGV3YXlfY2VydGlmaWNhdGVfYWxpYXMiLCJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJzdWIiOiJVVFBMLkVEVS5FQ1wvanNjYWxkZXJvbkBjYXJib24uc3VwZXIiLCJhcHBsaWNhdGlvbiI6eyJvd25lciI6IlVUUEwuRURVLkVDXC9qc2NhbGRlcm9uIiwidGllclF1b3RhVHlwZSI6bnVsbCwidGllciI6IlVubGltaXRlZCIsIm5hbWUiOiJEZWZhdWx0QXBwbGljYXRpb24iLCJpZCI6MSwidXVpZCI6IjhkYTZkYzA4LTc2YzYtNGJlYy1iNTViLTg2NjY2MDA5YWRmZSJ9LCJpc3MiOiJodHRwczpcL1wvc3J2LXNpLTAwMS51dHBsLmVkdS5lYzo0NDNcL29hdXRoMlwvdG9rZW4iLCJ0aWVySW5mbyI6eyJCcm9uemUiOnsidGllclF1b3RhVHlwZSI6InJlcXVlc3RDb3VudCIsImdyYXBoUUxNYXhDb21wbGV4aXR5IjowLCJncmFwaFFMTWF4RGVwdGgiOjAsInN0b3BPblF1b3RhUmVhY2giOnRydWUsInNwaWtlQXJyZXN0TGltaXQiOjAsInNwaWtlQXJyZXN0VW5pdCI6bnVsbH0sIlVubGltaXRlZCI6eyJ0aWVyUXVvdGFUeXBlIjoicmVxdWVzdENvdW50IiwiZ3JhcGhRTE1heENvbXBsZXhpdHkiOjAsImdyYXBoUUxNYXhEZXB0aCI6MCwic3RvcE9uUXVvdGFSZWFjaCI6dHJ1ZSwic3Bpa2VBcnJlc3RMaW1pdCI6MCwic3Bpa2VBcnJlc3RVbml0IjpudWxsfX0sImtleXR5cGUiOiJTQU5EQk9YIiwicGVybWl0dGVkUmVmZXJlciI6IiIsInN1YnNjcmliZWRBUElzIjpbeyJzdWJzY3JpYmVyVGVuYW50RG9tYWluIjoiY2FyYm9uLnN1cGVyIiwibmFtZSI6IkVTQkFwaSIsImNvbnRleHQiOiJcL2VzYmFwaVwvMS4wIiwicHVibGlzaGVyIjoiVVRQTC5FRFUuRUNcL2pzY2FsZGVyb24iLCJ2ZXJzaW9uIjoiMS4wIiwic3Vic2NyaXB0aW9uVGllciI6IkJyb256ZSJ9LHsic3Vic2NyaWJlclRlbmFudERvbWFpbiI6ImNhcmJvbi5zdXBlciIsIm5hbWUiOiJTZWd1cmlkYWRBcGkiLCJjb250ZXh0IjoiXC9hcGltXC9zZWd1cmlkYWRcLzEuMCIsInB1Ymxpc2hlciI6IlVUUEwuRURVLkVDXC9qc2NhbGRlcm9uIiwidmVyc2lvbiI6IjEuMCIsInN1YnNjcmlwdGlvblRpZXIiOiJCcm9uemUifSx7InN1YnNjcmliZXJUZW5hbnREb21haW4iOiJjYXJib24uc3VwZXIiLCJuYW1lIjoiUGFzYXJlbGFEb2N1bWVudGFsQXBpIiwiY29udGV4dCI6IlwvYXBpbVwvcGFzYXJlbGFcLzEuMCIsInB1Ymxpc2hlciI6IlVUUEwuRURVLkVDXC9qc2NhbGRlcm9uIiwidmVyc2lvbiI6IjEuMCIsInN1YnNjcmlwdGlvblRpZXIiOiJCcm9uemUifSx7InN1YnNjcmliZXJUZW5hbnREb21haW4iOiJjYXJib24uc3VwZXIiLCJuYW1lIjoiVVRQTFBheUFwaSIsImNvbnRleHQiOiJcL2FwaW1cL3V0cGxwYXlcLzEuMCIsInB1Ymxpc2hlciI6IlVUUEwuRURVLkVDXC9qc2NhbGRlcm9uIiwidmVyc2lvbiI6IjEuMCIsInN1YnNjcmlwdGlvblRpZXIiOiJVbmxpbWl0ZWQifSx7InN1YnNjcmliZXJUZW5hbnREb21haW4iOiJjYXJib24uc3VwZXIiLCJuYW1lIjoiQ1JNQXBpIiwiY29udGV4dCI6IlwvYXBpbVwvY3JtXC8xLjAiLCJwdWJsaXNoZXIiOiJVVFBMLkVEVS5FQ1wvanNjYWxkZXJvbiIsInZlcnNpb24iOiIxLjAiLCJzdWJzY3JpcHRpb25UaWVyIjoiQnJvbnplIn0seyJzdWJzY3JpYmVyVGVuYW50RG9tYWluIjoiY2FyYm9uLnN1cGVyIiwibmFtZSI6Ik5ldENvcmVBcGkiLCJjb250ZXh0IjoiXC9hcGltXC9uZXRjb3JlXC8xLjAiLCJwdWJsaXNoZXIiOiJVVFBMLkVEVS5FQ1wvanNjYWxkZXJvbiIsInZlcnNpb24iOiIxLjAiLCJzdWJzY3JpcHRpb25UaWVyIjoiQnJvbnplIn0seyJzdWJzY3JpYmVyVGVuYW50RG9tYWluIjoiY2FyYm9uLnN1cGVyIiwibmFtZSI6IlJlZ2lzdHJvQ2l2aWxBcGkiLCJjb250ZXh0IjoiXC9lc2JhcGlcL3JlZ2NpdmlsXC8xLjAiLCJwdWJsaXNoZXIiOiJVVFBMLkVEVS5FQ1wvanNjYWxkZXJvbiIsInZlcnNpb24iOiIxLjAiLCJzdWJzY3JpcHRpb25UaWVyIjoiQnJvbnplIn0seyJzdWJzY3JpYmVyVGVuYW50RG9tYWluIjoiY2FyYm9uLnN1cGVyIiwibmFtZSI6IkFjYWRlbWlhc0luZ2xlc0FwaSIsImNvbnRleHQiOiJcL2VzYmFwaVwvaW5nbGVzXC8xLjAiLCJwdWJsaXNoZXIiOiJVVFBMLkVEVS5FQ1wvanNjYWxkZXJvbiIsInZlcnNpb24iOiIxLjAiLCJzdWJzY3JpcHRpb25UaWVyIjoiQnJvbnplIn1dLCJwZXJtaXR0ZWRJUCI6IiIsImlhdCI6MTYxNzE2MTU1NywianRpIjoiMzBhNjE4NDUtMTJiYy00MTI2LWI0NGQtOTZkMWIxMDFmMDRlIn0=.SSwmsVKMbIvBJ7zwfNdrSxRkVPhR0ELi6GQbYq1CMxtDeQpW3DKL34v1dVCaInkrFIiISScZmgcmw4sviV86X1rUzcmvalCOorcSztA1EaWTExg6sAmKN4FwoDH4m3nOzPI-WG_OTDYFvc80es23FI-Qm31xgKuX__wnE99lIphlaYZ1PGc0Nyp55K0U4gEMa81fKtwOI1tO3jBKe13qkvqVrGSdl1bwsjeeDnd7mDSnjMfrAf1CAP4v_QkQbOZPAHtSpmBC0d78Tb2NuLKJNgsqgYyAQGbfO3k9jPfmInhWpRVkKDDPaXmPUm5VTFBIYJkgXpcAVFCeDSPHXq3KpQ=='

        },
        success: function (response) {
            var obj = Ext.util.JSON.decode(response.responseText);
            console.log('-----aaaaaaaaa-----', obj.result);
            if (obj.success) {
                if (obj.result) {
                    if (identificativo == 1) {
                        formData.down('[name=apellidos]').setValue(obj.result.primerApellido + ' ' + obj.result.segundoApellido);
                        formData.down('[name=nombres]').setValue(obj.result.primerNombre + ' ' + obj.result.segundoNombre);
                        formData.down('[name=cedula]').setValue(obj.result.identificacion);
                        formData.down('[name=correo]').setValue(obj.result.correoAlterno);
                        formData.down('[name=correoUTPL]').setValue(obj.result.correoUtpl);
                        if (obj.result.contratos.length > 0) {
                            formData.down('[name=idContrato]').setValue(obj.result.contratos[obj.result.contratos.length - 1].tipoContrato.codigo);
                        } else {
                            console.log('no hay contrato');
                        }
                        formData.down('[name=tipoSangre]').setValue(obj.result.tipoSangre.nombre);
                        if (formData.down('[name=direccion]'))
                            //formData.down('[name=direccion]').setValue(obj.p.dir);
                            formData.down('[name=idGenero]').setValue(true);
                        if (obj.result.genero.codigo === "M") {
                            formData.down('[name=idGenero]').setValue(false);
                        }
                        if (formData.down('[name=fNacimiento]'))
                            formData.down('[name=fNacimiento]').setValue(Ext.Date.subtract(new Date(setFormatFechaSolo(obj.result.fechaNacimiento)), Ext.Date.DAY, -1));
                        formData.down('[name=celular]').focus(true);
                    } else {
                        var celular = ' ';
                        var emailPrin = ' ';
                        var emailAlt = ' ';
                        var principal = false,
                                alterno = false;
                        for (var i = obj.result.telefonos.length; i > 0; i--) {
                            if (obj.result.telefonos[i - 1].codigo == "CEL") {
                                celular = obj.result.telefonos[obj.result.telefonos.length - 1].numero;
                                break;
                            }
                        }
                        for (var i = obj.result.correos.length; i > 0; i--) {
                            if (obj.result.correos[i - 1].codigo == "PRIN" && principal === false) {
                                principal = true;
                                emailPrin = obj.result.correos[i - 1].direccion;
                            }
                            if (obj.result.correos[i - 1].codigo == "ALTR" && alterno === false) {
                                alterno = true;
                                emailAlt = obj.result.correos[i - 1].direccion;

                            }
                            if (principal === true && alterno === true) {
                                break;
                            }

                        }
                        formData.down('[name=correo]').setValue(emailAlt);
                        formData.down('[name=correoUTPL]').setValue(emailPrin);
                        if (formData.down('[name=direccion]'))
                            formData.down('[name=direccion]').setValue(obj.result.direcciones[0].sector);

                        formData.down('[name=celular]').setValue(celular);
                        formData.down('[name=apellidos]').setValue(obj.result.apellidos.split('/').join(' '));
                        formData.down('[name=nombres]').setValue(obj.result.nombres);

                        if (formData.down('[name=usuario]'))
                            formData.down('[name=usuario]').setValue(obj.result.username);

                        if (formData.down('[name=usuarioVeh]'))
                            formData.down('[name=usuarioVeh]').setValue(obj.result.username);

                        formData.down('[name=idGenero]').setValue(true);
                        if (obj.result.genero === "M") {
                            formData.down('[name=idGenero]').setValue(false);
                        }

                        // formData.down('[name=correo]').setValue(obj.result.correoAlterno);
                        // formData.down('[name=correoUTPL]').setValue(obj.result.correoUtpl);


                        //formData.down('[name=direccion]').setValue(obj.p.dir);
                        //		formData.down('[name=gen]').setValue(1);
                        //		if (obj.p.g === "F") {
                        //		    formData.down('[name=gen]').setValue(2);
                        //		}
                        if (formData.down('[name=fNacimiento]'))
                            formData.down('[name=fNacimiento]').setValue(Ext.Date.subtract(new Date(setFormatFechaSolo(obj.result.fechaNacimiento)), Ext.Date.DAY, -1));

                        if (formData.down('[name=contrasenia]'))
                            formData.down('[name=contrasenia]').focus(true);

                        if (formData.down('[name=pass]'))
                            formData.down('[name=pass]').focus(true);




                    }

                    ocultarBarraProgreso();

                } else
                    ocultarBarraProgreso();
            } else {
                console.log('----------', response.responseText);
                ocultarBarraProgreso();
                //		messageInformation('Error revisar consola.');
            }
        },
        failure: function (response) {
            var obj = Ext.util.JSON.decode(response.responseText);
            notificaciones(obj.error.message, 2);
            console.log('--------------------------------->', obj.error.message);
            //console.log(response);
            ocultarBarraProgreso();
            //	    messageInformation('Fallo consulta revisar consola');
        }
    });
}

function setFormatFechaSolo(value) {
    var fecha = 'S/N';
    if (value !== "" && value !== null) {
        fecha = moment(value).format(STORE_FORMATO_FECHA.findRecord('id', CONFIGURACIONES['FORMATO_FECHA']).get('format'));
    }
    return fecha;
}

function onExportar(btn, nombre, grid, showExportarFiles, tipo) {
    var height = 400;
    if (showExportarFiles === undefined || tipo === undefined) {
        showExportarFiles = true;
        tipo = 3;
        height = 300;
    }
    var ventana_Exportar = Ext.create('Ext.window.Window', {
        height: height,
        width: 460,
        title: 'Descargar',
        iconCls: 'x-fa fa-download',
        closable: true,
        layout: 'anchor',
        modal: true,
        closeToolText: INFOMESSAGECLOSE,
        items: [{
                xtype: 'form',
                name: 'form_exportar',
                ui: 'light',
                cls: 'quick-graph-panel shadow panelFormulario',
                defaults: {
                    width: '100%',
                    labelWidth: 100
                },
                items: [{
                        xtype: 'textfield',
                        value: nombre,
                        name: 'nombre_archivo',
                        fieldLabel: 'Nombre archivo'
                    },
                    {
                        xtype: 'fieldset',
                        title: 'Exportar a Excel',
                        layaut: 'hbox',
                        items: [{
                                xtype: 'button',
                                text: 'Excel',
                                iconCls: 'x-fa fa-file-excel-o',
                                style: 'background:' + COLOR_SISTEMA,
                                width: '50%',
                                tooltip: 'Exportar a excel',
                                handler: function () {
                                    var name = ventana_Exportar.down('[name=nombre_archivo]').getValue();
                                    var nameFile = (name === null) ? 'Exportar_' : (name.length === 0) ? 'Exportar_' : name;
                                    getDataGridExcel(grid, 'xls', nameFile);
                                }
                            },
                            {
                                xtype: 'button',
                                text: 'Excel (técnico)',
                                iconCls: 'x-fa fa-file-excel-o',
                                name: 'btnExcelTecnico',
                                style: 'background:' + COLOR_SISTEMA,
                                width: '50%',
                                tooltip: 'Exportar a excel (técnico)',
                                handler: function () {
                                    var data = grid.getStore().data.items;
                                    var name = ventana_Exportar.down('[name=nombre_archivo]').getValue();
                                    var nameFile = (name === null) ? 'Exportar_' : (name.length === 0) ? 'Exportar_' : name;
                                    if (data) {
                                        exportExcelTecnico(data, 'xls', nameFile + '_técnico');
                                    }
                                }
                            }
                        ]
                    },
                    {
                        xtype: 'fieldset',
                        title: 'Exportar a Csv',
                        items: [{
                                xtype: 'panel',
                                layout: {
                                    type: 'hbox',
                                    pack: 'start',
                                    align: 'stretch'
                                },
                                items: [{
                                        xtype: 'combobox',
                                        labelWidth: 70,
                                        name: 'cmbx_separador',
                                        fieldLabel: 'Separador',
                                        editable: false,
                                        displayField: 'text',
                                        valueField: 'id',
                                        queryMode: 'local',
                                        value: 0,
                                        flex: 1,
                                        store: Ext.create('Ext.data.Store', {
                                            fields: ['id', 'text'],
                                            data: [{"id": 0, "text": ","}, {"id": 1, "text": ";"}]
                                        })
                                    },
                                    {
                                        xtype: 'button',
                                        flex: 1,
                                        text: 'Exportar a csv',
                                        iconCls: 'x-fa fa-file-excel-o',
                                        cls: 'btnExportarExcel',
                                        style: 'background:' + COLOR_SISTEMA,
                                        tooltip: 'Exportar a CSV',
                                        handler: function () {
                                            var name = ventana_Exportar.down('[name=nombre_archivo]').getValue();
                                            var nameFile = (name === null) ? 'Exportar_' : (name.length === 0) ? 'Exportar_' : name;
                                            var record = ventana_Exportar.down('[name=cmbx_separador]').getStore().findRecord('id', ventana_Exportar.down('[name=cmbx_separador]').getValue());
                                            var objeto = getArrayDataGrid(grid);
                                            if (objeto.data.length > 0) {
                                                getDataGridCsv(objeto.data, objeto.headers, nameFile, record.get('text'));
                                            } else
                                                notificaciones("La tabla no contiene datos.", 2);
                                        }
                                    }
                                ]
                            }]
                    },
                    {
                        xtype: 'fieldset',
                        title: 'Exportar',
                        layaut: 'hbox',

                        items: [{

                                xtype: 'button',
                                text: 'Html',
                                iconCls: 'fa fa-file-code-o',
                                cls: 'btnExportarExcel',
                                style: 'background:' + COLOR_SISTEMA,
                                width: '33%',
                                tooltip: 'Exportar a HTML',
                                handler: function () {
                                    var name = ventana_Exportar.down('[name=nombre_archivo]').getValue();
                                    var nameFile = (name === null) ? 'Exportar_' : (name.length === 0) ? 'Exportar_' : (name + moment().format('DD-MM-YYYY')).replace(/ /g, "");
                                    console.log(nameFile);
                                    var objeto = getArrayDataGrid(grid);
                                    if (objeto.data.length > 0) {
                                        var html = getTableHtml(objeto.data, objeto.headers);
                                        descargarArchivo(html, nameFile + '.html', "text/html;");
                                    }
                                }
                            },
                            {
                                xtype: 'button',
                                text: 'PDF',
                                iconCls: 'x-fa fa-file-pdf-o',
                                cls: 'btnExportarExcel',
                                style: 'background:' + COLOR_SISTEMA,
                                width: '33%',
                                tooltip: 'Exportar a PDF',
                                handler: function () {
                                    var name = ventana_Exportar.down('[name=nombre_archivo]').getValue();
                                    var nameFile = (name === null) ? 'Exportar_' : (name.length === 0) ? 'Exportar_' : name;
                                    nameFile = nameFile + "_" + new Date().getDate() + "_" + (new Date().getMonth() + 1) + "_" + new Date().getFullYear();
                                    var objeto = getArrayDataGrid(grid);
                                    if (objeto.data.length > 0) {
                                        if (nombre == "Reporte Control" || nombre == "Reporte Sanitización")
                                            imprimirPdfSanitizacionControl(getTableHtml(objeto.data, objeto.headers, nombre));
                                        else
                                            convertPDF(nombre, getTableHtml(objeto.data, objeto.headers));
                                    } else
                                        notificaciones("La tabla no contiene datos.", 2);
                                }
                            },
                            {
                                xtype: 'button',
                                text: 'Word',
                                iconCls: 'x-fa fa-file-word-o',
                                cls: 'btnExportarExcel',
                                style: 'background:' + COLOR_SISTEMA,
                                width: '33%',
                                tooltip: 'Exportar a Word',
                                handler: function () {
                                    var name = ventana_Exportar.down('[name=nombre_archivo]').getValue();
                                    var nameFile = (name === null) ? 'Exportar_' : (name.length === 0) ? 'Exportar_' : name;
                                    nameFile = nameFile + "_" + new Date().getDate() + "_" + (new Date().getMonth() + 1) + "_" + new Date().getFullYear();
                                    var objeto = getArrayDataGrid(grid);
                                    if (objeto.data.length > 0) {
                                        var html = getTableHtmlWord(objeto.data, objeto.headers, nameFile, null, null, "html", nombre);
                                        convertWord(html, nameFile);
                                    } else
                                        notificaciones("La tabla no contiene datos.", 2);
                                }
                            }
                        ]
                    },
                    {
                        xtype: 'fieldset',
                        title: 'Exportar',
                        layaut: 'hbox',
                        hidden: showExportarFiles,
                        items: [{
                                xtype: 'button',
                                text: 'Exportar a KML',
                                iconCls: 'x-fa fa-file',
                                cls: 'btnExportarExcel',
                                style: 'background:' + COLOR_SISTEMA,
                                flex: 1,
                                tooltip: 'Exportar a KML',
                                handler: function () {
                                    var name = ventana_Exportar.down('[name=nombre_archivo]').getValue();
                                    var nameFile = (name === null) ? 'Exportar_' : (name.length === 0) ? 'Exportar_' : name;
                                    descargarKML(nameFile, grid, tipo);
                                }
                            },
                            {
                                xtype: 'button',
                                text: 'Exportar a KMZ',
                                iconCls: 'x-fa fa-file-archive-o',
                                cls: 'btnExportarExcel',
                                style: 'background:' + COLOR_SISTEMA,
                                flex: 1,
                                tooltip: 'Exportar a KMZ',
                                hidden: true,
                                handler: function () {
                                    var name = ventana_Exportar.down('[name=nombre_archivo]').getValue();
                                    var nameFile = (name === null) ? 'Exportar_' : (name.length === 0) ? 'Exportar_' : name;
                                    nameFile = nameFile + "_" + new Date().getDate() + "_" + (new Date().getMonth() + 1) + "_" + new Date().getFullYear();
                                    var objeto = getArrayDataGrid(grid);
                                    if (objeto.data.length > 0) {
                                        convertPDF(nombre, getTableHtml(objeto.data, objeto.headers));
                                    } else
                                        notificaciones("La tabla no contiene datos.", 2);
                                }
                            },
                            {
                                xtype: 'button',
                                text: 'Exportar a JSON',
                                iconCls: 'x-fa fa-file-text-o',
                                cls: 'btnExportarExcel',
                                style: 'background:' + COLOR_SISTEMA,
                                flex: 1,
                                hidden: true,
                                tooltip: 'Exportar a JSON',
                                handler: function () {
                                    var name = ventana_Exportar.down('[name=nombre_archivo]').getValue();
                                    var nameFile = (name === null) ? 'Exportar_' : (name.length === 0) ? 'Exportar_' : name;
                                    nameFile = nameFile + "_" + new Date().getDate() + "_" + (new Date().getMonth() + 1) + "_" + new Date().getFullYear();
                                    var objeto = getArrayDataGrid(grid);
                                    if (objeto.data.length > 0) {
                                        var html = getTableHtml(objeto.data, objeto.headers);
                                        convertWord(html, nameFile);
                                    } else
                                        notificaciones("La tabla no contiene datos.", 2);
                                }
                            }
                        ]
                    }
                ]
            }],
        buttons: ['->',
            {
                xtype: 'button',
                iconCls: 'fa fa-times-circle',
                width: 90,
                iconAlign: 'right',
                text: 'Cerrar',
                tooltip: 'Cerrar',
                handler: function () {
                    ventana_Exportar.close();
                }
            }
        ]
    }).show();
}

function imprimirPdfSanitizacionControl(htmlImprimir) {
    var windowMessageImprimirMulta = Ext.MessageBox.show({
        title: 'Procesando Información',
        message: 'Generando reporte por favor espere...',
        width: 200,
        wait: true,
        waitConfig: {
            interval: 300
        }
    });
    if (!winReporteSanitizacionControl) {
        winReporteSanitizacionControl = Ext.create('Ext.window.Window', {
            title: '<center>Reporte de Sanitización</center>',
            resizable: true,
            width: 1150,
            height: 550,
            closeAction: 'hide',
            plain: false,
            autoScroll: true,
            closeToolText: INFOMESSAGECLOSE,
            items: [
                Ext.create('Ext.form.Panel', {
                    id: 'impLiqRecibo',
                    name: 'impLiqRecibo'
                })
            ],
            bbar: ['->',
                {
                    xtype: 'container',
                    defaults: {
                        xtype: 'button',
                        margin: '10 5 10 0'
                    },
                    items: [{
                            text: 'Imprimir',
                            iconCls: 'icon-printer',
                            flex: 1,
                            handler: function () {
                                var ficha = document.getElementById("impLiqRecibo");
                                var ventimp = window.open(' ', 'popimpr');
                                ventimp.document.write(ficha.innerHTML);
                                ventimp.document.close();
                                ventimp.print();
                                ventimp.close();
                                winReporteSanitizacionControl.hide();
                            }
                        },
                        {
                            text: 'Cancelar',
                            iconCls: 'icon-cancel',
                            flex: 1,
                            handler: function () {
                                winReporteSanitizacionControl.hide();
                            }
                        }
                    ]
                }, '->'
            ]
        });
    }

    windowMessageImprimirMulta.close();
    Ext.getCmp('impLiqRecibo').update(htmlImprimir);
    winReporteSanitizacionControl.show();
}

function getDataGridExcel(grid, format, nameFile) {
    var records = grid.getStore().data.items;
    if (records.length > 0) {
        var columns = grid.getColumns();
        var headers = [],
                num = false;
        for (var i in columns) {
            if (!columns[i].hidden) {
                var header = (columns[i].header) ? columns[i].header : columns[i].text;
                if (header !== '#') {
                    headers.push(header);
                } else {
                    num = true;
                }
            }
        }
        var data = [];
        for (var i in records) {
            var values = [];
            var value = "";
            for (var j in columns) {
                j = (num) ? parseInt(j) + 1 : j;
                if (j < columns.length) {
                    if (!columns[j].hidden) {
                        var cadena = String(columns[j].renderer).split(' ');
                        if (cadena[1] === 'formatInformacionCliente(value,') {
                            value = formatInformacionClienteExport(records[i]);
                            console.log('1');
                        } else if (cadena[1] === 'showTipContenIDSolicitud(value,') {
                            value = formatInformacionIDSolicitudExport(records[i]);
                            console.log('2');
                        } else {
                            value = (columns[j].renderer) ? columns[j].renderer(records[i].get(columns[j].dataIndex), 'excel', records[i]) : records[i].get(columns[j].dataIndex);
                        }
                        values.push(value);
                        console.log('3');
                    }
                }
            }
            data.push(values);
        }
        //console.log(data);
        nameFile = nameFile + "_" + new Date().getDate() + "_" + (new Date().getMonth() + 1) + "_" + new Date().getFullYear();
        exportArchivo(data, headers, format, nameFile);
    } else {
        notificaciones('No existen datos a exportar.', 2);
    }
}

function formatInformacionClienteExport(value) {
    var celda = '<b>Nombres:</b> ' + value.data.cliente + ' | <b>Cédula:</b> ' + value.data.cedulaCliente + '\n' +
            '<b>Celular:</b> ' + value.data.celularCliente;
    return celda;
}

function formatInformacionIDSolicitudExport(value) {
    /* var celda = "";
     for (i = 0; i < value.data.idSolicitud.length; i++) {
     celda += value.data.idSolicitud[i].idSolicitud + " | "
     }
     return celda; */
    if (value.data.idSolicitud == 0) {
        resp = 0;
    } else if (value.data.idSolicitud.includes('<select>')) {
        var texto = value.data.idSolicitud.replace('<select>', "");
        var texto1 = texto.replace('</select>', "");
        var array = texto1.split('</option>');
        var array1 = [];
        for (var i = 1; i < array.length - 1; i++) {
            array1.push(array[i].replace('<option>', ''));
        }
        resp = array1.join(' | ');
    } else {
        resp = value.data.idSolicitud.split('<br>').join(' | ');
    }
    return resp;
}

function formatFormaPago(value) {
    var html = 'Sin estado';
    if (value == 1) {
        html = 'Efectivo';
    }
    if (value == 2) {
        html = 'Tarjeta de crédito';
    }
    if (value == 3) {
        html = 'Saldo CLIPP';
    }
    if (value == 4) {
        html = 'Saldo Feria';
    }
    if (value == 5) {
        html = 'Transferencia boleto';
    }
    return html;
}

function formatAcceso(value) {
    var html = 'Sin estado';
    if (value == 0) {
        html = '<span style="color:blue;" title="Normal">Normal</span>';
    }
    if (value == 1) {
        html = '<span style="color:green;" title="Admin">Admin</span>';
    }


    return html;
}

function formatAplicativo(value) {
    var html = 'Sin aplicativo';
    if (value == 1) {
        html = 'CLIPP';
    }
    if (value == 2) {
        html = 'Puntualidad';
    }
    if (value == 3) {
        html = 'CLIPP HELP';
    }
    if (value == 4) {
        html = 'SCOIT';
    }
    if (value == 5) {
        html = 'WEB CLIENTE';
    }
    if (value == 6) {
        html = 'Clipp Store';
    }
    if (value == 7) {
        html = 'Clipper';
    }
    return html;
}

function formatPlataforma(value) {
    var html = 'Sin aplicativo';
    if (value == 1) {
        html = 'iOS';
    }
    if (value == 2) {
        html = 'Android';
    }
    if (value == 3) {
        html = 'WEB';
    }
    if (value == 4) {
        html = 'Portero Android';
    }
    if (value == 5) {
        html = 'Boot Facebook';
    }
    if (value == 6) {
        html = 'boot watsap';
    }
    return html;
}

function formatTipoEstadoPedido(value, b, c) {
    var html = 'Sin estado';
    if (value == 1) {
        html = c.data.tipoEstadoPedido;
    }
    if (value == 2) {
        html = c.data.tipoEstadoPedido;
    }
    if (value == 3) {
        html = c.data.tipoEstadoPedido;
    }
    return html;
}

function exportExcelTecnico(records, format, nameFile) {
    nameFile = nameFile + "_" + new Date().getDate() + "_" + (new Date().getMonth() + 1) + "_" + new Date().getFullYear();
    if (records.length > 0) {
        var headers = (records[0].data) ? Object.keys(records[0].data) : Object.keys(records[0]);
        var data = [];
        for (var i = 0; i < records.length; i++) {
            var values = (records[i].data) ? records[i].data : records[i];
            console.log('values ', Object.values(values));
            data.push(Object.values(values));
        }
        exportArchivo(data, headers, format, nameFile);
    } else {
        notificaciones('No existen datos a exportar.', 2);
    }
}

function getDataGridCsv(ar, headers, nombre, separador) {
    if (window.Blob && (window.URL || window.webkitURL)) {
        var contenido = "",
                d = new Date(),
                blob,
                reader,
                save,
                clicEvent;
        for (var i in headers) {
            var header = headers[i].split('<br>');
            if (header.length > 1)
                contenido += (header[0] + ' ' + header[1]) + separador;
            else
                contenido += header[0] + separador;
        }
        contenido = contenido.substring(0, contenido.length - 1);
        contenido += '\n';
        //creamos contenido del archivo
        for (var i = 0; i < ar.length; i++) {
            contenido += Object.keys(ar[i]).map(function (key) {
                return !isNaN(ar[i][key]) ? ar[i][key] : ar[i][key].replace(/(<([^>]+)>)/ig, '');
                //return ar[i][key];
            }).join(separador) + "\n";
        }
        blob = new Blob(["\ufeff", contenido], {type: 'text/csv'});
        var reader = new FileReader();
        reader.onload = function (event) {
            //escuchamos su evento load y creamos un enlace en dom
            save = document.createElement('a');
            save.href = event.target.result;
            save.target = '_blank';
            //aquí le damos nombre al archivo
            save.download = nombre + d.getDate() + "_" + (d.getMonth() + 1) + "_" + d.getFullYear() + ".csv";
            try {
                //creamos un evento click
                clicEvent = new MouseEvent('click', {
                    'view': window,
                    'bubbles': true,
                    'cancelable': true
                });
            } catch (e) {
                //si llega aquí es que probablemente implemente la forma antigua de crear un enlace
                clicEvent = document.createEvent("MouseEvent");
                clicEvent.initEvent('click', true, true);
            }
            //disparamos el evento
            save.dispatchEvent(clicEvent);
            //liberamos el objeto window.URL
            (window.URL || window.webkitURL).revokeObjectURL(save.href);
        };
        //leemos como url
        reader.readAsDataURL(blob);
    } else {
        //el navegador no admite esta opción
        alert("Su navegador no permite esta acción");
    }
}

function descargarArchivo(contenido, filename, type) {
    type = type + "charset=utf-8";
    var a = document.createElement("a"),
            file = new Blob([contenido], {type: type});
    if (window.navigator.msSaveOrOpenBlob) // IE10+
        window.navigator.msSaveOrOpenBlob(file, filename);
    else { // Others
        var url = URL.createObjectURL(file);
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        setTimeout(function () {
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
        }, 0);
    }
}

function descargarArchivo(contenido, filename, type) {
    type = type + "charset=utf-8";
    var a = document.createElement("a"),
            file = new Blob([contenido], {type: type});
    if (window.navigator.msSaveOrOpenBlob) // IE10+
        window.navigator.msSaveOrOpenBlob(file, filename);
    else { // Others
        var url = URL.createObjectURL(file);
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        setTimeout(function () {
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
        }, 0);
    }
}

function convertPDF(nombre, html) {
    //var fecha = moment().format(STORE_FORMATO_FECHA.findRecord('id', CONFIGURACIONES['FORMATO_FECHA']).get('format'));
    //console.log(html);

    var fecha = moment().format('YYYY-MM-DD');
    var d = new Date();
    var suma = 0;
    var doc = new jsPDF("l");
    doc.setFontSize(9);
    doc.text(nombre, 120, 43);
    var pos = 0;
    for (var i = 0; i < listaDatos.length; i++) {
        if (listaDatos[i][2] != "") {
            doc.setFontType("bold");
            doc.setFontSize(10);
            doc.text(listaDatos[i][1], 10, 53 + pos);
            doc.setFontType("normal");
            doc.text(listaDatos[i][2], 35, 53 + pos);
            pos += 5;
            suma = pos;
        }
    }
    suma = pos + 5;
    //var dom = new DOMParser().parseFromString(html, 'text/html');
    var dom = new DOMParser().parseFromString(html, 'text/html');
    var elem = dom.body.firstChild;
    var res = doc.autoTableHtmlToJson(elem);
    var options = {
        theme: "grid",
        margin: 10,
        styles: {
            font: "helvetica",
            fontSize: 10,
            overflow: "linebreak",
            cellPadding: 1,
            halign: "left"
        },
        startY: 48 + suma,
        pageBreak: 'auto',
        tableWidth: 'auto',
        showHeader: 'everyPage',
        showFoot: 'lastPage',
        tableLineColor: 200
    };
    doc.autoTable(res.columns, res.data, options);
    /*  if (listaDatos.length > 0) {
     var fin = doc.autoTableEndPosY();
     doc.setFontSize(8);
     doc.setFontType("bold");
     doc.text("Información del Reporte", 10, (fin + 5));
     doc.setFontType("normal");
     doc.setFontSize(8);
     doc.text("Reporte generado por: " + USUARIO.PERSONA, 10, (fin + 8));
     doc.setFontSize(8);
     doc.text(moment().format(STORE_FORMATO_FECHA.findRecord('id', CONFIGURACIONES['FORMATO_FECHA']).get('format')) + " " + moment().format(STORE_FORMATO_HORA.findRecord('id', CONFIGURACIONES['FORMATO_HORA']).get('format')), 10, (fin + 11));
     } */
    doc.setProperties({
        title: 'Reporte ' + fecha
    });
    doc.save(nombre + "_" + d.getDate() + "_" + (d.getMonth() + 1) + "_" + d.getFullYear() + '.pdf');
}

function getArrayDataGrid(grid, all) {
    all = (all) ? all : false;
    var header, datos = [],
            records = (grid.getStore().proxy.data) ? grid.getStore().proxy.data : grid.getStore().data.items;
    /* var r = JSON.stringify(item);
     var texto = r.replace(/<[^>]*>?/g, '');
     var re = JSON.parse(texto); */
    console.log(records);
    for (var i = 0; i < records.length; i++) {
        var record = (records[i].data) ? records[i].data : records[i];
        var clave = Object.keys(record),
                valor = Object.values(record),
                objeto = {};
        for (var j in clave) {
            if (clave[j] !== true || clave[j] !== false) {
                for (var k in grid.columns) {
                    if (clave[j] === grid.columns[k].dataIndex) {
                        header = grid.columns[k].header ? grid.columns[k].header.toUpperCase() : grid.columns[k].text.toUpperCase();
                        objeto[header] = (grid.columns[k].renderer) ? grid.columns[k].renderer(record[clave[j]], 'excel', records[i]) : record[clave[j]];
                        if (objeto[header] === undefined || objeto[header] === null)
                            objeto[header] = valor[j];
                    }
                }
                if (all) {
                    var claveAux = Object.keys(objeto);
                    var valorAux = Object.values(objeto);
                    for (var k = 0; k < claveAux.length; k++) {
                        if (claveAux[k] !== clave[j].toUpperCase())
                            header = clave[j].toUpperCase();
                        if (valorAux[k] !== record[clave[j]])
                            objeto[clave[j].toUpperCase()] = record[clave[j]];
                        k = claveAux.length;
                    }
                }
            }
        }
        datos.push(objeto);
    }
    var cabecera = [],
            info = [];
    datos.forEach(function (item, index) {
        if (index === 0)
            cabecera = Object.keys(item);
        info.push(Object.values(item));
    });
    return {headers: cabecera, data: info, datos: datos};
}

function getTableHtml(data, headers, nombre) {
    var encabezado = "";
    var htmlLogo = "";
    if (nombre == "Reporte Control" || nombre == "Reporte Sanitización") {
        htmlLogo = "<div style='text-align: center;  margin-left: 10px;margin-right: 10px;margin-bottom: 10px;'><img src='" + LOGO_PDF + "'/></div>";
        encabezado = "<div  style='text-align: center;  margin-left: 10px;margin-right: 10px;margin-bottom: 10px;'><center><b>" + TITULO_MAIN_APP + "</b></center></div>" +
                "<div><center><b>" + nombre + "</b></center><br></div>";
    }
    var cabezera = "",
            columnas = "",
            filas = "",
            html = '<!doctype html> <html> <head> <meta charset="utf-8"> <title>Html</title> </head> <body>' +
            htmlLogo +
            encabezado +
            '<table border="1" style="border: 3px solid #000000; width: 100%; text-align: left; border-collapse: collapse;">' +
            '<thead style="background: #CFCFCF; background: -moz-linear-gradient(top, #dbdbdb 0%, #d3d3d3 66%, #CFCFCF 100%); background: -webkit-linear-gradient(top, #dbdbdb 0%, #d3d3d3 66%, #CFCFCF 100%); background: linear-gradient(to bottom, #dbdbdb 0%, #d3d3d3 66%, #CFCFCF 100%); border-bottom: 3px solid #000000;">' +
            '<tr style=" font-size: 15px; font-weight: bold; color: #000000; text-align: left;">';
    for (var i in headers) {
        cabezera += '<th>' + headers[i] + '</th>';
    }
    for (var i in data) {
        for (var j in data[i]) {
            var text = (data[i][j] !== null) ? data[i][j] : '';
            filas = filas + '<td>' + text + '</td>';
        }
        columnas += '<tr style="border: 1px solid #000000;padding: 5px 4px;">' + filas + '</tr>';
        filas = "";
    }
    html = html + cabezera + '</tr></thead><tbody style=" font-size: 13px;text-align: left;">' + columnas + '</tbody></table></body> </html>';
    return html;
}

function getTableHtmlWord(data, headers, nameFile, fecha, administrador, tipo, name) {
    var pos = -1;
    var encabezado = "";
    if (tipo === "html") {
        encabezado = "<div  style='text-align: center;  margin-left: 10px;margin-right: 10px;margin-bottom: 10px;'><center><b>" + TITULO_MAIN_APP + "</b></center></div>" +
                "<div><center><b>" + name + "</b></center><br></div>";
        for (var i = 0; i < listaDatos.length; i++) {
            if (listaDatos[i][2] != "") {
                encabezado += "<div><b>" + listaDatos[i][1] + " </b> " + listaDatos[i][2] + "</div>";
            }
        }
    }
    var cabezera = "",
            columnas = "",
            filas = "",
            html = '<!doctype html> <html> <head> <meta charset="utf-8"> <title>Html</title> </head> <body>' +
            encabezado + '<table border="1" style="border: 3px solid #000000; width: 100%; text-align: left; border-collapse: collapse;">' + '<thead style="background: #CFCFCF; background: -moz-linear-gradient(top, #dbdbdb 0%, #d3d3d3 66%, #CFCFCF 100%); background: -webkit-linear-gradient(top, #dbdbdb 0%, #d3d3d3 66%, #CFCFCF 100%); background: linear-gradient(to bottom, #dbdbdb 0%, #d3d3d3 66%, #CFCFCF 100%); border-bottom: 3px solid #000000;">' + '<tr style=" font-size: 15px; font-weight: bold; color: #000000; text-align: left;">';
    for (var i in headers) {
        if (headers[i] === "<CENTER>OBSERVACIÓN</CENTER>") {
            cabezera += '<td WIDTH="50" >' + headers[i] + '</td>';
            pos = i;
        } else {
            cabezera += '<th>' + headers[i] + '</th>';
        }
    }
    var bandera = true;
    for (var i in data) {
        bandera = true;
        for (var j in data[i]) {
            var text = (data[i][j] !== null) ? data[i][j] : '';
            if (pos > -1 && pos == j && bandera) {
                filas = filas + '<td WIDTH="50" >' + text + '</td>';
                bandera = false;
            } else {
                filas = filas + '<td>' + text + '</td>';
            }
        }
        columnas += '<tr style="border: 1px solid #000000;padding: 5px 4px;">' + filas + '</tr>';
        filas = "";
    }
    html = html + cabezera + '</tr></thead><tbody style=" font-size: 13px;text-align: left;">' + columnas + '</tbody></table>';
    var firma = (tipo === "html") ? "<br><div align='left'><b> Información del reporte</b></div>\n\
                 <div align='left'> " + moment().format(STORE_FORMATO_FECHA.findRecord('id', CONFIGURACIONES['FORMATO_FECHA']).get('format')) + " " + moment().format(STORE_FORMATO_HORA.findRecord('id', CONFIGURACIONES['FORMATO_HORA']).get('format')) + "</div>\n\
                 <div align='left'> Reporte generado por: " + USUARIO.PERSONA + "</div></ div>" : "";
    html = html + firma + '</body> </html>';
    return html;
}

function exportArchivo(data, headers, formato, nameFile) {
    var html = getTableHtml(data, headers);
    switch (formato) {
        case 'xls':
        case 'xlsx':
            var uri = 'data:application/vnd.ms-excel;base64,',
                    base64 = function (s) {
                        return window.btoa(unescape(encodeURIComponent(s)));
                    },
                    format = function (s, c) {
                        return s.replace(/{(\w+)}/g, function (m, p) {
                            return c[p];
                        });
                    };
            var elemento = document.createElement('a');
            //elemento.href = 'data:application/vnd.ms-excel;base64,' + escape(html);
            elemento.href = uri + base64(format(html));
            elemento.download = nameFile + '.' + formato;
            elemento.click();
            break;
        case 'csv':
            var elemento = document.createElement('a');
            elemento.href = 'data:application/csv,charset=utf-8,' + escape(html);
            elemento.download = nameFile + '.' + formato;
            elemento.click();
            break;
    }
}

function convertWord(html, nombre) {
    var converted = htmlDocx.asBlob(html, {orientation: 'portrait'});
    saveAs(converted, nombre + '.docx');
}

function setFormatFechaHora(value, metaData, record, rowIdx, colIdx, store) {
    var fecha = 'S/N';
    if (value !== "" && value !== null) {
        fecha = moment(value).format(STORE_FORMATO_FECHA.findRecord('id', CONFIGURACIONES['FORMATO_FECHA']).get('format') + ' ' + STORE_FORMATO_HORA.findRecord('id', CONFIGURACIONES['FORMATO_HORA']).get('format'));
        if (metaData.tdAttr)
            metaData.tdAttr = 'data-qtip="' + fecha + '"';
        //    console.log(fecha);
    }


    return fecha;
}

function applicateVTypes() {
    Ext.apply(Ext.form.field.VTypes, {
        ip: function (val, field) {
            return /^(?:(?:[1-9]?[0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}(?:[1-9]?[0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$|^localhost$/.test(val);
        },
        ipText: 'Ingrese una Ip valido',
        imei: function (val, field) {
            return /^[0-9]{15}|[0-9]{10}|[0-9]{14}|[0-9]{8}$/.test(val);
        },
        imeiText: 'Ingrese un IMEI valido',
        imeiMask: /[0-9]/,
        puerto: function (val, field) {
            return /^[0-9]{2}|[0-9]{3}|[0-9]{4}|[0-9]{5}$/.test(val);
        },
        puertoText: 'Ingresar un puerto válido',
        puertoMask: /[0-9]/,
        numero: function (val, field) {
            return /^[0-9]*$/.test(val);
        },
        numeroText: 'Ingresar un número de celular válido',
        numeroMask: /[0-9]/,
        celular: function (val, field) {
            return /^09[0-9]{8}|0[0-9]{8}$/.test(val);
        },
        celularText: 'Ingresar un número de celular válido',
        celularMask: /[0-9]/,
        parrafos: function (val, field) {
            return /^[a-zA-Z0-9ñÑáéíóúÁÉÍÓÚ.-\s]*$/.test(val);
        },
        parrafosText: 'El campo solo debe contener letras, espacios, números, acentos, ñ|Ñ, . y -',
        parrafosMask: /[a-zA-Z0-9ñÑáéíóúÁÉÍÓÚ.-\s]/,
        cedula: function (val, field) {
            return /^[0-9]*$/.test(val);
        },
        cedulaText: 'Número de cédula incorrecta',
        cedulaMask: /[0-9]/,
        numeros: function (val, field) {
            return /^[0-9]*$/.test(val);
        },
        codigoText: 'Código de país incorrecto ejm: +593',
        codigoMask: /[0-9]/,
        codigo: function (val, field) {
            return /^[+]{1}[0-9]*$/.test(val);
        },
        numerosText: 'El campo solo debe contener números enteros',
        numerosMask: /[0-9]/,
        placa: function (val, field) {
            if (val.length >= 6) {
                return /^[A-Za-z]{3}[0-9]{4}|[A-Za-z]{3}[0-9]{3}|[A-Za-z]{2}[0-9]{3}[A-Za-z]{1}$/.test(val);
            }
        },
        placaText: 'Ingrese un número de placa válido.',
        placaMask: /[A-Z0-9a-z]/,
        idCobis: function (val, field) {
            return /^[a-zA-z\d]+$/.test(val);
        },
        idCobisText: 'Ingrese un id cobis válido.',
        acronimo: function (val, field) {
            if (!/^[A-Z\s*]{3,5}$/.test(val)) {
                return false;
            }
            return true;
        },
        acronimoText: 'Solo carateres alfa numéricos<br>Tamaño mínimo de 2 y un máximo de 5 carateres',
        numeroTelefono: function (val, field) {
            if (val.length === 10) {
                if (!/^[0]{1}[9]{1}[0-9]{8}$/.test(val)) {
                    return false;
                } else {
                    return true;
                }
            } else {
                if (!/^[0]{1}[2-7]{1}[2]{1}[0-9]{6}$/.test(val)) {
                    return false;
                } else {
                    return true;
                }
            }
        },
        numeroTelefonoMask: /[0-9]/,
        numeroCelular: function (val, field) {
            if (val.length === 10) {
                if (!/^[N0]{1}[9]{1}[0-9]{8}$/.test(val)) {
                    return false;
                } else {
                    return true;
                }
            }
            return false;
        },
        numeroCelularMask: /[0-9]/,
        password: function (val, field) {
            var pwd = field.up('form').down('[name=pass]');
            return (val == pwd.getValue());
            return true;
        },
        passwordText: 'Las contraseñas no coinciden.',
        latitud: function (val, field) {
            return /^(\+|-)?(?:90(?:(?:\.0{1,6})?)|(?:[0-9]|[1-8][0-9])(?:(?:\.[0-9]{1,25})?))$/.test(val);
        },
        latitudText: 'Latitud incorrecta',
        longitud: function (val, field) {
            return /^(\+|-)?(?:180(?:(?:\.0{1,6})?)|(?:[0-9]|[1-9][0-9]|1[0-7][0-9])(?:(?:\.[0-9]{1,25})?))$/.test(val);
        },
        longitudText: 'Longitud incorrecta',
        textos: function (val, field) {
            return /^[a-zA-Z0-9ñÑáéíóúüÁÉÍÓÚÜ.-\s#!¡¿?,;:+´]*$/.test(val);
        },
        textosText: 'El campo solo debe contener letras, espacios, números, acentos, ñ|Ñ, #, !, ¡, ¿, ?, . y -',
        textosMask: /[a-zA-Z0-9ñÑáéíóúüÁÉÍÓÚÜ.-\s#!¡¿?,;:+´]/
    });
    //    Ext.apply(Ext.form.field.VTypes, {
    //	idCobis: function (val, field) {
    //	    return /^[a-zA-z\d]+$/.test(val);
    //	},
    //	idCobisText: 'Ingrese un id cobis válido.',
    //	celular: function (val, field) {
    //            return /^09[0-9]{8}|0[0-9]{8}$/.test(val);
    //        },
    //        celularText: 'Ingresar un número de celular válido',
    //        celularMask: /[0-9]/,
    //	cedula: function (val, field) {
    //            return check_cedula(val);
    //        },
    //	cedulaText: 'Número de cédula incorrecta',
    //        cedulaMask: /[0-9]/,
    //	placa: function (val, field) {
    //            if (val.length >= 6) {
    //                return /^[A-Za-z]{3}[0-9]{4}|[A-Za-z]{3}[0-9]{3}|[A-Za-z]{2}[0-9]{3}[A-Za-z]{1}$/.test(val);
    //            }
    //        },
    //        placaText: 'Ingrese un número de placa válido.',
    //        placaMask: /[A-Z0-9a-z]/,
    //	numeroTelefono: function (val, field) {
    //            if (val.length === 10) {
    //                if (!/^[0]{1}[9]{1}[0-9]{8}$/.test(val)) {
    //                    return false;
    //                } else {
    //                    return true;
    //                }
    //            } else {
    //                if (!/^[0]{1}[2-7]{1}[2]{1}[0-9]{6}$/.test(val)) {
    //                    return false;
    //                } else {
    //                    return true;
    //                }
    //            }
    //        },
    //        numeroTelefonoMask: /[0-9]/,
    //        numeroCelular: function (val, field) {
    //            if (val.length === 10) {
    //                if (!/^[N0]{1}[9]{1}[0-9]{8}$/.test(val)) {
    //                    return false;
    //                } else {
    //                    return true;
    //                }
    //            }
    //            return false;
    //        },
    //        numeroCelularMask: /[0-9]/,
    //        password: function (val, field) {
    //            var pwd = field.up('form').down('[name=pass]');
    //            return (val == pwd.getValue());
    //            return true;
    //        },
    //        passwordText: 'Las contraseñas no coinciden.'
    //    });
}

function formatEstadoPuntoConectado(estado, metaData) {
    var htmlEstado = '',
            text = '';
    if (estado) {
        text = 'Conectado';
        htmlEstado = '<span style="color:green;" title="' + text + '">';
    } else {
        text = 'Desconectado';
        htmlEstado = '<span style="color:red;" title="' + text + '">';
    }
    if (metaData === 'excel') {
        htmlEstado += '&#8226;</span>';
        return htmlEstado;
    } else if (metaData)
        metaData.tdAttr = 'data-qtip="' + text + '"';
    return htmlEstado + '<i class="fa fa-certificate" aria-hidden="true"></i></span>';
}

function showTipContenFechaHora(value, metaData, record, rowIdx, colIdx, store) {
    if (value == null) {
        metaData.tdAttr = 'data-qtip="S/N"';
        return "S/N";
    } else {
        metaData.tdAttr = 'data-qtip="' + moment(value).format('YYYY-MM-DD HH:mm:ss') + '"';
        return moment(value).format('YYYY-MM-DD HH:mm:ss');
    }
}

function showTipContenNumeroEntero(value, metaData, record, rowIdx, colIdx, store) {
    var numero = parseInt(value);
    metaData.tdAttr = 'data-qtip="' + numero.toString() + '"';
    return '<center>' + numero.toString() + '</center>';
}

function showTipContenNumero(value, metaData, record, rowIdx, colIdx, store) {
    var numero = parseFloat(value).toFixed(2);
    metaData.tdAttr = 'data-qtip="' + numero.toString() + '"';
    return numero.toString();
}

function formatRoles(idRol) {
    if (idRol > 0) {
        var rol = Ext.getStore('s_Roles_Combo').findRecord('idRol', idRol);
        return rol.data.rol;
    } else {
        return idRol;
    }
}

function buscarColumnaDataIndex(grid, dataIndex) {
    var columns = grid.getColumns();
    for (var i in columns) {
        if (columns[i].dataIndex === dataIndex) {
            return columns[i];
        }
    }
}

function onDisabledGraficarGeocercaMisArboles(view, rowIndex, colIndex, item, record, tabName) {
    var hoja = record.get('leaf');
    switch (tabName) {
        case 'tabVehiculoPerfilRastreo':
            if (hoja) {

            } else {
                if (view.grid.bandera_rastreo)
                    return true;
                if (record.get('leaf') == true) {
                    return true;
                }
            }
            break;
        case 'tabVehiculoPerfilEscritorio':
            break;
        case 'tabVehiculoPerfilReportes':
            break;
        case 'tabVehiculoPerfilComandos':
            break;
        case 'tabVehiculoPerfilGaraje':
            break;
        default:
            break;
    }
}

function onGetCapaClassGreen(tabName, metaData, rec) {
    var hoja = rec.get('leaf');
    switch (tabName) {
        case 'tabVehiculoPerfilRastreo':
            if (hoja) {
                if (metaData.tdAttr)
                    metaData.tdAttr = 'data-qtip="Centrar vehículo/Ver geocercas"';
                return 'x-fa fa-search-plus';
            } else {
                if (metaData.tdAttr)
                    metaData.tdAttr = 'data-qtip="Dibujar/borrar geocerca."';
                return 'gridAuxCheck x-fa fa-paint-brush';
            }
            break;
        case 'tabVehiculoPerfilEscritorio':
            break;
        case 'tabVehiculoPerfilReportes':
            break;
        case 'tabVehiculoPerfilComandos':
            break;
        case 'tabVehiculoPerfilGaraje':
            break;
        default:
            if (rec.getId() !== 0 && rec.getId() !== 'root') {
                if (metaData.tdAttr)
                    metaData.tdAttr = 'data-qtip="Dibujar/borrar geocerca."';
                return 'gridAuxCheck x-fa fa-paint-brush';
            }
            break;
    }
}

function onGraficarGeocercaMisArboles(grid, rowIndex, colIndex, event, cell, record, tabName) {
    var hoja = record.get('leaf');
    switch (tabName) {
        case 'tabVehiculoPerfilRastreo':
            if (hoja) {
                OnCetrarVehiculoRastreo('D', record.get('idVehiculo'), record.get('idEquipo'), record, mapaGoogle);
                record.set('checked', true);
            } else {
                graficarGeocercaCarpeta(grid.idMapa, record);
            }
            break;
        case 'tabVehiculoPerfilEscritorio':
            break;
        case 'tabVehiculoPerfilReportes':
            break;
        case 'tabVehiculoPerfilComandos':
            break;
        case 'tabVehiculoPerfilGaraje':
            break;
        default:
            if (record.getId() !== 0 && record.getId() !== 'root') {
                graficarGeocercaCarpeta(grid.idMapa, record);
                dibujarGeocerca = true;
            }
            break;
    }
}

function onGetCapaClassRed(tabName, metaData, rec) {
    var hoja = rec.get('leaf');
    switch (tabName) {
        case 'tabVehiculoPerfilRastreo':
            if (hoja) {
                if (metaData.tdAttr)
                    metaData.tdAttr = 'data-qtip="Centrar vehículo/Ver geocercas"';
                if (rec.get('verGeocercas')) {
                    return 'gridAuxCheck x-fa fa-globe';
                } else {
                    return 'x-fa fa-globe';
                }
            } else {
                if (metaData.tdAttr)
                    metaData.tdAttr = 'data-qtip="Dibujar/borrar geocerca."';
                return 'gridAuxDelete x-fa fa-eraser';
            }
            break;
        case 'tabVehiculoPerfilEscritorio':
            break;
        case 'tabVehiculoPerfilReportes':
            break;
        case 'tabVehiculoPerfilComandos':
            break;
        case 'tabVehiculoPerfilGaraje':
            break;
        default:
            if (rec.getId() !== 0 && rec.getId() !== 'root') {
                metaData.tdAttr = 'data-qtip="Dibujar/borrar geocerca."';
                return 'gridAuxDelete x-fa fa-eraser';
            }
            break;
    }
}

function onBorrarGeocercaMisArboles(grid, rowIndex, colIndex, event, cell, record, tabName) {
    var hoja = record.get('leaf');
    switch (tabName) {
        case 'tabVehiculoPerfilRastreo':
            if (hoja) {
                OnVerGeocercas('D', record.get('idVehiculo'), record.get('idEquipo'));
            } else {
                borrarGeocercaCarpeta(grid, record);
            }
            break;
        case 'tabVehiculoPerfilEscritorio':
            break;
        case 'tabVehiculoPerfilReportes':
            break;
        case 'tabVehiculoPerfilComandos':
            break;
        case 'tabVehiculoPerfilGaraje':
            break;
        default:
            if (record.getId() !== 0 && record.getId() !== 'root') {
                borrarGeocercaCarpeta(grid, record);
            }
            break;
    }
}

function formatEstadoBoleto(value, metaData, record, rowIdx, colIdx, store) {
    var html = 'Sin estado';
    if (value == 1) {
        html = 'Próximamente';
    }
    if (value == 2) {
        html = 'A la venta';
    }
    if (value == 3) {
        html = 'Agotados';
    }
    if (value == 4) {
        html = 'No se envian';
    }
    return html;
}

function formatEstadoProducto(value, metaData, record, rowIdx, colIdx, store) {
    var html = 'Sin estado';
    if (value == 1) {
        html = 'Próximamente';
    }
    if (value == 2) {
        html = 'A la venta';
    }
    if (value == 3) {
        html = 'Agotados';
    }
    if (value == 4) {
        html = 'No se envian';
    }
    return html;
}

function formatPorcentaje(value) {
    var porcetaje = value;
    return porcetaje + ' %';
}


function formatEstadoOpcional(estado) {
    var htmlEstado = '';
    if (estado === '1' || estado === 1) {
        htmlEstado = '<span style="color:green;" title="Habilitado">Requerido</span>';
    } else {
        htmlEstado = '<span style="color:red;" title="Habilitado">Opcional</span>';
    }
    return htmlEstado;
}

function formatoTipoCampo(value) {
    var tipo = Ext.create('bancodt.store.stores.s_TipoCampo').findRecord('idTipo', value);
    return tipo.data.tipo;
}

function alertaMessage(title, message) {
    Ext.MessageBox.show({
        title: title,
        msg: message,
        buttons: Ext.MessageBox.OK,
        fn: function () {}
    });
}

function verificarFecha(ventana, desde, hasta, newValue, operacion) {
    switch (operacion) {
        case "menor":
            if (ventana.down('[name="' + hasta + '"]').getValue() < newValue)
                ventana.down('[name="' + hasta + '"]').setValue(newValue);
            break;
        case "mayor":
            if (ventana.down('[name="' + desde + '"]').getValue() > newValue)
                ventana.down('[name="' + desde + '"]').setValue(newValue);
            break;
        case "sumar":
            var fechaAnt = moment(hasta, 'YYYY-MM-DD');
            ventana.down('[name="' + desde + '"]').setValue(fechaAnt.add('days', +1).format('YYYY-MM-DD'));
            break;
        case "restar":
            var fechaAnt = moment(hasta, 'YYYY-MM-DD');
            ventana.down('[name="' + desde + '"]').setValue(fechaAnt.add('days', -1).format('YYYY-MM-DD'));
            break;
        case "15dias":
            var fecha_inicio = moment().add('days', -15).format('YYYY-MM-DD');
            var fin = moment().format('YYYY-MM-DD');
            var fecha_fin = moment(fin).add('days', 1).format('YYYY-MM-DD');
            ventana.down('[name="' + desde + '"]').setValue(fecha_inicio);
            ventana.down('[name="' + hasta + '"]').setValue(fecha_fin);
            break;
        case "mesActual":
            var anio = moment().format('YYYY');
            var mes = moment().format('MM');
            var fecha_inicio = moment(anio + "-" + mes + "-01").format('YYYY-MM-DD');
            var fin = moment(fecha_inicio).endOf("month").format('YYYY-MM-DD');
            var fecha_fin = moment(fin).add('days', 1).format('YYYY-MM-DD');
            ventana.down('[name="' + desde + '"]').setValue(fecha_inicio);
            ventana.down('[name="' + hasta + '"]').setValue(fecha_fin);
            break;
        case "mesAnterior":
            var anio = moment().format('YYYY');
            var mes = moment().format('MM');
            var fecha_inicio = moment(anio + "-" + mes + "-01").add('months', -1).format('YYYY-MM-DD');
            var fin = moment(fecha_inicio).endOf("month").format('YYYY-MM-DD');
            var fecha_fin = moment(fin).add('days', 1).format('YYYY-MM-DD');
            ventana.down('[name="' + desde + '"]').setValue(fecha_inicio);
            ventana.down('[name="' + hasta + '"]').setValue(fecha_fin);
            break;
        case "ayer":
            var fecha_inicio = moment().add('days', -1).format('YYYY-MM-DD');
            ventana.down('[name="' + desde + '"]').setValue(fecha_inicio);
            ventana.down('[name="' + hasta + '"]').setValue(fecha_inicio);
            break;
        default: //Hoy
            ventana.down('[name="' + desde + '"]').setValue(newValue);
            ventana.down('[name="' + hasta + '"]').setValue(newValue);
            break;
    }
}

function cargarPerfiles(panel, moduloPadre, modulo) {
    var params = {moduloPadre: moduloPadre, modulo: modulo};
    Ext.Ajax.request({
        async: true,
        params: params,
        url: 'php/Get/getPerfilesModulo.php',
        callback: function (callback, e, response) {
            var res = JSON.parse(response.request.result.responseText);
            if (res.success) {
                var perfiles = res.data;
                for (var perfil in perfiles) {
                    panel.down('[name=' + perfiles[perfil].perfil + ']').setHidden(false);
                }
            }
        }
    });
}

function hoyFecha() {
    var hoy = new Date();
    var dd = hoy.getDate();
    var mm = hoy.getMonth() + 1;
    var yyyy = hoy.getFullYear();
    dd = addZero(dd);
    mm = addZero(mm);
    var fecha = '';
    var result = fecha.concat(dd, mm, yyyy);
    return result;
}

function addZero(i) {
    if (i < 10) {
        i = '0' + i;
    }
    return i;
}

function formatVisibilidadPedido(id) {
    var dat = Ext.create('bancodt.store.stores.s_EstadosPedido').getById(id);
    if (dat !== null)
        return dat.get('text');
    else
        return "<center><span style='color:red;'>s/n</span></center>";
}

function obtenerSistemaOperativo() {
    var OSName = "Desconocido";
    if (navigator.appVersion.indexOf("Win") != -1)
        OSName = "Windows";
    else if (navigator.appVersion.indexOf("Mac") != -1)
        OSName = "MacOS";
    else if (navigator.appVersion.indexOf("X11") != -1)
        OSName = "UNIX";
    else if (navigator.appVersion.indexOf("Linux") != -1)
        OSName = "Linux";
    else if (navigator.appVersion.indexOf("Android") != -1)
        OSName = "Android";
    return OSName;
}

function generarLinkProfundo(grid, tipo, txtLink, modulo) {
    var so = obtenerSistemaOperativo();
    var urlImagen = "";
    var data;
    var titulo = "";
    var descripcion = "";
    var idCiudad = 0;
    if (tipo == "producto") {
        urlImagen = URL_RECURSO_IMAGENES + URL_RECURSO_IMAGEN_PRODUCTO_PEQUENO + grid[0].data.imgPequenia;
        data = {tipo: 3, data: {idSucursal: grid[0].data.idDepartamento, idProducto: grid[0].data.idProducto}};
        titulo = grid[0].data.titulo;
        var descripcionGuardar = (grid[0].data.subTitulo == null) ? "" : grid[0].data.subTitulo;
        descripcion = (descripcionGuardar != "") ? descripcionGuardar : modulo.down('[name=subTitulo]').getRawValue();
        idCiudad = grid[0].data.idCiudad;
    } else { //sucursal        
        urlImagen = IP_IMAGENES + URL_IMAGENES + URL_IMAGEN_SUCURSAL + grid[0].data.img;
        data = {tipo: 2, data: {idSucursal: grid[0].data.id}};
        titulo = grid[0].data.sucursal;
        var descripcionGuardar = (grid[0].data.descripcionCorta == null) ? "" : grid[0].data.descripcionCorta;
        descripcion = (descripcionGuardar != "") ? descripcionGuardar : modulo.down('[name=descripcionCorta]').getRawValue();
        idCiudad = grid[0].data.ciudad;
    }

    Ext.Ajax.request({
        method: 'POST',
        dataType: 'json',
        headers: {
            'version': '3.1.1'
        },
        url: URL_SERVICIO_NODE + URL_REST_LINKPROFUNDO,
        params: {
            domain: DOMINIO,
            link: LINK_PROFUNDO,
            android: LINK_ANDROID,
            ios: LINK_IOS,
            idTipoQR: 2, //1:Ktaxi, 2:Clipp            
            idAplicativo: 1,
            data: Ext.JSON.encode(data),
            titulo: titulo,
            descripcion: descripcion,
            idSistema: 2,
            idCiudad: idCiudad,
            urlImagen: urlImagen,
            idPlataforma: 3, //iOs, Android, WEB
            imei: '',
            marca: '',
            modelo: '',
            so: so,
            vs: '1.0.0',
            auth: ''
                    //idClienteopcional: 'int', //cuando se asocia link a un cliente
        },
        callback: function (callback, e, response) {
            var res = JSON.parse(response.request.result.responseText);
            if (res.en) {
                txtLink.setValue(res.sL);
                modulo.down('[name=btnGenerar]').disable();
                notificaciones(res.m + ". Presione en editar para guardar los cambios", 1);
            } else {
                notificaciones("Los siguientes campos son obligatorios " + res.m, 1);
            }
        }
    });
}


function cambiarMaximoMinimo(form_crear, idTipoIdentificacion) {
    if (idTipoIdentificacion == 1) {
        form_crear.down('[name=cedula]').inputEl.component.maskRe = /[0-9]/;
        form_crear.down('[name=cedula]').inputEl.component.minLength = 10;
        form_crear.down('[name=cedula]').inputEl.component.maxLength = 10;
        form_crear.down('[name=celular]').inputEl.component.maskRe = /[0-9]/;
        form_crear.down('[name=celular]').inputEl.component.minLength = 10;
        form_crear.down('[name=celular]').inputEl.component.maxLength = 10;
    } else {
        form_crear.down('[name=cedula]').inputEl.component.maskRe = /[a-zA-Z0-9]/;
        form_crear.down('[name=cedula]').inputEl.component.minLength = 7;
        form_crear.down('[name=cedula]').inputEl.component.maxLength = 18;
        form_crear.down('[name=celular]').inputEl.component.maskRe = /[0-9]/;
        form_crear.down('[name=celular]').inputEl.component.minLength = 7;
        form_crear.down('[name=celular]').inputEl.component.maxLength = 18;
    }
}

function initAutocomplete(element, ID_MAPA, panel) {
    var input = document.getElementById(element);
    var autocomplete = new google.maps.places.Autocomplete(input);
    autocomplete.setFields(
            ['address_components', 'geometry', 'name']);
    autocomplete.addListener('place_changed', function () {
        var place = autocomplete.getPlace();
        if (!place.geometry) {
            console.log("No se puede obtener la ubicación");
            return;
        }
        if (LIST_MAPS[ID_MAPA].MARCADOR) {
            LIST_MAPS[ID_MAPA].MARCADOR.remove();
        }
        if (panel) {
            panel.down('[name=latitud]').setValue(place.geometry.location.lat());
            panel.down('[name=longitud]').setValue(place.geometry.location.lng());
        }

        graficarMarcador(LIST_MAPS[ID_MAPA], place.geometry.location.lat(), place.geometry.location.lng(), null, LIST_MAPS[ID_MAPA].getZoom());
    });
}

function formatAccionRegistro(estado) {
    var htmlEstado = '';
    if (estado == 1 || estado == '1') {
        htmlEstado = '<span " title="Crear">Crear</span>';
    } else {
        htmlEstado = '<span " title="Editar">Editar</span>';
    }
    return htmlEstado;
}

function formatTablaRegistro(estado) {
    var htmlEstado = '';
    if (estado == 1 || estado == '1') {
        htmlEstado = '<span " title="Crear">Administradores</span>';
    } else if (estado == 2 || estado == '2') {
        htmlEstado = '<span " title="Usuarios">Usuarios</span>';
    } else if (estado == 3 || estado == '3') {
        htmlEstado = '<span " title="Horarios">Horarios</span>';
    } else {
        htmlEstado = '<span " title="Tarjetas">Tarjetas</span>';
    }
    return htmlEstado;
}