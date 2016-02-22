window.com_polelink_pike_extend_component_gantt_GanttChart = function() {

	
	var that = this;
	var startDate;
	var endDate;
	var taskURL;
	var toolBarFunctionName;
	var id;
	this.customMenu = new Array();
	this.currentLocale='en';
//	var customContextMenu;
	
	this.getGanttState = function() {
		startDate = that.getState().startDate;
		endDate = that.getState().endDate;
		taskURL = that.getState().taskURL;
		toolBarFunctionName = that.getState().toolBarFunctionName;
		id=that.getElement().id;
		document.getElementById(id).innerHTML="";
		

	};
	
	var winUrl = window.location;
	var location = (winUrl + '').split('/');
	var contextName = location[3];
	var basePath = location[0] + '//' + location[2] + '/';
	var restPath = basePath + 'rest/crud';
	
	
	
	this.defineCrudManager = function() {

	Ext.define('Gnt.examples.advanced.crud.CrudManager', {
	    extend          : 'Gnt.data.CrudManager',
	    alias           : 'crudmanager.advanced-crudmanager',
	    autoLoad        : true,
	    
	    
	    transport       : {scope : this,
			load : {
				url :  restPath + '/load',
				method : 'POST',
				scope : this,
				params : {
					taskURL : taskURL
				}
			},
			sync : {
				url : restPath + '/sync',
				method : 'POST',
				scope : this,
				params : {
					taskURL : taskURL
				}
			}
	    }
	});
	}
	

	
	this.buildGanttChart = function() {
		var ganttCustomMenu=that.customMenu;
		var ganttCurrentLocale=that.currentLocale;
		Ext.application({
		    appFolder           : 'VAADIN/js/advanced',
		    name                : 'Gnt.examples.advanced',
		   // extend              : 'Gnt.examples.advanced.Application',
		    autoCreateViewport  : false,
		    // force to get startDate based on the first task start
		    startDate           : null,
		    mixins          : ['Gnt.mixin.Localizable'],
		    requires        : [
		        'Sch.app.CrudManagerDomain',
		        'Gnt.examples.advanced.locale.En',
		        'Gnt.examples.advanced.crud.CrudManager',
		        'Sch.data.undoredo.Manager',
		        'Ext.window.MessageBox'
		    ],
		  paths           : {
	      'Gnt'   : 'VAADIN/js/Gnt',
	      'Sch'   : 'VAADIN/js/Sch'
	  },

		    stores          : [
		                       'Locales',
		                       'Calendars',
		                       'Tasks'
		                   ],

		                   views           : [
		                       'MainViewport'
		                   ],

		                   routes          : {
		                       ':lc'   : {
		                           before  : 'onBeforeLocaleEstablished',
		                           action  : 'onLocaleEstablished'
		                       }
		                   },

//		                   defaultToken    : 'en',

		                   listen          : {
		                       // Right now we just listen to locale-change on controllers domain, any controller fired that event might
		                       // initiate a locale change procedure
		                       controller : {
		                           '*' : {
		                               'locale-change' : 'onLocaleChange'
		                           }
		                       },

		                       crudmanager : {
		                           'advanced-crudmanager' : {
		                               'loadfail' : 'onCrudError',
		                               'syncfail' : 'onCrudError'
		                           }
		                       }
		                   },

		                   glyphFontFamily : 'FontAwesome',

		                   mainView        : null,

		                   crudManager     : null,

		                   undoManager     : null,

		                   currentLocale   : 'en',

		                   /**
		                    * Mapping for the startDate config of the gantt panel
		                    */
		                   startDate       : null,

		                   /**
		                    * Mapping for the endDate config of the gantt panel
		                    */
		                   endDate         : null,

		                   constructor : function (config) {
		                       var me = this;
                             
		                       me.crudManager = new Gnt.examples.advanced.crud.CrudManager({
		                           taskStore : new Gnt.examples.advanced.store.Tasks({
		                               calendarManager : me.getCalendarsStore()
		                           })
		                       });

		                       // Creating undo/redo manager
		                       me.undoManager = new Gnt.data.undoredo.Manager({
		                           transactionBoundary : 'timeout',
		                           stores              : [
		                               me.crudManager.getCalendarManager(),
		                               me.crudManager.getTaskStore(),
		                               me.crudManager.getResourceStore(),
		                               me.crudManager.getAssignmentStore(),
		                               me.crudManager.getDependencyStore()
		                           ]
		                       });

		                       this.callParent(arguments);
		                       this.onBeforeLocaleEstablished(ganttCurrentLocale);
		                        this.onLocaleEstablished(ganttCurrentLocale);
		                   },

		                   /**
		                    * This method will be called on CRUD manager exception and display a message box with error details.
		                    */
		                   onCrudError : function (crud, response, responseOptions) {
		                       Ext.Msg.show({
		                           title    : this.L('error'),
		                           msg      : response.message || this.L('requestError'),
		                           icon     : Ext.Msg.ERROR,
		                           buttons  : Ext.Msg.OK,
		                           minWidth : Ext.Msg.minWidth
		                       });
		                   },

		                   /**
		                    * When we've got a request to change locale we simply use redirectTo() for locale changing route handlers
		                    * fired, which in their turn know how to properly change locale.
		                    */
		                   onLocaleChange : function (lc, lcRecord) {
		                       //this.redirectTo(lc);
//		                       this.onBeforeLocaleEstablished(lc);
//		                        this.onLocaleEstablished(lc);
//		                	   this.currentLocale=lc;
		                	   that.currentLocale=lc;
		                	   that.buildGantt();
		                   },

		                   /**
		                    * This method will be executed upon location has change and upon application startup with default token in case
		                    * location hash is empty. This method is called *before* corresponding route change action handler, and it's
		                    * cappable of stopping/resument the switch action, thus we use it to load locale required script files.
		                    */
		                   onBeforeLocaleEstablished : function (lc, action) {
		                       var me          = this,
		                           lcRecord    = me.getLocalesStore().getById(lc);

		                       switch (true) {
		                           case lcRecord && !me.mainView && me.currentLocale != lc:

		                               Ext.Loader.loadScript({
		                                   // load Ext JS locale for the chosen language
		                                   url     : 'VAADIN/js/locale-' + lc + '.js',
		                                   onLoad  : function() {
		                                       var cls = lcRecord.get('cls');
		                                       // load the gantt locale for the chosen language
		                                       Ext.require('Gnt.examples.advanced.locale.' + cls, function () {
		                                           // Some of Ext JS localization wrapped with Ext.onReady(...)
		                                           // so we have to do the same to instantiate UI after Ext JS localization is applied
		                                           Ext.onReady(function() {
		                                        	   //action.resume();
		                                           });
		                                       });
		                                   }
		                               });

		                               break;

		                           case lcRecord && !me.mainView && me.currentLocale == lc:

		                              // action.resume();
		                               break;

		                           case lcRecord && me.mainView && true:

		                               // Main view is already created thus we have to execute hard reload otherwise locale related
		                               // scripts won't be properly applied.
		                               me.deactivate();
//		                               action.stop();
//		                               window.location.hash = '#' + lc;
//		                               window.location.reload(true);
		                               break;

		                           default:
		                             //  action.stop();
		                       }
		                   },

		                   /**
		                    * Since we are supporting such locale management we can't use application's autoCreateViewport option, since
		                    * we have to load all required locale JS files before any GUI creation. Loading is done in the 'before' handler,
		                    * so here in 'action' handler we are ready to create our main view.
		                    */
		                   onLocaleEstablished : function (lc) {
		                       var me      = this,
		                           crud    = me.crudManager,
		                           undo    = me.undoManager;

		                       me.currentLocale    = lc;

		                       me.mainView         = me.getMainViewportView().create({
		                           viewModel       : {
		                               type        : 'advanced-viewport',
		                               data        : {
		                                   crud                : crud,
		                                   undoManager         : undo,
		                                   taskStore           : crud.getTaskStore(),
		                                   calendarManager     : crud.getCalendarManager(),
		                                   currentLocale       : me.currentLocale,
		                                   availableLocales    : me.getLocalesStore()
		                               }
		                           },
		                           crudManager     : crud,
		                           undoManager     : undo,
		                           startDate       : me.startDate,
		                           endDate         : me.endDate,
		                           customContextMenu : ganttCustomMenu,
		                           renderTo : id
		                       });
		                   }
		});
	};
	
	this.buildGantt = function() {
		this.getGanttState();
		this.defineCrudManager();
		this.buildGanttChart();
	};
	
	//this.buildGantt();
	
	this.addCustomContextMenu = function(caption, actionType, showToolBar) {

		var str = "{ text:   '"
				+ caption
				+ "', handler     : this.onMyHandler, scope       : this, actionType : '"
				+ actionType + "',requiresTask :" + !showToolBar + "}";
		if (this.customMenu.length > 0) {
			for ( var index in this.customMenu) {

				var menuObj = eval('(' + this.customMenu[index] + ')')
				if (menuObj['text'] == caption)
					return;
			}
		}
		this.customMenu.push(str);

	};

	this.removeCustomContextMenu = function(actionType) {
		var str = "{ text:   '"
				+ caption
				+ "', handler     : this.onMyHandler, scope       : this, actionType : '"
				+ actionType + "'}";
		if (this.customMenu.length > 0) {
			for ( var index in this.customMenu) {

				var menuObj = eval('(' + this.customMenu[index] + ')')
				if (menuObj['actionType'] == actionType)
					customMenu.splice(index, 1);
			}
		}

	};

	this.modifyTask = function(value) {
		if (ganttContextMenu)
			ganttContextMenu.modifyTask(value);
	};

	this.insertTask = function(value) {
		if (ganttContextMenu)
			ganttContextMenu.insertTask(value);
	};

	// Listen for state changes
	this.onStateChange = function() {
		startDate = this.getState().startDate;
		endDate = this.getState().endDate;
		localeId = this.getState().localeId;
		extendColumns = this.getState().extendColumns;
	};

	this.buttonVisible = function(buttonName, buttonVisible) {
		var equal = (buttonVisible == 'true');
		Ext.getCmp(buttonName).setVisible(equal);
		ganttChart.getView().lockedView.refresh();
	};

	this.buttonEnable = function(buttonName, buttonEnable) {
		var equal = (buttonEnable == 'true');
		if (equal) {
			Ext.getCmp(buttonName).enable();
		} else {
			Ext.getCmp(buttonName).disable();
		}
		// ganttChart.getView().lockedView.refresh();
	}
	



}