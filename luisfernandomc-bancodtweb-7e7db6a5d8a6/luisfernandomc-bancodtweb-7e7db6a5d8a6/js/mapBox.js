//VARIABLES DE MAPA
var ZOOM_DEFECTO = 11;
var LATITUD_DEFECTO = -4.015393, LONGITUD_DEFECTO = -79.201864;
var INFO_WINDOWS = '', MARCADOR;
var LIST_MAPS = [];
var DRAW_POLIGON, PANELLOAD;
function cargarMapa(panelLoad, id) {

    PANELLOAD = panelLoad;
    mapboxgl.accessToken = TOKEN_MAPBOX;
    var lat = (getCookie('LATITUD_BANCODT') === 0) ? LATITUD_DEFECTO : getCookie('LATITUD_BANCODT');
    var lng = (getCookie('LONGITUD_BANCODT') === 0) ? LONGITUD_DEFECTO : getCookie('LONGITUD_BANCODT');
    LIST_MAPS[id] = new mapboxgl.Map({
        container: id, // container id
        style: 'mapbox://styles/mapbox/streets-v9', // stylesheet location
        center: [lng, lat], // starting position [lng, lat]
        zoom: ZOOM_DEFECTO, // starting zoom
        "light": {
            "anchor": "viewport",
            "color": "white",
            "intensity": 0.4
        }
    });
    LIST_MAPS[id].addControl(new mapboxgl.NavigationControl());
// Add geolocate control to the map.
    LIST_MAPS[id].addControl(new mapboxgl.GeolocateControl({
        positionOptions: {
            enableHighAccuracy: true
        },
        trackUserLocation: true
    }));
    LIST_MAPS[id].MARCADOR = '';
    LIST_MAPS[id].LIST_MARCADORES = [];
    if (panelLoad !== 0)
        switch (panelLoad.xtype) {
            case 'ciudad':
            case 'pais':
                addDrawPoligon(LIST_MAPS[id], panelLoad);
                addClickPoint(LIST_MAPS[id], panelLoad);
                break;
            case 'lugar':
                addDrawPoligon(LIST_MAPS[id], panelLoad);
                addClickPoint(LIST_MAPS[id], panelLoad);
                break;
            case 'carpetas':
            case 'lugares':
                addDrawPoligon(LIST_MAPS[id], panelLoad);
                break;
            case 'departamento':
            case 'compania':
            case 'empresa':
            case 'provincia':
            case 'suceso':
            case 'sucursal':
                addClickPoint(LIST_MAPS[id], panelLoad);
            case 'pre_registro':
                addClickPoint(LIST_MAPS[id], panelLoad);
                break;
            case 'rastreo':
                LIST_MAPS[id].STORE_RASTREANDO = Ext.create('Ext.data.ArrayStore');
                //Botón para mostrar/ocultar rutas en el mapa de rastreo
                var padre = document.getElementById(id);
                var parentDiv = padre.parentNode;
                var sp1 = document.createElement("span");
                //var btnPuntosInteres = '<button name="btnPuntosInteres_' + id + '" onclick="mostrarMapaPanelPuntosInteres(\'' + id + '\')" title="Ver/Ocultar panel de puntos de interes" class="btnMap" style="top: 121px; left: 0%;"><span class="x-fa fa-map-marker"></span></button>';
                var btnPuntosInteres = '<button name="btnPuntosInteres_' + id + '" onclick="mostrarPuntosInteres(\'' + id + '\')" title="Ver/Ocultar panel de puntos de interes" class="btnMap" style="top: 121px; left: 0%;"><span class="x-fa fa-map-marker"></span></button>';
                sp1.innerHTML = '<button title="Ver/Ocultar ruta" name="btnOcultarRastreo' + id + '" onclick="ocultarRutaRastreo(\'' + id + '\',\'route\');" class="btnMap" style="top: 120px; left:0px; right:0px; display:none;"><span class="x-fa fa-location-arrow"></span></button>' + btnPuntosInteres;
                parentDiv.insertBefore(sp1, padre);
                var spLbl = document.createElement("span");
                var spLblTotal = document.createElement("span");
                spLbl.innerHTML = '<div name="lblDistancia' + id + '" class="lblMap" style="top: 89%; left:0px; right:0px; display:none;"><table id="tDistancia"> <tr> <th>Distancia</th> </tr> <tr> <td>0</td> </tr> <tr> <td>0</td> </tr> </table></div>';
                spLblTotal.innerHTML = '<div name="lblDistanciaTotal' + id + '" class="lblMap" style="top: 89%; left:10%; right:0px; display:none;"><table id="tDistancia"> <tr> <th>Total</th> <th>Unidad</th> </tr> <tr> <td>0</td> <td>Km</td> </tr> <tr> <td>0</td> <td>Millas</td> </tr> </table></div>';
                parentDiv.insertBefore(spLbl, padre);
                parentDiv.insertBefore(spLblTotal, padre);
                break;
        }
    LIST_MAPS[id].loadImage('img/sistema/sistema_logo.png', function (error, image) {
        if (error)
            throw error;
        LIST_MAPS[id].addImage('plaza', image);
    });
    panelLoad.query('[region=east]')[0].on('resize', function (eventObject, element) {
        LIST_MAPS[id].resize();
    });
    LIST_MAPS[id].on('load', function () {
        LIST_MAPS[id].resize();
    });
    return LIST_MAPS[id];
}
function centrar(MAPA, lat, lng, zoom) {
    MAPA.setCenter([lng, lat]);
    if (zoom) {
        MAPA.setZoom(zoom);
    } else {
        MAPA.setZoom(MAPA.getZoom());
    }

}
function drawLayerRadio(MAPA, lng, lat, kilometros, ID) {
    if (ID === undefined) {
        ID = 'circle_radio';
    }
    cleanLayerMap(MAPA, ID);
    MAPA.addSource(ID, createGeoJSONCircle([lng, lat], kilometros));
    MAPA.addLayer({
        "id": ID,
        "type": "fill",
        "source": ID,
        "layout": {},
        "paint": {
            "fill-color": COLOR_SISTEMA2,
            "fill-outline-color": COLOR_SISTEMA2,
            "fill-opacity": 0.1
        }
    });
}
function createGeoJSONCircle(center, radiusInKm, points) {
    if (!points)
        points = 64;

    var coords = {
        latitude: center[1],
        longitude: center[0]
    };

    var km = radiusInKm;

    var ret = [];
    var distanceX = km / (111.320 * Math.cos(coords.latitude * Math.PI / 180));
    var distanceY = km / 110.574;

    var theta, x, y;
    for (var i = 0; i < points; i++) {
        theta = (i / points) * (2 * Math.PI);
        x = distanceX * Math.cos(theta);
        y = distanceY * Math.sin(theta);

        ret.push([coords.longitude + x, coords.latitude + y]);
    }
    ret.push(ret[0]);
    return {
        "type": "geojson",
        "data": {
            "type": "FeatureCollection",
            "features": [{
                    "type": "Feature",
                    "geometry": {
                        "type": "Polygon",
                        "coordinates": [ret]
                    }
                }]
        }
    };
}
function graficarMarcador(MAPA, lat, lng, data, zoom) {
    if (zoom) {
        centrar(MAPA, lat, lng, zoom);
    }
    MAPA.MARCADOR = new mapboxgl.Marker().setLngLat([lng, lat]).addTo(MAPA);
    if (data) {
        var popup = new mapboxgl.Popup({offset: 25}).setHTML(data);
        MAPA.MARCADOR.setPopup(popup).addTo(MAPA);
    }
    MAPA.LIST_MARCADORES.push(MAPA.MARCADOR);
}

