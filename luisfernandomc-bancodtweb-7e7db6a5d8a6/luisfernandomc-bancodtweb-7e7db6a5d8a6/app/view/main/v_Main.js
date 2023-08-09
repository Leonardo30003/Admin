var Lista = [];
Lista.push([
    'Ext.button.Segmented',
    'Ext.list.Tree',
    'bancodt.view.main.c_Main',
    'bancodt.view.main.MainContainerWrap',
    'bancodt.view.main.MainModel',
    'bancodt.view.404.v_SinModulo',
    'bancodt.view.persona.v_Persona'
])
Ext.define('bancodt.view.main.v_Main', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.v_Main',
    //requires: LISTA_VISTAS_BANCODT,
    requires: [
        'Ext.button.Segmented',
        'Ext.list.Tree',
        'bancodt.view.main.c_Main',
        'bancodt.view.main.MainContainerWrap',
        'bancodt.view.main.MainModel',
        'bancodt.view.404.v_SinModulo',
        'bancodt.view.persona.v_Persona',
        'bancodt.view.sucursal.v_Sucursal',
        'bancodt.view.categoria.v_Categoria',
        'bancodt.view.oferta.v_Oferta',
        'bancodt.view.transaccionTiempo.v_Tiempo'
    ],
    controller: 'main',
    viewModel: 'main',
    cls: 'sencha-dash-viewport',
    itemId: 'v_Main',
    layout: {
        type: 'vbox',
        align: 'stretch'
    },
    listeners: {
        render: 'onMainViewRender',
        afterRender: 'setDataUsuario'
    },
    items: [
        {
            xtype: 'toolbar',
            cls: 'sencha-dash-dash-headerbar shadow',
            height: 64,
            itemId: 'headerBar',
            id: 'toolbarMain',
            style: {
                background: '#0fcbb9',
                color: 'white',
                border: '1px solid #0fcbb9'
            },
            items: [
                {
                    xtype: 'component',
                    reference: 'senchaLogo',
                    cls: 'sencha-logo',
                    html: '<div class="main-logo"><img src="' + IMG_LOGO + '" width="185"><div class="titulo">' + APP + '</div><!--<div class="subtitulo">' + TITULO_MAIN_APP + '</div>--></div>',
                    width: 150
                },
                '->',
                {
                    xtype: 'label',
                    html: '<div class = "subtitulo">' + DIAS[FECHA_ACTUAL.getDay() - 1 ] + ', ' + FECHA_ACTUAL.getDate() + ' de ' + MESES[FECHA_ACTUAL.getMonth()] + '&nbsp&nbsp&nbsp&nbsp&nbsp<span class="barra">|</span>&nbsp&nbsp&nbsp&nbsp&nbsp<span id="reloj" style="font-weight: bold;">00:00:00</span>&nbsp&nbsp&nbsp&nbsp&nbsp' + '</div>'
                },
                {
                    xtype: 'button',
                    id: 'btnAlarmas',
                    iconCls: 'x-fa fa-bell',
                    ui: 'header',
                    tooltip: 'Ver Alarmas',
                    badgeText: 0,
                    cls: 'gray-badge',
                    arrowVisible: false,
                    menu: [],
                    handler: function () {
                        verAlarmas();
                    },
                    hidden: true
                },
                {
                    xtype: 'image',
                    name: 'FOTO_PERFIL',
                    cls: 'header-right-profile-image',
                    height: 35,
                    width: 35,
                    alt: 'Imagen de Usuario',
                    src: URL_IMG_SISTEMA + 'usuario.png',
                    listeners: {
                        render: function (me) {
                            me.el.on({
                                error: function (e, t, eOmpts) {
                                    me.setSrc(URL_IMG_SISTEMA + 'usuario.png');
                                }
                            });
                        }
                    }
                },
                {
                    xtype: 'toolbar',
                    cls: 'sencha-dash-dash-headerbar shadow',
                    height: 64,
                    itemId: 'headerBar',
                    layout: 'vbox',
                    id: 'toolbarMain2',
                    border: '0px',
                    style: {
                        background: COLOR_SISTEMA2,
                        color: COLOR_SISTEMA2
                    },
                    items: [
                        {
                            xtype: 'button',
                            name: 'NOMBRE_USUARIO',
                            text: 'ADMIN',
                            style: 'color:white!important;',
                            menu: [
        //                        {text: 'Mi Perfil', iconCls: 'x-fa fa-user', style: {}},
        //                        {text: 'Configuracion', iconCls: 'x-fa fa-cogs', handler: '', style: {}},
        //                        {text: 'Ayuda', iconCls: 'x-fa fa-question-circle', handler: '', style: {}},
                                {text: 'Salir', iconCls: 'x-fa fa-sign-out', handler: 'onSalir', style: {}}]
                        },
                        {
                            xtype: 'container',
                            width: '100%',
                            layout: {
                                type: 'hbox',
                                align: 'center',
                                pack: 'center'
                            },
                            items:[
                                {
                                    xtype: 'image',
                                    name: 'CEO',
                                    cls: 'header-right-profile-image',
                                    margin: 2,
                                    height: 16,
                                    width: 16,
                                    alt: 'CEO',
                                    src: URL_IMG_ICONOS + 'ceo_blanco.png',
                                    hidden: true,
                                    //tip: 'CEO'
                                },
                                {
                                    xtype: 'image',
                                    name: 'Empresarial',
                                    margin: 2,
                                    height: 16,
                                    width: 16,
                                    alt: 'Empresarial',
                                    src: URL_IMG_ICONOS + 'empresario_blanco.png',
                                    hidden: true,
                                    tip: 'Empresarial'
                                },
                                {
                                    xtype: 'image',
                                    name: 'Profesional',
                                    margin: 2,
                                    height: 16,
                                    width: 16,
                                    alt: 'Profesional',
                                    src: URL_IMG_ICONOS + 'profesional_blanco.png',
                                    hidden: true,
                                    tip: 'Profesional'
                                },
                                {
                                    xtype: 'image',
                                    name: 'Partner',
                                    margin: 2,
                                    height: 16,
                                    width: 16,
                                    alt: 'Partner',
                                    src: URL_IMG_ICONOS + 'partner_blanco.png',
                                    hidden: true,
                                    tip: 'Partner'
                                }
                            ]
                        }
                    ]
                }
                /*{
                    xtype: 'container',
                    width: '1%'
                },
                {
                    xtype: 'image',
                    name: 'FOTO_PERFIL',
                    cls: 'header-right-profile-image',
                    height: 35,
                    width: 35,
                    alt: 'Imagen de Usuario',
                    src: URL_IMG_SISTEMA + 'usuario.png',
                    listeners: {
                        render: function (me) {
                            me.el.on({
                                error: function (e, t, eOmpts) {
                                    me.setSrc(URL_IMG_SISTEMA + 'usuario.png');
                                }
                            });
                        }
                    }
                },
                {
                    xtype: 'button',
                    name: 'NOMBRE_USUARIO',
                    text: 'ADMIN',
                    style: 'color:white!important;',
                    menu: [
//                        {text: 'Mi Perfil', iconCls: 'x-fa fa-user', style: {}},
//                        {text: 'Configuracion', iconCls: 'x-fa fa-cogs', handler: '', style: {}},
//                        {text: 'Ayuda', iconCls: 'x-fa fa-question-circle', handler: '', style: {}},
                        {text: 'Salir', iconCls: 'x-fa fa-sign-out', handler: 'onSalir', style: {}}]
                }*/
            ]
        },
        {
            xtype: 'maincontainerwrap',
            id: 'main-view-detail-wrap',
            reference: 'mainContainerWrap',
            flex: 1,
            items: [
                {
                    xtype: 'treelist',
                    reference: 'navigationTreeList',
                    itemId: 'navigationTreeList',
                    ui: 'navigation',
                    store: 'Navegacion',
                    width: 60,
                    expandedWidth: WIDTH_NAVEGACION,
                    expanderFirst: false,
                    expanderOnly: false,
                    micro: true,
                    listeners: {
                        itemClick: 'onClickMenu',
                        selectionchange: 'onNavigationTreeSelectionChange'
                    }
                },
                {
                    xtype: 'container',
                    flex: 1,
                    reference: 'mainCardPanel',
                    cls: 'sencha-dash-right-main-container',
                    itemId: 'contentPanel',
                    layout: {
                        type: 'card',
                        anchor: '100%'
                    }
                }
            ]
        }
    ]
});
