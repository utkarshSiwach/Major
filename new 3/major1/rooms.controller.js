sap.ui.controller("major1.rooms", {

/**
* Called when a controller is instantiated and its View controls (if available) are already created.
* Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
* @memberOf major1.rooms
*/
	onInit: function() {
		$.ajax({
			url:"./major1/getRooms.php",
			type:"POST",
			success: function(data) {
				var dataJSON = JSON.parse(data);
				var oTable = sap.ui.getCore().byId("table1");
				oTable.getModel().setData({modelData:dataJSON});
			}
		});
	},
	
	table1Option: function(oEvent) {
		var oButton = oEvent.getSource();
		//var rowNum = $("#"+oButton.getId()).parent().parent().parent().attr('id');
		var rowNum = oEvent.getParameter('id');		
	},

/**
* Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
* (NOT before the first rendering! onInit() is used for that one!).
* @memberOf major1.rooms
*/
//	onBeforeRendering: function() {
//
//	},

/**
* Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
* This hook is the same one that SAPUI5 controls get after being rendered.
* @memberOf major1.rooms
*/
//	onAfterRendering: function() {
//
//	},

/**
* Called when the Controller is destroyed. Use this one to free resources and finalize activities.
* @memberOf major1.rooms
*/
//	onExit: function() {
//
//	}

});