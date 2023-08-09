/* global Ext */

Ext.define('bancodt.store.stores.s_Usuarios', {
    extend: 'Ext.data.Store',
    //    proxy: {
    //        type: 'ajax',
    //        url: 'php/Get/getAdministradorCompania.php',
    //        method: 'GET',
    //        reader: {
    //            type: 'json',
    //            rootProperty: 'data'
    //        }
    //    },
    fields: [
        { name: 'id' },
        { name: 'id_rol', type: 'int' },
        { name: 'id_persona', type: 'int' },
        { name: 'usuario' },
        { name: 'password' },
        { name: 'password' },
        { name: 'habilitado' },
        /* { name: 'idUserCreate', type: 'int' },
        { name: 'dateCreate', type: 'date' },
        { name: 'idUserChange', type: 'int' },
        { name: "dateChange", type: 'date' } */
    ]
});