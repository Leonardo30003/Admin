/* global Ext */
Ext.define('bancodt.store.categoria.s_Categoria', {
    extend: 'Ext.data.Store',
    fields: [
        {name: 'id'},
        {name: 'categoria'},
        {name: 'descripcion'},
        {name: 'logo'},
        {name: 'habilitado'}
    ],
    alias: 'sucursal.s_Categoria',
    pageSize: 250,
    proxy: {
        type: 'ajax',
        api: {
            read: 'php/Categoria/read.php',
            create: 'php/Categoria/create.php',
            update: 'php/Categoria/update.php'
        },
        reader: {
            type: 'json',
            rootProperty: 'categorias',
            successProperty: 'success'
        }
    },
//    onCreateRecords: function (records, operation, success) {
//        if (!success) {
//            Ext.getStore('Persona.s_Persona').remove(records);
//            var res = JSON.parse(operation._response.responseText);
//            notificaciones(res.error, 2);
//        }
//    },
//    onUpdateRecords: function (records, operation, success) {
//        if (!success) {
//            Ext.getStore('Persona.s_Persona').rejectChanges()
//            var res = JSON.parse(operation._response.responseText);
//            notificaciones(res.error, 2);
//        }
//    },
//    listeners: {
//        write: function (store, operation, eOpts) {
//            if ((operation.getRequest().getInitialConfig(['action']) === 'create') ||
//                    (operation.getRequest().getInitialConfig(['action']) === 'update')) {
//                notificaciones(MENSAJE_SUCCESS_CREAR, 1);
//                limpiarFormularioPersona();
//            }
//        },
//        load: function (thisObj, records, successful, eOpts) {
//            if (successful) {
//                var modulo = Ext.getCmp('moduloPersona');
//                if (modulo) {
//                    modulo.down('[name=numRegistrosGrid]').setText(records.length + ' Registros');
//                }
//            }
//        }
//    }
});

