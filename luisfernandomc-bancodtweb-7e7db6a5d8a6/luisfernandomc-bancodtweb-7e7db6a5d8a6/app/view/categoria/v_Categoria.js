var permisosSucursal;
//var changeImage = false;
//ID_BUSCADOR_Sucursal = 'buscadorSucursal';
Ext.define('bancodt.view.categoria.v_Categoria', {
    extend: 'Ext.panel.Panel',
    xtype: 'categoria',
    store: 'categoria.s_Categoria',
    height: HEIGT_VIEWS,
    layout: 'border',
    id: 'moduloCategoria',
    controller: 'c_Categoria',
    bodyBorder: false,
    requires: [
        'Ext.layout.container.Border',
        'bancodt.view.categoria.c_Categoria'
    ],
    defaults: {
        collapsible: true,
        collapsed: false,
        collapseMode: 'mini',
        split: true,
        bodyPadding: 0
    },
    listeners: {
        afterrender: 'onViewCategoria',
        show: 'onShowCategoria'
    },
    initComponent: function () {
        var STORE_CATEGORIA = Ext.create('bancodt.store.categoria.s_Categoria');
        //var COMBO_PAIS = Ext.create('bancodt.store.combos.s_Pais');
        //var COMBO_PROVINCIA = Ext.create('bancodt.store.combos.s_Provincia');
        this.items = [
            {
                region: 'west',
                xtype: 'panel',
                name: 'panelLeerCategoria',
                padding: 5,
                flex: 2,
                layout: 'fit',
                header: false,
                headerAsText: false,
                items: [
                    {
                        name: 'gridLeerCategoria',
                        columnLines: true,
                        xtype: 'grid',
                        plugins: [{ptype: 'gridfilters'}],
                        bufferedRenderer: false,
                        store: STORE_CATEGORIA,
                        tbar: [
                            {
                                xtype: 'textfield',
                                flex: 2,
                                tooltip: 'Escribir búsqueda',
                                name: 'paramBusquedaSucursal',
                                emptyText: 'Categoría, descripcion...',
                                minChars: 0,
                                typeAhead: true,
                                listeners: {
                                    specialkey: 'onChangeSearchCategoria'
                                }
                            },
                            {
                                width: '6%',
                                xtype: 'button',
                                iconCls: 'x-fa fa-search',
                                iconAlign: 'right',
                                tooltip: 'Buscar',
                                handler: 'onChangeSearchCategoria'
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
                            {filter: true, tooltip: "Nombre de la categoria", text: "Categoría", flex: 2, dataIndex: 'categoria', sortable: true, renderer: showTipConten},
                            {filter: true, tooltip: "Descripcion de la categoria", text: "Descripcion", flex: 2, dataIndex: 'descripcion', sortable: true, renderer: showTipConten},
                            { filter: true, tooltip: "Habilitado", text: "Habilitado", flex: 2, dataIndex: 'habilitado', sortable: true, align: 'center', renderer: formatEstadoPunto },
                            {filter: true, tooltip: "Fecha registro", text: "Fecha registro", flex: 2, dataIndex: 'fecha_registro', sortable: true, renderer: showTipContenFechaHora},
                            // { filter: true, tooltip: "Fecha Registro", text: "Fecha Registro", flex: 2, dataIndex: 'dateCreate', sortable: true, renderer: setFormatFechaHora },
                            {filter: true, tooltip: "ID", text: "ID", flex: 1, dataIndex: 'id', sortable: true, renderer: showTipContenID, hidden: true}
                        ],
                        height: 210,
                        split: true,
                        region: 'north',
                        listeners: {
                            selectionchange: 'onSelectChangeGridCategoria',
                            beforeitemclick: 'onBeforeclickGridCategoria',
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
                            name: 'pagingToolbarCategoria',
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
                                        onExportar(btn, "Reporte_Categorias", this.up('grid'));
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
                name: 'panelCrearEditarCategoria',
                cls: 'panelCrearEditar',
                region: 'center',
                xtype: 'form',
                layout: 'fit',
                padding: 5,
                flex: 1.5,
                collapsible: false,
                items: [{
                        xtype: 'form',
                        name: 'formCrearEditarCategoria',
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
                                title: '<b>Ícono de la categoría</b>',
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
                                                            src: URL_IMG_SISTEMA + 'categoria.png',
                                                            height: 200,
                                                            width: 200,
                                                            name: 'imagenCategoria',
                                                            style: {
                                                                'border-radius': '2%',
                                                                //'border': '2px solid rgb(7, 73, 117)'
                                                            },
                                                            listeners: {
                                                                render: function (me) {
                                                                    me.el.on({
                                                                        error: function (e, t, eOmpts) {
                                                                            me.setSrc(URL_IMG_SISTEMA + 'categoria.png');
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
                                                                    var fieldImage = MODULO_CATEGORIA.down('[name=formCrearEditarCategoria]').down('[name=imagenCategoria]');
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
                                fieldLabel: 'Categoría',
                                name: 'categoria',
                                emptyText: 'Categoría...',
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
                                boxLabel: 'Habilitado',
                                xtype: 'checkbox',
                                allowBlank: true,
                                allowOnlyWhitespace: true,
                                uncheckedValue: 0,
                                inputValue: 1,
                                name: 'habilitado',
                                labelAlign: 'right',
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
            /* {
                region: 'east',
                xtype: 'panel',
                margin: 5,
                flex: 1.5,
                header: false,
                collapsible: true,
                collapsed: false,
                html: '<input class="form-input" id="' + ID_BUSCADOR_Sucursal + '" style="position: absolute; top: 0; left: 0; width: 70%; z-index: 10;" placeholder="Buscar dirección..." type="text" /><div id="' + ID_MAPA_SUCURSAL + '" style="position: absolute; top: 0; left: 0; z-index: 0; width: 100%; height: 100%"></div>',
            } */
        ];
        this.callParent(arguments);
    }
});

