var permisosSucursal;
var changeImage = false;
ID_BUSCADOR_Sucursal = 'buscadorSucursal';
Ext.define('bancodt.view.sucursal.v_Sucursal', {
    extend: 'Ext.panel.Panel',
    xtype: 'sucursal',
    store: 'sucursal.s_Sucursal',
    height: HEIGT_VIEWS,
    layout: 'border',
    id: 'moduloSucursal',
    controller: 'c_Sucursal',
    bodyBorder: false,
    requires: [
        'Ext.layout.container.Border',
        'bancodt.view.sucursal.c_Sucursal'
    ],
    defaults: {
        collapsible: true,
        collapsed: false,
        collapseMode: 'mini',
        split: true,
        bodyPadding: 0
    },
    listeners: {
        afterrender: 'onViewSucursal',
        show: 'onShowSucursal'
    },
    initComponent: function () {
        var STORE_SUCURSAL = Ext.create('bancodt.store.sucursal.s_Sucursal');
        //var COMBO_PAIS = Ext.create('bancodt.store.combos.s_Pais');
        //var COMBO_PROVINCIA = Ext.create('bancodt.store.combos.s_Provincia');
        this.items = [
            {
                region: 'west',
                xtype: 'panel',
                name: 'panelLeerSucursal',
                padding: 5,
                flex: 2,
                layout: 'fit',
                header: false,
                headerAsText: false,
                items: [
                    {
                        name: 'gridLeerSucursal',
                        columnLines: true,
                        xtype: 'grid',
                        plugins: [{ptype: 'gridfilters'}],
                        bufferedRenderer: false,
                        store: STORE_SUCURSAL,
                        tbar: [
                            {
                                xtype: 'textfield',
                                flex: 2,
                                tooltip: 'Escribir búsqueda',
                                name: 'paramBusquedaSucursal',
                                emptyText: 'Nombre, descripcion...',
                                minChars: 0,
                                typeAhead: true,
                                listeners: {
                                    specialkey: 'onChangeSearchSucursal'
                                }
                            },
                            {
                                xtype: 'numberfield',
                                flex: 1,
                                //fieldLabel: 'Edad',
                                name: 'numeroMiembros',
                                emptyText: '# miembros',
                                maxLength: 3,
                                minLength: 1,
                                minValue: 1,
                                maxValue: 100,
                                listeners: {
                                    specialkey: 'onChangeSearchSucursal'
                                }
                            },
                            {
                                width: '6%',
                                xtype: 'button',
                                iconCls: 'x-fa fa-search',
                                iconAlign: 'right',
                                tooltip: 'Buscar',
                                handler: 'onChangeSearchSucursal'
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
                            Ext.create('Ext.grid.RowNumberer', {header: '#', width: 30, align: 'center'}),
                            {filter: true, tooltip: "Nombre del banco", text: "Banco", flex: 2, dataIndex: 'nombres', sortable: true, renderer: showTipConten},
//							{filter: true, tooltip: "Provincia", text: "Provincia", flex: 2, dataIndex: 'provincia', sortable: true, renderer: showTipConten },
                            {filter: true, tooltip: "Latitud", text: "Latitud", flex: 1, dataIndex: 'latitud', sortable: true, renderer: getNombrePais},
                            {filter: true, tooltip: "Longitud", text: "Longitud", flex: 1, dataIndex: 'longitud', sortable: true, renderer: showTipConten},
                            {filter: true, tooltip: "Descripción", text: "Descripción", flex: 2, dataIndex: 'descripcion', sortable: true, renderer: showTipConten},
                            { filter: true, tooltip: "Número miembros", text: "Número miembros", flex: 1, dataIndex: 'numeroM', sortable: true, align: 'center', renderer: showTipConten},
                            //{filter: true, tooltip: "Fecha registro", text: "Fecha registro", flex: 2, dataIndex: 'fecha_registro', sortable: true, renderer: showTipContenFechaHora},
                            // { filter: true, tooltip: "Fecha Registro", text: "Fecha Registro", flex: 2, dataIndex: 'dateCreate', sortable: true, renderer: setFormatFechaHora },
                            {filter: true, tooltip: "ID", text: "ID", flex: 1, dataIndex: 'id', sortable: true, renderer: showTipContenID, hidden: true}
                        ],
                        height: 210,
                        split: true,
                        region: 'north',
                        listeners: {
                            selectionchange: 'onSelectChangeGridSucursal',
                            beforeitemclick: 'onBeforeclickGridSucursal',
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
                            name: 'pagingToolbarSucursal',
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
                                        onExportar(btn, "Reporte_Bancos", this.up('grid'));
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
                name: 'panelCrearEditarSucursal',
                cls: 'panelCrearEditar',
                region: 'center',
                xtype: 'form',
                layout: 'fit',
                padding: 5,
                flex: 1.5,
                collapsible: false,
                items: [{
                        xtype: 'form',
                        name: 'formCrearEditarSucursal',
                        title: 'Banco',
                        layout: 'vbox',
                        padding: 5,
                        flex: 3,
                        cls: 'quick-graph-panel shadow panelFormulario',
                        ui: 'light',
                        defaultType: 'textfield',
                        defaults: {
                            anchor: '100%',
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
                                title: '<b>Ícono del Banco</b>',
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
                                                            src: URL_IMG_SISTEMA + 'empresa.png',
                                                            height: 200,
                                                            width: 200,
                                                            name: 'imagenBanco',
                                                            style: {
                                                                'border-radius': '2%',
                                                                'border': '2px solid rgb(7, 73, 117)'
                                                            },
                                                            listeners: {
                                                                render: function (me) {
                                                                    me.el.on({
                                                                        error: function (e, t, eOmpts) {
                                                                            me.setSrc(URL_IMG_SISTEMA + 'empresa.png');
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
                                                                    var fieldImage = MODULO_SUCURSAL.down('[name=formCrearEditarSucursal]').down('[name=imagenBanco]');
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
                                fieldLabel: 'Nombre',
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
                                fieldLabel: 'Latitud',
                                name: 'latitud',
                                emptyText: 'Latitud',
                                maxLength: '100',
                                minLength: '4',
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
                                allowBlank: false,
                                fieldLabel: 'Longitud',
                                name: 'longitud',
                                emptyText: 'Longitud',
                                maxLength: '100',
                                minLength: '4',
                                width: '100%',
                                maskRe: /[0-9.]/,
                                //vtype: 'longitud',
                                afterLabelTextTpl: INFOMESSAGEREQUERID,
                                allowOnlyWhitespace: false,
                                blankText: INFOMESSAGEBLANKTEXT,
                                minLengthText: MINIMUMMESSAGUEREQUERID,
                                maxLengthText: MAXIMUMMESSAGUEREQURID
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
                                xtype: 'textareafield',
                                allowBlank: false,
                                fieldLabel: 'Descripción',
                                name: 'descripcion',
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
                                minValue: 1,
                                fieldLabel: '# miembros',
                                name: 'numeroM',
                                emptyText: 'Número miembros...',
                                xtype: 'numberfield',
                                maxLength: '2',
                                minLength: '0',
                                //flex: 1.5,
                                afterLabelTextTpl: INFOMESSAGEREQUERID,
                                allowOnlyWhitespace: false,
                                blankText: INFOMESSAGEBLANKTEXT
                            },
                            {
                                xtype: 'textfield',
                                name: 'nombreImgBanco',
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
                                //disabled: true,
                                name: 'btnCrear',
                                handler: 'onCrear'
                            }]
                    }]
            },
            {
                region: 'east',
                xtype: 'panel',
                margin: 5,
                flex: 1.5,
                header: false,
                collapsible: true,
                collapsed: false,
                html: '<input class="form-input" id="' + ID_BUSCADOR_Sucursal + '" style="position: absolute; top: 0; left: 0; width: 70%; z-index: 10;" placeholder="Buscar dirección..." type="text" /><div id="' + ID_MAPA_SUCURSAL + '" style="position: absolute; top: 0; left: 0; z-index: 0; width: 100%; height: 100%"></div>',
            }
        ];
        this.callParent(arguments);
    }
});

