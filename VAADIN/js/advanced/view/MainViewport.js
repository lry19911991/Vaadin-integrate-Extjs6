Ext.define("Gnt.examples.advanced.view.MainViewport", {
    extend      : 'Ext.panel.Panel',
    alias       : 'widget.advanced-viewport',

    requires    : [
        'Gnt.examples.advanced.view.MainViewportController',
        'Gnt.examples.advanced.view.MainViewportModel',
        'Gnt.examples.advanced.view.GanttSecondaryToolbar',
        'Gnt.examples.advanced.view.ControlHeader',
        // @cut-if-gantt->
        'Gnt.examples.advanced.view.Timeline',
        // <-@
        'Gnt.examples.advanced.view.Gantt'
    ],

    viewModel   : 'advanced-viewport',
    controller  : 'advanced-viewport',

        layout : 'border',
    //crudManager : Ext.create('Gnt.examples.advanced.crud.CrudManager'),
    //renderTo: 'Gantt-chart1',
    	region : 'center',// center
    	customContextMenu : undefined,
    //height : document.documentElement.clientHeight-150,
    initComponent : function () {
    	var customContextMenu=this.customContextMenu;
    	this.height=document.documentElement.clientHeight-150;
        this.items = [
            // @cut-if-gantt->
            {
                xtype       : 'advanced-timeline',
                height      : 180,
                //flex : 1,
                region      : 'north',
                taskStore   : this.crudManager.getTaskStore()
            },
            // <-@
            {
                xtype       : 'advanced-gantt',
                region      : 'center',
                reference   : 'gantt',
                //layout : 'fit',
                 //flex : 4,
                crudManager : this.crudManager,
                startDate   : this.startDate,
                endDate     : this.endDate,
                customContextMenu : customContextMenu,
                header      : Gnt.panel.Timeline ? null : { xtype : 'controlheader' },
                bbar        : {
                    xtype   : 'gantt-secondary-toolbar'
                }
            }
        ];
        
        var panel= this; 


window.onresize=function () { 
panel.setHeight(document.documentElement.clientHeight-150);      }  

//alert('initComponent');
        this.callParent(arguments);
    }
});
