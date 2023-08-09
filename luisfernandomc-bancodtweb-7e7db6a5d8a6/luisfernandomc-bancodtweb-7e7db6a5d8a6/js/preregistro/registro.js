
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

    validarFormulario();
 // cargarMapa();

    $('#typeahead dropdown-menu li').click(function () {
        var str = $(this).text();
    });

  
    $("input.coor").on('keyup', function(){
        var value = $(this).val();
        var datos = 0;
        var areglo = [];
        var total = 0;
        var idAplicativo = "1"; //debe ser string
        var idCiudad = 1;
        var idCliente = "8485";
        var timeStanD = new Date().getTime();
        var token = getToken(timeStanD, idCliente); //sha256(timeStanD + md5(idAplicativo)
        var key = getKey(token, timeStanD, idCliente); //md5(idAplicativo + token + timeStanD)
        $.ajax({
                url: URL_REST_SOLICITUD + 'ser/destino/lugares-cercanos/',
                type: 'POST',
                dataType: 'json',
                headers: {
                    'Content-Type': "application/x-www-form-urlencoded",
                    "version": "1.0.0",
                },
                data: {
                    idAplicativo: 1,
                    idCiudad: idCiudad,
                    lugarActual: value,
                    imei: idCliente,
                    token: token,
                    key: key,
                    timeStanD: timeStanD,
                },
                success: function (response) {
                    console.log(response);
                    console.log('aqui');
                    if(response.en == 1){
                        $('#coordenadas').empty();
                       for(var i = 0; i < response.lC.length; i++){
                        $("#coordenadas").append('<a class="dropdown-item" onClick="prueba(\''+ response.lC[i].dP+'\' , \''+response.lC[i].dS+'\');" role="option" id="item" value="hola"><strong>'+ response.lC[i].dP + ' ' + '</strong>' +  response.lC[i].dS + '</a>');
                       }
                    }else
                    $('#coordenadas').empty();
                },
                failure: function (response) {
                    console.log(response);
                }
            });
            
    });

    $( "#entrada" ).click(function() {
        getPaisCiudadProvincia(latitud,longitud);
    });

     $("#idCiudad").change(function(){
        if($(this).val()!=0){
        console.log('click');
        swal({
         title: "Cargando..." ,
         text: "Cargando provincia, Por favor espere...",
         icon: "./img/loader.gif",
         button: false,
         closeOnClickOutside: false,
         closeOnEsc: false,
         //timer: 2000
       });
         $.ajax({
           type: "POST",
           url: './php/Get/getPaisProvincia.php', 
           dataType: "json",
           data: {
               idCiudad : $(this).val()
           },
           success: function(data){  
             if(data.success){
                 console.log(data);
                longitud = data.data[0].longitud;
                latitud = data.data[0].latitud;
                idProvincia = data.data[0].idProvincia;
                idPais = data.data[0].idPais;
                   swal.close();
             }
             if(data.data.length == 0){
                swal({
                    title: "Error",
                    text: "No se pudo obtener la provincia",
                    icon: "error",
                  });
                 swal.close();
             }
           },
           error: function(data) {
            swal({
                title: "Error",
                text: "No se pudo obtener la información",
                icon: "error",
              });
           }
         });
        }
     });

     $('#registrar').click(function (e) {
        console.log('dentro');
        $.validator.addMethod("valueNotEquals", function(value, element, arg){
            // I use element.value instead value here, value parameter was always null
            return arg != element.value; 
        }, "Value must not equal arg.");
        //e.preventDefault();//detenemos el envio
        $("#form").validate({
           /*  errorElement: 'div', */
           debug: true,
           success: "valid",
            rules: {
                compania: {
                    required: true,
                    minlength: 4,
                },
                responsable: {
                    required: true,
                    minlength: 4,
                },
                contactoCompania: {
                    required: true,
                    minlength: 7,
                    maxlength: 30,
                },
                email: {
                    required: false,
                   // email: true
                },
                url: {
                    required: false,
                },
                ruc: {
                    required: false,
                    minlength: 13,
                    maxlength: 13,
                },
                idCompaniaTipo: {
                    required: true,
                    valueNotEquals: "0"
                },
                idCiudad: {
                    required: true,
                    valueNotEquals: "0"
                },

            },
            messages: {
                compania: {
                    required: "Obligatorio",
                    minlength: $.format("Mínimo {0} caracteres"),
                },
                responsable: {
                    required: "Obligatorio",
                    minlength: $.format("Mínimo {0} caracteres"),
                },
                contactoCompania: {
                    required: "Obligatorio",
                    minlength: $.format("Mínimo {0} caracteres"),
                    maxlength: $.format("Maximo {0} caracteres")
                },
                email: {
                    email: "Dirección de correo incorrecto", 
                },
                url: {
                    url: "Por favor ingrese una URL válida", 
                },
                ruc: {
                    minlength: $.format("Mínimo {0} caracteres"),
                    maxlength: $.format("Maximo {0} caracteres")
                },
                idCompaniaTipo: {
                    //required: "Obligatorio - Por favor seleccione uno",
                    valueNotEquals: "Obligatorio - Por favor seleccione uno"
                },
                idCiudad: {
                    //required: "Obligatorio - Por favor seleccione uno",
                    valueNotEquals: "Obligatorio - Por favor seleccione uno"
                }
        },
        
        submitHandler: function(form){
            swal({
                title: "Guardando..." ,
                text: "Guardando datos, Por favor espere...",
                icon: "./img/loader.gif",
                button: false,
                closeOnClickOutside: false,
                closeOnEsc: false,
              });
            $.ajax({
                type: "POST",
                url: 'php/Get/preRegistro.php',
                data: {
                        idPais: idPais,
                        idProvincia: idProvincia,
                        idCiudad: document.getElementById("idCiudad").value,
                        idCompaniaTipo: document.getElementById("idCompaniaTipo").value,
                        compania: $('#compania').val(),
                        ruc: ($('#ruc').val()!="")?$('#ruc').val(): "",
                        callePrin: (calleP != "")?calleP:"S/N",
                        calleSec: (calleS != "")?calleS:"S/N",
                        contacto: ($('#contactoCompania').val()!="")?$('#contactoCompania').val():"",
                        correoS: ($('#email').val()!="")?$('#email').val():"",
                        url: ($('#url').val()!="")?$('#url').val():"",
                        latitud: (latitud != "")?latitud:0,
                        longitud: (latitud != "")?longitud:0,
                        nombres: ($('#responsable').val()!="")?$('#responsable').val():"S/N",
                },
                success: function (response) {
                    latitud = "";
                    longitud = "";
                    idPais = "";
                    idProvincia = "";
                    var data = JSON.parse(response);
                    if (data.success === true) {
                        swal.close();
                        swal({
                            title: "Felicidades",
                            text: data.message,
                            icon: "success",
                          });
                        limpiarForm();
                    } else{
                        swal.close();
                       swal({
                        title: "Error",
                        text: data.message,
                        icon: "error",
                      });
                    }
                },
                error: function (xhr, ajaxOptions, thrownError) {
                    latitud = "";
                    longitud = "";
                    idPais = "";
                    idProvincia = "";
                    swal.close();
                    swal({
                        title: "Error",
                        text: MENSAJE_ERROR,
                        icon: "error",
                      });
                }
            });
        }
    });


    
        /* if(document.getElementById("idCiudad").value==0 || document.getElementById("idCompaniaTipo").value==0  ){
            if(document.getElementById("idCiudad").value==0 ){
                swal({
                    title: "Por favor...",
                    text: "Primero seleccione un Ciudad",
                    icon: "error",
                  });
            }
    
            if(document.getElementById("idCompaniaTipo").value==0 ){
                swal({
                    title: "Por favor...",
                    text: "Primero seleccione un tipo de Establecimiento",
                    icon: "error",
                  });
            }
    
        }else{
            swal({
                title: "Guardando..." ,
                text: "Guardando datos, Por favor espere...",
                icon: "./img/loader.gif",
                button: false,
                closeOnClickOutside: false,
                closeOnEsc: false,
              });
            $.ajax({
                type: "POST",
                url: 'php/Get/preRegistro.php',
                data: {
                        idPais: idPais,
                        idProvincia: idProvincia,
                        idCiudad: document.getElementById("idCiudad").value,
                        idCompaniaTipo: document.getElementById("idCompaniaTipo").value,
                        compania: $('#compania').val(),
                        ruc: ($('#ruc').val()!="")?$('#ruc').val(): "s/n",
                        callePrin: (calleP != "")?calleP:"s/n",
                        calleSec: (calleS != "")?calleS:"s/n",
                        contacto: ($('#contactoCompania').val()!="")?$('#contactoCompania').val():"s/s",
                        correoS: ($('#email').val()!="")?$('#email').val():"s/n",
                        url: ($('#url').val()!="")?$('#url').val():"s/n",
                        latitud: (latitud != "")?latitud:0,
                        longitud: (latitud != "")?longitud:0,
                        nombres: ($('#responsable').val()!="")?$('#responsable').val():"S/N",
                },
                success: function (response) {
                    latitud = "";
                    longitud = "";
                    idPais = "";
                    idProvincia = "";
                    var data = JSON.parse(response);
                    if (data.success === true) {
                        swal.close();
                        swal({
                            title: "Felicidades",
                            text: data.message,
                            icon: "success",
                          });
                        limpiarForm();
                    } else{
                        swal.close();
                       swal({
                        title: "Error",
                        text: data.message,
                        icon: "error",
                      });
                    }
                },
                error: function (xhr, ajaxOptions, thrownError) {
                    latitud = "";
                    longitud = "";
                    idPais = "";
                    idProvincia = "";
                    swal.close();
                    swal({
                        title: "Error",
                        text: MENSAJE_ERROR,
                        icon: "error",
                      });
                }
            });
        } */
    });

    $('#ruc').keypress(function(e) { 
        if(e.which === 32) 
        return false; 
    });

    $('#contactoCompania').keypress(function(e) { 
        if(e.which === 32) 
        return false; 
    }); 
});


