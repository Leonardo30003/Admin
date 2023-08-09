/* global Ext */
Ext.define('bancodt.store.persona.s_Persona', {
    extend: 'Ext.data.Store',
    fields: [
        {name: 'id'},
        {name: 'id_persona'},
        {name: 'id_banco'},
        {name: 'identificativo'},
        {name: 'nombres'},
        {name: 'apellidos'},
        {name: 'edad'},
        {name: 'direccion'},
        {name: 'usuario_creacion'},
        {name: 'eliminado', type: 'bool' },
        {name: 'telefono'}
    ],
    alias: 'persona.s_Persona',
    pageSize: 250,
    proxy: {
        type: 'ajax',
        api: {
            read: 'php/Persona/read.php',
            create: 'php/Persona/create.php',
            update: 'php/Persona/update.php'
        },
        reader: {
            type: 'json',
            rootProperty: 'personas',
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

