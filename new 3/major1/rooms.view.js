sap.ui.jsview("major1.rooms", {

	/** Specifies the Controller belonging to this View. 
	* In the case that it is not implemented, or that "null" is returned, this View does not have a Controller.
	* @memberOf major1.rooms
	*/ 
	getControllerName : function() {
		return "major1.rooms";
	},

	/** Is initially called once after the Controller has been instantiated. It is the place where the UI is constructed. 
	* Since the Controller is given to this method, its event handlers can be attached right away. 
	* @memberOf major1.rooms
	*/ 
	createContent : function(oController) {
		
		// Create a BorderLayout instance
		var oBorderLayout1 = new sap.ui.commons.layout.BorderLayout("BorderLayout1", {width: "1200px", height: "650px", 
			top: new sap.ui.commons.layout.BorderLayoutArea({
				size: "6%",
				contentAlign: "left",
				visible: true 
				//content: [new sap.ui.commons.TextView({text: 'Top Area', design: sap.ui.commons.TextViewDesign.Bold })]
				}),
			bottom: new sap.ui.commons.layout.BorderLayoutArea({
				size: "5%",
				contentAlign: "center",
				visible: true, 
				content: [new sap.ui.commons.TextView({text: 'Bottom Area', design: sap.ui.commons.TextViewDesign.Bold })]
				}),
			begin: new sap.ui.commons.layout.BorderLayoutArea({
				size: "20%",
				contentAlign: "left",
				visible: true
			}).addStyleClass("layoutBegin"),
			center: new sap.ui.commons.layout.BorderLayoutArea({
				contentAlign: "center",
				visible: true
				//content: [new sap.ui.commons.TextView({text: 'Center Area', design: sap.ui.commons.TextViewDesign.Bold })]
				})
			});
		// Attach the BorderLayout to the page
		oBorderLayout1.placeAt("content");

		//////////// things for top //////////////
		
		//create the ApplicationHeader control and add to "top"
		var oAppHeader = new sap.ui.commons.ApplicationHeader("appHeader"); 
		//configure the branding area
		oAppHeader.setLogoSrc("http://www.sap.com/global/images/SAPLogo.gif");
		oAppHeader.setLogoText("TIMETABLE GENERATOR");
		//configure the welcome area
		oAppHeader.setDisplayWelcome(true);
		oAppHeader.setUserName("John Doe");
		//configure the log off area
		oAppHeader.setDisplayLogoff(true);
		oBorderLayout1.addContent(sap.ui.commons.layout.BorderLayoutAreaTypes.top,oAppHeader);
		
		//////////////// things for begin /////////////
		
		//Create a panel instance
		var oPanel = new sap.ui.commons.Panel({showCollapseIcon: false});
		oPanel.setAreaDesign(sap.ui.commons.enums.AreaDesign.Plain);
		oPanel.setBorderDesign(sap.ui.commons.enums.BorderDesign.Box);
		//Set the title of the panel
		oPanel.setTitle(new sap.ui.core.Title({text:"Rooms"}));		
		var oViewRoomsBtn = new sap.ui.commons.Button({text:"View Rooms",press:oController.manageClick});
		oViewRoomsBtn.addStyleClass("newsButtons");		
		var oNewRoomsBtn = new sap.ui.commons.Button({text:"New Room",press:oController.manageClick});
		oNewRoomsBtn.addStyleClass("newsButtons");
		var oLayoutVertical = new sap.ui.layout.VerticalLayout({
			content: [oViewRoomsBtn,oNewRoomsBtn]
		});
		oPanel.addContent(oLayoutVertical);
		oPanel.addStyleClass("panelSpacing");
		oBorderLayout1.addContent(sap.ui.commons.layout.BorderLayoutAreaTypes.begin,oPanel);
		
		//Create a panel instance
		var oPanel2 = new sap.ui.commons.Panel({showCollapseIcon: false});
		oPanel2.setAreaDesign(sap.ui.commons.enums.AreaDesign.Plain);
		oPanel2.setBorderDesign(sap.ui.commons.enums.BorderDesign.Box);
		//Set the title of the panel
		oPanel2.setTitle(new sap.ui.core.Title({text:"Subjects"}));
		var oViewSubjectsBtn = new sap.ui.commons.Button({width:"130px",text:"View Subjects",press:oController.manageClick});		
		var oNewSubjectsBtn = new sap.ui.commons.Button({width:"130px",text:"New Subject",press:oController.manageClick});
		oLayoutVertical = new sap.ui.layout.VerticalLayout({
			content: [oViewSubjectsBtn,oNewSubjectsBtn]
		});
		oPanel2.addContent(oLayoutVertical);
		oPanel2.addStyleClass("panelSpacing");
		oBorderLayout1.addContent(sap.ui.commons.layout.BorderLayoutAreaTypes.begin,oPanel2);
		
		//Create a panel instance
		var oPanel3 = new sap.ui.commons.Panel({showCollapseIcon: false});
		oPanel3.setAreaDesign(sap.ui.commons.enums.AreaDesign.Plain);
		oPanel3.setBorderDesign(sap.ui.commons.enums.BorderDesign.Box);
		//Set the title of the panel
		oPanel3.setTitle(new sap.ui.core.Title({text:"Batches"}));
		var oViewBatchesBtn = new sap.ui.commons.Button({width:"130px",text:"View Batches",press:oController.manageClick});
		var oNewBatchesBtn = new sap.ui.commons.Button({width:"130px",text:"New Batch",press:oController.manageClick});
		oLayoutVertical = new sap.ui.layout.VerticalLayout({
			content: [oViewBatchesBtn,oNewBatchesBtn]
		});
		oPanel3.addContent(oLayoutVertical);		
		oPanel3.addStyleClass("panelSpacing");
		oBorderLayout1.addContent(sap.ui.commons.layout.BorderLayoutAreaTypes.begin,oPanel3);
		
		//Create a panel instance
		var oPanel4 = new sap.ui.commons.Panel({showCollapseIcon: false});
		oPanel4.setAreaDesign(sap.ui.commons.enums.AreaDesign.Plain);
		oPanel4.setBorderDesign(sap.ui.commons.enums.BorderDesign.Box);
		//Set the title of the panel
		oPanel4.setTitle(new sap.ui.core.Title({text:"Edit Profile"}));
		var oEditBtn = new sap.ui.commons.Button({width:"130px",text:"Edit",press:oController.manageClick});
		oLayoutVertical = new sap.ui.layout.VerticalLayout({
			content: [oEditBtn]
		});
		oPanel4.addContent(oLayoutVertical);		
		oPanel4.addStyleClass("panelSpacing");
		oBorderLayout1.addContent(sap.ui.commons.layout.BorderLayoutAreaTypes.begin,oPanel4);
		
		//Create a panel instance
		var oPanel5 = new sap.ui.commons.Panel({showCollapseIcon: false});
		oPanel5.setAreaDesign(sap.ui.commons.enums.AreaDesign.Plain);
		oPanel5.setBorderDesign(sap.ui.commons.enums.BorderDesign.Box);
		//Set the title of the panel
		oPanel5.setTitle(new sap.ui.core.Title({text:"Timetable"}));
		var oViewTtBtn = new sap.ui.commons.Button({width:"130px",text:"View Timetable",press:oController.manageClick});
		//oPanel5.addContent(oViewTtBtn);		
		var oCreateTtBtn = new sap.ui.commons.Button({width:"130px",text:"Create Timetable",press:oController.manageClick});
		oLayoutVertical = new sap.ui.layout.VerticalLayout({
			content: [oViewTtBtn,oCreateTtBtn]
		});
		oPanel5.addContent(oLayoutVertical);		
		oPanel5.addStyleClass("panelSpacing");
		oBorderLayout1.addContent(sap.ui.commons.layout.BorderLayoutAreaTypes.begin,oPanel5);
		
		////////////////  things for center ////////////
		
		////////////////     rooms part  ///////////////////
		var oTable = new sap.ui.table.Table("table1",{
			title:"Rooms data",
			visibleRowCount:10,
			width:"80%",
			navigationMode:sap.ui.table.NavigationMode.Paginator,
			selectionMode:sap.ui.table.SelectionMode.Single
		});
		
		oTable.addColumn(new sap.ui.table.Column("tabCol1",{
			label: new sap.ui.commons.Label({text:"Room Name"}),
			template: new sap.ui.commons.TextView().bindProperty("text","roomName"),
			sortProperty:"roomName"
		}));
		
		oTable.addColumn(new sap.ui.table.Column("tabCol2",{
			label: new sap.ui.commons.Label({text:"Type"}),
			template: new sap.ui.commons.TextView().bindProperty("text","type"),
			filterProperty:"type"
		}));
		
		oTable.addColumn(new sap.ui.table.Column("tabCol3",{
			label: new sap.ui.commons.Label({text:"Capacity"}),
			template: new sap.ui.commons.TextView().bindProperty("text","capacity"),
			sortProperty:"capacity",
			filterProperty:"capacity"
		}));
		
		oTable.addColumn(new sap.ui.table.Column("tabCol4",{
			label: new sap.ui.commons.Label({text:"Location"}),
			template: new sap.ui.commons.TextView().bindProperty("text","location"),
			sortProperty:"location",
			filterProperty:"location"
		}));
				
		var oModel = new sap.ui.model.json.JSONModel();		
		oModel.refresh(true);
		oTable.setModel(oModel);
		oTable.bindRows("/modelData");
				
		var oToolbar1 = new sap.ui.commons.Toolbar("tb1",{width:"80%"});
		oToolbar1.setDesign(sap.ui.commons.ToolbarDesign.Standard);
		
		var button = new sap.ui.commons.Button("editRoomsBtn",{
						text:"Edit",
						icon: "sap-icon://edit",
						press: oController.editRoom
					});
		var button2 = new sap.ui.commons.Button("deleteRoomsBtn",{
						text:"Delete",
						icon: "sap-icon://delete",
						press: oController.deleteRoom
					});
		oToolbar1.addItem(button);
		oToolbar1.addItem(button2);
		oToolbar1.addStyleClass("toolbar_color");
		
		oLayoutVertical = new sap.ui.layout.VerticalLayout("roomsTable",{
			content: [oTable,oToolbar1]
		}).addStyleClass("table1");
		
		/////// edit room (form and toolbar) /////
		var oLayout1 = new sap.ui.layout.form.GridLayout("L1", {singleColumn: true});
		var oFormId = "F1";
		var oFormContainerId = "formC1";
		var oForm1 = new sap.ui.layout.form.Form(oFormId,{
			title: new sap.ui.core.Title({text: "Edit Room"}),
			width: "300px",
			layout: oLayout1,
			formContainers: [
				new sap.ui.layout.form.FormContainer(oFormContainerId,{
					formElements: [						
						new sap.ui.layout.form.FormElement({
							label: new sap.ui.commons.Label({
								text: "Room name",
								layoutData: new sap.ui.layout.form.GridElementData({hCells: "3"})
							}),
							fields: [new sap.ui.commons.TextField({
								layoutData: new sap.ui.layout.form.GridElementData({hCells: "auto"})})
							]
						}),
						new sap.ui.layout.form.FormElement({
							label: new sap.ui.commons.Label({
								text: "Type",
								layoutData: new sap.ui.layout.form.GridElementData({hCells: "3"})
							}),
							fields: [new sap.ui.commons.TextField({
								layoutData: new sap.ui.layout.form.GridElementData({hCells: "auto"})})
							]
						}),
						new sap.ui.layout.form.FormElement({
							label: new sap.ui.commons.Label({
								text: "Capacity",
								layoutData: new sap.ui.layout.form.GridElementData({hCells: "3"})
							}),
							fields: [new sap.ui.commons.TextField({
								layoutData: new sap.ui.layout.form.GridElementData({hCells: "auto"})})
							]
						}),
						new sap.ui.layout.form.FormElement({
							label: new sap.ui.commons.Label({
								text: "Location",
								layoutData: new sap.ui.layout.form.GridElementData({hCells: "3"})
							}),
							fields: [new sap.ui.commons.TextField({
								layoutData: new sap.ui.layout.form.GridElementData({hCells: "auto"})})
							]
						})
					]
				})
			]
		});//.addStyleClass("editRoom");
		
		var oToolbar2 = new sap.ui.commons.Toolbar("tb2",{width:"300px"});
		//oToolbar2.setDesign(sap.ui.commons.ToolbarDesign.Standard);		
		var button = new sap.ui.commons.Button("updateRoomsBtn",{
						text:"Update",
						icon: "sap-icon://save",
						press: oController.updateEditRoom
					});
		var button2 = new sap.ui.commons.Button({
						text:"Cancel",
						icon: "sap-icon://decline",
						press: oController.cancelEditRoom
					});
		oToolbar2.addItem(button);
		oToolbar2.addItem(button2);
		//oToolbar2.addStyleClass("toolbar_color");
		oForm1.setTitle("Edit Room");
		oLayoutVertical = new sap.ui.layout.VerticalLayout("editRoomsForm",{
			content: [oForm1,oToolbar2]
		}).addStyleClass("editRoom");
		
		/////// new room (prev. form, new toolbar, new layout) /////
		var oToolbar3 = new sap.ui.commons.Toolbar("tb3",{width:"300px"});		
		var button = new sap.ui.commons.Button("newRoomBtn",{
						text:"Add",
						icon: "sap-icon://save",
						press: oController.addNewRoom
					});
		var button2 = new sap.ui.commons.Button({
						text:"Cancel",
						icon: "sap-icon://decline",
						press: oController.cancelNewRoom
					});
		oToolbar3.addItem(button);
		oToolbar3.addItem(button2);		
		oToolbar3.addStyleClass("toolbar3Spacing");
		var oFormId = "F2";
		var oFormContainerId = "formC2";
		var oForm2 = oForm1.clone("2");
		oForm2.setTitle("New Room");
		oLayoutVertical = new sap.ui.layout.VerticalLayout("newRoomForm",{
			content: [oForm2,oToolbar3]
		}).addStyleClass("newRoom");
		
		///////////////////  subjects part /////////////////
		///////////////////////////////////////////////////
		
		var oTable2 = new sap.ui.table.Table("table2",{
			title:"Subjects data",
			visibleRowCount:10,
			width:"80%",
			navigationMode:sap.ui.table.NavigationMode.Paginator,
			selectionMode:sap.ui.table.SelectionMode.Single
		});
		
		oTable2.addColumn(new sap.ui.table.Column("tab2Col1",{
			label: new sap.ui.commons.Label({text:"Subject code"}),
			template: new sap.ui.commons.TextView().bindProperty("text","subCode"),
			sortProperty:"subCode",
			filterProperty:"subCode"
		}));
		
		oTable2.addColumn(new sap.ui.table.Column("tab2Col2",{
			label: new sap.ui.commons.Label({text:"Type"}),
			template: new sap.ui.commons.TextView().bindProperty("text","type"),
			filterProperty:"type"
		}));
		
		oTable2.addColumn(new sap.ui.table.Column("tab2Col3",{
			label: new sap.ui.commons.Label({text:"Subject Name"}),
			template: new sap.ui.commons.TextView().bindProperty("text","name"),
			sortProperty:"name",
			filterProperty:"name"
		}));
		
		oTable2.addColumn(new sap.ui.table.Column("tab2Col4",{
			label: new sap.ui.commons.Label({text:"Semester"}),
			template: new sap.ui.commons.TextView().bindProperty("text","semester"),
			sortProperty:"semester",
			filterProperty:"semester"
		}));
		
		oTable2.addColumn(new sap.ui.table.Column("tab2Col5",{
			label: new sap.ui.commons.Label({text:"Branch"}),
			template: new sap.ui.commons.TextView().bindProperty("text","branch"),
			sortProperty:"branch",
			filterProperty:"branch"
		}));
		
		oTable2.addColumn(new sap.ui.table.Column("tab2Col6",{
			label: new sap.ui.commons.Label({text:"Hours"}),
			template: new sap.ui.commons.TextView().bindProperty("text","hours"),
			sortProperty:"hours",
			filterProperty:"hours"
		}));
		
		var oModel2 = new sap.ui.model.json.JSONModel();		
		oModel2.refresh(true);
		oTable2.setModel(oModel2);
		oTable2.bindRows("/modelData");
				
		var oToolbar1 = new sap.ui.commons.Toolbar("tb1Sub",{width:"80%"});
		oToolbar1.setDesign(sap.ui.commons.ToolbarDesign.Standard);
		
		var button = new sap.ui.commons.Button("editSubBtn",{
						text:"Edit",
						icon: "sap-icon://edit",
						press: oController.editSubject
					});
		var button2 = new sap.ui.commons.Button("deleteSubBtn",{
						text:"Delete",
						icon: "sap-icon://delete",
						press: oController.deleteSubject
					});
		oToolbar1.addItem(button);
		oToolbar1.addItem(button2);
		oToolbar1.addStyleClass("toolbar_color");
		
		oLayoutVertical = new sap.ui.layout.VerticalLayout("subjectTable",{
			content: [oTable2,oToolbar1]
		}).addStyleClass("table1");
		
		/////// edit subject (form and toolbar) /////
		var oLayout1 = new sap.ui.layout.form.GridLayout("L2", {singleColumn: true});
		var oFormId = "F1Sub";
		var oFormContainerId = "formC1Sub";
		var oForm1 = new sap.ui.layout.form.Form(oFormId,{
			title: new sap.ui.core.Title({text: "Edit Subject"}),
			width: "300px",
			layout: oLayout1,
			formContainers: [
				new sap.ui.layout.form.FormContainer(oFormContainerId,{
					formElements: [						
						new sap.ui.layout.form.FormElement({
							label: new sap.ui.commons.Label({
								text: "Subject code",
								layoutData: new sap.ui.layout.form.GridElementData({hCells: "3"})
							}),
							fields: [new sap.ui.commons.TextField({
								layoutData: new sap.ui.layout.form.GridElementData({hCells: "auto"})})
							]
						}),
						new sap.ui.layout.form.FormElement({
							label: new sap.ui.commons.Label({
								text: "Type",
								layoutData: new sap.ui.layout.form.GridElementData({hCells: "3"})
							}),
							fields: [
								// Create a DropdownBox
								new sap.ui.commons.DropdownBox("DropdownBox1",{
									layoutData: new sap.ui.layout.form.GridElementData({hCells: "auto"})})
								.setTooltip("Subject type")
								.setEditable(true)
								.setWidth("200px")
								.addItem(
									new sap.ui.core.ListItem()
									.setText("lecture")
								)
								.addItem(
									new sap.ui.core.ListItem()
									.setText("lab")
								)	
								.addItem(
									new sap.ui.core.ListItem()
									.setText("lecture+tut")
								)
							]
						}),
						new sap.ui.layout.form.FormElement({
							label: new sap.ui.commons.Label({
								text: "Name",
								layoutData: new sap.ui.layout.form.GridElementData({hCells: "3"})
							}),
							fields: [new sap.ui.commons.TextField({
								layoutData: new sap.ui.layout.form.GridElementData({hCells: "auto"})})
							]
						}),
						new sap.ui.layout.form.FormElement({
							label: new sap.ui.commons.Label({
								text:"Semester",
								layoutData: new sap.ui.layout.form.GridElementData({hCells: "3"})
							}),
							fields: [new sap.ui.commons.TextField({
								layoutData: new sap.ui.layout.form.GridElementData({hCells: "auto"})})
							]
						}),
						new sap.ui.layout.form.FormElement({
							label: new sap.ui.commons.Label({
								text: "Branch",
								layoutData: new sap.ui.layout.form.GridElementData({hCells: "3"})
							}),
							fields: [new sap.ui.commons.TextField({
								layoutData: new sap.ui.layout.form.GridElementData({hCells: "auto"})})
							]
						}),
						new sap.ui.layout.form.FormElement({
							label: new sap.ui.commons.Label({
								text:"Hours",
								layoutData: new sap.ui.layout.form.GridElementData({hCells: "3"})
							}),
							fields: [new sap.ui.commons.TextField({
								layoutData: new sap.ui.layout.form.GridElementData({hCells: "auto"})})
							]
						})
					]
				})
			]
		});
		
		var oToolbar2 = new sap.ui.commons.Toolbar("tb2Sub",{width:"300px"});
		//oToolbar2.setDesign(sap.ui.commons.ToolbarDesign.Standard);		
		var button = new sap.ui.commons.Button("updateSubBtn",{
						text:"Update",
						icon: "sap-icon://save",
						press: oController.updateEditSubject
					});
		var button2 = new sap.ui.commons.Button({
						text:"Cancel",
						icon: "sap-icon://decline",
						press: oController.cancelEditSubject
					});
		oToolbar2.addItem(button);
		oToolbar2.addItem(button2);
		oForm1.setTitle("Edit Subject");
		oLayoutVertical = new sap.ui.layout.VerticalLayout("editSubForm",{
			content: [oForm1,oToolbar2]
		}).addStyleClass("editRoom");
		
		/////// new room (prev. form, new toolbar, new layout) /////
		var oToolbar3 = new sap.ui.commons.Toolbar("tb3Sub",{width:"300px"});		
		var button = new sap.ui.commons.Button("newSubBtn",{
						text:"Add",
						icon: "sap-icon://save",
						press: oController.addNewSubject
					});
		var button2 = new sap.ui.commons.Button({
						text:"Cancel",
						icon: "sap-icon://decline",
						press: oController.cancelNewSubject
					});
		oToolbar3.addItem(button);
		oToolbar3.addItem(button2);		
		oToolbar3.addStyleClass("toolbar3Spacing");
		var oFormId = "F2Sub";
		var oFormContainerId = "formC2Sub";
		var oForm2 = oForm1.clone("2");
		oForm2.setTitle("New Subject");
		oLayoutVertical = new sap.ui.layout.VerticalLayout("newSubForm",{
			content: [oForm2,oToolbar3]
		}).addStyleClass("newSubject");
		
	} // createContent

});
