/* global Ext */
Ext.define('bancodt.store.oferta.s_Oferta', {
    extend: 'Ext.data.Store',
    fields: [
        /* {name: 'id'},
        {name: 'id_persona'},
        {name: 'nombres'},
        {name: 'latitud'},
        {name: 'longitud'},
        {name: 'descripcion'},
        {name: 'logo'},
        {name: 'numeroM'} */
    ],
    alias: 'oferta.s_Oferta',
    pageSize: 250,
    proxy: {
        type: 'ajax',
        api: {
            read: 'php/Oferta/read.php',
            create: 'php/Oferta/create.php',
            update: 'php/Oferta/update.php'
        },
        reader: {
            type: 'json',
            rootProperty: 'ofertas',
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

