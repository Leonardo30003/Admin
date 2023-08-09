
Ext.data.Connection.disableCaching = true;
Ext.data.proxy.Server.prototype.noCache = true;
Ext.Ajax.disableCaching = true;

Ext.application({
    name: 'bancodt',
    appFolder: 'app',
    requires: [
        'bancodt.view.main.v_Main',
        'bancodt.view.main.c_Main',
        'bancodt.view.main.MainContainerWrap',
        'bancodt.view.main.MainModel'
    ],
    stores: [
        'Navegacion',
        //STORES PREDETERMINADOS
        //'combos.s_Usuario',
        //STORES ADMINISTRADOR
        //'administrador.s_Administrador',
        //'administrador.s_Modulos'
    ],
    mainView: 'bancodt.view.main.v_Main',
    launch: function () {
//        console.log('launch');
    }
});


