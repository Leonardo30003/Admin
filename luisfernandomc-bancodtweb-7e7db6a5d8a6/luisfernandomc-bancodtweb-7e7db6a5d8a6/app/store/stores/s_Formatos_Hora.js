Ext.define('bancodt.store.stores.s_Formatos_Hora', {
    extend: 'Ext.data.ArrayStore',
    data: [
        [0, '0 a 23 Horas', 'HH:mm:ss'],
        [1, '1 a 12 AM/PM', 'hh:mm:ss A']
    ],
    fields: [
        {name: 'id'},
        {name: 'text'},
        {name: 'format'}
    ]
});