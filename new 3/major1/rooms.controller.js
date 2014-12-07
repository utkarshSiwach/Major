sap.ui.controller("major1.rooms", abc={

/**
* Called when a controller is instantiated and its View controls (if available) are already created.
* Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
* @memberOf major1.rooms
*/
	onInit: function() {
		// fetch rooms data
		$.ajax({
			url:"./major1/getRooms.php",
			type:"POST",
			data:{toDo:"displayRooms"},
			success: function(data) {
				if(data === "login first") { alert(data);}
				else {
					var dataJSON = JSON.parse(data);
					var oTable = sap.ui.getCore().byId("table1");
					oTable.getModel().setData({modelData:dataJSON});
				}
			}
		});
	},
	
	// manage the clicks of left side menu
	manageClick: function(oEvent) {
		var toDo = oEvent.getSource().getText();
		var layout = sap.ui.getCore().byId("BorderLayout1");
		if(toDo === "View Rooms") {
			var controls = layout.getContent("center");
			if(controls.length!=0 && controls[0].sId === "roomsTable") {
				layout.removeAllContent("center");
			}
			else {
				layout.removeAllContent("center");
				layout.addContent(sap.ui.commons.layout.BorderLayoutAreaTypes.center,				
					sap.ui.getCore().byId("roomsTable"));
				sap.ui.getCore().byId("editRoomsBtn").setEnabled(true);
				sap.ui.getCore().byId("deleteRoomsBtn").setEnabled(true);
			}			
		}
		else if(toDo ==="New Room") {
			var controls = layout.getContent("center");
			if(controls.length!=0 && controls[0].sId === "newRoomForm") {
				layout.removeAllContent("center");
			}
			else {
				layout.removeAllContent("center");
				layout.addContent(sap.ui.commons.layout.BorderLayoutAreaTypes.center,				
					sap.ui.getCore().byId("newRoomForm"));
			}
		}
	},
	
	// create the edit room popup and populate it with
	// the selected row data, is called when "Edit" button is pressed
	// in the view rooms section
	// If no row is selected, issue alert to do so
	editRoom: function(oEvent) {
		var row = sap.ui.getCore().byId("table1").getSelectedIndices();
		if(row.length == 0) {
			alert("Please select a row to edit it");
		}
		else {
			var layout = sap.ui.getCore().byId("BorderLayout1");
			sap.ui.getCore().byId("editRoomsBtn").setEnabled(false);
			sap.ui.getCore().byId("deleteRoomsBtn").setEnabled(false);
			var arr=sap.ui.getCore().byId("table1").getModel().getData();
			var formElems = sap.ui.getCore().byId("formC1").getFormElements();
			
			var fields = formElems[0].getFields();
			fields[0].setValue(arr.modelData[row[0]].roomName);
			fields = formElems[1].getFields();
			fields[0].setValue(arr.modelData[row[0]].type);
			fields = formElems[2].getFields();
			fields[0].setValue(arr.modelData[row[0]].capacity);
			fields = formElems[3].getFields();
			fields[0].setValue(arr.modelData[row[0]].location);
			
			layout.addContent(sap.ui.commons.layout.BorderLayoutAreaTypes.center,
				sap.ui.getCore().byId("editRoomsForm"));
		}
	},
	cancelEditRoom: function() {
		var layout = sap.ui.getCore().byId("BorderLayout1");
		sap.ui.getCore().byId("editRoomsBtn").setEnabled(true);
		sap.ui.getCore().byId("deleteRoomsBtn").setEnabled(true);
		layout.removeContent("center",1);	// remove the edit rooms popup
	},
	
	// validates room form data
	validateRoomData: function(formId) {
	
		var formElems = sap.ui.getCore().byId(formId).getFormElements();			
			
		var fields = formElems[0].getFields();
		var roomName = fields[0].getValue();
		
		fields = formElems[1].getFields();
		var type = fields[0].getValue();
		
		fields = formElems[2].getFields();
		var capacity = fields[0].getValue();
		
		fields = formElems[3].getFields();
		var location = fields[0].getValue();
		
		if ( roomName == "" || type == "" || capacity == "" || location == "") {
			alert("You cannot leave information blank");
			return null;
		}
		if (type.length > 50){
			alert("Type cannot be greater than 50 characters.");
			return null;
		}	
		if (type!='lecture' && type!= 'lab' && type!= 'tut') {
			alert("Room must be lecture, lab or tut");
			return null;
		}
		if ( capacity <=0 || capacity >= 5 ) {
			alert("Capacity must be between 1-5 batches.");
			return null;
		}
		return [roomName,type,capacity,location];
	},
	
	// is called when updated data needs to be validated and sent
	// to the server
	updateEditRoom: function() {
		var data;
		if(!(data=abc.validateRoomData("formC1"))) {
			return 0;
		}
		var arr=sap.ui.getCore().byId("table1").getModel().getData();
		var row = sap.ui.getCore().byId("table1").getSelectedIndices();
		var id = arr.modelData[row].id;
		
		$.ajax({
			url:"./major1/getRooms.php",
			type:"POST",
			data:{
				toDo:"updateRoom",
				rid:id,
				name:data[0],
				type:data[1],
				cap:data[2],
				loc:data[3]
			},
			success: function(data2) {
				if(data2 === "login first") { alert(data);}
				else {
					arr.modelData[row].id = id;
					arr.modelData[row].roomName = data[0];
					arr.modelData[row].type = data[1];
					arr.modelData[row].capacity = data[2];
					arr.modelData[row].location = data[3];
					sap.ui.getCore().byId("table1").getModel().setData({modelData:arr.modelData});
				}
			},
			failure: function() {
				alert("some error in updation");
			},
			complete: function() {
				abc.cancelEditRoom();
			}
		});
	},
	
	deleteRoom: function(oEvent){
		var arr=sap.ui.getCore().byId("table1").getModel().getData();
		var row = sap.ui.getCore().byId("table1").getSelectedIndices();
		
		if(row.length == 0) {
			alert("Please select a row to delete it");
			return 0;
		}
		
		var id = arr.modelData[row].id;
		$.ajax({
			url:"./major1/getRooms.php",
			type:"POST",
			data:{toDo:"deleteRoom",roomId:id},
			success: function(data) {
				if(data === "login first") { alert(data);}
				else {
					arr.modelData.splice(row,1);
					sap.ui.getCore().byId("table1").getModel().setData({modelData:arr.modelData});
					sap.ui.getCore().byId("table1").setSelectedIndex();
				}
			},
			failure: function() {
				alert("some error in deletion");
			}
		});		
	},

	addNewRoom: function(oEvent) {
		var data;
		if(!(data=abc.validateRoomData("formC1-2"))) {
			return 0;
		}
		$.ajax({
			url:"./major1/getRooms.php",
			type:"POST",
			data:{
				toDo:"addRoom",
				name:data[0],
				type:data[1],
				cap:data[2],
				loc:data[3]
			},
			success: function(data) {
				if(data === "login first") { alert(data);}
				else {
					var item = JSON.parse(data);
					var arr=sap.ui.getCore().byId("table1").getModel().getData();
					arr.modelData.push(item);
					sap.ui.getCore().byId("table1").getModel().setData({modelData:arr.modelData});
				}
			},
			failure: function() {
				alert("some error in addition");
			},
			complete: function() {
				// clear the form
				var formElems = sap.ui.getCore().byId("formC1-2").getFormElements();			
				var fields = formElems[0].getFields();
				fields[0].setValue("");
		
				fields = formElems[1].getFields();
				fields[0].setValue("");
		
				fields = formElems[2].getFields();
				fields[0].setValue("");
		
				fields = formElems[3].getFields();
				fields[0].setValue("");
			}
		});
		
	},
	cancelNewRoom: function(oEvent) {
		sap.ui.getCore().byId("BorderLayout1").removeAllContent("center");
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