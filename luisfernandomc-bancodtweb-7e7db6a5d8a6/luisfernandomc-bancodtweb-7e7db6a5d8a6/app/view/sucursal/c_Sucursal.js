var MODULO_SUCURSAL;
Ext.define('bancodt.view.sucursal.c_Sucursal', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.c_Sucursal',
    onViewSucursal: function (panelLoad) {
        panelLoad.ID_MAPA = ID_MAPA_SUCURSAL;
        cargarMapa(panelLoad, ID_MAPA_SUCURSAL);
        //validarPermisosGeneral(panelLoad);
        MODULO_SUCURSAL = panelLoad;
        MODULO_SUCURSAL.down('[name=gridLeerSucursal]').getStore().load();
        initAutocomplete(ID_BUSCADOR_Sucursal, ID_MAPA_SUCURSAL, panelLoad);

    },
    onRecargar: function () {
        MODULO_SUCURSAL.down('[name=gridLeerSucursal]').getStore().reload();
    },
    onShowSucursal: function (panelLoad) {
        PANELLOAD = panelLoad;
        PANELLOAD.ID_MAPA = ID_MAPA_SUCURSAL;
    },
    onLimpiarGrid: function () {
        MODULO_SUCURSAL.down('[name=paramBusquedaSucursal]').reset();
        MODULO_SUCURSAL.down('[name=numeroMiembros]').setValue();
        MODULO_SUCURSAL.down('[name=gridLeerSucursal]').getStore().load();
        limpiarMapa(LIST_MAPS[ID_MAPA_SUCURSAL]);
        var grid = MODULO_SUCURSAL.down('[name=gridLeerSucursal]');
        grid.filters.clearFilters();
        grid.getView().deselect(grid.getSelection());
        //validarPermisosGeneral(MODULO_SUCURSAL);
    },
    onLimpiarForm: function () {
        MODULO_SUCURSAL.down('[name=btnCrear]').enable();
        MODULO_SUCURSAL.down('[name=btnEditar]').disable();
        MODULO_SUCURSAL.down('[name=formCrearEditarSucursal]').down('[name=imagenBanco]').setSrc(URL_IMG_SISTEMA + 'empresa.png');
        limpiarMapa(LIST_MAPS[ID_MAPA_SUCURSAL]);
        var grid = MODULO_SUCURSAL.down('[name=gridLeerSucursal]');
        grid.getView().deselect(grid.getSelection());
        MODULO_SUCURSAL.down('[name=gridLeerSucursal]').getStore().reload();
        //validarPermisosGeneral(MODULO_SUCURSAL);
        MODULO_SUCURSAL.down('[name=formCrearEditarSucursal]').getForm().reset();
    },
    cargarToolTip: function (c) {
        Ext.create('Ext.tip.ToolTip', {
            target: c.getEl(),
            html: c.tip
        });
    },
    onChangeSearchSucursal: function (btn, e) {
        if (btn.xtype === 'button' || e.event.keyCode === 13) {
            MODULO_SUCURSAL.down('[name=pagingToolbarSucursal]').moveFirst();
            var paramBusqueda = MODULO_SUCURSAL.down('[name=gridLeerSucursal]').down('[name=paramBusquedaSucursal]').getValue();
            var numeroM = MODULO_SUCURSAL.down('[name=gridLeerSucursal]').down('[name=numeroMiembros]').getValue();
            var params = { param: paramBusqueda, numero_miembros: numeroM };
            MODULO_SUCURSAL.down('[name=gridLeerSucursal]').getStore().load({
                params: params,
                callback: function (records) {
                    if (records.length <= 0) {
                        MODULO_SUCURSAL.down('[name=gridLeerSucursal]').getStore().removeAll();
                    }
                }
            });
        }
    },
    onSelectChangeGridSucursal: function (thisObj, selected, eOpts) {
        if (selected.length > 0) {
            limpiarMapa(LIST_MAPS[ID_MAPA_SUCURSAL]);
            var form = MODULO_SUCURSAL.down('[name=formCrearEditarSucursal]');
            var formCrearSucursal = MODULO_SUCURSAL.down('[name=formCrearEditarSucursal]');
            formCrearSucursal.loadRecord(selected[0]);
            if (selected[0].data.logo === '' || selected[0].data.logo === null) {
                form.down('[name=imagenBanco]').setSrc(URL_IMG_SISTEMA + 'empresa.png');
            } else {
                var str = selected[0].data.logo;
                if (str.substr(-4) == '.png' || str.substr(-4) == '.jpg') {
                    var newStr = selected[0].data.logo.slice(0, -4);
                    MODULO_SUCURSAL.down('[name=nombreImgBanco]').setValue(newStr);
                } else {
                    if (str.substr(-4) == '.jpeg') {
                        var newStr = selected[0].data.logo.slice(0, -5);
                        MODULO_SUCURSAL.down('[name=nombreImgBanco]').setValue(newStr);
                    }
                }
                form.down('[name=imagenBanco]').setSrc(URL_IMAGEN_SUCURSAL + selected[0].data.logo);
            }
            graficarMarcador(LIST_MAPS[ID_MAPA_SUCURSAL], selected[0].data.latitud, selected[0].data.longitud, null, 12);
        }
    },

    onBeforeclickGridSucursal: function (thisObj, record, item, index, e, eOpts) {
        MODULO_SUCURSAL.down('[name=btnEditar]').enable();
        MODULO_SUCURSAL.down('[name=btnCrear]').disable();
    },

    onCrear: function () {
        var me = this;
        var form = MODULO_SUCURSAL.down('[name=formCrearEditarSucursal]');
        var storeSucursal = MODULO_SUCURSAL.down('[name=gridLeerSucursal]').getStore();
        var formUploadImage = MODULO_SUCURSAL.down('[name=forImagen]').getForm();

        if (changeImage == true && form.isValid()) {
            var record = form.getValues();
            Ext.Ajax.request({
                async: true,
                url: 'php/Get/getNombreImagen.php',
                params: {
                    tabla: 'banco',
                    id: 'id_banco'
                },
                callback: function (callback, e, response) {
                    var res = JSON.parse(response.request.result.responseText);
                    if (res.success) {
                        var fecha = new Date().getTime() + '';
                        var nombre = (res.id + 1) + fecha.substr(-5);
                        formUploadImage.submit({
                            url: 'php/Uploads/upload.php?ruta=' + URL_SUBIR_IMG_SUCURSAL + '&nombre=' + nombre,
                            waitMsg: 'Cargando imagen...',
                            success: function (fp, o) {
                                record.imgBanco = o.result.message;
                                //record.iconFormaPago = '';
                                //var params = this.getRecordsFormaPago();
                                MODULO_SUCURSAL.down('[name=gridLeerSucursal]').getStore().insert(0, record);
                                MODULO_SUCURSAL.down('[name=gridLeerSucursal]').getStore().sync({
                                    callback: function (response) {
                                        onProcesarPeticion(response, me.onLimpiarForm({ limpiar: true }));
                                        MODULO_SUCURSAL.down('[name=gridLeerSucursal]').getStore().reload();
                                    }
                                });
                                changeImage = false;
                            },
                            failure: function (fp, action) {
                                if (action.result.success === false) {
                                    notificaciones(action.result.message, 2);
                                }
                            }
                        });
                    } else {
                        notificaciones(MENSAJE_ERROR_CREAR, 2);
                    }
                }
            });
        } else if (form.isValid()) {
            var record = form.getValues();
            record.imgBanco = '';
            //record.iconFormaPago = '';
            //var params = this.getRecordsFormaPago();
            MODULO_SUCURSAL.down('[name=gridLeerSucursal]').getStore().insert(0, record);
            MODULO_SUCURSAL.down('[name=gridLeerSucursal]').getStore().sync({
                callback: function (response) {
                    onProcesarPeticion(response, me.onLimpiarForm({ limpiar: true }));
                    MODULO_SUCURSAL.down('[name=gridLeerSucursal]').getStore().reload();
                }
            });
            changeImage = false;


        } else {
            var fields = form.form.getFields();
            notificaciones("Llene los campos requeridos", 2);
            mensajesValidacionForms(fields);
        }

    },

    onEditar: function () {
        var me = this;
        var form = MODULO_SUCURSAL.down('[name=formCrearEditarSucursal]');
        var storeSucursal = MODULO_SUCURSAL.down('[name=gridLeerSucursal]').getStore();
        var gridSucursal = MODULO_SUCURSAL.down('[name=gridLeerSucursal]');
        var gridSelect = gridSucursal.getSelection();
        var formUploadImage = MODULO_SUCURSAL.down('[name=forImagen]').getForm();


        if (changeImage == true && form.isValid()) {
            var record = form.getValues();
            var nombre = gridSelect[0].data.logo;
            if (nombre !== null) {
                nombre = nombre.substr(0, nombre.indexOf('.'));
            }
            if (nombre === '' || nombre === null) {
                var fecha = new Date().getTime() + '';
                nombre = (gridSelect[0].data.id) + fecha.substr(-5);
            }
            formUploadImage.submit({
                url: 'php/Uploads/upload.php?ruta=' + URL_SUBIR_IMG_SUCURSAL + '&nombre=' + nombre,
                waitMsg: 'Cargando imagen...',
                success: function (fp, o) {
                    gridSelect[0].set('imgBanco', o.result.message);
                    form.updateRecord(form.activeRecord);
                    storeSucursal.sync({
                        callback: function (response) {
                            onProcesarPeticion(response, me.onLimpiarForm({ limpiar: true }));
                            MODULO_SUCURSAL.down('[name=gridLeerSucursal]').getStore().reload();
                            changeImage = false;
                        }
                    });
                },
                failure: function (fp, action) {
                    if (action.result.success === false) {
                        notificaciones(action.result.message, 2);
                    }
                    //                        var record = form.getValues();
                }
            });

        } else if (form.isValid()) {
            form.updateRecord(form.activeRecord);
            storeSucursal.sync({
                callback: function (response) {
                    onProcesarPeticion(response, me.onLimpiarForm({ limpiar: true }));
                    MODULO_SUCURSAL.down('[name=gridLeerSucursal]').getStore().reload();
                    changeImage = false;
                }
            });
        } else {
            var fields = form.form.getFields();
            notificaciones("Llene los campos requeridos", 2);
            mensajesValidacionForms(fields);
        }
    }
});