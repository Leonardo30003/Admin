<?php
include './dll/config.php';
if (isset($_SESSION["IS_SESSION_BANCODT"]) && $_SESSION["IS_SESSION_BANCODT"] == 1)
    header("Location: ./" . $_SESSION["URL_SISTEMA"]);
?>
<!DOCTYPE html>
<html>
    <head>
        <!--title><?php //echo $NOMBRE_APP;     ?></title-->
        <link rel="shortcut icon" href="<?php echo $APP_ICONO; ?>" type="image/x-icon" />
        <meta content='text/html; charset=UTF-8' http-equiv='Content-Type' />
        <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
        <meta name="description" content="<?php echo $DESCRIPCION_SISTEMA ?> - Versión: <?php echo $VERSION ?>">
        <!--title><?php //echo $APP_NOMBRE . ' ' . $VERSION     ?></title-->
        <title><?php echo $TITULO_SISTEMA ?></title>
        <link href="css/main.css?<?php echo $VERSION ?>" rel="stylesheet" type="text/css"/>
        <!--CSS Bootstrap-->
        <link href="vendor/font-awesome/css/font-awesome.min.css" rel="stylesheet" type="text/css"/>
        <link href="vendor/bootstrap/css/bootstrap.min.css" rel="stylesheet" type="text/css"/>
        <!--CSS Alertify-->
        <link href="vendor/alertify/css/alertify.rtl.css?<?php echo $VERSION ?>" rel="stylesheet" type="text/css"/>
        <link href="vendor/alertify/css/themes/default.rtl.css?<?php echo $VERSION ?>" rel="stylesheet" type="text/css"/>
        <!--JS Jquery-->
        <script src="vendor/jquery/jquery.min.js" type="text/javascript"></script>
        <!-- JS bootstrap-->
        <script src="vendor/popper/popper.min.js" type="text/javascript"></script>
        <script src="vendor/bootstrap/js/bootstrap.min.js" type="text/javascript"></script>
        <!--JS Alertify-->
        <script src="vendor/alertify/alertify.js?<?php echo $VERSION ?>" type="text/javascript"></script>
        <!--JS MD5-->
        <script src="vendor/md5.min.js" type="text/javascript"></script>
        <script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyBHu8ccDCkEjsONhuAluyh16sGEDmDlgwY&libraries=places"></script>
        <script src="vendor/hex_md5.js" type="text/javascript"></script>
        <script src="js/funciones.js?<?php echo $VERSION ?>" type="text/javascript"></script><!--FUNCIONES-->
        <script src="js/login/login.js?<?php echo $VERSION ?>" type="text/javascript"></script><!--LOGIN-->
        <script src="dll/ambiente.js" type="text/javascript"></script><!--LOGIN-->
        <script src="dll/config.js" type="text/javascript"></script><!--LOGIN-->
        <script type="text/javascript">
            if (navigator.geolocation) {
                var LAT_U = 0, LNG_U = 0;
                navigator.geolocation.getCurrentPosition(function (position) {
                    LAT_U = position.coords.latitude;
                    LNG_U = position.coords.longitude;
                    $('#latitud').val(LAT_U);
                    $('#longitud').val(LNG_U);
                });
            }
        </script>
    </head>
    <body>
        <br>
        <img class="rounded mx-auto d-block" src="<?php echo $BANNER ?>" alt=""/>
        <ul class="nav justify-content-end">
            <li class="nav-item">
                <a class="nav-link active" href="#" data-toggle="modal" data-target="#<?php echo str_replace(' ', '', $NAV_1); ?>"><?php echo $NAV_1 ?></a>
            </li>
            <li class="nav-item">
                <a class="nav-link" href="#" data-toggle="modal" data-target="#<?php echo str_replace(' ', '', $NAV_2); ?>"><?php echo $NAV_2 ?></a>
            </li>
            <li class="nav-item">
                <a class="nav-link" href="#" data-toggle="modal" data-target="#<?php echo str_replace(' ', '', $NAV_3); ?>"><?php echo $NAV_3 ?></a>
            </li>
        </ul>
        <!-- LOGIN-->
        <div class="container">
            <div class="form-horizontal" id="frm-login">
                <div class="row">
                    <div class="col-md-3"></div>
                    
                </div>
                <div class="row">
                    <div class="col-md-3"></div>
                    <div class="col-md-6">
                        <div class="form-group" id="group-usuario">
                            <label class="sr-only" for="email">Usuario</label>
                            <div class="input-group mb-2 mr-sm-2 mb-sm-0">
                                <div class="input-group-addon" style="width: 2.6rem"><i class="fa fa-at"></i></div>
                                <input type="text" name="usuario" id="usuario" class="form-control formLogin" placeholder="Usuario" required autofocus/>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-3" id="msj-usu-error">
                        <div class="form-control-feedback">
                            <span class="text-danger align-middle">
                                <div id="cargando"></div>
                                <div id="msj-validar"></div>
                            </span>
                        </div>
                    </div>
                </div>
                <div class="row">
                    <div class="col-md-3"></div>
                    <div class="col-md-6">
                        <div class="form-group" id="group-contrasenia">
                            <label class="sr-only" for="password">Contraseña</label>
                            <div class="input-group mb-2 mr-sm-2 mb-sm-0">
                                <div class="input-group-addon" style="width: 2.6rem"><i class="fa fa-key"></i></div>
                                <input type="password" name="contrasenia" id="contrasenia" class="form-control formLogin" placeholder="Contraseña" required/>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-3" id="msj-con-error">
                        <div class="form-control-feedback">
                            <span class="text-danger align-middle">
                                <div id="cargandoCon"></div>
                                <div id="msj-con-validar"></div>
                            </span>
                        </div>
                    </div>
                </div>
                <div class="row">
                    <div class="col-md-3"></div>
                    <div class="col-md-6" style="padding-top: .35rem">
                        <div class="form-check mb-2 mr-sm-2 mb-sm-0">
                            <label class="form-check-label">
                                <input class="form-check-input" name="remember" type="checkbox"  onclick="mostrarClave(this.checked, 'contrasenia')"/>
                                <span style="padding-bottom: .15rem">Mostrar contraseña</span>
                            </label>
                        </div>
                    </div>
                </div>
                <input name = "latitud" type="text" id="latitud" style="display: none;">
                <input name = "longitud" type="text" id="longitud" style="display: none;">
                <center>
                    <button type="submit" id="bnt-login" name="bnt-login" class="btn btn-success"><i class="fa fa-sign-in"></i> Ingresar Sistema</button>
                </center>
                <br/>
                <center>
                    <a class="btn btn-link" href="#" data-toggle="modal" data-target="#restContraModal">¿Olvidó su contraseña?</a>
                </center>
                <center>
                    <a class="btn btn-link" href="registro.php" >Registrate con nosotros</a>
                </center>
                <div class="row" >
                    <div class="col-md-4"></div>
                    <div class="col-md-4"></div>
                </div>
            </div>
        </div>
        <!--        <footer class="footer">
                    <div class="container">
                        <span class="text-muted">Conectar con KRADAC CIA. LTDA. 072104038</span>
                    </div>
                </footer>-->
        <!-- FIN LOGIN -->
        <!-- Modal NAV 1-->
        <div class="modal fade" id="<?php echo str_replace(' ', '', $NAV_1); ?>" tabindex="-1" role="dialog" aria-labelledby="tituloModalLabel" aria-hidden="true">
            <div class="modal-dialog" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="tituloModalLabel"><?php echo $NAV_1 ?></h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        Conectar con KRADAC CIA. LTDA. 072104038
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-dismiss="modal">Cerrar</button>
                    </div>
                </div>
            </div>
        </div>
        <!-- Modal NAV 2-->
        <div class="modal fade" id="<?php echo str_replace(' ', '', $NAV_2); ?>" tabindex="-1" role="dialog" aria-labelledby="tituloAyudaModal" aria-hidden="true">
            <div class="modal-dialog" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="tituloAyudaModal"><?php echo $NAV_2 ?></h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        AYUDA
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-dismiss="modal">Cerrar</button>
                    </div>
                </div>
            </div>
        </div>
        <!-- Modal NAV 3-->
        <div class="modal fade" id="<?php echo str_replace(' ', '', $NAV_3); ?>" tabindex="-1" role="dialog" aria-labelledby="tituloAyudaModal" aria-hidden="true">
            <div class="modal-dialog" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="tituloAyudaModal"><?php echo $NAV_3 ?></h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        <?php echo $NAV_3 ?>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-dismiss="modal">Cerrar</button>
                    </div>
                </div>
            </div>
        </div>
        <!-- Modal RESETEAR CLAVE-->
        <div class="modal fade" id="restContraModal" tabindex="-1" role="dialog" aria-labelledby="restContraModal" aria-hidden="true">
            <div class="modal-dialog" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="restContraModal">Restaurar contraseña</h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        Restaurar contraseña
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-dismiss="modal">Cerrar</button>
                    </div>
                </div>
            </div>
        </div>
        <!-- Modal CARGANDO-->
        <div class="modal fade bs-example-modal-sm" data-backdrop="static" data-keyboard="false" id="cargandoModal" tabindex="-1" role="dialog" aria-hidden="true">
            <div class="modal-dialog modal-sm modal_cargando" role="document">
                <div class="modal-content">
                    <div class="modal-body">
                        <img src="./img/loaderModal.gif">
                    </div>
                </div>
            </div>
        </div>

        <!-- JS EXT LOCAL-->
        <script src="ext/ext-all.js" type="text/javascript"></script>
        <script src="ext/packages/charts/classic/charts.js" type="text/javascript"></script>
        <script src="ext/classic/theme-gray/theme-gray.js" type="text/javascript"></script>
        <script src="ext/packages/ux/classic/ux.js" type="text/javascript"></script>
        <!-- JS EXT REMOTO-->
        <!--<script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/extjs/6.2.0/ext-all.js"></script>-->
        <!--<script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/extjs/6.2.0/classic/theme-gray/theme-gray.js"></script>-->
        <!--<script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/extjs/6.2.0/packages/charts/classic/charts.js"></script>-->
        <!-- JS APP-->
        <!--JSPDF-->
        <script src="vendor/jsPdf/jspdf.min.js" type="text/javascript"></script>
        <script src="vendor/jsPdf/jspdf.plugin.autotable.js" type="text/javascript"></script>
        <!--word-->
        <script src="vendor/word/FileSaver.js" type="text/javascript"></script>
        <script src="vendor/word/html-docx.js" type="text/javascript"></script>
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

    </body>
</html>