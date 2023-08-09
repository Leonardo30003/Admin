var MODULO_TIEMPO;
Ext.define('bancodt.view.transaccionTiempo.c_Tiempo', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.c_Tiempo',
    onViewTiempo: function (panelLoad) {
        panelLoad.ID_MAPA = ID_MAPA_SUCURSAL;
        //cargarMapa(panelLoad, ID_MAPA_SUCURSAL);
        //validarPermisosGeneral(panelLoad);
        MODULO_TIEMPO = panelLoad;
        MODULO_TIEMPO.down('[name=gridLeerTiempo]').getStore().load();
        initAutocomplete(ID_BUSCADOR_Sucursal, ID_MAPA_SUCURSAL, panelLoad);

    },
    onRecargar: function () {
        MODULO_TIEMPO.down('[name=gridLeerTiempo]').getStore().reload();
    },
    onShowTiempo: function (panelLoad) {
        PANELLOAD = panelLoad;
        PANELLOAD.ID_MAPA = ID_MAPA_SUCURSAL;
    },
    onLimpiarGrid: function () {
        MODULO_TIEMPO.down('[name=paramBusqueda]').reset();
        //MODULO_TIEMPO.down('[name=comboTipo]').setValue();
        MODULO_TIEMPO.down('[name=gridLeerTiempo]').getStore().load();
        //limpiarMapa(LIST_MAPS[ID_MAPA_SUCURSAL]);
        var grid = MODULO_TIEMPO.down('[name=gridLeerTiempo]');
        grid.filters.clearFilters();
        grid.getView().deselect(grid.getSelection());
        //validarPermisosGeneral(MODULO_TIEMPO);
    },
    onLimpiarForm: function () {
        MODULO_TIEMPO.down('[name=btnCrear]').enable();
        MODULO_TIEMPO.down('[name=btnEditar]').disable();
        MODULO_TIEMPO.down('[name=formCrearEditarSucursal]').down('[name=imagenBanco]').setSrc(URL_IMG_SISTEMA + 'empresa.png');
        //limpiarMapa(LIST_MAPS[ID_MAPA_SUCURSAL]);
        var grid = MODULO_TIEMPO.down('[name=gridLeerTiempo]');
        grid.getView().deselect(grid.getSelection());
        MODULO_TIEMPO.down('[name=gridLeerTiempo]').getStore().reload();
        //validarPermisosGeneral(MODULO_TIEMPO);
        MODULO_TIEMPO.down('[name=formCrearEditarSucursal]').getForm().reset();
    },
    onChangeSearchOferta: function (btn, e) {
        if (btn.xtype === 'button' || e.event.keyCode === 13) {
            MODULO_TIEMPO.down('[name=pagingToolbarSucursal]').moveFirst();
            var paramBusqueda = MODULO_TIEMPO.down('[name=gridLeerTiempo]').down('[name=paramBusqueda]').getValue();
            //var comboTipo = MODULO_TIEMPO.down('[name=gridLeerTiempo]').down('[name=comboTipo]').getValue();
            var params = { param: paramBusqueda };
            MODULO_TIEMPO.down('[name=gridLeerTiempo]').getStore().load({
                params: params,
                callback: function (records) {
                    if (records.length <= 0) {
                        MODULO_TIEMPO.down('[name=gridLeerTiempo]').getStore().removeAll();
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