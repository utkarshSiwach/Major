sap.ui.controller("major1.rooms", abc={

	updateSubjectPrevType:"",	// used to hold the previous type of subject before update
	updateSubjectPrevCode:"",	// used to hold the previous subject code of subject before update
	allBeginControls:null,		// used to hold all controls in the main begin area of the layout
	ttJSON:null,				// used to hold the generated timetable json data
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
		
		// fetch batch data
		$.ajax({		
			url:"./major1/getRooms.php",
			type:"POST",
			data:{toDo:"displayBatches"},
			success: function(data) {
				if(data === "login first") { alert(data);}
				else {
					var dataJSON = JSON.parse(data);
					var oTable = sap.ui.getCore().byId("table3");
					oTable.getModel().setData({modelData:dataJSON});
					oTable.attachEvent("rowSelectionChange",abc.batchSubjectChange);
				}
			}
		});
		
		// fetch backlog data
		$.ajax({		
			url:"./major1/getRooms.php",
			type:"POST",
			data:{toDo:"displayBacklogs"},
			success: function(data) {
				if(data === "login first") { alert(data);}
				else {
					var dataJSON = JSON.parse(data);
					var oTable = sap.ui.getCore().byId("table8");
					oTable.getModel().setData({modelData:dataJSON});
					oTable.attachEvent("rowSelectionChange",abc.backlogSubjectChange);					
				}
			}
		});
		
		// fetch teacher preferences data
		$.ajax({
			url:"./major1/getRooms.php",
			type:"POST",
			data:{toDo:"displayPrefs",id:userId},
			success: function(data) {
				if(data === "login first") { alert(data);}
				else {
					var dataJSON = JSON.parse(data);					
					var newArr = [];
					var newArr2 = [];
					
					var arr = sap.ui.getCore().byId("table2").getModel().getData().modelData;
					var flag = true;
					for(var i=0; i<arr.length;i++) {
						flag=true;
						for(var j=0;j<dataJSON.length;j++) {
							if(dataJSON[j].subId == arr[i].id) {
								arr[i].prefNum = dataJSON[j].prefNum;
								newArr.push(arr[i]);								
								flag = false;
								break;
							}
						}
						if(flag && arr[i].branch == userDept) {
							newArr2.push(arr[i]);
						}
					}
					sap.ui.getCore().byId("table2-6").getModel().setData({modelData:newArr});
					sap.ui.getCore().byId("table2-7").getModel().setData({modelData:newArr2});
				}
			}
		});
	},
	logOff:function(){
		$.ajax({
			url:"./major1/getRooms.php",
			type:"POST",
			data:{toDo:"logOff"},
			success: function() {
				window.location.assign("//127.0.0.1/web/");
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
		else if(toDo === "View Batches") {
			var controls = layout.getContent("center");
			if(controls.length!=0 && controls[0].sId === "batchTable") {
				layout.removeAllContent("center");
			}
			else {
				layout.removeAllContent("center");
				layout.addContent(sap.ui.commons.layout.BorderLayoutAreaTypes.center,				
					sap.ui.getCore().byId("batchTable"));
				
				layout.addContent(sap.ui.commons.layout.BorderLayoutAreaTypes.center,				
					sap.ui.getCore().byId("batchSubjectTable"));				
				sap.ui.getCore().byId("editBatchBtn").setEnabled(true);
				sap.ui.getCore().byId("deleteBatchBtn").setEnabled(true);
			}			
		}
		else if(toDo ==="New Batch") {
			var controls = layout.getContent("center");
			if(controls.length!=0 && controls[0].sId === "newBatchForm") {
				layout.removeAllContent("center");
			}
			else {
				layout.removeAllContent("center");
				layout.addContent(sap.ui.commons.layout.BorderLayoutAreaTypes.center,				
					sap.ui.getCore().byId("newBatchForm"));
			}
		}
		else if(toDo ==="View Backlogs") {
			var controls = layout.getContent("center");
			if(controls.length!=0 && controls[0].sId === "backlogTable") {
				layout.removeAllContent("center");
			}
			else {
				layout.removeAllContent("center");
				layout.addContent(sap.ui.commons.layout.BorderLayoutAreaTypes.center,				
					sap.ui.getCore().byId("backlogTable"));
				layout.addContent(sap.ui.commons.layout.BorderLayoutAreaTypes.center,				
					sap.ui.getCore().byId("table2-9-11"));
			}
		}
		else if(toDo ==="New Backlog") {
			var controls = layout.getContent("center");
			if(controls.length!=0 && controls[0].sId === "createBacklogForm") {
				layout.removeAllContent("center");
			}
			else {
				layout.removeAllContent("center");
				layout.addContent(sap.ui.commons.layout.BorderLayoutAreaTypes.center,				
					sap.ui.getCore().byId("createBacklogForm"));
				layout.addContent(sap.ui.commons.layout.BorderLayoutAreaTypes.center,				
					sap.ui.getCore().byId("backlogSubjectTable"));
				abc.newBacklogSemChange();
			}
		}
		else if(toDo === "View Preferences") {
			var controls = layout.getContent("center");
			if(controls.length!=0 && controls[0].sId === "table2-6") {
				layout.removeAllContent("center");
			}
			else {
				layout.removeAllContent("center");
				layout.addContent(sap.ui.commons.layout.BorderLayoutAreaTypes.center,				
					sap.ui.getCore().byId("table2-6"));
				layout.addContent(sap.ui.commons.layout.BorderLayoutAreaTypes.center,				
					sap.ui.getCore().byId("table2-7"));
				layout.addContent(sap.ui.commons.layout.BorderLayoutAreaTypes.center,				
					sap.ui.getCore().byId("updatePrefsBtn"));
			}
		}
		else if(toDo ==="View Timetable") {		
			var controls = layout.getContent("center");
			if(controls.length!=0 && controls[0].sId === "allTimeTable") {
				// view timetable is already placed, so remove it 
				layout.removeAllContent("center");
			}
			else { // place view timetable content
				layout.removeAllContent("center");
				layout.addContent(sap.ui.commons.layout.BorderLayoutAreaTypes.center,				
					sap.ui.getCore().byId("allTimeTable"));
				abc.allBeginControls = layout.getContent("begin");
				layout.removeAllContent("begin");
				layout.addContent(sap.ui.commons.layout.BorderLayoutAreaTypes.begin,
					sap.ui.getCore().byId("ttFilters"));
			}
		}
		else if(toDo ==="Create Timetable") {			
			var controls = layout.getContent("center");
			if(controls.length!=0 && controls[0].sId === "createTT") {
				layout.removeAllContent("center");
			}
			else {
				layout.removeAllContent("center");
				layout.addContent(sap.ui.commons.layout.BorderLayoutAreaTypes.center,				
					sap.ui.getCore().byId("createTT"));
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
				if(data2 === "login first") { alert(data2);}
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
			alert("Please select a row to edit it");
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
			abc.updateSubjectPrevCode = arr.modelData[i].subCode;
			
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
		var prevCode = abc.updateSubjectPrevCode;
		$.ajax({
			url:"./major1/getRooms.php",
			type:"POST",
			data:{
				toDo:"updateSubject",
				sid:id,
				subCode:data[0],				
				type:data[1],
				prevType: prevType,
				prevCode: prevCode,
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
					arr.modelData[i].semester = data[3];
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
	
	//////////////// batch functions ///////////////////
	
	editBatch: function(oEvent) {
		var arr=sap.ui.getCore().byId("table3").getModel().getData();
		var rows = sap.ui.getCore().byId("table3").getRows();
		var rowNum = sap.ui.getCore().byId("table3").getSelectedIndices();
				
		if(rowNum.length == 0) {
			alert("Please select a row to edit it");
			return 0;
		}
		var cells = rows[rowNum%10].getCells();
		var cell = cells[0];
		var i = parseInt(cell.getBindingContext().sPath.substring(11));
		
			var layout = sap.ui.getCore().byId("BorderLayout1");
			sap.ui.getCore().byId("editBatchBtn").setEnabled(false);
			sap.ui.getCore().byId("deleteBatchBtn").setEnabled(false);			
			var formElems = sap.ui.getCore().byId("formC1Batch").getFormElements();
			
			var fields = formElems[0].getFields();
			fields[0].setValue(arr.modelData[i].name);
			fields = formElems[1].getFields();
			fields[0].setValue(arr.modelData[i].semester);			
			fields = formElems[2].getFields();
			fields[0].setValue(arr.modelData[i].branch);
			
			layout.addContent(sap.ui.commons.layout.BorderLayoutAreaTypes.center,
				sap.ui.getCore().byId("editBatchForm"));
	},
	
	updateEditBatch: function(oEvent){
		var arr=sap.ui.getCore().byId("table3").getModel().getData();
		var rows = sap.ui.getCore().byId("table3").getRows();
		var rowNum = sap.ui.getCore().byId("table3").getSelectedIndices();
		var cells = rows[rowNum%10].getCells();
		var cell = cells[0];
		var i = parseInt(cell.getBindingContext().sPath.substring(11));
		var id = arr.modelData[i].id;
		
		var formElems = sap.ui.getCore().byId("formC1Batch").getFormElements();			
			
		var fields = formElems[0].getFields();
		var name = fields[0].getValue();
		
		fields = formElems[1].getFields();
		var semester = fields[0].getValue();
		
		fields = formElems[2].getFields();
		var branch = fields[0].getValue();
		
		$.ajax({
			url:"./major1/getRooms.php",
			type:"POST",
			data:{
				toDo:"updateBatch",
				id:id,
				name:name,
				sem:semester,
				branch:branch
			},
			success: function(data2) {
				if(data2 === "login first") { alert(data2);}
				else {
					arr.modelData[i].name = name;
					arr.modelData[i].semester = semester;
					arr.modelData[i].branch = branch;
					sap.ui.getCore().byId("table3").getModel().setData({modelData:arr.modelData});
				}
			},
			failure: function() {
				alert("some error in updation");
			},
			complete: function() {
				abc.cancelEditBatch();
			}
		});
	},
	cancelEditBatch: function(oEvent){
		var layout = sap.ui.getCore().byId("BorderLayout1");
		sap.ui.getCore().byId("editBatchBtn").setEnabled(true);
		sap.ui.getCore().byId("deleteBatchBtn").setEnabled(true);
		layout.removeContent("center",2);	// remove the edit rooms popup(index:2)
	},
	
	deleteBatch: function(oEvent){
		var arr=sap.ui.getCore().byId("table3").getModel().getData();
		var rows = sap.ui.getCore().byId("table3").getRows();
		var rowNum = sap.ui.getCore().byId("table3").getSelectedIndices();
				
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
			data:{toDo:"deleteBatch",id:id},
			success: function(data) {
				if(data === "login first") { alert(data);}
				else {
					arr.modelData.splice(i,1);
					sap.ui.getCore().byId("table3").getModel().setData({modelData:arr.modelData});
					sap.ui.getCore().byId("table3").setSelectedIndex();
				}
			},
			failure: function() {
				alert("some error in deletion");
			}
		});	
	},
	
	addNewBatch: function(oEvent) {
	
		var formElems = sap.ui.getCore().byId("formC1Batch-2").getFormElements();			
			
		var fields = formElems[0].getFields();
		var name = fields[0].getValue();
		
		fields = formElems[1].getFields();
		var semester = fields[0].getValue();
		
		fields = formElems[2].getFields();
		var branch = fields[0].getValue();
		
		$.ajax({
			url:"./major1/getRooms.php",
			type:"POST",
			data:{
				toDo:"addBatch",
				name:name,
				sem:semester,
				branch:branch
			},
			success: function(data) {
				if(data === "login first") { alert(data);}
				else {
					var item = JSON.parse(data);
					var arr=sap.ui.getCore().byId("table3").getModel().getData();
					arr.modelData.push(item);
					sap.ui.getCore().byId("table3").getModel().setData({modelData:arr.modelData});
				}
			},
			failure: function() {
				alert("some error in addition");
			},
			complete: function() {
				// clear the form
				var formElems = sap.ui.getCore().byId("formC1Batch-2").getFormElements();			
				var fields = formElems[0].getFields();
				fields[0].setValue("");
		
				fields = formElems[1].getFields();
				fields[0].setValue("");
		
				fields = formElems[2].getFields();
				fields[0].setValue("");
			}
		});
		
	},
	
	cancelNewBatch: function() {
		sap.ui.getCore().byId("BorderLayout1").removeAllContent("center");
	},
	
	addBatchSubject: function() {
		var layout = sap.ui.getCore().byId("BorderLayout1");
		layout.addContent(sap.ui.commons.layout.BorderLayoutAreaTypes.center,				
			sap.ui.getCore().byId("batchAddSubjectTable"));
	},
	
	deleteBatchSubject: function() {
		var rows = sap.ui.getCore().byId("table3").getRows();
		var rowNum = sap.ui.getCore().byId("table3").getSelectedIndices();
		if(rowNum.length == 0) {
			return 0;
		}
		var cells = rows[rowNum%10].getCells();
		var cell = cells[0];
		var i2 = parseInt(cell.getBindingContext().sPath.substring(11));		
		var arr2 = sap.ui.getCore().byId("table3").getModel().getData().modelData;
		var batchId = arr2[i2].id;
		
		var table2 = sap.ui.getCore().byId("table2-4");
		var arr = table2.getModel().getData();
		rows = table2.getRows();
		rowNum = table2.getSelectedIndices();
				
		if(rowNum.length == 0) {
			alert("Please select a row to delete it");
			return 0;
		}
		
		var i = parseInt(table2.getContextByIndex(rowNum).sPath.substring(11));
		var subId = arr.modelData[i].id;
		$.ajax({
			url:"./major1/getRooms.php",
			type:"POST",
			data:{toDo:"deleteBatchSubject",bid:batchId,sid:subId},
			success: function(data) {
				if(data === "login first") { alert(data);}
				else {
					var tmp = arr.modelData.splice(i,1);
					sap.ui.getCore().byId("table2-4").getModel().setData({modelData:arr.modelData});
					sap.ui.getCore().byId("table2-4").setSelectedIndex();
					var model = sap.ui.getCore().byId("table2-5").getModel();
					var dat = model.getData().modelData;
					dat.push(tmp[0]);
					model.setData({modelData:dat});
					
					// also set modelData of table3, change subIds of this batch
					for(var a=0;a<arr2[i2].subIds.length;a++) {
						if(arr2[i2].subIds[a].id == subId) {
							break;
						}
					}
					arr2[i2].subIds.splice(a,1);
					sap.ui.getCore().byId("table3").getModel().setData({modelData:arr2});
				}
			},
			failure: function() {
				alert("some error in deletion");
			}
		});	
	},
	
	// set models of table 4 and 5
	batchSubjectChange: function(oEvent) {
		var rows = sap.ui.getCore().byId("table3").getRows();
		var rowNum = sap.ui.getCore().byId("table3").getSelectedIndices();
		if(rowNum.length == 0) {
			return 0;
		}
		var cells = rows[rowNum%10].getCells();
		var cell = cells[0];
		var i = parseInt(cell.getBindingContext().sPath.substring(11));		
		var arr = sap.ui.getCore().byId("table3").getModel().getData().modelData;
		var ids = arr[i].subIds;
		var batch = arr[i];
		arr = sap.ui.getCore().byId("table2").getModel().getData().modelData;
		var newArr=[];
		var newArr2=[];
		var flag;
		for(var i=0;i<arr.length;i++) {	// for each subject
			flag = false;
			for(var j=0;j<ids.length;j++) {
				if(arr[i].id == ids[j].id) {
					if(arr[i].type!="tut") {
						newArr.push(arr[i]);
					}
					flag=true;
					break;
				}	
			}			
			if( (!flag)/* && arr[i].semester == batch.semester*/){
				newArr2.push(arr[i]);
			}
		}
		sap.ui.getCore().byId("table2-4").getModel().setData({modelData:newArr});
		sap.ui.getCore().byId("table2-5").getModel().setData({modelData:newArr2});
	},

	// add subjects to a batch
	addBatchSubject1: function() {
		var rows = sap.ui.getCore().byId("table3").getRows();
		var rowNum = sap.ui.getCore().byId("table3").getSelectedIndices();
		if(rowNum.length == 0) {
			return 0;
		}
		var cells = rows[rowNum%10].getCells();
		var cell = cells[0];
		var i2 = parseInt(cell.getBindingContext().sPath.substring(11));		
		var arr2 = sap.ui.getCore().byId("table3").getModel().getData().modelData;
		var batchId = arr2[i2].id;
		
		var table = sap.ui.getCore().byId("table2-5");
		var arr= table.getModel().getData();
		rows = table.getRows();
		rowNum = table.getSelectedIndices();
		
		if(rowNum.length == 0) {
			alert("Please select a row to add it");
			return 0;
		}
		
		var i = parseInt(table.getContextByIndex(rowNum).sPath.substring(11));
		var subId = arr.modelData[i].id;
		var subType = arr.modelData[i].type;
		var subCode = arr.modelData[i].subCode;
		$.ajax({
			url:"./major1/getRooms.php",
			type:"POST",
			data:{toDo:"addBatchSubject",bid:batchId,sid:subId,subType:subType,subCode:subCode},
			success: function(data) {
				if(data === "login first") { alert(data);}
				else {
					var tmp = arr.modelData.splice(i,1);
					sap.ui.getCore().byId("table2-5").getModel().setData({modelData:arr.modelData});					
					var model = sap.ui.getCore().byId("table2-4").getModel();
					var dat = model.getData().modelData;
					dat.push(tmp[0]);
					model.setData({modelData:dat});
					
					// also update batch modelData for subIds
					var obj = {id:subId};
					arr2[i2].subIds.push(obj);
					sap.ui.getCore().byId("table3").getModel().setData({modelData:arr2});
				}
			},
			failure: function() {
				alert("some error in addition");
			}
		});	
	},
	
	////////////////////// backlog functions ///////////////

	editBacklog : function() {},
	deleteBacklog : function() {
		var arr=sap.ui.getCore().byId("table8").getModel().getData();
		var rows = sap.ui.getCore().byId("table8").getRows();
		var rowNum = sap.ui.getCore().byId("table8").getSelectedIndices();
				
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
			data:{toDo:"deleteBacklog",id:id},
			success: function(data) {
				if(data === "login first") { alert(data);}
				else {
					arr.modelData.splice(i,1);
					sap.ui.getCore().byId("table8").getModel().setData({modelData:arr.modelData});
					sap.ui.getCore().byId("table8").setSelectedIndex();
				}
			},
			failure: function() {
				alert("some error in deletion");
			}
		});	
	},
	createBacklog: function() {
		var formElems = sap.ui.getCore().byId("formC1Backlog").getFormElements();			
			
		var fields = formElems[0].getFields();
		var id = fields[0].getValue();
		
		fields = formElems[1].getFields();
		var name = fields[0].getValue();
	
		fields = formElems[2].getFields();
		var semester = fields[0].getValue();
		
		fields = formElems[3].getFields();
		var branch = fields[0].getValue();

		fields = formElems[4].getFields();
		var batch = fields[0].getValue();
		
		if(id==="" || name==="" || semester ==="" || branch ==="" || batch==="") {
			alert("please ensure all values are provided");
			return 0;
		}
		
		var aa=fields[0].getSelectedItemId();
		var bid = parseInt(aa.substring(25));
		var batchId = fields[0].getModel().getData().modelData[bid].bId;
		
		var subs = [];
		var model = sap.ui.getCore().byId("table2-9").getModel();
		var arr = model.getData().modelData || [];
		for(var i =0;i<arr.length;i++) {
			var oId = {id:arr[i].id};
			subs.push(oId);
		}		
		var dat = {
			id:id,
			name:name,
			batchId:batchId,			
			batchName:batch,
			semester:semester,
			branch:branch,
			subIds:subs
		};
		$.ajax({
			url:"./major1/getRooms.php",
			type:"POST",
			data:{toDo:"addBacklog",json:JSON.stringify(dat)},
			success: function(data) {
				if(data === "login first") { alert(data);}
				else if(data === "done"){					
					var arr=sap.ui.getCore().byId("table8").getModel().getData();
					arr.modelData.push(dat);
					sap.ui.getCore().byId("table8").getModel().setData({modelData:arr.modelData});
					
					// clear the form
					var formElems = sap.ui.getCore().byId("formC1Backlog").getFormElements();			
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
					// clear the backlog subjects table
					var empty = [];
					sap.ui.getCore().byId("table2-9").getModel().setData({modelData:empty});
				}
				else {
					alert(data);
				}
			},
			failure: function() {
				alert("some error in addition");
			},
			complete: function() {
				
			}
		});
	},
	cancelBacklog: function() {
		sap.ui.getCore().byId("BorderLayout1").removeAllContent("center");
	},
	addBacklogSubject: function() {
		var layout = sap.ui.getCore().byId("BorderLayout1");
		layout.addContent(sap.ui.commons.layout.BorderLayoutAreaTypes.center,				
			sap.ui.getCore().byId("backlogAddSubjectTable"));		
	},
	deleteBacklogSubject: function() {
			
		var table2 = sap.ui.getCore().byId("table2-9");
		var arr = table2.getModel().getData();
		var rows = table2.getRows();
		var rowNum = table2.getSelectedIndices();
				
		if(rowNum.length == 0) {
			alert("Please select a row to delete it");
			return 0;
		}
		
		var i = parseInt(table2.getContextByIndex(rowNum).sPath.substring(11));
		var subId = arr.modelData[i].id;
		var formElems = sap.ui.getCore().byId("formC1Backlog").getFormElements();			
		var fields = formElems[0].getFields();
		var id = fields[0].getValue();
		$.ajax({
			url:"./major1/getRooms.php",
			type:"POST",
			data:{toDo:"deleteBacklogSubject",studentId:id,subId:subId},
			success: function(data) {
				if(data === "login first") { alert(data);}
				else {
					var tmp = arr.modelData.splice(i,1);
					sap.ui.getCore().byId("table2-9").getModel().setData({modelData:arr.modelData});
					sap.ui.getCore().byId("table2-9").setSelectedIndex();
					var model = sap.ui.getCore().byId("table2-10").getModel();
					var dat = model.getData().modelData;
					dat.push(tmp[0]);
					model.setData({modelData:dat});					
				}
			},
			failure: function() {
				alert("some error in deletion");
			}
		});	
	},
	addBacklogSubject1: function() {
		
		var table = sap.ui.getCore().byId("table2-10");
		var arr= table.getModel().getData();
		var rows = table.getRows();
		var rowNum = table.getSelectedIndices();
		
		if(rowNum.length == 0) {
			alert("Please select a row to add it");
			return 0;
		}
		
		var i = parseInt(table.getContextByIndex(rowNum).sPath.substring(11));
		var subId = arr.modelData[i].id;
		var formElems = sap.ui.getCore().byId("formC1Backlog").getFormElements();			
		var fields = formElems[0].getFields();
		var id = fields[0].getValue();
		var tmp = arr.modelData.splice(i,1);
		sap.ui.getCore().byId("table2-10").getModel().setData({modelData:arr.modelData});					
		var model = sap.ui.getCore().byId("table2-9").getModel();
		var dat = model.getData().modelData||[];
		dat.push(tmp[0]);
		model.setData({modelData:dat});		
	},
	newBacklogSemChange: function() {	
		var formElems = sap.ui.getCore().byId("formC1Backlog").getFormElements();			
		var fields = formElems[2].getFields();
		var sem = fields[0].getValue();
		var arr = sap.ui.getCore().byId("table2").getModel().getData().modelData;
		var newarr = [];
		for(var i =0;i<arr.length;i++) {
			if(abc.isLess(arr[i].semester,sem)) {
				newarr.push(arr[i]);
			}
		}
		sap.ui.getCore().byId("table2-10").getModel().setData({modelData:newarr});
		abc.updateCurrentBatchChoices();
	},
	newBacklogBranchChange: function() {
		abc.updateCurrentBatchChoices();
	},
	updateCurrentBatchChoices: function() {
		var formElems = sap.ui.getCore().byId("formC1Backlog").getFormElements();			
		var fields = formElems[2].getFields();
		var curSem = fields[0].getValue();
		fields = formElems[3].getFields();
		var curBranch = fields[0].getValue();
		var arr = sap.ui.getCore().byId("table3").getModel().getData().modelData;
		var batches = [];
		
		for(var i =0;i<arr.length;i++) {
			if(arr[i].semester === curSem && arr[i].branch === curBranch) {
				var obj = {bId:arr[i].id,bName:arr[i].name};
				batches.push(obj);
			}
		}
		sap.ui.getCore().byId("newBaklgBatchDD").getModel().setData({modelData:batches});
	},
	isLess: function(a,b) {
		var arr = ["first","second","third","fourth","fifth","sixth","seventh","eighth"];
		var aa,bb;
		for(var i =0;i<arr.length;i++) {
			if(a===arr[i]) {
				aa=i;
			}
			if(b===arr[i]) {
				bb=i;
			}
		}
		return (aa<bb);
	},
	backlogSubjectChange: function() {
		var rows = sap.ui.getCore().byId("table8").getRows();
		var rowNum = sap.ui.getCore().byId("table8").getSelectedIndices();
		if(rowNum.length == 0) {
			return 0;
		}
		var cells = rows[rowNum%10].getCells();
		var cell = cells[0];
		var i = parseInt(cell.getBindingContext().sPath.substring(11));		
		var arr = sap.ui.getCore().byId("table8").getModel().getData().modelData;
		var ids = arr[i].subIds;
		var student = arr[i];
		arr = sap.ui.getCore().byId("table2").getModel().getData().modelData;
		var newArr=[];
		for(var i=0;i<arr.length;i++) {	// for each subject
			for(var j=0;j<ids.length;j++) {
				if(arr[i].id == ids[j].id) {
					if(arr[i].type!="tut") {
						newArr.push(arr[i]);
					}
					break;
				}	
			}
		}
		sap.ui.getCore().byId("table2-9-11").getModel().setData({modelData:newArr});
	},
	
	/////////////////////  preference functions /////////////
	
	// have to do prefNum also
	// also have to add update btn
	prefChangeBtn: function(oEvent){
		var btn = oEvent.getSource();
		var id = parseInt(btn.getBindingContext().sPath.substring(11));
		var model1 = sap.ui.getCore().byId("table2-6").getModel();
		var model2 = sap.ui.getCore().byId("table2-7").getModel();
		var arr = model1.getData().modelData;
		var arr2 = model2.getData().modelData;
		var btn1 = sap.ui.getCore().byId(btn.getSelectedButton());
		var btnText = btn1.getTooltip_Text();
		if(btnText == "move up" && id!=0) {			
			var obj = arr.splice(id,1);
			arr.splice(id-1,0,obj[0]);			
		}
		else if(btnText == "move down" && id!=(arr.length-1)) {			
			var obj = arr.splice(id,1);
			arr.splice(id+1,0,obj[0]);
		}
		else if(btnText == "remove") {
			var tmp = arr.splice(id,1);
			arr2.push(tmp[0]);
			model2.setData({modelData:arr2});
		}
		model1.setData({modelData:arr});
		btn.setSelectedButton();		
	},
	
	addPrefSubject: function(oEvent) {
		var btn = oEvent.getSource();
		var id = btn.getId().substring(20);
		var model1 = sap.ui.getCore().byId("table2-6").getModel();
		if(model1.getData().modelData.length >= 5) {
			// no more additions possible
			btn.setSelectedButton();
			return 0;
		}
		var model2 = sap.ui.getCore().byId("table2-7").getModel();
		var arr = model1.getData().modelData;
		var arr2 = model2.getData().modelData;
		var tmp = arr2.splice(id,1);
		arr.push(tmp[0]);
		model2.setData({modelData:arr2});
		model1.setData({modelData:arr});
		btn.setSelectedButton();
	},
	
	updatePrefs: function(oEvent) {
		var data = [];
		var arr = sap.ui.getCore().byId("table2-6").getModel().getData().modelData;
		var numLabs = 0;
		for(var i=0;i<arr.length;i++) {
			if(arr[i].type == "lab") {
				numLabs++;
			}
			var item = {
				id:userId,
				prefNum:(i+1),
				subId:arr[i].id
			};
			data.push(item);
		}
		
		if(numLabs == 0) {
			alert("You must select at least one lab");
			return 0;
		}
		
		var sendStr = {
			toDo:"updatePrefs",
			json:JSON.stringify(data)
		};
		$.ajax({
			url:"./major1/getRooms.php",
			type:"POST",
			data:sendStr,
			success: function(data2) {
				if(data2 === "login first") { alert(data2);}
				else {
					alert("done");
				}
			},
			failure: function() {
				alert("some error in updation");
			}			
		});
	},
	
	//////////////// timetable functions /////////////////
	showBegin: function() {
		var layout = sap.ui.getCore().byId("BorderLayout1");
		layout.removeAllContent("begin");
		layout.removeAllContent("center");
		for(var i=0;i<abc.allBeginControls.length;i++) {
			layout.addContent(sap.ui.commons.layout.BorderLayoutAreaTypes.begin,				
				abc.allBeginControls[i]);
		}
	},
	filtersSem: function(oEvent) {},
	applyFilters: function() {
		var semItems = sap.ui.getCore().byId("semFilterBox").getSelectedItems();
		var sems = [];
		for(var i=0;i<semItems.length;i++) {
			sems.push(semItems[i].getText());
		}
		var batch = sap.ui.getCore().byId("batchFilterText").getValue();
		var room = sap.ui.getCore().byId("roomFilterText").getValue();
		var teacher = sap.ui.getCore().byId("teacherFilterText").getValue();
		var allDays = ["tableT1","tableT1-2","tableT1-3","tableT1-4","tableT1-5","tableT1-6"];
		var day;
		for(day of allDays) {
			var arrOr = sap.ui.getCore().byId(day).getModel().getData().modelData;
			var arr = jQuery.extend(true, [], arrOr);
			for( var time in arr[0]) {
				for(var i =0;i<arr.length;i++) {				
					if(arr[i][time]!="") {
						var flag=false;
						var str = arr[i][time].split(",");
						if(sems.length>0 && !abc.filterMatchSem(str[0],sems)) {
							arr[i][time]="";
							flag=true;
						}
						else if(batch!="" && !abc.filterMatchBatch(str[1],batch)) {
							arr[i][time]="";
							flag=true;
						}
						else if(room!="" && !abc.filterMatchRoom(str[4],room)) {
							arr[i][time]="";
							flag=true;
						}
						else if(teacher!="" && !abc.filterMatchTeacher(str[3],teacher)) {
							arr[i][time]="";
							flag=true;
						}
						if(flag==true) {
							for(var j=i;j<arr.length-1;j++) {
								arr[j][time]=arr[j+1][time];
							}
							i--;
							arr[j][time]="";
						}
					}
				}
			}		
			sap.ui.getCore().byId(day).getModel().setData({modelData:arr});		
		}		
	},
	filterMatchSem: function(str,sem) {
		for(var i=0;i<sem.length;i++) {
			if(str==sem) {
				return true;
			}
		}
		return false;
	},
	filterMatchBatch: function(str,batch) {
		if(str.search(batch)!=-1)
			return true;
		return false;
	},
	filterMatchRoom: function(str,room) {
		if(str==room)
			return true;
		return false;
	},
	filterMatchTeacher: function(str,teacher) {
		if(str==teacher)
			return true;
		return false;
	},
	resetFilters: function() {
		sap.ui.getCore().byId("tableT1").getModel().setData({modelData:abc.ttJSON.monday});
		sap.ui.getCore().byId("tableT1-2").getModel().setData({modelData:abc.ttJSON.tuesday});
		sap.ui.getCore().byId("tableT1-3").getModel().setData({modelData:abc.ttJSON.wednesday});
		sap.ui.getCore().byId("tableT1-4").getModel().setData({modelData:abc.ttJSON.thursday});
		sap.ui.getCore().byId("tableT1-5").getModel().setData({modelData:abc.ttJSON.friday});
		sap.ui.getCore().byId("tableT1-6").getModel().setData({modelData:abc.ttJSON.saturday});
	},
	connectToCppServer: function() {
		var elems = sap.ui.getCore().byId("createTTFormCont").getFormElements();
		var fields = elems[0].getFields();
		var ip = fields[0].getValue();
		fields = elems[1].getFields();
		var port = fields[0].getValue();
		fields = elems[2].getFields();	
		var iterNos = fields[0].getValue();
		var iter = parseInt(iterNos);
		if(iter < 0 || iter >999) {
			alert("please enter a value between 0-999");
			return 0;
		}
		$.ajax({
				url:"http://"+ip+":"+port,
				type:"POST",
				data:{iterNos:iterNos},
				success:function(data) {
					abc.ttJSON = JSON.parse(data);
					sap.ui.getCore().byId("tableT1").getModel().setData({modelData:abc.ttJSON.monday});
					sap.ui.getCore().byId("tableT1-2").getModel().setData({modelData:abc.ttJSON.tuesday});
					sap.ui.getCore().byId("tableT1-3").getModel().setData({modelData:abc.ttJSON.wednesday});
					sap.ui.getCore().byId("tableT1-4").getModel().setData({modelData:abc.ttJSON.thursday});
					sap.ui.getCore().byId("tableT1-5").getModel().setData({modelData:abc.ttJSON.friday});
					sap.ui.getCore().byId("tableT1-6").getModel().setData({modelData:abc.ttJSON.saturday});
					sap.ui.getCore().byId("tableUT").getModel().setData({modelData:abc.ttJSON.unplacedSlots});
					alert("Timetable created, number of unplaced slots :"+abc.ttJSON.unplaced);
				},
				error:function(oEvent) {
					alert("error connecting to server");
				}
			});
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