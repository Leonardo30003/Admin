var permisosSucursal;
var changeImage = false;
ID_BUSCADOR_Sucursal = 'buscadorSucursal';
Ext.define('bancodt.view.transaccionTiempo.v_Tiempo', {
    extend: 'Ext.panel.Panel',
    xtype: 'transaccionTiempo',
    store: 'transaccionTiempo.s_Tiempo',
    height: HEIGT_VIEWS,
    layout: 'border',
    id: 'moduloTransaccionTiempo',
    controller: 'c_Tiempo',
    bodyBorder: false,
    requires: [
        'Ext.layout.container.Border',
        'bancodt.view.transaccionTiempo.c_Tiempo'
    ],
    defaults: {
        collapsible: true,
        collapsed: false,
        collapseMode: 'mini',
        split: true,
        bodyPadding: 0
    },
    listeners: {
        afterrender: 'onViewTiempo',
        show: 'onShowTiempo'
    },
    initComponent: function () {
        var STORE_SUCURSAL = Ext.create('bancodt.store.transaccionTiempo.s_Tiempo');
        //var COMBO_PAIS = Ext.create('bancodt.store.combos.s_Pais');
        //var COMBO_PROVINCIA = Ext.create('bancodt.store.combos.s_Provincia');
        this.items = [
            {
                region: 'center',
                xtype: 'panel',
                name: 'panelLeerTiempo',
                padding: 5,
                flex: 2,
                layout: 'fit',
                header: false,
                headerAsText: false,
                items: [
                    {
                        name: 'gridLeerTiempo',
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
                                name: 'paramBusqueda',
                                emptyText: 'Actividad, número de minutos..',
                                minChars: 0,
                                typeAhead: true,
                                listeners: {
                                    specialkey: 'onChangeSearchOferta'
                                }
                            },
                            /* {
                                xtype: 'numberfield',
                                flex: 0.5,
                                //fieldLabel: 'Edad',
                                name: 'comboTipo',
                                emptyText: 'tipo',
                                maxLength: 3,
                                minLength: 1,
                                minValue: 1,
                                maxValue: 100,
                                listeners: {
                                    specialkey: 'onChangeSearchOferta'
                                }
                            }, */
                            {
                                width: '6%',
                                xtype: 'button',
                                iconCls: 'x-fa fa-search',
                                iconAlign: 'right',
                                tooltip: 'Buscar',
                                handler: 'onChangeSearchOferta'
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
                            { filter: true, tooltip: "Descripción de la actividad", text: "Actividad", flex: 3, dataIndex: 'descripcion_actividad', sortable: true, renderer: showTipConten},
//							{filter: true, tooltip: "Provincia", text: "Provincia", flex: 2, dataIndex: 'provincia', sortable: true, renderer: showTipConten },
                            //{ filter: true, tooltip: "Categoría", text: "Categoría", flex: 1, dataIndex: 'categoria', sortable: true, align: 'center', renderer: showTipConten },
                            { filter: true, tooltip: "Ofertante", text: "Ofertante", flex: 1, dataIndex: 'ofertante', sortable: true, align: 'center', renderer: showTipConten },
                            { filter: true, tooltip: "Demandante", text: "Demandante", flex: 1, dataIndex: 'demandante', sortable: true, align: 'center', renderer: showTipConten },
                            {filter: true, tooltip: "Número horas", text: "Número horas", flex: 1, dataIndex: 'numero_horas', sortable: true, renderer: getNombrePais},
                            //{filter: true, tooltip: "Número minutos", text: "Número minutos", flex: 1, dataIndex: 'numero_minutos', sortable: true, renderer: showTipConten},
                            {filter: true, tooltip: "Valoración", text: "Valoración", flex: 1, dataIndex: 'valoracion', sortable: true, renderer: showTipConten},
                            //{filter: true, tooltip: "tipo", text: "Tipo", flex: 0.5, dataIndex: 'tipo', sortable: true, renderer: showTipConten},
                            //{filter: true, tooltip: "Fecha registro", text: "Fecha registro", flex: 2, dataIndex: 'fecha_registro', sortable: true, renderer: showTipContenFechaHora},
                            // { filter: true, tooltip: "Fecha Registro", text: "Fecha Registro", flex: 2, dataIndex: 'dateCreate', sortable: true, renderer: setFormatFechaHora },
                            {filter: true, tooltip: "ID", text: "ID", flex: 1, dataIndex: 'id', sortable: true, renderer: showTipContenID, hidden: true}
                        ],
                        height: 210,
                        split: true,
                        region: 'north',
                        listeners: {
                            //selectionchange: 'onSelectChangeGridSucursal',
                            //beforeitemclick: 'onBeforeclickGridSucursal',
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
                                        onExportar(btn, "Reporte_Transacciones_Tiempo", this.up('grid'));
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
        ];
        this.callParent(arguments);
    }
});

