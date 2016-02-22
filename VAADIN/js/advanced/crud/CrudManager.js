Ext.define('Gnt.examples.advanced.crud.CrudManager', {
    extend          : 'Gnt.data.CrudManager',
    alias           : 'crudmanager.advanced-crudmanager',
    autoLoad        : true,
    config : {
		customContextMenu : undefined
	},
    transport       : {
		load : {
			url :  'http://localhost:8080/rest/crud/load',
			method : 'POST',
			params : {
				taskURL : 'http://localhost:8080/rest/task/gantt/1/all/'
			}
		},
		sync : {
			url : 'http://localhost:8080/rest/crud/sync',
			method : 'POST',
			params : {
				taskURL : 'http://localhost:8080/rest/task/gantt/1/all/'
			}
		}
    }
});