function prueba(value, value1){
    $('#coordenadas').empty();
    $('#entrada').val(value + " " + value1);
            var idAplicativo = "1"; //debe ser string
              var idCiudad = "1";
              var idCliente = "8485";
              var timeStanD = new Date().getTime();
              var md5ti = MD5(idCliente + timeStanD);
              var token = sha256(timeStanD + md5ti);
              var key = MD5(token + timeStanD);
              var lugar = value + ' ' + value1;
              $.ajax({
                url: URL_REST_SOLICITUD + 'ser/destino/coordenadas-lugar/',
                type: 'POST',
                dataType: 'json',
                headers: {
                    'Content-Type': "application/x-www-form-urlencoded",
                    "version": "1.0.0",
                },
                data: {
                    idAplicativo: idAplicativo,
                    //idCiudad: ID_CIUDAD,
                    lugar: lugar,
                    imei: idCliente,
                    token: token,
                    key: key,
                    timeStanD: timeStanD,
                },
                success: function (response) {
                    console.log(response);
                    if(response.en == 1){
                        if(response.l.lat != 0 && response.l.lng != 0 ){
                             marcadorMapa(response.l.lat, response.l.lng );
                             centrarMapa(response.l.lat, response.l.lng);
                             latitud = response.l.lat;
                             longitud= response.l.lng;
                        }else{
                            notificaciones("No se pudo obtener la direccíon",2);
                        }
                    }else
                    notificaciones("No se pudo obtener la direccíon",2);
                },
                failure: function (response) {
                    console.log(response);
                }
            });


  // $('#coor').value(value);
}