function agregarPopup(MAPA, data) {
    var popup = new mapboxgl.Popup({offset: 25}).setHTML('<div class="fa fa-user"></div> ' + data.nombre + '<br><div class="fa fa-calendar"></div> ' + Ext.Date.format(new Date(data.fecha), 'Y-m-d') + '<br>' + '<div class="fa fa-clock-o"></div> ' + Ext.Date.format(new Date(data.fecha), 'H:i:s'));
    MAPA.MARCADOR.setPopup(popup).addTo(MAPA);
}
function comprobarPuntoPoligono(MAPA) {
    if (MAPA.POLIGON.getAll().features.length > 0) {
        if (MAPA.POLIGON.getAll().features[0].geometry.coordinates[0].length >= 4) {
            if (MAPA.MARCADOR) {
                var pt = turf.point([MAPA.MARCADOR._lngLat.lng, MAPA.MARCADOR._lngLat.lat]);
            }
            var poly = turf.polygon([MAPA.POLIGON.getAll().features[0].geometry.coordinates[0]]);
        }
    }
    if (pt && poly) {
        return turf.booleanPointInPolygon(pt, poly);
    }else{
        return false;
    }

}
function addClickPoint(MAPA, panelLoad, oneClick) {
    MAPA.on('click', function (e) {
        console.log(e);
        if (MAPA.MARCADOR) {
            MAPA.MARCADOR.remove();
        }
       var zoom_click = MAPA.getZoom();
       graficarMarcador(MAPA, e.lngLat.lat, e.lngLat.lng);
       centrar(MAPA, e.lngLat.lat, e.lngLat.lng, zoom_click);
        panelLoad.down('[name=latitud]').setValue(e.lngLat.lat);
       panelLoad.down('[name=longitud]').setValue(e.lngLat.lng);
        if (oneClick) {
            deleteClickEvent(MAPA);
        }
       // get_Ajax(URL_SERVICIO_INVESTIGACION + RECURSO_DIRECCION + '?lat=' + e.lngLat.lat + '&lng=' + e.lngLat.lng + '&username=esquezada', {}, 3000, function (result) {
          //  if (result.resAjax > 0) {
                /* var calle1 = panelLoad.down('[name=principal]');
                var calle2 = panelLoad.down('[name=secundaria]');
                var calle1C = panelLoad.down('[name=callePrin]');
                var calle2C = panelLoad.down('[name=calleSec]');
                (calle1) ? calle1.setValue(result.st1) : null;
                (calle2) ? calle2.setValue(result.st2) : null;
                (calle1C) ? calle1C.setValue(result.st1) : null;
                (calle2C) ? calle2C.setValue(result.st2) : null; */
          //  }
       // });

        /* get_Ajax(URL_SERVICIO_INVESTIGACION + RECURSO_BARRIO + '?lat=' + e.lngLat.lat + '&lng=' + e.lngLat.lng + '&username=kdespachos', {}, 3000, function (result) {
            var barrio = panelLoad.down('[name=barrio]');
            if (result.resAjax > 0) {
                if (result.nB) {
                    (barrio) ? barrio.setValue(result.nB) : null;
                } else {
                    (barrio) ? barrio.setValue('') : null;
                }
            } else {
                (barrio) ? barrio.setValue('') : null;
            }
        }); */
    });
}

