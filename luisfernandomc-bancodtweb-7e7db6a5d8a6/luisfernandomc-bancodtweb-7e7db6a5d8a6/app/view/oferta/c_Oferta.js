var MODULO_OFERTA;
Ext.define('bancodt.view.oferta.c_Oferta', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.c_Oferta',
    onViewOferta: function (panelLoad) {
        panelLoad.ID_MAPA = ID_MAPA_SUCURSAL;
        //cargarMapa(panelLoad, ID_MAPA_SUCURSAL);
        //validarPermisosGeneral(panelLoad);
        MODULO_OFERTA = panelLoad;
        MODULO_OFERTA.down('[name=gridLeerOferta]').getStore().load();
        initAutocomplete(ID_BUSCADOR_Sucursal, ID_MAPA_SUCURSAL, panelLoad);

    },
    onRecargar: function () {
        MODULO_OFERTA.down('[name=gridLeerOferta]').getStore().reload();
    },
    onShowOferta: function (panelLoad) {
        PANELLOAD = panelLoad;
        PANELLOAD.ID_MAPA = ID_MAPA_SUCURSAL;
    },
    onLimpiarGrid: function () {
        MODULO_OFERTA.down('[name=paramBusqueda]').reset();
        MODULO_OFERTA.down('[name=comboTipo]').setValue();
        MODULO_OFERTA.down('[name=gridLeerOferta]').getStore().load();
        //limpiarMapa(LIST_MAPS[ID_MAPA_SUCURSAL]);
        var grid = MODULO_OFERTA.down('[name=gridLeerOferta]');
        grid.filters.clearFilters();
        grid.getView().deselect(grid.getSelection());
        //validarPermisosGeneral(MODULO_OFERTA);
    },
    onLimpiarForm: function () {
        MODULO_OFERTA.down('[name=btnCrear]').enable();
        MODULO_OFERTA.down('[name=btnEditar]').disable();
        MODULO_OFERTA.down('[name=formCrearEditarSucursal]').down('[name=imagenBanco]').setSrc(URL_IMG_SISTEMA + 'empresa.png');
        //limpiarMapa(LIST_MAPS[ID_MAPA_SUCURSAL]);
        var grid = MODULO_OFERTA.down('[name=gridLeerOferta]');
        grid.getView().deselect(grid.getSelection());
        MODULO_OFERTA.down('[name=gridLeerOferta]').getStore().reload();
        //validarPermisosGeneral(MODULO_OFERTA);
        MODULO_OFERTA.down('[name=formCrearEditarSucursal]').getForm().reset();
    },
    onChangeSearchOferta: function (btn, e) {
        if (btn.xtype === 'button' || e.event.keyCode === 13) {
            MODULO_OFERTA.down('[name=pagingToolbarSucursal]').moveFirst();
            var paramBusqueda = MODULO_OFERTA.down('[name=gridLeerOferta]').down('[name=paramBusqueda]').getValue();
            var comboTipo = MODULO_OFERTA.down('[name=gridLeerOferta]').down('[name=comboTipo]').getValue();
            var params = { param: paramBusqueda, tipo: comboTipo };
            MODULO_OFERTA.down('[name=gridLeerOferta]').getStore().load({
                params: params,
                callback: function (records) {
                    if (records.length <= 0) {
                        MODULO_OFERTA.down('[name=gridLeerOferta]').getStore().removeAll();
                    }
                }
            });
        }
    },
    cargarToolTip: function (c) {
        Ext.create('Ext.tip.ToolTip', {
            target: c.getEl(),
            html: c.tip
        });
    },
    
});