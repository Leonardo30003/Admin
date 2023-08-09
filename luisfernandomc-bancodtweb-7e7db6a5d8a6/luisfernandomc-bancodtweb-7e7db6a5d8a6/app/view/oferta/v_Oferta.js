var permisosSucursal;
var changeImage = false;
ID_BUSCADOR_Sucursal = 'buscadorSucursal';
Ext.define('bancodt.view.oferta.v_Oferta', {
    extend: 'Ext.panel.Panel',
    xtype: 'oferta',
    store: 'oferta.s_Oferta',
    height: HEIGT_VIEWS,
    layout: 'border',
    id: 'moduloOferta',
    controller: 'c_Oferta',
    bodyBorder: false,
    requires: [
        'Ext.layout.container.Border',
        'bancodt.view.oferta.c_Oferta'
    ],
    defaults: {
        collapsible: true,
        collapsed: false,
        collapseMode: 'mini',
        split: true,
        bodyPadding: 0
    },
    listeners: {
        afterrender: 'onViewOferta',
        show: 'onShowOferta'
    },
    initComponent: function () {
        var STORE_SUCURSAL = Ext.create('bancodt.store.oferta.s_Oferta');
        //var COMBO_PAIS = Ext.create('bancodt.store.combos.s_Pais');
        //var COMBO_PROVINCIA = Ext.create('bancodt.store.combos.s_Provincia');
        this.items = [
            {
                region: 'center',
                xtype: 'panel',
                name: 'panelLeerOferta',
                padding: 5,
                flex: 2,
                layout: 'fit',
                header: false,
                headerAsText: false,
                items: [
                    {
                        name: 'gridLeerOferta',
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
                                emptyText: 'Descripción, número de minutos..',
                                minChars: 0,
                                typeAhead: true,
                                listeners: {
                                    specialkey: 'onChangeSearchOferta'
                                }
                            },
                            {
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
                            },
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
                            {filter: true, tooltip: "Descripción de la avtividad", text: "Actividad", flex: 3, dataIndex: 'descripcion_actividad', sortable: true, renderer: showTipConten},
//							{filter: true, tooltip: "Provincia", text: "Provincia", flex: 2, dataIndex: 'provincia', sortable: true, renderer: showTipConten },
                            //{filter: true, tooltip: "Número horas", text: "Número horas", flex: 1, dataIndex: 'numero_horas', sortable: true, renderer: getNombrePais},
                            //{filter: true, tooltip: "Número minutos", text: "Número minutos", flex: 1, dataIndex: 'numero_minutos', sortable: true, renderer: showTipConten},
                            {filter: true, tooltip: "tipo", text: "Tipo", flex: 0.5, dataIndex: 'tipo', sortable: true, renderer: showTipConten},
                            { filter: true, tooltip: "Categoría", text: "Categoría", flex: 1, dataIndex: 'categoria', sortable: true, align: 'center', renderer: showTipConten},
                            {filter: true, tooltip: "Fecha registro", text: "Fecha registro", flex: 2, dataIndex: 'fecha_registro', sortable: true, renderer: showTipContenFechaHora},
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
                                        onExportar(btn, "Reporte_Ofertas_Demandas", this.up('grid'));
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

