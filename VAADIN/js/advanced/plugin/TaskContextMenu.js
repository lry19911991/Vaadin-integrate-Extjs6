//extended context menu, color picker added
Ext.define('Gnt.examples.advanced.plugin.TaskContextMenu', {
    extend          : 'Gnt.plugin.TaskContextMenu',
    mixins          : ['Gnt.mixin.Localizable'],
    alias           : ['plugin.advanced_taskcontextmenu','widget.advanced_taskcontextmenu'],
	config : {
		customContextMenu : undefined
	},
  
    
	createMenuItems : function() {
		var that = this;
		var items = this.callParent(arguments);
		var customItem;
		var colorItem = [        {
            text         : this.L('changeTaskColor'),
            requiresTask : true,
            itemId       : 'changeTaskColor',
            isColorMenu  : true,
            isValidAction : function (task) {

                var readOnly = this.isReadOnly(task),
                    m = this.down('#changeTaskColor').menu;

                m.setDisabled(readOnly);

                return !readOnly;
            },
            menu         : {
                showSeparator : false,
                items         : [
                    {
                        xtype         : 'colorpicker',
                        allowReselect : true,
                        listeners     : {
                            select : function (cp, color) {
                                this.rec.set('Color', color);
                                this.hide();
                            },
                            scope  : this
                        }
                    }
                ]
            }
        } ];
		var contextMenu = that.getCustomContextMenu();
		if (contextMenu&&contextMenu.length > 0) {
			for ( var index in contextMenu) {
				colorItem = colorItem.concat(eval('('
						+ contextMenu[index] + ')'));
			}
		}

		customItem = colorItem;

		return customItem.concat(items);
	},
	onMyHandler : function() {
		// the task on which the right click have occured
		var task = this.rec;
		var str = JSON.stringify(task['data']);
		eval("GANNT_TASK_CONTEXT_MENU_FUNCTION('"
				+ arguments[0]['actionType'] + "'," + str + ")");

	},
	modifyTask : function(value) {
		var taskObj = eval('(' + value + ')');

		var task = this.rec;

		for ( var index in taskObj) {
			if (task.get(index) != taskObj[index])
				task.set(index, taskObj[index]);
		}
	},
	insertTask : function(value) {
		var taskObj = eval('(' + value + ')');

		this.grid.taskStore.getRootNode().appendChild(taskObj);
		this.grid.getSchedulingView().scrollEventIntoView(taskObj);

	},

    configureMenuItems : function () {

        this.callParent(arguments);

        var rec = this.rec;

        // there might be no record when clicked on the empty space
        if (!rec) return;

        var colorMenu   = this.query('[isColorMenu]')[0].menu.items.first(),
            val         = colorMenu.getValue(),
            recVal      = rec.get('Color');

        if (colorMenu.el) {
            if (val && recVal && recVal !== val) {

                colorMenu.el.down('a.color-' + val).removeCls(colorMenu.selectedCls);

                if (colorMenu.el.down('a.color-' + recVal)) {
                    colorMenu.select(recVal.toUpperCase());
                }
            } else if (val && !recVal) {
                colorMenu.el.down('a.color-' + val).removeCls(colorMenu.selectedCls);
            }
        }
    }
});
