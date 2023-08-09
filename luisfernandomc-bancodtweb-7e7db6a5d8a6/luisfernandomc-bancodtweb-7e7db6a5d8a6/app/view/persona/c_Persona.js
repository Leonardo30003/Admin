var MODULO_PERSONA;
var idP = '';
Ext.define('bancodt.view.persona.c_Persona', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.c_Persona',
    onViewPersona: function (panelLoad) {
        /* panelLoad.ID_MAPA = ID_MAPA_Persona; //para cargar el id del nuevo mapa
        cargarMapa(panelLoad, ID_MAPA_Persona); */
        validarPermisosGeneral(panelLoad);
        MODULO_PERSONA = panelLoad;
        MODULO_PERSONA.down('[name=gridLeerPersona]').getStore().load();
        //initAutocomplete(ID_BUSCADOR_Persona, ID_MAPA_Persona, panelLoad);

    },
    onRecargar: function () {
        MODULO_PERSONA.down('[name=gridLeerPersona]').getStore().reload();
    },
    onShowPersona: function (panelLoad) {
        PANELLOAD = panelLoad;
        //PANELLOAD.ID_MAPA = ID_MAPA_Persona;
    },
    onLimpiarGrid: function () {
        MODULO_PERSONA.down('[name=paramBusquedaPersona]').reset();
        MODULO_PERSONA.down('[name=edadBusqueda]').setValue();
        MODULO_PERSONA.down('[name=gridLeerPersona]').getStore().load();
        //limpiarMapa(LIST_MAPS[ID_MAPA_Persona]);
        var grid = MODULO_PERSONA.down('[name=gridLeerPersona]');
        grid.filters.clearFilters();
        grid.getView().deselect(grid.getSelection());
        validarPermisosGeneral(MODULO_PERSONA);
    },
    onLimpiarForm: function () {
        MODULO_PERSONA.down('[name=btnCrear]').enable();
        MODULO_PERSONA.down('[name=btnEditar]').disable();
        //limpiarMapa(LIST_MAPS[ID_MAPA_Persona]);
        MODULO_PERSONA.down('[name=formCrearEditarPersona]').down('[name=imagenPersona]').setSrc(URL_IMG_SISTEMA + 'usuario.png');
        var grid = MODULO_PERSONA.down('[name=gridLeerPersona]');
        grid.getView().deselect(grid.getSelection());
        MODULO_PERSONA.down('[name=gridLeerPersona]').getStore().reload();
        validarPermisosGeneral(MODULO_PERSONA);
        MODULO_PERSONA.down('[name=formCrearEditarPersona]').getForm().reset();
        MODULO_PERSONA.down('[name=gridUsuario]').getStore().removeAll();
        usuarioCliente = []
        idP = '';

    },
    cargarToolTip: function (c) {
        Ext.create('Ext.tip.ToolTip', {
            target: c.getEl(),
            html: c.tip
        });
    },
    onChangeSearchPersona: function (btn, e) {
        if (btn.xtype === 'button' || e.event.keyCode === 13) {
            MODULO_PERSONA.down('[name=pagingToolbarPersona]').moveFirst();
            var paramBusqueda = MODULO_PERSONA.down('[name=gridLeerPersona]').down('[name=paramBusquedaPersona]').getValue();
            var edad = MODULO_PERSONA.down('[name=gridLeerPersona]').down('[name=edadBusqueda]').getValue();
            var params = { param: paramBusqueda, edad: edad };
            MODULO_PERSONA.down('[name=gridLeerPersona]').getStore().load({
                params: params,
                callback: function (records) {
                    if (records.length <= 0) {
                        MODULO_PERSONA.down('[name=gridLeerPersona]').getStore().removeAll();
                    }
                }
            });
        }
    },
    onSelectChangeGridPersona: function (thisObj, selected, eOpts) {
        if (selected.length > 0) {
            var form = MODULO_PERSONA.down('[name=formCrearEditarPersona]');
            MODULO_PERSONA.down('[name=gridUsuario]').getStore().removeAll();
            var formCrearPersona = MODULO_PERSONA.down('[name=formCrearEditarPersona]');
            idP = selected[0].data.id;

            var comboBanco = MODULO_PERSONA.down('[name=id_banco]');
            if (!isInStore(comboBanco.getStore(), selected[0].data.id_banco, 'id', 'exact')) {
                comboBanco.getStore().load({
                    params: { id_banco: selected[0].get('id_banco') },
                    callback: function (records) {
                        if (records.length > 0)
                            comboBanco.setValue(records);
                        //                        MODULO_BIBLIOTECA.down('[name=idCiudad]').setValue(records);
                    }
                });
            }

            var listaUsuarios = selected[0].data.usuarios;
            for (var i in listaUsuarios) {
                var newRecord = {
                    id: listaUsuarios[i].id,
                    id_rol: listaUsuarios[i].id_rol,
                    id_persona: listaUsuarios[i].id_persona,
                    usuario: listaUsuarios[i].usuario,
                    password: listaUsuarios[i].password,
                    nombre_rol: listaUsuarios[i].nombre_rol,
                    habilitado: listaUsuarios[i].habilitado,
                    nuevo: false,
                    modificado: false
                };
                MODULO_PERSONA.down('[name=gridUsuario]').getStore().add(newRecord);
            }

            formCrearPersona.loadRecord(selected[0]);
            if (selected[0].data.imagen === '' || selected[0].data.imagen === null) {
                form.down('[name=imagenPersona]').setSrc(URL_IMG_SISTEMA + 'usuario.png');
            } else {
                var str = selected[0].data.imagen;
                if (str.substr(-4) == '.png' || str.substr(-4) == '.jpg') {
                    var newStr = selected[0].data.imagen.slice(0, -4);
                    MODULO_PERSONA.down('[name=nombreImgPersona]').setValue(newStr);
                } else {
                    if (str.substr(-4) == '.jpeg') {
                        var newStr = selected[0].data.imagen.slice(0, -5);
                        MODULO_PERSONA.down('[name=nombreImgPersona]').setValue(newStr);
                    }
                }
                form.down('[name=imagenPersona]').setSrc(URL_IMAGEN_ADMINS + selected[0].data.imagen);
            }

        }
    },

    onBeforeclickGridPersona: function (thisObj, record, item, index, e, eOpts) {
        MODULO_PERSONA.down('[name=btnEditar]').enable();
        MODULO_PERSONA.down('[name=btnCrear]').disable();
    },

    onCrear: function () {
        var me = this;
        var form = MODULO_PERSONA.down('[name=formCrearEditarPersona]');
        var storePersona = MODULO_PERSONA.down('[name=gridLeerPersona]').getStore();
        var lista = this.getRecordsTipoUsuario();
        var formUploadImage = MODULO_PERSONA.down('[name=forImagen]').getForm();
        storePersona.proxy.extraParams = {
            listaTipoUsuario: lista
        };
        var data = form.getValues()
        var nombre = data.nombres
        var monto = MODULO_PERSONA.down('[name=id_banco]').getStore().data.items[0].data.montoInicial

        if (usuarioCliente.length > 0) {
            usuarioCliente[0].nombre = nombre
            usuarioCliente[0].monto = monto
        }

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
                            url: 'php/Uploads/upload.php?ruta=' + URL_SUBIR_IMG_ADMINS + '&nombre=' + nombre,
                            waitMsg: 'Cargando imagen...',
                            success: function (fp, o) {
                                record.imgPersona = o.result.message;
                                MODULO_PERSONA.down('[name=gridLeerPersona]').getStore().insert(0, record);
                                MODULO_PERSONA.down('[name=gridLeerPersona]').getStore().sync({
                                    callback: function (response) {
                                        if (usuarioCliente.length > 0) {
                                            console.log('MOSTRAA VENTANA DE TRANSACCION')
                                            onVentanaTransaccion(usuarioCliente, response, idP)
                                            usuarioCliente = []
                                        }
                                        onProcesarPeticion(response, me.onLimpiarForm({ limpiar: true }));
                                        MODULO_PERSONA.down('[name=gridLeerPersona]').getStore().reload();
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
                    }
                }
            });
        } else if (form.isValid()) {
            var record = form.getValues();
            record.imgPersona = '';
            //record.iconFormaPago = '';
            //var params = this.getRecordsFormaPago();
            MODULO_PERSONA.down('[name=gridLeerPersona]').getStore().insert(0, form.getValues());
            MODULO_PERSONA.down('[name=gridLeerPersona]').getStore().sync({
                callback: function (response) {
                    console.log(response)
                    if (usuarioCliente.length > 0) {
                        console.log('MOSTRAA VENTANA DE TRANSACCION')
                        onVentanaTransaccion(usuarioCliente, response, idP)
                        usuarioCliente = []
                    }
                    onProcesarPeticion(response, me.onLimpiarForm({ limpiar: true }));
                    MODULO_PERSONA.down('[name=gridLeerPersona]').getStore().reload();
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
        var form = MODULO_PERSONA.down('[name=formCrearEditarPersona]');
        var storePersona = MODULO_PERSONA.down('[name=gridLeerPersona]').getStore();
        var storeSeleccion = MODULO_PERSONA.down('[name=gridLeerPersona]').getSelection();
        var lista = this.getRecordsTipoUsuario();
        var formUploadImage = MODULO_PERSONA.down('[name=forImagen]').getForm();
        var data = form.getValues()
        var nombre = data.nombres
        var monto = MODULO_PERSONA.down('[name=id_banco]').getStore().data.items[0].data.montoInicial

        if (usuarioCliente.length > 0) {
            usuarioCliente[0].nombre = nombre
            usuarioCliente[0].monto = monto
        }

        if (changeImage == true && form.isValid()) {
            var record = form.getValues();
            var nombre = storeSeleccion[0].data.imagen;
            if (nombre !== null) {
                nombre = nombre.substr(0, nombre.indexOf('.'));
            }
            if (nombre === '' || nombre === null) {
                var fecha = new Date().getTime() + '';
                nombre = (storeSeleccion[0].data.id) + fecha.substr(-5);
            }
            formUploadImage.submit({
                url: 'php/Uploads/upload.php?ruta=' + URL_SUBIR_IMG_ADMINS + '&nombre=' + nombre,
                waitMsg: 'Cargando imagen...',
                success: function (fp, o) {
                    storeSeleccion[0].set('imgPersona', o.result.message);
                    MODULO_PERSONA.down('[name=gridLeerPersona]').getStore().proxy.extraParams = {
                        listaUsuarios: lista,
                        idBancoA: storeSeleccion[0].data.id_banco
                    };
                    form.updateRecord(form.activeRecord);
                    storePersona.sync({
                        callback: function (response) {
                            if (usuarioCliente.length > 0) {
                                console.log('MOSTRAA VENTANA DE TRANSACCION')
                                onVentanaTransaccion(usuarioCliente, response, idP)
                                usuarioCliente = []
                            }
                            onProcesarPeticion(response, me.onLimpiarForm({ limpiar: true }));
                            MODULO_PERSONA.down('[name=gridLeerPersona]').getStore().reload();
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
            MODULO_PERSONA.down('[name=gridLeerPersona]').getStore().proxy.extraParams = {
                listaUsuarios: lista,
                idBancoA: storeSeleccion[0].data.id_banco
            };
            form.updateRecord(form.activeRecord);
            storePersona.sync({
                callback: function (response) {
                    if (usuarioCliente.length > 0) {
                        console.log('MOSTRAA VENTANA DE TRANSACCION')
                        onVentanaTransaccion(usuarioCliente, response, idP)
                        usuarioCliente = []
                    }
                    onProcesarPeticion(response, me.onLimpiarForm({ limpiar: true }));
                    MODULO_PERSONA.down('[name=gridLeerPersona]').getStore().reload();
                    changeImage = false;
                }
            });
        } else {
            var fields = form.form.getFields();
            notificaciones("Llene los campos requeridos", 2);
            mensajesValidacionForms(fields);
        }
    },

    onAddUsuario: function (btn) {
        mostrarBarraProgreso('Verificando usuario. Por favor espere');
        var usuario = MODULO_PERSONA.down('[name=usuario]').getValue();
        var password = MODULO_PERSONA.down('[name=password]').getValue();
        var tipoUusario = MODULO_PERSONA.down('[name=tipoUsuario]').getValue();
        var tipoUusarion = MODULO_PERSONA.down('[name=tipoUsuario]').getRawValue();

        if (usuario == '') {
            ocultarBarraProgreso();
            return notificaciones("Por favor ingrese un usuario", 2);
        }
        if (password == '') {
            ocultarBarraProgreso();
            return notificaciones("Por favor ingrese una contraseña", 2);
        }
        if (tipoUusarion == '') {
            ocultarBarraProgreso();
            return notificaciones("Por favor ingrese un tipo de usuario", 2);
        }
        if (MODULO_PERSONA.down('[name=usuario]').wasValid == false) {
            ocultarBarraProgreso();
            return notificaciones("Por favor ingrese un usuario válido", 2);
        }
        if (MODULO_PERSONA.down('[name=password]').wasValid == false) {
            ocultarBarraProgreso();
            return notificaciones("Por favor ingrese una contraseña válida", 2);
        }
        if (MODULO_PERSONA.down('[name=tipoUsuario]').wasValid == false) {
            ocultarBarraProgreso();
            return notificaciones("Por favor ingrese un tipo de usuario válido", 2);
        }

        if (!isInStore(MODULO_PERSONA.down('[name=gridUsuario]').getStore(), usuario, 'usuario', 'exact')) {
            if (!isInStore(MODULO_PERSONA.down('[name=gridUsuario]').getStore(), tipoUusario, 'id_rol', 'exact')) {
                Ext.Ajax.request({
                    url: 'php/Login/verificarUser.php',
                    params: {
                        usuario: usuario,
                    },
                    success: function (response, opts) {
                        var obj = Ext.decode(response.responseText);
                        if (obj.success == true) {
                            notificaciones("El usuario " + usuario + " ya existe. Por favor ingrese uno nuevo", 2);
                            ocultarBarraProgreso();
                        } else {
                            var newRecord = {
                                id: usuario,
                                id_rol: tipoUusario,
                                usuario: usuario,
                                password: password,
                                nombre_rol: tipoUusarion,
                                habilitado: 1,
                                nuevo: true,
                                modificado: true
                            };
                            if (newRecord.id != null) {
                                MODULO_PERSONA.down('[name=gridUsuario]').getStore().insert(0, newRecord);
                            }
                            if (tipoUusario == 2) {
                                usuarioCliente.push(newRecord)
                            }
                            ocultarBarraProgreso();
                        }
                    },

                    failure: function (response, opts) {
                        console.log('server-side failure with status code ' + response.status);
                        notificaciones("Por favor, intentelo más tarde.", 2)
                    }
                });
            } else {
                notificaciones("Ya existe un perfil asignada como " + tipoUusarion, 2);
                ocultarBarraProgreso();
            }
        } else {
            notificaciones("El usuario " + usuario + " ya existe. Por favor ingrese uno nuevo", 2);
            ocultarBarraProgreso();
        }

        MODULO_PERSONA.down('[name=tipoUsuario]').setValue(null);
        MODULO_PERSONA.down('[name=usuario]').reset();
        MODULO_PERSONA.down('[name=password]').reset();
    },

    getRecordsTipoUsuario: function () {
        var listaTipoUsuario = [];
        var dataAux = MODULO_PERSONA.down('[name=gridUsuario]').getStore().getData().items;

        for (var i in dataAux) {
            if (dataAux[i].data.nuevo && dataAux[i].data.modificado == true) {
                listaTipoUsuario[i] = {
                    id: dataAux[i].data.id,
                    id_rol: dataAux[i].data.id_rol,
                    habilitado: dataAux[i].data.habilitado,
                    usuario: dataAux[i].data.usuario,
                    password: dataAux[i].data.password,
                    nuevo: dataAux[i].data.nuevo
                };
            } else if (dataAux[i].data.modificado == true) {
                listaTipoUsuario[i] = {
                    id: dataAux[i].data.id,
                    id_rol: dataAux[i].data.id_rol,
                    habilitado: dataAux[i].data.habilitado,
                    usuario: dataAux[i].data.usuario,
                    password: dataAux[i].data.password,
                    nuevo: false
                };
            }
        }
        return {
            listaTipoUsuario: JSON.stringify(listaTipoUsuario)
        };
    },
});

function onVentanaTransaccion(usuario, response, id) {
    var idpe = id;
    if (response.operations.length > 0) {
        var obj = {};
        if (isJsonString(response.operations[0]._response.responseText)) {
            obj = JSON.parse(response.operations[0]._response.responseText);
            if (obj.success) {
                console.log(usuario);
               var v =  Ext.create('Ext.window.Window', {
                    title: '<b>Transferencia Inicial</b>',
                    bodyStyle: 'background-color: white; padding:5px;',
                    width: 300,
                    layout: 'vbox',
                    plain: true,
                    buttonAlign: 'center',
                    itemsAlign: 'center',
                    items: [ // Let's put an empty grid in just to illustrate fit layout
                        {
                            xtype: 'label',
                            width: '100%',
                            html: '<center><h4>Se va a realizar una transferencia inicial de:</h4></center>'
                        },
                        {
                            xtype: 'container',
                            align: 'center',
                            width: '100%',
                            label: 'hbox',
                            items: [
                                {
                                    xtype: 'label',
                                    html: '<div style="display: flex; aling-items: center; justify-content: center; place-items: center"><div><img src="./img/time1.png" alt="tiempo"></img></div><div> <h3> &nbsp; ' + usuario[0].monto + '</h3></div></div>',
                                    flex: 1
                                }
                            ]
                        },
                        {
                            xtype: 'label',
                            width: '100%',
                            html: '<center><b>Beneficiario:</b> ' + usuario[0].nombre + '</center>'
                        },

                    ],

                    buttons: [
                        {
                            text: 'Transferir',
                            width: 100,
                            handler: function () {
                                console.log('transferir')
                                Ext.Ajax.request({
                                    url: './php/Get/getIdUsuario.php',
                                    method: 'POST',
                                    headers: {
                                        'Content-Type': "application/x-www-form-urlencoded",
                                        'version': "1.0.0"
                                    },
                                    params: {
                                        idUsuario: (obj.id == 0 ? idpe : obj.id)
                                    },
                                    success: function (result, action, response) {
                                        console.log(result);
                                        var resp = JSON.parse(result.responseText);
                                        console.log(resp);
                                       if (resp.success){
                                            Ext.Ajax.request({
                                                url: './php/Set/transaccionTiempo.php',
                                                method: 'POST',
                                                headers: {
                                                    'Content-Type': "application/x-www-form-urlencoded",
                                                    'version': "1.0.0"
                                                },
                                                params: {
                                                    idUsuarioPaga: ID_USUARIO_PAGA,
                                                    idUsuarioRecibe: resp.data[0].id,
                                                    detalle: 'Transferencia Inicial',
                                                    valoracion: 5,
                                                    monto: usuario[0].monto

                                                },
                                                success: function (result, action, response) {
                                                    console.log(result);
                                                    var resp = JSON.parse(result.responseText);
                                                    if (resp.success) {
                                                        notificaciones('Transaccion realizada con éxito', 1)
                                                        v.close()
                                                    } else {
                                                        notificaciones('No se pudo realizar la transferencia.', 2)
                                                        v.close()
                                                    }


                                                },
                                                failure: function (message, err) {
                                                    notificaciones('No se pudo realizar la transferencia.', 2)
                                                    console.log('error')
                                                    console.log(message);
                                                    console.log(err);
                                                    //v.close()
                                                }
                                            });
                                        } else {
                                            notificaciones('No se pudo realizar la transferencia.', 2)
                                            v.close()
                                        }
                                    },
                                    failure: function (message, err) {
                                        notificaciones('No se pudo realizar la transferencia.', 2)
                                        console.log('error')
                                        console.log(message);
                                        console.log(err);
                                        //v.close()
                                    }
                                })
                            }
                        },
                        {
                            text: 'Cancelar',
                            width: 80,
                            handler: function () {
                                usuarioCliente = []
                                this.up('window').close()
                            }

                        }
                    ]

                }).show();
            }
        }
    }
}