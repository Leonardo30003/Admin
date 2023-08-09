/* global Ext */

Ext.define('bancodt.store.combos.s_TipoUsuario', {
    extend: 'Ext.data.Store',
    proxy: {
        type: 'ajax',
        url: 'php/Get/getTipoUsuario.php',
        method: 'GET',
        reader: {
            type: 'json',
            rootProperty: 'data'
        }
    },
    fields: [
        { name: 'id', type: 'int' },
        { name: 'text' },
        //{ name: 'tipoDescripcion' }
    ]
});