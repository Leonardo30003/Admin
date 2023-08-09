var MODULO_CATEGORIA;
Ext.define('bancodt.view.categoria.c_Categoria', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.c_Categoria',
    onViewCategoria: function (panelLoad) {
        panelLoad.ID_MAPA = ID_MAPA_SUCURSAL;
        //cargarMapa(panelLoad, ID_MAPA_SUCURSAL);
        //validarPermisosGeneral(panelLoad);
        MODULO_CATEGORIA = panelLoad;
        MODULO_CATEGORIA.down('[name=gridLeerCategoria]').getStore().load();
        initAutocomplete(ID_BUSCADOR_Sucursal, ID_MAPA_SUCURSAL, panelLoad);

    },
    onRecargar: function () {
        MODULO_CATEGORIA.down('[name=gridLeerCategoria]').getStore().reload();
    },
    onShowCategoria: function (panelLoad) {
        PANELLOAD = panelLoad;
        PANELLOAD.ID_MAPA = ID_MAPA_SUCURSAL;
    },
    onLimpiarGrid: function () {
        MODULO_CATEGORIA.down('[name=paramBusquedaSucursal]').reset();
        //MODULO_CATEGORIA.down('[name=numeroMiembros]').setValue();
        MODULO_CATEGORIA.down('[name=gridLeerCategoria]').getStore().load();
        //limpiarMapa(LIST_MAPS[ID_MAPA_SUCURSAL]);
        var grid = MODULO_CATEGORIA.down('[name=gridLeerCategoria]');
        grid.filters.clearFilters();
        grid.getView().deselect(grid.getSelection());
        //validarPermisosGeneral(MODULO_CATEGORIA);
    },
    onLimpiarForm: function () {
        MODULO_CATEGORIA.down('[name=btnCrear]').enable();
        MODULO_CATEGORIA.down('[name=btnEditar]').disable();
        MODULO_CATEGORIA.down('[name=formCrearEditarCategoria]').down('[name=imagenCategoria]').setSrc(URL_IMG_SISTEMA + 'categoria.png');
        //limpiarMapa(LIST_MAPS[ID_MAPA_SUCURSAL]);
        var grid = MODULO_CATEGORIA.down('[name=gridLeerCategoria]');
        grid.getView().deselect(grid.getSelection());
        MODULO_CATEGORIA.down('[name=gridLeerCategoria]').getStore().reload();
        //validarPermisosGeneral(MODULO_CATEGORIA);
        MODULO_CATEGORIA.down('[name=formCrearEditarCategoria]').getForm().reset();
    },
    cargarToolTip: function (c) {
        Ext.create('Ext.tip.ToolTip', {
            target: c.getEl(),
            html: c.tip
        });
    },
    onChangeSearchCategoria: function (btn, e) {
        if (btn.xtype === 'button' || e.event.keyCode === 13) {
            MODULO_CATEGORIA.down('[name=pagingToolbarCategoria]').moveFirst();
            var paramBusqueda = MODULO_CATEGORIA.down('[name=gridLeerCategoria]').down('[name=paramBusquedaSucursal]').getValue();
            //var numeroM = MODULO_CATEGORIA.down('[name=gridLeerCategoria]').down('[name=numeroMiembros]').getValue();
            var params = { param: paramBusqueda};
            MODULO_CATEGORIA.down('[name=gridLeerCategoria]').getStore().load({
                params: params,
                callback: function (records) {
                    if (records.length <= 0) {
                        MODULO_CATEGORIA.down('[name=gridLeerCategoria]').getStore().removeAll();
                    }
                }
            });
        }
    },
    onSelectChangeGridCategoria: function (thisObj, selected, eOpts) {
        if (selected.length > 0) {
            //limpiarMapa(LIST_MAPS[ID_MAPA_SUCURSAL]);
            var form = MODULO_CATEGORIA.down('[name=formCrearEditarCategoria]');
            var formCrearSucursal = MODULO_CATEGORIA.down('[name=formCrearEditarCategoria]');
            formCrearSucursal.loadRecord(selected[0]);
            if (selected[0].data.logo === '' || selected[0].data.logo === null) {
                form.down('[name=imagenCategoria]').setSrc(URL_IMG_SISTEMA + 'categoria.png');
            } else {
                var str = selected[0].data.logo;
                if (str.substr(-4) == '.png' || str.substr(-4) == '.jpg') {
                    var newStr = selected[0].data.logo.slice(0, -4);
                    MODULO_CATEGORIA.down('[name=nombreImgBanco]').setValue(newStr);
                } else {
                    if (str.substr(-4) == '.jpeg') {
                        var newStr = selected[0].data.logo.slice(0, -5);
                        MODULO_CATEGORIA.down('[name=nombreImgBanco]').setValue(newStr);
                    }
                }
                form.down('[name=imagenCategoria]').setSrc(URL_IMAGEN_CATEGORIA + selected[0].data.logo);
            }
            //graficarMarcador(LIST_MAPS[ID_MAPA_SUCURSAL], selected[0].data.latitud, selected[0].data.longitud, null, 12);
        }
    },

    onBeforeclickGridCategoria: function (thisObj, record, item, index, e, eOpts) {
        MODULO_CATEGORIA.down('[name=btnEditar]').enable();
        MODULO_CATEGORIA.down('[name=btnCrear]').disable();
    },

    onCrear: function () {
        var me = this;
        var form = MODULO_CATEGORIA.down('[name=formCrearEditarCategoria]');
        var storeSucursal = MODULO_CATEGORIA.down('[name=gridLeerCategoria]').getStore();
        var formUploadImage = MODULO_CATEGORIA.down('[name=forImagen]').getForm();

        if (changeImage == true && form.isValid()) {
            var record = form.getValues();
            Ext.Ajax.request({
                async: true,
                url: 'php/Get/getNombreImagen.php',
                params: {
                    tabla: 'categoria',
                    id: 'idCategoria'
                },
                callback: function (callback, e, response) {
                    var res = JSON.parse(response.request.result.responseText);
                    if (res.success) {
                        var fecha = new Date().getTime() + '';
                        var nombre = (res.id + 1) + fecha.substr(-5);
                        formUploadImage.submit({
                            url: 'php/Uploads/upload.php?ruta=' + URL_SUBIR_IMG_CATEGORIA + '&nombre=' + nombre,
                            waitMsg: 'Cargando imagen...',
                            success: function (fp, o) {
                                record.imgCategoria = o.result.message;
                                //record.iconFormaPago = '';
                                //var params = this.getRecordsFormaPago();
                                MODULO_CATEGORIA.down('[name=gridLeerCategoria]').getStore().insert(0, record);
                                MODULO_CATEGORIA.down('[name=gridLeerCategoria]').getStore().sync({
                                    callback: function (response) {
                                        onProcesarPeticion(response, me.onLimpiarForm({ limpiar: true }));
                                        MODULO_CATEGORIA.down('[name=gridLeerCategoria]').getStore().reload();
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
            record.imgCategoria = '';
            //record.iconFormaPago = '';
            //var params = this.getRecordsFormaPago();
            MODULO_CATEGORIA.down('[name=gridLeerCategoria]').getStore().insert(0, record);
            MODULO_CATEGORIA.down('[name=gridLeerCategoria]').getStore().sync({
                callback: function (response) {
                    onProcesarPeticion(response, me.onLimpiarForm({ limpiar: true }));
                    MODULO_CATEGORIA.down('[name=gridLeerCategoria]').getStore().reload();
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
        var form = MODULO_CATEGORIA.down('[name=formCrearEditarCategoria]');
        var storeSucursal = MODULO_CATEGORIA.down('[name=gridLeerCategoria]').getStore();
        var gridSucursal = MODULO_CATEGORIA.down('[name=gridLeerCategoria]');
        var gridSelect = gridSucursal.getSelection();
        var formUploadImage = MODULO_CATEGORIA.down('[name=forImagen]').getForm();


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
                url: 'php/Uploads/upload.php?ruta=' + URL_SUBIR_IMG_CATEGORIA + '&nombre=' + nombre,
                waitMsg: 'Cargando imagen...',
                success: function (fp, o) {
                    gridSelect[0].set('imgCategoria', o.result.message);
                    form.updateRecord(form.activeRecord);
                    storeSucursal.sync({
                        callback: function (response) {
                            onProcesarPeticion(response, me.onLimpiarForm({ limpiar: true }));
                            MODULO_CATEGORIA.down('[name=gridLeerCategoria]').getStore().reload();
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
                    MODULO_CATEGORIA.down('[name=gridLeerCategoria]').getStore().reload();
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