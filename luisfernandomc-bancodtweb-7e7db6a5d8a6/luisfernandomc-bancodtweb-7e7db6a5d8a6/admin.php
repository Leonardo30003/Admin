<?php
include("./dll/config.php");
if (isset($_SESSION["IS_SESSION_BANCODT"]) && $_SESSION["IS_SESSION_BANCODT"] === 0)
    header("Location: php/Login/logout.php");
?>
<!DOCTYPE HTML>
<html manifest="">
    <head>
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta http-equiv="content-type" content="application/vnd.ms-excel; charset=UTF-8"> 
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no">
        <meta name='viewport' content='initial-scale=1,maximum-scale=1,user-scalable=no' />
        <meta name="description" content="<?php echo $DESCRIPCION_SISTEMA ?> - Versión: <?php echo $VERSION ?>">
        <title><?php echo $TITULO_SISTEMA . " " . $VERSION ?></title>
        <!--title><?php //echo $NOMBRE_APP . ' ' . $VERSION              ?></title-->
        <?php
        if (isset($_SESSION['VIEW_BANCODT']))
            echo "<script >var LISTA_VISTAS_BANCODT =" . $_SESSION['VIEW_BANCODT'] . "</script>"
            ?>
        <link rel="shortcut icon" href="<?php echo $APP_ICONO; ?>" type="image/x-icon" />
        <!--CSS Alertify-->
        <link href="vendor/alertify/css/alertify.rtl.css?<?php echo $VERSION ?>" rel="stylesheet" type="text/css"/>
        <link href="vendor/alertify/css/themes/default.rtl.css?<?php echo $VERSION ?>" rel="stylesheet" type="text/css"/>
        <link href="css/Admin-all.css?<?php echo $VERSION ?>" rel="stylesheet" type="text/css"/>
        <!--CSS Bootstrap-->
        <link href="css/main.css?<?php echo $VERSION ?>" rel="stylesheet" type="text/css"/>
        <link href="css/iconos.css" rel="stylesheet" type="text/css"/>
        <link href="css/tablaResumen.css" rel="stylesheet" type="text/css"/>
        <!--CSS Theme EXT JS LOCAL -->

        <link href="ext/classic/theme-gray/resources/theme-gray-all.css" rel="stylesheet" type="text/css"/>
        <!--CSS Theme EXT JS REMOTE-->
        <!--CSS croppie -->
        <!--<link rel="stylesheet" type="text/css" href="https://cdnjs.cloudflare.com/ajax/libs/extjs/6.2.0/classic/theme-gray/resources/theme-gray-all.css"/>-->
        <!--CSS Font Awesome LOCAL-->
        <link href="vendor/font-awesome/css/font-awesome.min.css" rel="stylesheet" type="text/css"/>
        <!--CSS Font Awesome REMOTE-->
        <!--<link rel="stylesheet" type="text/css" href="https://cdnjs.cloudflare.com/ajax/libs/extjs/6.2.0/packages/font-awesome/resources/font-awesome-all.css"/>-->
        <!--CSS Charts-->
        <link href="ext/packages/charts/classic/classic/resources/charts-all.css" rel="stylesheet" type="text/css"/>
        <link href="vendor/pace-1.0.2/pace-theme-flash.tmpl.css" rel="stylesheet" type="text/css"/>
        <script src="ext/ext-all.js" type="text/javascript"></script>
        <script src="ext/packages/charts/classic/charts.js" type="text/javascript"></script>
        <script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyBHu8ccDCkEjsONhuAluyh16sGEDmDlgwY&libraries=places"></script>
        <script src="ext/classic/theme-gray/theme-gray.js" type="text/javascript"></script>
        <script src="ext/packages/ux/classic/ux.js" type="text/javascript"></script>
        <!--JS Jquery-->
        <script src="vendor/jquery/jquery.min.js?<?php echo $VERSION ?>" type="text/javascript"></script>
        <!--JS Alertify-->
        <script src="vendor/alertify/alertify.js?<?php echo $VERSION ?>" type="text/javascript"></script>
        <!--JSPDF-->
        <script src="vendor/jsPdf/jspdf.min.js" type="text/javascript"></script>
        <script src="vendor/jsPdf/jspdf.plugin.autotable.js" type="text/javascript"></script>
        <!--word-->
        <script src="vendor/word/FileSaver.js" type="text/javascript"></script>
        <script src="vendor/word/html-docx.js" type="text/javascript"></script>
        <!-- JS APP-->
        <script src="dll/ambiente.js?<?php echo $VERSION ?>" type="text/javascript"></script>
        <script src="dll/config.js?<?php echo $VERSION ?>" type="text/javascript"></script>
        <script src="js/funciones.js?<?php echo $VERSION ?>" type="text/javascript"></script>
        <script src="js/run.js?<?php echo $VERSION ?>" type="text/javascript"></script>
        <script src="vendor/md5.min.js" type="text/javascript"></script>
        <script src="vendor/hex_md5.js" type="text/javascript"></script>
        <!-- JS EXT LOCAL-->
        <link href="css/croppie.css?<?php echo $VERSION ?>" rel="stylesheet" />
        <script src="js/jquery.min.js?<?php echo $VERSION ?>" type="text/javascript"></script>
        <script src="js/croppie.js?<?php echo $VERSION ?>" type="text/javascript"></script>

        <!-- JS EXT REMOTO-->
        <!--<script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/extjs/6.2.0/ext-all.js"></script>-->
        <!--<script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/extjs/6.2.0/classic/theme-gray/theme-gray.js"></script>-->
        <!--<script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/extjs/6.2.0/packages/charts/classic/charts.js"></script>-->
        <!-- JS APP-->
        <script src="app.js?<?php echo $VERSION ?>" type="text/javascript"></script>
        <!-- JS MOMENT-->
        <script src="vendor/moment.js?<?php echo $VERSION ?>" type="text/javascript"></script>
        <!-- JS SOCKET -->
        <script src="vendor/socket.io.js?<?php echo $VERSION ?>" type="text/javascript"></script>
        <!--JS MAP -->
        <!--<script src='https://api.tiles.mapbox.com/mapbox-gl-js/v0.44.0/mapbox-gl.js'></script>-->
        <script src="vendor/mapbox/mabox-gl.js" type="text/javascript"></script>
        <script src="vendor/pace-1.0.2/pace.min.js" type="text/javascript"></script>
        <link href='https://api.tiles.mapbox.com/mapbox-gl-js/v0.44.0/mapbox-gl.css' rel='stylesheet' />
        <!--<script src='https://api.tiles.mapbox.com/mapbox.js/plugins/turf/v3.0.11/turf.min.js'></script>-->
        <script src="vendor/mapbox/turf.min.js" type="text/javascript"></script>
        <!--<script src='https://api.mapbox.com/mapbox-gl-js/plugins/mapbox-gl-draw/v1.0.0/mapbox-gl-draw.js'></script>-->
        <script src="vendor/mapbox/mapbox-gl-draw.js" type="text/javascript"></script>
        <link rel='stylesheet' href='https://api.mapbox.com/mapbox-gl-js/plugins/mapbox-gl-draw/v1.0.0/mapbox-gl-draw.css' type='text/css'/>
        <script src="js/mapBox.js?<?php echo $VERSION ?>" type="text/javascript"></script>
        <script>
            function confirmarCierre() {
                Ext.MessageBox.buttonText = {
                    yes: "Aceptar",
                    no: "Salir"
                };
                Ext.MessageBox.confirm('Atención', '<b>El sistema lleva mucho tiempo inactivo.</b>.<br><font color=blue>¿Desea restaurar la sesión?</font>', function (choice) {
                    if (choice === 'yes') {
                        Ext.Ajax.request({
                            async: true,
                            url: 'php/Login/obtenerUsuario.php',
                            callback: function (callback, e, response) {
                                var res = JSON.parse(response.request.result.responseText);
                                if (res.success) {
                                    Ext.Ajax.request({
                                        async: true,
                                        url: 'php/Login/login.php?ps=1',
                                        params: {
                                            usuario: res.data[0].usuario,
                                            contrasenia: res.data[0].contrasenia,
                                            latitud: res.data[0].latitud,
                                            longitud: res.data[0].longitud
                                        },
                                        callback: function (callback, e, response) {
                                            //location.reload();
                                        }
                                    });
                                }
                            }
                        });
                    } else {
                        window.location = 'php/Login/logout.php';
                    }
                });
            }
            var temp = setTimeout(confirmarCierre, TIEMPO_INACTIVIDAD);

            // cuando se detecte actividad en cualquier parte de la app
            $(document).on('click keyup keypress keydown blur change', function (e) {
                // borrar el temporizador de la funcion confirmarCierre
                clearTimeout(temp);
                // y volver a iniciarlo con 5 minutos
                temp = setTimeout(confirmarCierre, TIEMPO_INACTIVIDAD);
            });
        </script>
    </head>
    <body oncontextmenu = "return false">
    <center>
