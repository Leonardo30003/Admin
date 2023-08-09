/* global Ext */

Ext.define('bancodt.store.combos.s_Banco', {
    extend: 'Ext.data.Store',
    proxy: {
        type: 'ajax',
        url: 'php/Get/getBanco.php',
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