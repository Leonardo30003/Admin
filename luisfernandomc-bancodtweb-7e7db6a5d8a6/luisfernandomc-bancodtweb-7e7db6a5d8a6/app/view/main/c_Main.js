Ext.define('bancodt.view.main.c_Main', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.main',
    requires: [
        'Ext.grid.filters.Filters'
    ],
    listen: {
        controller: {
            '#': {
                unmatchedroute: 'onRouteChange'
            }
        }
    },
    routes: {
        ':node': 'onRouteChange'
    },
    lastView: null,
    setCurrentView: function (hashTag) {
        hashTag = (hashTag || '').toLowerCase();
        var me = this, refs = me.getReferences(),
                mainCard = refs.mainCardPanel,
                mainLayout = mainCard.getLayout(),
                navigationList = refs.navigationTreeList,
                store = navigationList.getStore(),
                node = store.findNode('routeId', hashTag) ||
                store.findNode('viewType', hashTag),
                view = (node && node.get('viewType')) || 'page404',
                lastView = me.lastView,
                existingItem = mainCard.child('component[routeId=' + hashTag + ']'),
                newView;

        // Kill any previously routed window
        if (lastView && lastView.isWindow) {
            lastView.destroy();
        }

        lastView = mainLayout.getActiveItem();

        if (!existingItem) {
            newView = Ext.create({
                xtype: view,
                routeId: hashTag, // for existingItem search later
                hideMode: 'offsets'
            });
        }

        if (!newView || !newView.isWindow) {
            // !newView means we have an existing view, but if the newView isWindow
            // we don't add it to the card layout.
            if (existingItem) {
                // We don't have a newView, so activate the existing view.
                if (existingItem !== lastView) {
                    mainLayout.setActiveItem(existingItem);
                }
                newView = existingItem;
            } else {
                // newView is set (did not exist already), so add it and make it the
                // activeItem.
                Ext.suspendLayouts();
                mainLayout.setActiveItem(mainCard.add(newView));
                Ext.resumeLayouts(true);
            }
        }

        navigationList.setSelection(node);

        if (newView.isFocusable(true)) {
            newView.focus();
        }
        me.lastView = newView;
    },
    onClickMenu: function (tree, node) {
        if (node.item.getId() === 'ext-treelistitem-1') {
            this.onToggleNavigationSize();
        }
    },
    onNavigationTreeSelectionChange: function (tree, node) {
        var to = node && (node.get('routeId') || node.get('viewType'));
        if (to) {
            this.redirectTo(to);
        }
    },
    onToggleNavigationSize: function () {
        var me = this,
                refs = me.getReferences(),
                navigationList = refs.navigationTreeList,
                wrapContainer = refs.mainContainerWrap,
                collapsing = !navigationList.getMicro(),
                new_width = collapsing ? 64 : WIDTH_NAVEGACION;

        if (Ext.isIE9m || !Ext.os.is.Desktop) {
            Ext.suspendLayouts();

            refs.senchaLogo.setWidth(new_width);

            navigationList.setWidth(new_width);
            navigationList.setMicro(collapsing);

            Ext.resumeLayouts(); // do not flush the layout here...

            // No animation for IE9 or lower...
            wrapContainer.layout.animatePolicy = wrapContainer.layout.animate = null;
            wrapContainer.updateLayout();  // ... since this will flush them
        } else {
            if (!collapsing) {
                // If we are leaving micro mode (expanding), we do that first so that the
                // text of the items in the navlist will be revealed by the animation.
                navigationList.setMicro(false);
            }

            // Start this layout first since it does not require a layout
            refs.senchaLogo.animate({dynamic: true, to: {width: new_width}});

            // Directly adjust the width config and then run the main wrap container layout
            // as the root layout (it and its chidren). This will cause the adjusted size to
            // be flushed to the element and animate to that new size.
            navigationList.width = new_width;
            wrapContainer.updateLayout({isRoot: true});
            navigationList.el.addCls('nav-tree-animating');

            // We need to switch to micro mode on the navlist *after* the animation (this
            // allows the "sweep" to leave the item text in place until it is no longer
            // visible.
            if (collapsing) {
                navigationList.on({
                    afterlayoutanimation: function () {
                        navigationList.setMicro(true);
                        navigationList.el.removeCls('nav-tree-animating');
                    },
                    single: true
                });
            }
        }
    },
    setDataUsuario: function () {
        asignarDatosMain();
    },
    onMainViewRender: function () {
//        setTimeout(function () {
//            if (!window.location.hash) {
//                this.redirectTo(MODULOS[1].viewType);
//            }
//        }, 2000)
        if (!window.location.hash) {
            if (MODULOS[1].viewType)
                this.redirectTo(MODULOS[1].viewType);
            else if (MODULOS[1].children.length > 0)
                this.redirectTo(MODULOS[1].children[0].viewType);
            else {
                this.redirectTo('404');
            }
        }
    },
    onRouteChange: function (id) {
        this.setCurrentView(id);
    },
    onSearchRouteChange: function () {
        this.setCurrentView('searchresults');
    },
    onSwitchToModern: function () {
        Ext.Msg.confirm('Switch to Modern', 'Are you sure you want to switch toolkits?',
                this.onSwitchToModernConfirmed, this);
    },
    onSwitchToModernConfirmed: function (choice) {
        if (choice === 'yes') {
            var s = location.search;

            // Strip "?classic" or "&classic" with optionally more "&foo" tokens
            // following and ensure we don't start with "?".
            s = s.replace(/(^\?|&)classic($|&)/, '').replace(/^\?/, '');

            // Add "?modern&" before the remaining tokens and strip & if there are
            // none.
            location.search = ('?modern&' + s).replace(/&$/, '');
        }
    },
    onEmailRouteChange: function () {
        this.setCurrentView('email');
    },
    onSalir: function () {
        alertaSalir();
    },
    onConfiguraciones: function (btn) {
        var ventana_configuraciones = Ext.create('Ext.window.Window', {
            height: 200,
            width: 400,
            title: 'Configuraciones',
            iconCls: 'x-fa fa-cogs',
            closable: true,
            layout: 'fit',
            modal: true,
            listeners: {
                afterrender: function (vtn) {
                    var recordFecha = vtn.down('[name=cmbxFecha]').getStore().findRecord('id', vtn.down('[name=cmbxFecha]').getValue());
                    var recordHora = vtn.down('[name=cmbxHora]').getStore().findRecord('id', vtn.down('[name=cmbxHora]').getValue());
                    vtn.down('[name=ejemploFecha]').setValue(moment().format(recordFecha.get('format') + ' ' + recordHora.get('format')));
                }
            },
            items: [
                {
                    xtype: 'form',
                    name: 'form_cofiguraciones',
                    ui: 'light',
                    cls: 'quick-graph-panel shadow panelFormulario',
                    defaults: {
                        width: '100%',
                        allowBlank: false,
                        minLengthText: MINIMUMMESSAGUEREQUERID,
                        maxLengthText: MAXIMUMMESSAGUEREQURID,
                        afterLabelTextTpl: INFOMESSAGEREQUERID,
                        allowOnlyWhitespace: false,
                        blankText: INFOMESSAGEBLANKTEXT,
                    },
                    items: [
                        {
                            xtype: 'combobox',
                            fieldLabel: 'Unidad de distancia',
                            labelWidth: 125,
                            name: 'cmbxDistancia',
                            value: comprobarCookie("UNIDAD_DISTANCIA") ? getCookie("UNIDAD_DISTANCIA") : 0,
                            editable: false,
                            displayField: 'text',
                            valueField: 'id',
                            queryMode: 'local',
                            store: Ext.create('bancodt.store.stores.s_Formatos_Distancia')
                        },
                        {
                            xtype: 'combobox',
                            fieldLabel: 'Formato de fecha',
                            labelWidth: 125,
                            name: 'cmbxFecha',
                            value: comprobarCookie("FORMATO_FECHA") ? getCookie("FORMATO_FECHA") : 0,
                            editable: false,
                            displayField: 'text',
                            valueField: 'id',
                            queryMode: 'local',
                            store: Ext.create('bancodt.store.stores.s_Formatos_Fecha'),
                            listeners: {
                                change: function change(cmbx, newValue, oldValue, eOpts) {
                                    var recordHora = ventana_configuraciones.down('[name=cmbxHora]').getStore().findRecord('id', ventana_configuraciones.down('[name=cmbxHora]').getValue());
                                    var recordFecha = cmbx.getStore().findRecord('id', newValue);
                                    ventana_configuraciones.down('[name=ejemploFecha]').setValue(moment().format(recordFecha.get('format') + ' ' + recordHora.get('format')));
                                }
                            }
                        },
                        {
                            xtype: 'combobox',
                            fieldLabel: 'Formato hora',
                            labelWidth: 125,
                            name: 'cmbxHora',
                            value: comprobarCookie("FORMATO_HORA") ? getCookie("FORMATO_HORA") : 0,
                            editable: false,
                            displayField: 'text',
                            valueField: 'id',
                            queryMode: 'local',
                            store: Ext.create('bancodt.store.stores.s_Formatos_Hora'),
                            listeners: {
                                change: function change(cmbx, newValue, oldValue, eOpts) {
                                    var recordFecha = ventana_configuraciones.down('[name=cmbxFecha]').getStore().findRecord('id', ventana_configuraciones.down('[name=cmbxFecha]').getValue());
                                    var recordHora = cmbx.getStore().findRecord('id', newValue);
                                    ventana_configuraciones.down('[name=ejemploFecha]').setValue(moment().format(recordFecha.get('format') + ' ' + recordHora.get('format')));
                                }
                            }
                        },
                        {
                            xtype: 'textfield',
                            fieldLabel: 'Vista previa',
                            name: 'ejemploFecha',
                            labelWidth: 125,
                            readOnly: true
                        }
                    ]
                }
            ],
            buttons: ['->',
                {
                    xtype: 'button',
                    iconCls: 'fa fa-times-circle',
                    width: '15%',
                    iconAlign: 'right',
                    text: 'Cerrar',
                    tooltip: 'Cerrar',
                    handler: function () {
                        ventana_configuraciones.close();
                    }
                },
                {
                    xtype: 'button',
                    iconCls: 'x-fa fa-share-square-o',
                    iconAlign: 'right',
                    text: 'Aceptar',
                    tooltip: 'Aceptar',
                    handler: function () {
                        var form = ventana_configuraciones.down('[name=form_cofiguraciones]').getForm();
                        if (form.isValid()) {
                            var values = form.getValues();
                            createCookie("UNIDAD_DISTANCIA", values.cmbxDistancia, 1000);
                            createCookie("FORMATO_FECHA", values.cmbxFecha, 1000);
                            createCookie("FORMATO_HORA", values.cmbxHora, 1000);
                            notificaciones("Datos guardados correctamente", 1);
                            addConfiguraciones();
                            ventana_configuraciones.close();
                        } else {
                            var fields = form.getFields();
                            fields.each(function (field) {
                                console.log(field);
                                if (!field.isValid()) {
                                    switch (field.xtype) {
                                        case 'datefield':
                                            notificaciones('EL CAMPO DE HORA ES INVÁLIDO.', 2);
                                            break;
                                        case 'timefield':
                                            notificaciones('EL CAMPO DE FECHA ES INVÁLIDO.', 2);
                                            break;
                                    }
                                }
                            });
                        }
                    }
                }
            ]}).show();
    }
});
