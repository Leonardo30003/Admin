Ext.define('bancodt.store.stores.s_Formatos_Fecha', {
    extend: 'Ext.data.ArrayStore',
    data: [
        [0, moment().format('YYYY-MM-DD'), 'YYYY-MM-DD'],
        [1, moment().format('DD/MM/YYYY'), 'DD/MM/YYYY'],
        [2, moment().format('MMM DD YYYY'), 'MMM DD YYYY'],
        [3, moment().format('MMMM DD YYYY'), 'MMMM DD YYYY']
    ],
    fields: [
        {name: 'id'},
        {name: 'text'},
        {name: 'format'}
    ]
});