function addDrawPoligon(MAPA, panelLoad) {
    deleteClickEvent(MAPA);
    MAPA.POLIGON = new MapboxDraw({
        displayControlsDefault: false,
        controls: {
            polygon: true,
            trash: true
        }
    });
    MAPA.addControl(MAPA.POLIGON);
    MAPA.on('draw.create', function (e) {
        updateArea(e, panelLoad, MAPA);
    });
    MAPA.on('draw.delete', function (e) {
        updateArea(e, panelLoad, MAPA);
    });
    MAPA.on('draw.update', function (e) {
        updateArea(e, panelLoad, MAPA);
    });
}

function updateArea(e, panelLoad, MAPA) {
    var MAPA = e.target;
    var data = MAPA.POLIGON.getAll();
    if (data.features.length > 0) {
        var puntos = data.features[data.features.length - 1].geometry.coordinates[0];
        var listaPuntos = [];
        for (var i in puntos) {
            listaPuntos[i] = puntos[i].toString();
        }
        panelLoad.down('form').down('[name=limite]').setValue(null);
        panelLoad.down('form').down('[name=limite]').setValue(listaPuntos.join(';'));
        if (data.features.length > 1) {
            MAPA.POLIGON.delete(data.features[0].id);
        }
    } else {
        panelLoad.down('form').down('[name=limite]').setValue(null);
    }
}

var getCenterPolygon = function (coord) {
    var center = coord.reduce(function (x, y) {
        return [x[0] + y[0] / coord.length, x[1] + y[1] / coord.length];
    }, [0, 0]);
    return center;
};

function graficarPoligono(coordenadas, MAPA, zoom, formato) {
    if (coordenadas !== null && coordenadas !== '') {
        formato = (formato) ? formato : 'latlng';
        var coordenadas = getCoordenadasString(coordenadas, formato, MAPA);
        if (MAPA !== undefined) {
            if (zoom) {
                var coordCentrar = getCenterPolygon(coordenadas);
                centrar(MAPA, coordCentrar[1], coordCentrar[0], zoom);
            }
            var geometryObj = {coordinates: [coordenadas], type: "Polygon"};
            MAPA.POLIGON.add(geometryObj);
        } else {
            notificaciones("Error al inicializar el mapa.", 5);
        }
    }
}

function getCoordenadasString(coordenadas, format, MAPA, boolCentrar) {
    var listCoordenadas = [];
    if (coordenadas && coordenadas !== '') {
        coordenadas = coordenadas.split(';');
        for (var i = 0; i < coordenadas.length; i++) {
            var latLong = coordenadas[i].split(',');
            var lat = parseFloat(latLong[0]);
            var lng = parseFloat(latLong[1]);
            if (format === 'latlng') {
                listCoordenadas[i] = [parseFloat(lat), parseFloat(lng)];
            } else if (format === 'lnglat') {
                listCoordenadas[i] = [parseFloat(lng), parseFloat(lat)];
            }
        }
        if (boolCentrar) {
            centrar(MAPA, lat, lng, 14);
        }
        return listCoordenadas;
    }
}