function cargarMapa(){
    mapboxgl.accessToken = 'pk.eyJ1Ijoia2F0aWVuY2lhcCIsImEiOiJjamN1a3VkbTUxMHllMnduemQ3OTh1ajB5In0.DDiBB1jMawcG_4IRpHNjiQ'; // Nuestro Token de acceso
    map = new mapboxgl.Map({
    container: 'map', // id del contenedor
    style: 'mapbox://styles/mapbox/streets-v9', // localización del mapa de estilo
    center: [-79.2338259,-3.9479672999999993], // Posición inicial 
    zoom: 10 // Zoom inicial
    });


    map.addControl(new mapboxgl.NavigationControl());
    map.addControl(new mapboxgl.FullscreenControl());
    map.addControl(new mapboxgl.GeolocateControl({
        positionOptions: {
            enableHighAccuracy: true
        },
        trackUserLocation: false
        }));

        map.on('click', function (e) {
            var lat = e.lngLat.lat;
            var lng = e.lngLat.lng;
            latitud = e.lngLat.lat;
            longitud= e.lngLat.lng;
                marcadorMapa(lat, lng);
            });
        
       /*  map.on('mousemove',  function (e) {
            latitud = e.lngLat.lat;
            longitud= e.lngLat.lng;
        }); */

        if (navigator.geolocation) { //check if geolocation is available
            navigator.geolocation.getCurrentPosition(function(position){
                latA = position.coords.latitude;
                lngA = position.coords.longitude;
                centrarMapa( latA, lngA);
            });   
        }
    }

