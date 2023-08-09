var permisosPersona;
var usuarioCliente = []
ID_BUSCADOR_Persona = 'buscadorPersona';
Ext.define('bancodt.view.persona.v_Persona', {
    extend: 'Ext.panel.Panel',
    xtype: 'persona',
    store: 'persona.s_Persona',
    height: HEIGT_VIEWS,
    layout: 'border',
    id: 'moduloPersona',
    controller: 'c_Persona',
    bodyBorder: false,
    requires: [
        'Ext.layout.container.Border',
        'bancodt.view.persona.c_Persona'
    ],
    defaults: {
        collapsible: true,
        collapsed: false,
        collapseMode: 'mini',
        split: true,
        bodyPadding: 0
    },
    listeners: {
        afterrender: 'onViewPersona',
        show: 'onShowPersona'
    },
    initComponent: function () {
        var STORE_PERSONA = Ext.create('bancodt.store.persona.s_Persona');
        var STORE_USUARIOS = Ext.create('bancodt.store.stores.s_Usuarios');
        var STORE_TIPO_USUARIO = Ext.create('bancodt.store.combos.s_TipoUsuario');
        var STORE_BANCO = Ext.create('bancodt.store.combos.s_Banco');
        //var COMBO_PAIS = Ext.create('bancodt.store.combos.s_Pais');
        //var COMBO_PROVINCIA = Ext.create('bancodt.store.combos.s_Provincia');
        this.items = [
            {
                region: 'west',
                xtype: 'panel',
                name: 'panelLeerPersona',
                padding: 5,
                flex: 2,
                layout: 'fit',
                header: false,
                headerAsText: false,
                items: [
                    {
                        name: 'gridLeerPersona',
                        columnLines: true,
                        xtype: 'grid',
                        plugins: [{ ptype: 'gridfilters' }],
                        bufferedRenderer: false,
                        store: STORE_PERSONA,
                        tbar: [
                            {
                                xtype: 'textfield',
                                flex: 2,
                                tooltip: 'Escribir búsqueda',
                                name: 'paramBusquedaPersona',
                                emptyText: 'Nombres, apellidos, teléfono',
                                minChars: 0,
                                typeAhead: true,
                                listeners: {
                                    specialkey: 'onChangeSearchPersona'
                                }
                            },
                            {
                                xtype: 'numberfield',
                                flex: 1,
                                //fieldLabel: 'Edad',
                                name: 'edadBusqueda',
                                emptyText: 'Edad',
                                maxLength: 3,
                                minLength: 1,
                                minValue: 1,
                                maxValue: 100,
                                listeners: {
                                    specialkey: 'onChangeSearchPersona'
                                }
                            },
                            {
                                width: '6%',
                                xtype: 'button',
                                iconCls: 'x-fa fa-search',
                                iconAlign: 'right',
                                tooltip: 'Buscar',
                                handler: 'onChangeSearchPersona'
                            },
                            {
                                width: '6%',
                                xtype: 'button',
                                iconCls: 'x-fa fa-eraser',
                                iconAlign: 'right',
                                tooltip: 'Limpiar',
                                handler: 'onLimpiarGrid'
                            },
                            {
                                width: '6%',
                                xtype: 'button',
                                iconCls: 'x-fa fa-refresh',
                                iconAlign: 'right',
                                tooltip: 'Recargar',
                                handler: 'onRecargar'
                            }
                        ],
                        columns: [
                            Ext.create('Ext.grid.RowNumberer', { header: '#', width: 30, align: 'center' }),
                            { filter: true, tooltip: "Nombres", text: "Nombres", flex: 2, dataIndex: 'nombres', sortable: true, renderer: showTipConten },
                            //							{filter: true, tooltip: "Provincia", text: "Provincia", flex: 2, dataIndex: 'provincia', sortable: true, renderer: showTipConten },
                            { filter: true, tooltip: "Apellidos", text: "Apellidos", flex: 2, dataIndex: 'apellidos', sortable: true, renderer: getNombrePais },
                            { filter: true, tooltip: "Identificación", text: "Identificación", flex: 1, dataIndex: 'identificativo', sortable: true, renderer: showTipConten },
                            //{ filter: false, tooltip: "Edad", text: "Edad", flex: 1, dataIndex: 'edad', sortable: true, renderer: showTipConten },
                            { filter: true, tooltip: "Dirección", text: "Dirección", flex: 2, dataIndex: 'direccion', sortable: true, renderer: showTipConten },
                            { filter: true, tooltip: "Teléfono", text: "Teléfono", flex: 2, dataIndex: 'telefono', sortable: true, renderer: showTipConten },
                            { filter: true, tooltip: "Bloqueado", text: "Habilitado", flex: 2, dataIndex: 'eliminado', sortable: true, align: 'center', renderer: formatEstadoPuntoBloqueado },
                            //{ filter: true, tooltip: "Usuario", text: "Usuario", flex: 2, dataIndex: 'usuario_creacion', sortable: true, align: 'center', renderer: formatEstadoPunto },
                            { filter: true, tooltip: "Banco", text: "Banco", flex: 2, dataIndex: 'banco', sortable: true, align: 'center', renderer: showTipConten },
                            { filter: true, tooltip: "Fecha registro", text: "Fecha registro", flex: 2, dataIndex: 'fecha_registro', sortable: true, renderer: showTipContenFechaHora },
                            // { filter: true, tooltip: "Fecha Registro", text: "Fecha Registro", flex: 2, dataIndex: 'dateCreate', sortable: true, renderer: setFormatFechaHora },
                            { filter: true, tooltip: "ID", text: "ID", flex: 1, dataIndex: 'id', sortable: true, renderer: showTipContenID, hidden: true }
                        ],
                        height: 210,
                        split: true,
                        region: 'north',
                        listeners: {
                            selectionchange: 'onSelectChangeGridPersona',
                            beforeitemclick: 'onBeforeclickGridPersona',
                            //rowdblclick: showAuditoria
                        },
                        viewConfig: {
                            deferEmptyText: false,
                            enableTextSelection: true,
                            preserveScrollOnRefresh: true,
                            listeners: {
                                loadingText: 'Cargando...'
                            },
                            loadMask: true,
                            emptyText: '<center><h1 style="margin:20px">No existen resultados</h1></center>' 
                        },
                        bbar: Ext.create('Ext.PagingToolbar', {
                            name: 'pagingToolbarPersona',
                            displayInfo: true,
                            emptyMsg: "Sin datos que mostrar.",
                            displayMsg: ' {0} - {1} de {2} registros',
                            beforePageText: 'Página',
                            afterPageText: 'de {0}',
                            firstText: 'Primera página',
                            prevText: 'Página anterior',
                            nextText: 'Siguiente página',
                            lastText: 'Última página',
                            refreshText: 'Actualizar',
                            inputItemWidth: 35,
                            items: [
                                {
                                    xtype: 'button',
                                    text: 'Exportar',
                                    iconCls: 'x-fa fa-download',
                                    handler: function (btn) {
                                        onExportar(btn, "Reporte_Personas", this.up('grid'));
                                    }
                                },
                                {
                                    xtype: 'label',
                                    name: 'numRegistrosGrid',
                                    text: '0 registros',
                                    hidden: true
                                }
                            ],
                            listeners: {
                                afterrender: function () {
                                    this.child('#refresh').hide();
                                }
                            }
                        })
                    }]
            },
            {
                name: 'panelCrearEditarPersona',
                cls: 'panelCrearEditar',
                region: 'center',
                xtype: 'form',
                layout: 'fit',
                padding: 5,
                flex: 1.5,
                collapsible: false,
                items: [{
                    xtype: 'form',
                    name: 'formCrearEditarPersona',
                    title: 'Persona',
                    //layout: 'vbox',
                    padding: 5,
                    flex: 3,
                    cls: 'quick-graph-panel shadow panelFormulario',
                    ui: 'light',
                    //defaultType: 'textfield',
                    defaults: {
                        //anchor: '100%',
                        width: '100%',
                    },
                    items: [
                        //						{
                        //							allowBlank: false,
                        //							name: 'idProvincia',
                        //							xtype: 'combobox',
                        //							emptyText: 'Seleccione',
                        //							fieldLabel: 'Provincia',
                        //							displayField: 'provincia',
                        //							value: 0,
                        //							minChars: 2,
                        //							typeAhead: true,
                        //							valueField: 'idProvincia',
                        //							queryParam: 'param',
                        //							queryMode: 'local',
                        //							afterLabelTextTpl: INFOMESSAGEREQUERID,
                        //							allowOnlyWhitespace: false,
                        //							blankText: INFOMESSAGEBLANKTEXT,
                        //							store: COMBO_PROVINCIA,
                        //							listeners:{
                        //								specialkey: 'onChangeSearchProvincia',
                        //							}
                        //						},
                        {
                            title: '<b>Imagen Persona</b>',
                            xtype: 'fieldset',
                            width: "100%",
                            defaults: {
                                //                                                    margin: '5 5 5 5'
                            },
                            items: [
                                {
                                    xtype: 'container',
                                    layout: 'hbox',
                                    layout: 'center',
                                    align: 'center',
                                    items: [
                                        {
                                            xtype: 'container',
                                            align: 'center',
                                            layout: 'center',
                                            layout: {
                                                type: 'hbox',
                                                pack: 'center',
                                                align: 'center'
                                            },
                                            margin: '0 5 0 0',
                                            defaults: {
                                                flex: 1,
                                            },
                                            items: [
                                                {
                                                    xtype: 'form',
                                                    name: 'forImagen',
                                                    layout: {
                                                        type: 'vbox',
                                                        pack: 'center',
                                                        align: 'center'
                                                    },
                                                    items: [{
                                                        xtype: 'image',
                                                        src: URL_IMG_SISTEMA + 'usuario.png',
                                                        height: 200,
                                                        width: 200,
                                                        name: 'imagenPersona',
                                                        style: {
                                                            'border-radius': '2%',
                                                            'border': '2px solid rgb(7, 73, 117)'
                                                        },
                                                        listeners: {
                                                            render: function (me) {
                                                                me.el.on({
                                                                    error: function (e, t, eOmpts) {
                                                                        me.setSrc(URL_IMG_SISTEMA + 'usuario.png');
                                                                    }
                                                                });
                                                            }
                                                        }
                                                    },
                                                    {
                                                        xtype: 'hidden',
                                                        value: 'false',
                                                        name: 'imagen'
                                                    },
                                                    {
                                                        xtype: 'filefield',
                                                        allowOnlyWhitespace: true,
                                                        buttonOnly: true,
                                                        iconCls: 'x-fa fa-camera',
                                                        name: 'photo',
                                                        msgTarget: 'side',
                                                        allowBlank: true,
                                                        buttonConfig: {
                                                            text: 'Imagen',
                                                            iconCls: 'x-fa fa-camera',
                                                            width: '100%'
                                                        },
                                                        listeners: {
                                                            afterrender: function (cmp) {
                                                                cmp.fileInputEl.set({
                                                                    accept: '.png, .jpg, .jpeg'
                                                                });
                                                            },
                                                            change: function (evt, a, b) {
                                                                changeImage = true;
                                                                var fieldImage = MODULO_PERSONA.down('[name=formCrearEditarPersona]').down('[name=imagenPersona]');
                                                                if (evt.fileInputEl.dom.files && evt.fileInputEl.dom.files) {
                                                                    var reader = new FileReader();
                                                                    reader.onload = function (e) {
                                                                        //fieldImage.setSrc(e.target.result);
                                                                        var image = new Image();
                                                                        image.src = e.target.result
                                                                        image.onload = function () {
                                                                            /*  if (image.width >= 300 && image.width >= 300) {
                                                                                 fieldImage.setSrc(e.target.result);
                                                                             } else {
                                                                                 changeImageFormaPago = false;
                                                                                 alert(' La imagen subida es de: ' + image.width + ' x ' + image.height + ' y el tamaño mínimo es: 300*300');
                                                                             } */
                                                                            fieldImage.setSrc(e.target.result);
                                                                        };
                                                                    };
                                                                    reader.readAsDataURL(evt.fileInputEl.dom.files[0]);
                                                                    var str = evt.fileInputEl.dom.files[0].name;
                                                                    var f = hoyFecha();
                                                                    if (str.substr(-4) == '.png' || str.substr(-4) == '.jpg') {
                                                                        var newStr = evt.fileInputEl.dom.files[0].name.slice(0, -4);
                                                                        var res = newStr.concat(f);
                                                                        //console.log(res);
                                                                        //MODULO_BOLETO.down('[name=nombreImgGrande]').setValue(newStr);

                                                                    } else {
                                                                        if (str.substr(-4) == '.jpeg') {
                                                                            var newStr = evt.fileInputEl.dom.files[0].name.slice(0, -5);
                                                                            var res = newStr.concat(f);
                                                                            //console.log(res);
                                                                            //MODULO_BOLETO.down('[name=nombreImgGrande]').setValue(newStr);

                                                                        }
                                                                    }
                                                                }
                                                            }
                                                        }
                                                    },
                                                        /* {
                                                            xtype: 'label',
                                                            html: 'min. 300 x 300'
                                                        }, */
                                                    ]
                                                },
                                            ]
                                        }
                                    ]
                                },
                            ]
                        },
                        {
                            allowBlank: false,
                            xtype: 'textfield',
                            fieldLabel: 'Nombres',
                            name: 'nombres',
                            emptyText: 'Nombres',
                            afterLabelTextTpl: INFOMESSAGEREQUERID,
                            allowOnlyWhitespace: false,
                            blankText: INFOMESSAGEBLANKTEXT,
                            maxLength: '45',
                            minLength: '3',
                            minLengthText: MINIMUMMESSAGUEREQUERID,
                            maxLengthText: MAXIMUMMESSAGUEREQURID,
                            listeners: {
                                change: function keyup(thisObj, e, eOpts) {
                                    //                                        thisObj.setValue(e.toUpperCase());
                                }
                            }
                        },
                        {
                            allowBlank: false,
                            fieldLabel: 'Apellidos',
                            xtype: 'textfield',
                            name: 'apellidos',
                            emptyText: 'Apellidos',
                            afterLabelTextTpl: INFOMESSAGEREQUERID,
                            allowOnlyWhitespace: false,
                            blankText: INFOMESSAGEBLANKTEXT,
                            maxLength: '45',
                            minLength: '3',
                            minLengthText: MINIMUMMESSAGUEREQUERID,
                            maxLengthText: MAXIMUMMESSAGUEREQURID,
                            listeners: {
                                change: function keyup(thisObj, e, eOpts) {
                                    //                                        thisObj.setValue(e.toUpperCase());
                                }
                            }
                        },
                        {
                            //allowBlank: true,
                            fieldLabel: 'Banco',
                            //afterLabelTextTpl: INFOMESSAGEREQUERID,
                            xtype: 'combobox',
                            tooltip: 'Buscar Banco',
                            name: 'id_banco',
                            emptyText: 'Banco..',
                            displayField: 'text',
                            valueField: 'id',
                            filterPickList: true,
                            forceSelection: true,
                            queryParam: 'param',
                            queryMode: 'remote',
                            store: STORE_BANCO,
                            minChars: 3,
                            flex: 2,
                            afterLabelTextTpl: INFOMESSAGEREQUERID,
                            allowOnlyWhitespace: false,
                            blankText: INFOMESSAGEBLANKTEXT,
                            //anchor: 20,
                            /* listeners: {
                                beforequery: function (queryEvent, eOpts) {
                                    queryEvent.combo.store.proxy.extraParams = { tipo: 2 };
                                }
                            } */
                        },
                        {
                            allowBlank: false,
                            fieldLabel: 'Identificativo',
                            xtype: 'textfield',
                            name: 'identificativo',
                            afterLabelTextTpl: INFOMESSAGEREQUERID,
                            allowOnlyWhitespace: false,
                            blankText: INFOMESSAGEBLANKTEXT,
                            maxLength: '13',
                            minLength: '6',
                            emptyText: 'Cédula, pasaporte o RUC',
                            maskRe: /[0-9.]/,
                            minLengthText: MINIMUMMESSAGUEREQUERID,
                            maxLengthText: MAXIMUMMESSAGUEREQURID,
                            listeners: {
                                change: function keyup(thisObj, e, eOpts) {
                                    thisObj.setValue(e.toUpperCase());
                                }
                            }
                        },
                        /*  {
                             allowBlank: false,
                             fieldLabel: 'Color',
                             name: 'color',
                             value: '#000000',
                             inputType: 'color',
                             height: 25,
                             afterLabelTextTpl: INFOMESSAGEREQUERID,
                             allowOnlyWhitespace: false,
                             blankText: INFOMESSAGEBLANKTEXT
                         }, */
                        {
                            allowBlank: false,
                            fieldLabel: 'Teléfono',
                            xtype: 'textfield',
                            name: 'telefono',
                            emptyText: 'Teléfono',
                            maxLength: '10',
                            minLength: '7',
                            width: '100%',
                            maskRe: /[0-9.]/,
                            //vtype: 'latitud',
                            afterLabelTextTpl: INFOMESSAGEREQUERID,
                            allowOnlyWhitespace: false,
                            blankText: INFOMESSAGEBLANKTEXT,
                            minLengthText: MINIMUMMESSAGUEREQUERID,
                            maxLengthText: MAXIMUMMESSAGUEREQURID
                        },
                        {
                            xtype: 'numberfield',
                            width: "100%",
                            fieldLabel: 'Edad',
                            name: 'edad',
                            emptyText: 'Edad',
                            maxLength: 3,
                            minLength: 1,
                            minValue: 1,
                            maxValue: 100,
                            height: 25,
                            //value: -5,
                            style: 'height:15px!important;',
                            maxLengthText: MAXIMUMMESSAGUEREQURID,
                            allowOnlyWhitespace: true,
                            blankText: INFOMESSAGEBLANKTEXT,
                            afterLabelTextTpl: INFOMESSAGEREQUERID,
                            allowBlank: false,
                            maxText: INFOMESSAGEMAXVALUE,
                            minText: INFOMESSAGEMINVALUE,
                            tip: 'Permite definir la edad de la persona',
                            listeners: {
                                render: 'cargarToolTip'
                            }
                        },
                        {
                            xtype: 'textareafield',
                            allowBlank: false,
                            fieldLabel: 'Dirección',
                            name: 'direccion',
                            emptyText: 'Dirección',
                            allowOnlyWhitespace: true,
                            maxLength: '500',
                            minLength: '10',
                            minLengthText: MINIMUMMESSAGUEREQUERID,
                            maxLengthText: MAXIMUMMESSAGUEREQURID,
                            blankText: INFOMESSAGEBLANKTEXT,
                            afterLabelTextTpl: INFOMESSAGEREQUERID,
                        },
                        {
                            boxLabel: 'Bloquear',
                            xtype: 'checkbox',
                            allowBlank: true,
                            allowOnlyWhitespace: true,
                            uncheckedValue: 0,
                            inputValue: 1,
                            name: 'eliminado',
                            labelAlign: 'right',
                        },
                        {
                            xtype: 'panel',
                            layout: 'hbox',
                            width: '100%',
                            defaultType: 'textfield',
                            defaults: {
                                margin: 1
                            },
                            items: [{
                                fieldLabel: 'Usuario',
                                name: 'usuario',
                                labelWidth: 50,
                                emptyText: 'Usuario',
                                maxLength: '45',
                                minLength: '5',
                                minLengthText: MINIMUMMESSAGUEREQUERID,
                                maxLengthText: MAXIMUMMESSAGUEREQURID,
                                flex: 0.8,
                                listeners: {
                                    change: function keyup(thisObj, e, eOpts) {
                                        //                                        thisObj.setValue(e.toUpperCase());
                                    }
                                }
                            },
                            {
                                fieldLabel: 'Contraseña',
                                name: 'password',
                                emptyText: 'Contraseña',
                                maxLength: '45',
                                minLength: '8',
                                minLengthText: MINIMUMMESSAGUEREQUERID,
                                maxLengthText: MAXIMUMMESSAGUEREQURID,
                                inputType: 'password',
                                flex: 0.9,
                                labelWidth: 70,
                                listeners: {
                                    change: function keyup(thisObj, e, eOpts) {
                                        //                                        thisObj.setValue(e.toUpperCase());
                                    }
                                }
                            },
                            {
                                name: 'tipoUsuario',
                                tooltip: 'Tipo de usuario',
                                xtype: 'combobox',
                                emptyText: 'Seleccione',
                                fieldLabel: 'Tipo',
                                displayField: 'text',
                                minChars: 0,
                                typeAhead: true,
                                forceSelection: true,
                                valueField: 'id',
                                queryParam: 'param',
                                queryMode: 'remote',
                                maxLength: '150',
                                flex: 1,
                                labelWidth: 50,
                                store: STORE_TIPO_USUARIO,
                                /* fieldStyle: {
                                 width: '100px'
                                 } */
                            },
                            {
                                xtype: 'button',
                                name: 'onAddCompaniaTipo',
                                flex: 0.2,
                                iconCls: 'x-fa fa-plus',
                                height: 23,
                                handler: 'onAddUsuario'
                            }
                            ]
                        },
                        {
                            xtype: 'grid',
                            height: 10,
                            width: '100%',
                            name: 'gridUsuario',
                            autoScroll: true,
                            bufferedRenderer: false,
                            store: STORE_USUARIOS,
                            cls: 'gridAuxAdmAplicativo',
                            columns: [{
                                flex: 1,
                                dataIndex: 'habilitado',
                                sortable: true,
                                renderer: formatEstadoRegistro
                            },
                            {
                                flex: 2,
                                dataIndex: 'usuario',
                                sortable: true, 
                                editor: {
                                    inputType: 'textfield',
                                    allowBlank: false,
                                    listeners: {
                                        change: function(){
                                            a = MODULO_PERSONA.down('[name=gridUsuario]').getSelection();
                                            a[0].data.modificado = true;
                                        }
                                    }
                                }
                            },
                            {
                                flex: 2,
                                dataIndex: 'password',
                                sortable: true,
                                renderer: function (val) {
                                    var toReturn = "";
                                    for (var x = 0; x < val.length; x++) {
                                        toReturn += "&#x25cf;";
                                    }

                                    return toReturn;
                                },
                                editor: {
                                    inputType: 'password',
                                    allowBlank: false,
                                    name: 'password1',
                                    minLength: '8',
                                    minLengthText: MINIMUMMESSAGUEREQUERID,
                                    maxLengthText: MAXIMUMMESSAGUEREQURID,
                                    blankText: INFOMESSAGEBLANKTEXT,
                                    listeners: {
                                        change: function(s,b,c){
                                            console.log('CAMBIO DE PASSWORD');
                                            if(b.length >= 8){
                                                a = MODULO_PERSONA.down('[name=gridUsuario]').getSelection();
                                                a[0].data.modificado = true;
                                            }
                                        }
                                    }
                                }
                            },
                            {
                                flex: 2,
                                dataIndex: 'nombre_rol',
                                sortable: true,
                                /* editor: {
                                    field: {
                                        xtype: 'combobox',
                                        allowBlank: false,
                                        emptyText: 'Seleccione',
                                        //fieldLabel: 'Tipo',
                                        displayField: 'text',
                                        minChars: 0,
                                        typeAhead: true,
                                        forceSelection: true,
                                        //valueField: 'id',
                                        queryParam: 'param',
                                        queryMode: 'remote',
                                        maxLength: '150',
                                        //flex: 1,
                                        //labelWidth: 50,
                                        store: STORE_TIPO_USUARIO,
                                        listeners: {
                                            change: function(a,b){
                                                let dato = MODULO_PERSONA.down('[name=gridUsuario]').getSelection();
                                                dato[0].data.id_rol = a.selection.data.id;
                                                dato[0].data.modificado = true;
                                            }
                                        }
                                    }
                                } */
                            },
                            {
                                xtype: 'actioncolumn',
                                menuDisabled: true,
                                sortable: false,
                                minWidth: 20,
                                flex: 1,
                                items: [{
                                    getClass: function (v, meta, rec) {
                                        if (rec.data.habilitado) {
                                            return 'gridAuxDelete x-fa fa-times';
                                        } else {
                                            return 'gridAuxCheck x-fa fa-check';
                                        }
                                    },
                                    handler: function (grid, rowIndex, colIndex) {
                                        var rec = grid.getStore().getAt(rowIndex);
                                        if (rec.data.nuevo) {
                                            grid.getStore().remove(rec);
                                        } else {
                                            if (rec.data.habilitado) {

                                                rec.set('habilitado', 0);
                                            } else {
                                                rec.set('habilitado', 1);

                                            }
                                            rec.data.modificado = true;
                                        }
                                    }
                                }]
                            }
                            ],
                            selModel: 'cellmodel',
                            plugins: {
                                ptype: 'cellediting',
                                clicksToEdit: 1
                            },
                            minHeight: 150,
                            split: true,
                            region: 'north',
                            viewConfig: {
                                deferEmptyText: false,
                                enableTextSelection: true,
                                preserveScrollOnRefresh: true,
                                listeners: {
                                    loadingText: 'Cargando...'
                                },
                                loadMask: true,
                                emptyText: '<center><h1>No existen usuarios</h1></center>',
                                getRowClass: function (record) {
                                    //console.log("111111111111"+record.data.nuevo);
                                    if (record.data.nuevo) {
                                        return 'newRowGrid';
                                    }
                                }
                            },
                        },
                        {
                            xtype: 'textfield',
                            name: 'nombreImgPersona',
                            hidden: true
                        },

                        /*{
                         xtype: 'timefield',
                         minValue: '-9:00 AM',
                         maxValue: '6:00 PM',
                         increment: 30
                         },*/
                    ]
                }],
                dockedItems: [{
                    ui: 'footer',
                    xtype: 'toolbar',
                    dock: 'bottom',
                    defaults: {
                        width: '25%',
                        height: 30
                    },
                    items: [
                        {
                            text: 'Limpiar',
                            tooltip: 'Limpiar',
                            disabled: false,
                            handler: 'onLimpiarForm'
                        },
                        '->',
                        {
                            text: 'Editar',
                            tooltip: 'Actualizar',
                            disabled: true,
                            name: 'btnEditar',
                            handler: 'onEditar'
                        }, {
                            text: 'Crear',
                            tooltip: 'Crear',
                            disabled: true,
                            name: 'btnCrear',
                            handler: 'onCrear'
                        }]
                }]
            },
            /* {
                region: 'east',
                xtype: 'panel',
                margin: 5,
                flex: 1.5,
                header: false,
                collapsible: true,
                collapsed: false,
                html: '<input class="form-input" id="' + ID_BUSCADOR_Persona + '" style="position: absolute; top: 0; left: 0; width: 70%; z-index: 10;" placeholder="Buscar dirección..." type="text" /><div id="' + ID_MAPA_Persona + '" style="position: absolute; top: 0; left: 0; z-index: 0; width: 100%; height: 100%"></div>',
            } */
        ];
        this.callParent(arguments);
    }
});

