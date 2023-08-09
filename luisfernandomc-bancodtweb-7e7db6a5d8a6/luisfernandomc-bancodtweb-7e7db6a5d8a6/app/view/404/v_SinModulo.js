Ext.define('bancodt.view.404.v_SinModulo', {
    extend: 'Ext.panel.Panel',
    xtype: 'page404',
    requires: [
        'Ext.container.Container',
        'Ext.form.Label',
        'Ext.layout.container.VBox',
        'Ext.toolbar.Spacer'
    ],
    items: [
        {
            xtype: 'container',
            width: '100%',
            layout: {
                type: 'vbox',
                align: 'center',
                pack: 'center'
            },
            items: [
                {
                    xtype: 'label',
                    style: 'font-size:80px;line-height:150px',
                    text: '404 MODULO NO EXISTE'
                },
                {
                    xtype: 'tbspacer',
                    flex: 1
                },
                {
                    xtype: 'label',
                    style: 'line-height:24px;text-align:center;font-size:18px',
                    html: '<p>Ho no usted está ingresando a una funcionalidad del sistema que aún no existe<br>por favor seleccione una opción del menú y continúe con su labor normal.</p>'
                },
                {
                    xtype: 'tbspacer',
                    flex: 1
                }
            ]
        }
    ]
});
