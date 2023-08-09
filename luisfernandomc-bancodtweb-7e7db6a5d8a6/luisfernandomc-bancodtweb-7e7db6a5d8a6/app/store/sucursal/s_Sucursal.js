/* global Ext */
Ext.define('bancodt.store.sucursal.s_Sucursal', {
    extend: 'Ext.data.Store',
    fields: [
        {name: 'id'},
        {name: 'id_persona'},
        {name: 'nombres'},
        {name: 'latitud'},
        {name: 'longitud'},
        {name: 'descripcion'},
        {name: 'logo'},
        {name: 'numeroM'}
    ],
    alias: 'sucursal.s_Sucursal',
    pageSize: 250,
    proxy: {
        type: 'ajax',
        api: {
            read: 'php/Sucursal/read.php',
            create: 'php/Sucursal/create.php',
            update: 'php/Sucursal/update.php'
        },
        reader: {
            type: 'json',
            rootProperty: 'sucursales',
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