<!--        <img alt="karview" src="img/loaderModal.gif"/>-->
        <br>
        <img alt="Banco del tiempo" src="<?php echo $URL_IMG; ?>/sistema/bancotiempo1.jpeg" style=""/>
    </center>
</body>
<?php
/* include("./php/Get/getModulosId.php");
if ($ban == 0) {
    include("./php/Get/getControlSesion.php");
    $usuario = $_COOKIE["USUARIO_BANCODT"];
    $latitud = $_COOKIE["LATITUD_BANCODT"];
    $longitud = $_COOKIE["LONGITUD_BANCODT"];

    if ($latitud == "" && $longitud == "")
        $latitud = 0;
    $longitud = 0;

    if ($pass == "") {
        echo "<script src='js/run.js?<?php echo $VERSION ?>' type='text/javascript'></script>";
    }

    echo "<script  type='text/javascript'>  
                $.ajax({ type: 'POST',
                url:'./php/Login/login.php?ps=1',
                data: {usuario: '$usuario', contrasenia: '$pass', latitud: '$latitud' , longitud:  '$longitud' },
                success: function (response) {
                    var data = JSON.parse(response);
                    console.log(data);
                    if (data.success === true) {
                        VIEWMODULOS=data.VIEW_bancodt;
                        console.log(VIEWMODULOS);
                        if (data.MODULO.PATH.length > 0)
                            location.href = data.MODULO.PATH;
                    } 
                }
            });</script>";
    echo "<script src='js/run.js?<?php echo $VERSION ?>' type='text/javascript'></script>";
} else
    echo "<script src='js/run.js?<?php echo $VERSION ?>' type='text/javascript'></script>"; */
?>
</html>