function myFunction(){
 $("#exampleModal").modal();
 $('#entrada').val('');
 cargarMapa();
}

function mostrarClave(isSelect, id) {
    if (isSelect) {
        document.getElementById(id).type = "text";
    } else {
        document.getElementById(id).type = "password";
    }
}
function login() {
//    $('#cargandoModal').modal('show');
    $.ajax({
        type: "POST",
        url: 'php/Login/login.php',
        data: {usuario: $('#usuario').val(), contrasenia: hex_md5($('#contrasenia').val()), latitud: $('#latitud').val(), longitud: $('#longitud').val()},
        success: function (response) {
            var data = JSON.parse(response);
            if (data.success === true) {
                createCookie("ID_ADMINISTRADOR_BANCODT", data.sesion.ID_ADMINISTRADOR, 1);
                createCookie("LONGITUD_BANCODT", data.sesion.LNG_U, 1);
                createCookie("LATITUD_BANCODT", data.sesion.LAT_U, 1);
                createCookie("USUARIO_BANCODT", data.sesion.USUARIO, 1);
                createCookie("INICIO_bancodt", data.MODULO.INICIO, 1);
                createCookie("PATH_bancodt", data.MODULO.PATH, 1);
                createCookie("MODULO_bancodt", data.MODULO.MODULO, 1);
                if (data.MODULO.PATH.length > 0)
                    location.href = data.MODULO.PATH;
                else
                    notificaciones(MENSAJE_NO_TIENE_ASIGNADO_URL, 2);
            } else
                notificaciones(data.message, 2);
        },
        error: function (xhr, ajaxOptions, thrownError) {
            notificaciones(MENSAJE_ERROR, 2);
        }
    });
}

function limpiarForm(){
    console.log('limpiando');
    if ( marcador) {
        marcador.remove();
    }
    latitud = "";
    longitud = "";
    idPais = "";
    idProvincia = "";
    calleP = "";
    calleS = "";
    document.getElementById("idCiudad").disabled = false;
    document.getElementById("idCiudad").value = 0,
    document.getElementById("idCompaniaTipo").value = 0,
    $('#compania').val("");
    $('#ruc').val("");
    $('#contactoCompania').val("");
    $('#email').val("");
    $('#url').val("");
    $('#responsable').val("");
    var validator = $( "#form" ).validate();
    validator.resetForm();
}

function getToken(timeStanD, idAplicativo) {
    //sha256(timeStanD + md5(idAplicativo)
    var md5app = MD5(idAplicativo);
    return sha256(timeStanD + md5app);
}

function getKey(idAplicativo, token, timeStanD) {
    //md5(idAplicativo + token + timeStanD)
    return MD5(idAplicativo + token + timeStanD);
}