function getCoordenadasArray(coordenadas) {
    var puntos = coordenadas;
    var listaPuntos = [];
    for (var i in puntos) {
        listaPuntos[i] = puntos[i].toString();
    }
    return listaPuntos.join(';');
}

function limpiarMapa(MAPA, boolCentrar) {
    if (MAPA.LIST_MARCADORES) {
        if (MAPA.LIST_MARCADORES.length > 0) {
            for (var i in MAPA.LIST_MARCADORES) {
                MAPA.LIST_MARCADORES[i].remove();
            }
        }
    }
    limpiarPoligono(MAPA);
    if (boolCentrar) {
        centrar(MAPA, LATITUD_DEFECTO, LONGITUD_DEFECTO);
    }
}

function limpiarPoligono(MAPA) {
    if (MAPA.POLIGON) {
        MAPA.POLIGON.deleteAll();
    }
}


function deleteClickEvent(MAPA, id) {
    if (MAPA._listeners.click) {
        for (var i in MAPA._listeners.click) {
            if (MAPA._listeners.click[i].name === '' || MAPA._listeners.click[i].name === id) {
                MAPA._listeners.click.splice(i, 1);
            }
        }
    }
}
//FUCNION PARA GRAFICAR LINEAS
function graficarRuta(MAPA, coordenadas) {
    MAPA.setZoom(15);
    limpiarRuta(MAPA, "route");
    MAPA.addLayer({
        "id": "route",
        "type": "line",
        "source": {
            "type": "geojson",
            "data": {
                "type": "Feature",
                "properties": {},
                "geometry": {
                    "type": "LineString",
                    "coordinates": coordenadas
                }
            }
        },
        "layout": {
            "line-join": "round",
            "line-cap": "round"
        },
        "paint": {
            "line-color": COLOR_SISTEMA,
            "line-width": 8
        }
    });
}
function limpiarRuta(MAPA, ID) {
    var LAYER = MAPA.getLayer(ID);
    if (LAYER !== undefined) {
        MAPA.removeLayer(ID);
        MAPA.removeSource(ID);
    }
}

//GRAFCAR POLIGONO EN MAPA
function drawLayerPoligon(geometryObj, MAPA, id, text, color) {
    MAPA.addLayer({
        'id': id,
        'type': 'fill',
        'source': {
            'type': 'geojson',
            'data': geometryObj
        },
        'paint': {
            'fill-color': color,
            'fill-outline-color': color,
            'fill-opacity': 0.6
        }
    });
}

function cleanLayerPoligon(MAPA, ID) {
    var LAYER = MAPA.getLayer(ID);
    if (LAYER !== undefined) {
        MAPA.removeLayer(ID);
        MAPA.removeSource(ID);
    }
}

//GRAFCAR CAPA DE PUNTOS EN MAPA
function drawLayerPoints(coordenadas, MAPA) {
    var pointsObj = {features: coordenadas, type: "FeatureCollection"};
    MAPA.addLayer({
        "id": "puntosPlazas",
        "type": "symbol",
        "source": {
            "type": "geojson",
            "data": pointsObj
        },
        "layout": {
            "icon-image": "plaza",
            "text-field": "{title}",
            "text-font": ["Open Sans Semibold", "Arial Unicode MS Bold"],
            "text-offset": [0, 0.6],
            "text-anchor": "top",
            "icon-size": 0.5
        }
    });
}

//GRAFCAR CAPA DE POLIGONOS EN MAPA
function drawLayerPoligons(coordenadas, MAPA) {
    MAPA.addLayer({
        'id': 'poligonosZonas',
        'type': 'fill',
        'source': {
            'type': 'geojson',
            'data': {
                'type': 'Feature',
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': coordenadas
                }
            }
        },
        'layout': {},
        'paint': {
            'fill-color': '#006600',
            'fill-opacity': 0.5
        }
    });
}

function drawLayerPoligon(geometryObj, MAPA, id, color) {
    cleanLayerMap(MAPA, id);
    MAPA.addLayer({
        'id': id,
        'type': 'fill',
        'source': {
            'type': 'geojson',
            'data': geometryObj
        },
        'paint': {
            'fill-color': {
                type: 'identity',
                property: 'color'
            },
            'fill-outline-color': color,
            'fill-opacity': 0.5
        }
    });
}

function cleanLayerMap(MAPA, ID) {
    if (MAPA) {
        if (typeof MAPA.getLayer === 'function') {
            var LAYER = MAPA.getLayer(ID);
            if (LAYER) {
                MAPA.removeLayer(ID);
            }
        }
        if (typeof MAPA.getSource === 'function') {
            var SOURCE = MAPA.getSource(ID);
            if (SOURCE) {
                MAPA.removeSource(ID);
            }
        }
    }
}
