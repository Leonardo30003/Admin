if (MODULOS.length <= 0)
    run(function (response) {
        if (response === 1)
            llenar_Store_Navegacion();
        else {
            notificaciones(MENSAJE_ERROR, 2);
        }
    });
else
    llenar_Store_Navegacion();
function llenar_Store_Navegacion() {
    var itemMenu = {
        'id': 'menu',
        'iconCls': 'x-fa fa-bars',
        'viewType': '',
        'inicio': '',
        'text': 'Menú',
        'name': '',
        'PATH': '',
        'leaf': true,
        'selectable': false,
        'rowCls': 'menuPrincipal',
        'permisos': ''};
        //MÓDULOS ESTATICOS
    MODULOS = [];
    MODULOS.push(
        {
            "id": "1",
            "iconCls": "fa fa-user-circle-o",
            "text": "Usuarios",
            "rowCls": "nav-tree-badge",
            "selectable": false,
            "children": [
                {
                    "id": "persona",
                    "iconCls": "fa fa-address-card",
                    "viewType": "persona",
                    "text": "Personas",
                    "name": "Persona",
                    "PATH": "admin.php",
                    "padre": "Usuarios",
                    "leaf": true,
                    "rowCls": "nav-tree-badge",
                    "permisos": {
                        "leer": 1,
                        "crear": 1,
                        "editar": 1,
                        "eliminar": 1
                    }
                }
            ]
        },{
            "id": "2",
            "iconCls": "fa fa-pencil-square-o",
            "text": "Gestión",
            "rowCls": "nav-tree-badge",
            "selectable": false,
            "children": [
                {
                    "id": "banco",
                    "iconCls": "fa fa-building-o",
                    "viewType": "sucursal",
                    "text": "Bancos",
                    "name": "bancos",
                    "PATH": "admin.php",
                    "padre": "Gestión",
                    "leaf": true,
                    "rowCls": "nav-tree-badge",
                    "permisos": {
                        "leer": 1,
                        "crear": 1,
                        "editar": 1,
                        "eliminar": 1
                    }
                },
                {
                    "id": "categoria",
                    "iconCls": "fa fa-server",
                    "viewType": "categoria",
                    "text": "Categorías",
                    "name": "categoria",
                    "PATH": "admin.php",
                    "padre": "Gestión",
                    "leaf": true,
                    "rowCls": "nav-tree-badge",
                    "permisos": {
                        "leer": 1,
                        "crear": 1,
                        "editar": 1,
                        "eliminar": 1
                    }
                }
            ]
        },
        {
            "id": "3",
            "iconCls": "fa fa-file-text-o",
            "text": "Reportes",
            "rowCls": "nav-tree-badge",
            "selectable": false,
            "children": [
                {
                    "id": "Ofertas",
                    "iconCls": "fa fa-hourglass-half",
                    "viewType": "oferta",
                    "text": "Ofertas",
                    "name": "oferta",
                    "PATH": "admin.php",
                    "padre": "Reportes",
                    "leaf": true,
                    "rowCls": "nav-tree-badge",
                    "permisos": {
                        "leer": 1,
                        "crear": 1,
                        "editar": 1,
                        "eliminar": 1
                    }
                },
                {
                    "id": "Tiempos",
                    "iconCls": "fa fa-handshake-o",
                    "viewType": "transaccionTiempo",
                    "text": "Trans. Tiempo",
                    "name": "tiempo",
                    "PATH": "admin.php",
                    "padre": "Reportes",
                    "leaf": true,
                    "rowCls": "nav-tree-badge",
                    "permisos": {
                        "leer": 1,
                        "crear": 1,
                        "editar": 1,
                        "eliminar": 1
                    }
                }
            ]
        }
        );
    MODULOS.unshift(itemMenu);
    Ext.define('bancodt.store.Navegacion', {
        extend: 'Ext.data.TreeStore',
        storeId: 'Navegacion',
        data: MODULOS,
        fields: [{name: 'text'}],
        root: {
            expanded: true,
        }
    });
    setTimeout('runReloj()', 2000);//EJECUTA RELOJ
    setTimeout('asignarDatosMain()', 2000);//ASIGNA DATOS
    STORE_FORMATO_FECHA = Ext.create('bancodt.store.stores.s_Formatos_Fecha');
    STORE_FORMATO_HORA = Ext.create('bancodt.store.stores.s_Formatos_Hora');
}