function sha256(ascii) {
    console.log("sha256");
    function rightRotate(value, amount) {
        return (value >>> amount) | (value << (32 - amount));
    };

    var mathPow = Math.pow;
    var maxWord = mathPow(2, 32);
    var lengthProperty = 'length'
    var i, j; // Used as a counter across the whole file
    var result = ''

    var words = [];
    var asciiBitLength = ascii[lengthProperty] * 8;

    //* caching results is optional - remove/add slash from front of this line to toggle
    // Initial hash value: first 32 bits of the fractional parts of the square roots of the first 8 primes
    // (we actually calculate the first 64, but extra values are just ignored)
    var hash = sha256.h = sha256.h || [];
    // Round constants: first 32 bits of the fractional parts of the cube roots of the first 64 primes
    var k = sha256.k = sha256.k || [];
    var primeCounter = k[lengthProperty];
    /*/
    var hash = [], k = [];
    var primeCounter = 0;
    //*/

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

    ascii += '\x80' // Append Ƈ' bit (plus zero padding)
    while (ascii[lengthProperty] % 64 - 56) ascii += '\x00' // More zero padding
    for (i = 0; i < ascii[lengthProperty]; i++) {
        j = ascii.charCodeAt(i);
        if (j >> 8) return; // ASCII check: only accept characters in range 0-255
        words[i >> 2] |= j << ((3 - i) % 4) * 8;
    }
    words[words[lengthProperty]] = ((asciiBitLength / maxWord) | 0);
    words[words[lengthProperty]] = (asciiBitLength)

    // process each chunk
    for (j = 0; j < words[lengthProperty];) {
        var w = words.slice(j, j += 16); // The message is expanded into 64 words as part of the iteration
        var oldHash = hash;
        // This is now the undefinedworking hash", often labelled as variables a...g
        // (we have to truncate as well, otherwise extra entries at the end accumulate
        hash = hash.slice(0, 8);

        for (i = 0; i < 64; i++) {
            var i2 = i + j;
            // Expand the message into 64 words
            // Used below if 
            var w15 = w[i - 15],
                w2 = w[i - 2];

            // Iterate
            var a = hash[0],
                e = hash[4];
            var temp1 = hash[7] +
                (rightRotate(e, 6) ^ rightRotate(e, 11) ^ rightRotate(e, 25)) // S1
                +
                ((e & hash[5]) ^ ((~e) & hash[6])) // ch
                +
                k[i]
                // Expand the message schedule if needed
                +
                (w[i] = (i < 16) ? w[i] : (
                    w[i - 16] +
                    (rightRotate(w15, 7) ^ rightRotate(w15, 18) ^ (w15 >>> 3)) // s0
                    +
                    w[i - 7] +
                    (rightRotate(w2, 17) ^ rightRotate(w2, 19) ^ (w2 >>> 10)) // s1
                ) | 0);
            // This is only used once, so *could* be moved below, but it only saves 4 bytes and makes things unreadble
            var temp2 = (rightRotate(a, 2) ^ rightRotate(a, 13) ^ rightRotate(a, 22)) // S0
                +
                ((a & hash[1]) ^ (a & hash[2]) ^ (hash[1] & hash[2])); // maj

            hash = [(temp1 + temp2) | 0].concat(hash); // We don't bother trimming off the extra ones, they're harmless as long as we're truncating when we do the slice()
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
};

function MD5(d) {
    console.log("MD5");
    result = M(V(Y(X(d), 8 * d.length)));
    return result.toLowerCase()
};

function M(d) {
    for (var _, m = "0123456789ABCDEF", f = "", r = 0; r < d.length; r++) _ = d.charCodeAt(r), f += m.charAt(_ >>> 4 & 15) + m.charAt(15 & _);
    return f
}

function X(d) {
    for (var _ = Array(d.length >> 2), m = 0; m < _.length; m++) _[m] = 0;
    for (m = 0; m < 8 * d.length; m += 8) _[m >> 5] |= (255 & d.charCodeAt(m / 8)) << m % 32;
    return _;
}

function V(d) {
    for (var _ = "", m = 0; m < 32 * d.length; m += 8) _ += String.fromCharCode(d[m >> 5] >>> m % 32 & 255);
    return _;
}

function Y(d, _) {
    d[_ >> 5] |= 128 << _ % 32, d[14 + (_ + 64 >>> 9 << 4)] = _;
    for (var m = 1732584193, f = -271733879, r = -1732584194, i = 271733878, n = 0; n < d.length; n += 16) {
        var h = m,
            t = f,
            g = r,
            e = i;
        f = md5_ii(f = md5_ii(f = md5_ii(f = md5_ii(f = md5_hh(f = md5_hh(f = md5_hh(f = md5_hh(f = md5_gg(f = md5_gg(f = md5_gg(f = md5_gg(f = md5_ff(f = md5_ff(f = md5_ff(f = md5_ff(f, r = md5_ff(r, i = md5_ff(i, m = md5_ff(m, f, r, i, d[n + 0], 7, -680876936), f, r, d[n + 1], 12, -389564586), m, f, d[n + 2], 17, 606105819), i, m, d[n + 3], 22, -1044525330), r = md5_ff(r, i = md5_ff(i, m = md5_ff(m, f, r, i, d[n + 4], 7, -176418897), f, r, d[n + 5], 12, 1200080426), m, f, d[n + 6], 17, -1473231341), i, m, d[n + 7], 22, -45705983), r = md5_ff(r, i = md5_ff(i, m = md5_ff(m, f, r, i, d[n + 8], 7, 1770035416), f, r, d[n + 9], 12, -1958414417), m, f, d[n + 10], 17, -42063), i, m, d[n + 11], 22, -1990404162), r = md5_ff(r, i = md5_ff(i, m = md5_ff(m, f, r, i, d[n + 12], 7, 1804603682), f, r, d[n + 13], 12, -40341101), m, f, d[n + 14], 17, -1502002290), i, m, d[n + 15], 22, 1236535329), r = md5_gg(r, i = md5_gg(i, m = md5_gg(m, f, r, i, d[n + 1], 5, -165796510), f, r, d[n + 6], 9, -1069501632), m, f, d[n + 11], 14, 643717713), i, m, d[n + 0], 20, -373897302), r = md5_gg(r, i = md5_gg(i, m = md5_gg(m, f, r, i, d[n + 5], 5, -701558691), f, r, d[n + 10], 9, 38016083), m, f, d[n + 15], 14, -660478335), i, m, d[n + 4], 20, -405537848), r = md5_gg(r, i = md5_gg(i, m = md5_gg(m, f, r, i, d[n + 9], 5, 568446438), f, r, d[n + 14], 9, -1019803690), m, f, d[n + 3], 14, -187363961), i, m, d[n + 8], 20, 1163531501), r = md5_gg(r, i = md5_gg(i, m = md5_gg(m, f, r, i, d[n + 13], 5, -1444681467), f, r, d[n + 2], 9, -51403784), m, f, d[n + 7], 14, 1735328473), i, m, d[n + 12], 20, -1926607734), r = md5_hh(r, i = md5_hh(i, m = md5_hh(m, f, r, i, d[n + 5], 4, -378558), f, r, d[n + 8], 11, -2022574463), m, f, d[n + 11], 16, 1839030562), i, m, d[n + 14], 23, -35309556), r = md5_hh(r, i = md5_hh(i, m = md5_hh(m, f, r, i, d[n + 1], 4, -1530992060), f, r, d[n + 4], 11, 1272893353), m, f, d[n + 7], 16, -155497632), i, m, d[n + 10], 23, -1094730640), r = md5_hh(r, i = md5_hh(i, m = md5_hh(m, f, r, i, d[n + 13], 4, 681279174), f, r, d[n + 0], 11, -358537222), m, f, d[n + 3], 16, -722521979), i, m, d[n + 6], 23, 76029189), r = md5_hh(r, i = md5_hh(i, m = md5_hh(m, f, r, i, d[n + 9], 4, -640364487), f, r, d[n + 12], 11, -421815835), m, f, d[n + 15], 16, 530742520), i, m, d[n + 2], 23, -995338651), r = md5_ii(r, i = md5_ii(i, m = md5_ii(m, f, r, i, d[n + 0], 6, -198630844), f, r, d[n + 7], 10, 1126891415), m, f, d[n + 14], 15, -1416354905), i, m, d[n + 5], 21, -57434055), r = md5_ii(r, i = md5_ii(i, m = md5_ii(m, f, r, i, d[n + 12], 6, 1700485571), f, r, d[n + 3], 10, -1894986606), m, f, d[n + 10], 15, -1051523), i, m, d[n + 1], 21, -2054922799), r = md5_ii(r, i = md5_ii(i, m = md5_ii(m, f, r, i, d[n + 8], 6, 1873313359), f, r, d[n + 15], 10, -30611744), m, f, d[n + 6], 15, -1560198380), i, m, d[n + 13], 21, 1309151649), r = md5_ii(r, i = md5_ii(i, m = md5_ii(m, f, r, i, d[n + 4], 6, -145523070), f, r, d[n + 11], 10, -1120210379), m, f, d[n + 2], 15, 718787259), i, m, d[n + 9], 21, -343485551), m = safe_add(m, h), f = safe_add(f, t), r = safe_add(r, g), i = safe_add(i, e)
    }
    return Array(m, f, r, i);
}

function md5_cmn(d, _, m, f, r, i) {
    return safe_add(bit_rol(safe_add(safe_add(_, d), safe_add(f, i)), r), m);
}

function md5_ff(d, _, m, f, r, i, n) {
    return md5_cmn(_ & m | ~_ & f, d, _, r, i, n);
}

function md5_gg(d, _, m, f, r, i, n) {
    return md5_cmn(_ & f | m & ~f, d, _, r, i, n);
}

function md5_hh(d, _, m, f, r, i, n) {
    return md5_cmn(_ ^ m ^ f, d, _, r, i, n);
}

function md5_ii(d, _, m, f, r, i, n) {
    return md5_cmn(m ^ (_ | ~f), d, _, r, i, n);
}

function safe_add(d, _) {
    var m = (65535 & d) + (65535 & _);
    return (d >> 16) + (_ >> 16) + (m >> 16) << 16 | 65535 & m ;
}

function bit_rol(d, _) {
    return d << _ | d >>> 32 - _ ;
}

function marcadorMapa(lat, lng){
    if ( marcador) {
        marcador.remove();
    }
  /*  document.getElementById("latitud").value = lat;
   document.getElementById("longitud").value = lng; */
   marcador = new mapboxgl.Marker().setLngLat([lng, lat]).addTo(map);
   getPaisCiudadProvincia(lat,lng);
}

function centrarMapa(lat,lon){
    map.setZoom(10);
    map.flyTo({center:[lon, lat]});
}

function getPaisCiudadProvincia(lat,lng){
    swal({
        title: "Cargando..." ,
        text: "Buscando dirección, Por favor espere...",
        icon: "./img/loader.gif",
        button: false,
        closeOnClickOutside: false,
        closeOnEsc: false,
        timer: 2000
      });
    $.ajax({
        url: 'https://investigacion.kradac.com:/geocode?' + 'username=danny.saetama' + '&lat=' + lat + '&lng=' + lng ,
        method: 'GET',
        dataType: 'json',
        contentType: "application/json; charset=utf-8",
        params: {
            usuario: 'danny.saetama',
        },
        success: function(respuesta) {
            console.log(respuesta);
            if(respuesta.st1 !==undefined && respuesta.st2 !==undefined ){
            calleP = respuesta.st1;
            calleS = respuesta.st2;
            swal.close();
            }else{
                calleP = "";
                calleS = "";
            }
    
            if(respuesta.nC !==undefined){
            $.ajax({
                url: './php/Get/getProvinciaPaisCiudad.php' ,
                method: 'POST',
                data: {
                    ciudad: respuesta.nC,
                },
                success: function(response) {
                    var data = JSON.parse(response);
                    if(data.success && data.data.length > 0){
                       /*  document.getElementById("idPais").disabled = true;
                        document.getElementById("idProvincia").disabled = true; */
                        document.getElementById("idCiudad").disabled = true;
                       /*  document.getElementById("idPais").value = data.data[0].idPais;
                        document.getElementById("idProvincia").value = data.data[0].idProvincia; */
                        document.getElementById("idCiudad").value = data.data[0].idCiudad;
                        idPais = data.data[0].idPais;
                        idProvincia = data.data[0].idProvincia;
    
                    }else{
                      /*   document.getElementById("idPais").value = 0;
                        document.getElementById("idProvincia").value = 0; */
                        document.getElementById("idCiudad").value = 0;
                     /*    document.getElementById("idPais").disabled = false;
                        document.getElementById("idProvincia").disabled = false; */
                        document.getElementById("idCiudad").disabled = false;
                    }
                    swal.close();
                },
                error: function() {
                    console.log("No se ha podido obtener la información");
                    swal.close();
                }
            });
           }else{
               swal.close();
           /*  document.getElementById("idPais").value = 0;
            document.getElementById("idProvincia").value = 0; */
            document.getElementById("idCiudad").value = 0;
           /*  document.getElementById("idPais").disabled = false;
            document.getElementById("idProvincia").disabled = false; */
            document.getElementById("idCiudad").disabled = false;
           }
        },
        error: function() {
            console.log("No se ha podido obtener la información");
        }
        });
}

function checkURL (url) {
    /* var string = url.value;
        if (!string.match(/^https?:/) && string.length) {
            string = "http://" + string;
        }
        url.value = string;
        return url; */
        if(url.value == ""){
            string = "http://";
            url.value = string;
        }
        return url;

}

function validarFormulario(){
    $.validator.addMethod("valueNotEquals", function(value, element, arg){
        // I use element.value instead value here, value parameter was always null
        return arg != element.value; 
    }, "Value must not equal arg.");
    var form = $("#form").validate({
        /*  errorElement: 'div', */
        debug: true,
        success: "valid",
         rules: {
             compania: {
                 required: true,
                 minlength: 4,
             },
             responsable: {
                 required: true,
                 minlength: 4,
             },
             contactoCompania: {
                 required: true,
                 minlength: 7,
                 maxlength: 18,
             },
             email: {
                 required: false,
                // email: true
             },
             url: {
                 required: false,
             },
             ruc: {
                 required: false,
                 minlength: 7,
                 maxlength: 18
             },
             idCompaniaTipo: {
                 required: true,
                 valueNotEquals: "0"
             },
             idCiudad: {
                 required: true,
                 valueNotEquals: "0"
             },

         },
         messages: {
             compania: {
                 required: "Obligatorio",
                 minlength: $.format("Mínimo {0} caracteres"),
             },
             responsable: {
                 required: "Obligatorio",
                 minlength: $.format("Mínimo {0} caracteres"),
             },
             contactoCompania: {
                 required: "Obligatorio",
                 minlength: $.format("Mínimo {0} caracteres"),
                 maxlength: $.format("Maximo {0} caracteres")
             },
             email: {
                 email: "Dirección de correo incorrecto", 
             },
             url: {
                 url: "Por favor ingrese una URL válida", 
             },
             ruc: {
                 minlength: $.format("Mínimo {0} caracteres"),
                 maxlength: $.format("Maximo {0} caracteres")
             },
             idCompaniaTipo: {
                 //required: "Obligatorio - Por favor seleccione uno",
                 valueNotEquals: "Obligatorio - Por favor seleccione uno"
             },
             idCiudad: {
                 //required: "Obligatorio - Por favor seleccione uno",
                 valueNotEquals: "Obligatorio - Por favor seleccione uno"
             }
     },
     
     submitHandler: function(form){
         swal({
             title: "Guardando..." ,
             text: "Guardando datos, Por favor espere...",
             icon: "./img/loader.gif",
             button: false,
             closeOnClickOutside: false,
             closeOnEsc: false,
           });
         $.ajax({
             type: "POST",
             url: 'php/Get/preRegistro.php',
             data: {
                     idPais: idPais,
                     idProvincia: idProvincia,
                     idCiudad: document.getElementById("idCiudad").value,
                     idCompaniaTipo: document.getElementById("idCompaniaTipo").value,
                     compania: $('#compania').val(),
                     ruc: ($('#ruc').val()!="")?$('#ruc').val(): "",
                     callePrin: (calleP != "")?calleP:"S/N",
                     calleSec: (calleS != "")?calleS:"S/N",
                     contacto: ($('#contactoCompania').val()!="")?$('#contactoCompania').val():"",
                     correoS: ($('#email').val()!="")?$('#email').val():"",
                     url: ($('#url').val()!="")?$('#url').val():"",
                     latitud: (latitud != "")?latitud:0,
                     longitud: (latitud != "")?longitud:0,
                     nombres: ($('#responsable').val()!="")?$('#responsable').val():"S/N",
             },
             success: function (response) {
                 latitud = "";
                 longitud = "";
                 idPais = "";
                 idProvincia = "";
                 var data = JSON.parse(response);
                 if (data.success === true) {
                     swal.close();
                     swal({
                         title: "Felicidades",
                         text: data.message,
                         icon: "success",
                       });
                     limpiarForm();
                 } else{
                     swal.close();
                    swal({
                     title: "Error",
                     text: data.message,
                     icon: "error",
                   });
                 }
             },
             error: function (xhr, ajaxOptions, thrownError) {
                 latitud = "";
                 longitud = "";
                 idPais = "";
                 idProvincia = "";
                 swal.close();
                 swal({
                     title: "Error",
                     text: MENSAJE_ERROR,
                     icon: "error",
                   });
             }
         });
     }
 });

 form.resetForm();
}