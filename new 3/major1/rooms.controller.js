sap.ui.controller("major1.rooms", abc={

	updateSubjectPrevType:"",	// used to hold the previous type of subject before update

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
		
		// fetch subject data
		$.ajax({
			url:"./major1/getRooms.php",
			type:"POST",
			data:{toDo:"displaySubjects"},
			success: function(data) {
				if(data === "login first") { alert(data);}
				else {
					var dataJSON = JSON.parse(data);
					var oTable = sap.ui.getCore().byId("table2");
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
		else if(toDo === "View Subjects") {
			var controls = layout.getContent("center");
			if(controls.length!=0 && controls[0].sId === "subjectTable") {
				layout.removeAllContent("center");
			}
			else {
				layout.removeAllContent("center");
				layout.addContent(sap.ui.commons.layout.BorderLayoutAreaTypes.center,				
					sap.ui.getCore().byId("subjectTable"));
				sap.ui.getCore().byId("editSubBtn").setEnabled(true);
				sap.ui.getCore().byId("deleteSubBtn").setEnabled(true);
			}			
		}
		else if(toDo ==="New Subject") {
			var controls = layout.getContent("center");
			if(controls.length!=0 && controls[0].sId === "newSubForm") {
				layout.removeAllContent("center");
			}
			else {
				layout.removeAllContent("center");
				layout.addContent(sap.ui.commons.layout.BorderLayoutAreaTypes.center,				
					sap.ui.getCore().byId("newSubForm"));
			}
		}
	},
	
	// create the edit room popup and populate it with
	// the selected row data, is called when "Edit" button is pressed
	// in the view rooms section
	// If no row is selected, issue alert to do so
	editRoom: function(oEvent) {
		var arr=sap.ui.getCore().byId("table1").getModel().getData();
		var rows = sap.ui.getCore().byId("table1").getRows();
		var rowNum = sap.ui.getCore().byId("table1").getSelectedIndices();
				
		if(rowNum.length == 0) {
			alert("Please select a row to delete it");
			return 0;
		}
		var cells = rows[rowNum%10].getCells();
		var cell = cells[0];
		var i = parseInt(cell.getBindingContext().sPath.substring(11));
		
			var layout = sap.ui.getCore().byId("BorderLayout1");
			sap.ui.getCore().byId("editRoomsBtn").setEnabled(false);
			sap.ui.getCore().byId("deleteRoomsBtn").setEnabled(false);
			var arr=sap.ui.getCore().byId("table1").getModel().getData();
			var formElems = sap.ui.getCore().byId("formC1").getFormElements();
			
			var fields = formElems[0].getFields();
			fields[0].setValue(arr.modelData[i].roomName);
			fields = formElems[1].getFields();
			fields[0].setValue(arr.modelData[i].type);
			fields = formElems[2].getFields();
			fields[0].setValue(arr.modelData[i].capacity);
			fields = formElems[3].getFields();
			fields[0].setValue(arr.modelData[i].location);
			
			layout.addContent(sap.ui.commons.layout.BorderLayoutAreaTypes.center,
				sap.ui.getCore().byId("editRoomsForm"));
		
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
		var rows = sap.ui.getCore().byId("table1").getRows();
		var rowNum = sap.ui.getCore().byId("table1").getSelectedIndices();
		var cells = rows[rowNum%10].getCells();
		var cell = cells[0];
		var i = parseInt(cell.getBindingContext().sPath.substring(11));
		var id = arr.modelData[i].id;
		
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
					arr.modelData[i].id = id;
					arr.modelData[i].roomName = data[0];
					arr.modelData[i].type = data[1];
					arr.modelData[i].capacity = data[2];
					arr.modelData[i].location = data[3];
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
		var rows = sap.ui.getCore().byId("table1").getRows();
		var rowNum = sap.ui.getCore().byId("table1").getSelectedIndices();
				
		if(rowNum.length == 0) {
			alert("Please select a row to delete it");
			return 0;
		}		
		var cells = rows[rowNum%10].getCells();
		var cell = cells[0];
		var i = parseInt(cell.getBindingContext().sPath.substring(11));
		var id = arr.modelData[i].id;
		$.ajax({
			url:"./major1/getRooms.php",
			type:"POST",
			data:{toDo:"deleteRoom",roomId:id},
			success: function(data) {
				if(data === "login first") { alert(data);}
				else {
					arr.modelData.splice(i,1);
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
	
	////////////////  subject functions /////////////////
	
	editSubject: function(oEvent) {
		var arr=sap.ui.getCore().byId("table2").getModel().getData();
		var rows = sap.ui.getCore().byId("table2").getRows();
		var rowNum = sap.ui.getCore().byId("table2").getSelectedIndices();
				
		if(rowNum.length == 0) {
			alert("Please select a row to delete it");
			return 0;
		}
		var cells = rows[rowNum%10].getCells();
		var cell = cells[0];
		var i = parseInt(cell.getBindingContext().sPath.substring(11));
		
			var layout = sap.ui.getCore().byId("BorderLayout1");
			sap.ui.getCore().byId("editSubBtn").setEnabled(false);
			sap.ui.getCore().byId("deleteSubBtn").setEnabled(false);			
			var formElems = sap.ui.getCore().byId("formC1Sub").getFormElements();
			
			var fields = formElems[0].getFields();
			fields[0].setValue(arr.modelData[i].subCode);
			fields = formElems[1].getFields();
			fields[0].setValue(arr.modelData[i].type);			
			fields = formElems[2].getFields();
			fields[0].setValue(arr.modelData[i].name);
			fields = formElems[3].getFields();
			fields[0].setValue(arr.modelData[i].semester);
			fields = formElems[4].getFields();
			fields[0].setValue(arr.modelData[i].branch);
			fields = formElems[5].getFields();
			fields[0].setValue(arr.modelData[i].hours);
			
			abc.updateSubjectPrevType = arr.modelData[i].type;
			
			layout.addContent(sap.ui.commons.layout.BorderLayoutAreaTypes.center,
				sap.ui.getCore().byId("editSubForm"));
		
	},
	
	cancelEditSubject: function() {
		var layout = sap.ui.getCore().byId("BorderLayout1");
		sap.ui.getCore().byId("editSubBtn").setEnabled(true);
		sap.ui.getCore().byId("deleteSubBtn").setEnabled(true);
		layout.removeContent("center",1);	// remove the edit subject popup
	},
	
	// validates subject form data
	validateSubjectData: function(formId) {
	
		var formElems = sap.ui.getCore().byId(formId).getFormElements();			
			
		var fields = formElems[0].getFields();
		var subCode = fields[0].getValue();
		
		fields = formElems[1].getFields();
		var type = fields[0].getValue();
		
		fields = formElems[2].getFields();
		var name = fields[0].getValue();
		
		fields = formElems[3].getFields();
		var semester = fields[0].getValue();
		
		fields = formElems[4].getFields();
		var branch = fields[0].getValue();
		
		fields = formElems[5].getFields();
		var hours = fields[0].getValue();
		
		if ( subCode == "" || type == "" || name == "" || semester == ""
			|| branch == "" || hours == "") {
			alert("You cannot leave information blank");
			return null;
		}
		if (type.length > 50){
			alert("Type cannot be greater than 50 characters.");
			return null;
		}
		if ( hours < 1 || hours > 10 ) {
			alert("Hours must be between 1-10 batches.");
			return null;
		}
		return [subCode,type,name,semester,branch,hours];
	},
	
	// is called when updated data needs to be validated and sent
	// to the server
	updateEditSubject: function() {
		var data;
		if(!(data=abc.validateSubjectData("formC1Sub"))) {
			return 0;
		}
		var arr=sap.ui.getCore().byId("table2").getModel().getData();
		var rows = sap.ui.getCore().byId("table2").getRows();
		var rowNum = sap.ui.getCore().byId("table2").getSelectedIndices();
		var cells = rows[rowNum%10].getCells();
		var cell = cells[0];
		var i = parseInt(cell.getBindingContext().sPath.substring(11));
		var id = arr.modelData[i].id;
		var prevType = abc.updateSubjectPrevType;
		$.ajax({
			url:"./major1/getRooms.php",
			type:"POST",
			data:{
				toDo:"updateSubject",
				sid:id,
				subCode:data[0],				
				type:data[1],
				prevType: prevType,
				name:data[2],
				sem:data[3],
				branch:data[4],
				hours:data[5]
			},
			success: function(data2) {
				if(data2 === "login first") { alert(data);}
				else {				
					arr.modelData[i].id = id;
					arr.modelData[i].subCode = data[0];
					arr.modelData[i].type = data[1];
					arr.modelData[i].name = data[2];
					arr.modelData[i].sem = data[3];
					arr.modelData[i].branch = data[4];
					arr.modelData[i].hours = data[5];
					sap.ui.getCore().byId("table2").getModel().setData({modelData:arr.modelData});
					
				}
			},
			failure: function() {
				alert("some error in updation");
			},
			complete: function() {
				abc.cancelEditSubject();
			}
		});
	},
	
	deleteSubject: function(oEvent){		
		var arr=sap.ui.getCore().byId("table2").getModel().getData();
		var rows = sap.ui.getCore().byId("table2").getRows();
		var rowNum = sap.ui.getCore().byId("table2").getSelectedIndices();
				
		if(rowNum.length == 0) {
			alert("Please select a row to delete it");
			return 0;
		}		
		var cells = rows[rowNum%10].getCells();
		var cell = cells[0];
		var i = parseInt(cell.getBindingContext().sPath.substring(11));
		var id = arr.modelData[i].id;
		$.ajax({
			url:"./major1/getRooms.php",
			type:"POST",
			data:{toDo:"deleteSubject",subId:id},
			success: function(data) {
				if(data === "login first") { alert(data);}
				else {
					arr.modelData.splice(i,1);
					sap.ui.getCore().byId("table2").getModel().setData({modelData:arr.modelData});
					sap.ui.getCore().byId("table2").setSelectedIndex();
				}
			},
			failure: function() {
				alert("some error in deletion");
			}
		});		
	},

	addNewSubject: function(oEvent) {
		var data;
		if(!(data=abc.validateSubjectData("formC1Sub-2"))) {
			return 0;
		}
		$.ajax({
			url:"./major1/getRooms.php",
			type:"POST",
			data:{
				toDo:"addSubject",
				subCode:data[0],				
				type:data[1],
				name:data[2],
				sem:data[3],
				branch:data[4],
				hours:data[5]
			},
			success: function(data2) {
				if(data2 === "login first") { alert(data);}
				else {
					var item = {
						id:data2,
						subCode:data[0],				
						type:data[1],
						name:data[2],
						semester:data[3],
						branch:data[4],
						hours:data[5]
					};
					var arr=sap.ui.getCore().byId("table2").getModel().getData();
					arr.modelData.push(item);
					sap.ui.getCore().byId("table2").getModel().setData({modelData:arr.modelData});
				}
			},
			failure: function() {
				alert("some error in addition");
			},
			complete: function() {
				// clear the form
				var formElems = sap.ui.getCore().byId("formC1Sub-2").getFormElements();			
				var fields = formElems[0].getFields();
				fields[0].setValue("");
		
				fields = formElems[1].getFields();
				fields[0].setValue("");
		
				fields = formElems[2].getFields();
				fields[0].setValue("");
		
				fields = formElems[3].getFields();
				fields[0].setValue("");
				
				fields = formElems[4].getFields();
				fields[0].setValue("");
		
				fields = formElems[5].getFields();
				fields[0].setValue("");
			}
		});
		
	},
	cancelNewSubject: function(oEvent) {
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