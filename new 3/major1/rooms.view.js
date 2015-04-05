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
		oAppHeader.setUserName(userName);
		//configure the log off area
		oAppHeader.setDisplayLogoff(true);
		oAppHeader.attachEvent("logoff",oController.logOff);
		oBorderLayout1.addContent(sap.ui.commons.layout.BorderLayoutAreaTypes.top,oAppHeader);
		
		//////////////// things for begin /////////////
		///////////////////////////////////////////////
		
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
		var oPanel7 = new sap.ui.commons.Panel({showCollapseIcon: false});
		oPanel7.setAreaDesign(sap.ui.commons.enums.AreaDesign.Plain);
		oPanel7.setBorderDesign(sap.ui.commons.enums.BorderDesign.Box);
		//Set the title of the panel
		oPanel7.setTitle(new sap.ui.core.Title({text:"Backlogs"}));
		var oViewBacklogsBtn = new sap.ui.commons.Button({width:"130px",text:"View Backlogs",press:oController.manageClick});
		var oNewBacklogBtn = new sap.ui.commons.Button({width:"130px",text:"New Backlog",press:oController.manageClick});
		oLayoutVertical = new sap.ui.layout.VerticalLayout({
			content: [oViewBacklogsBtn,oNewBacklogBtn]
		});
		oPanel7.addContent(oLayoutVertical);		
		oPanel7.addStyleClass("panelSpacing");
		oBorderLayout1.addContent(sap.ui.commons.layout.BorderLayoutAreaTypes.begin,oPanel7);
		
		//Create a panel instance
		var oPanel6 = new sap.ui.commons.Panel({showCollapseIcon: false});
		oPanel6.setAreaDesign(sap.ui.commons.enums.AreaDesign.Plain);
		oPanel6.setBorderDesign(sap.ui.commons.enums.BorderDesign.Box);
		//Set the title of the panel
		oPanel6.setTitle(new sap.ui.core.Title({text:"Course Preferences"}));
		var oViewPrefBtn = new sap.ui.commons.Button({
			width:"130px",text:"View Preferences",press:oController.manageClick
		});
		oLayoutVertical = new sap.ui.layout.VerticalLayout({
			content: [oViewPrefBtn]
		});
		oPanel6.addContent(oLayoutVertical);		
		oPanel6.addStyleClass("panelSpacing");
		oBorderLayout1.addContent(sap.ui.commons.layout.BorderLayoutAreaTypes.begin,oPanel6);
		
		//Create a panel instance
		var oPanel4 = new sap.ui.commons.Panel({showCollapseIcon: false});
		oPanel4.setAreaDesign(sap.ui.commons.enums.AreaDesign.Plain);
		oPanel4.setBorderDesign(sap.ui.commons.enums.BorderDesign.Box);
		//Set the title of the panel
		oPanel4.setTitle(new sap.ui.core.Title({text:"Manage Profile"}));
		var oViewBtn = new sap.ui.commons.Button({width:"130px",text:"View",press:oController.manageClick});
		oLayoutVertical = new sap.ui.layout.VerticalLayout({
			content: [oViewBtn]
		});
		oPanel4.addContent(oLayoutVertical);		
		oPanel4.addStyleClass("panelSpacing");
		oBorderLayout1.addContent(sap.ui.commons.layout.BorderLayoutAreaTypes.begin,oPanel4);
		
		//Create a panel instance
		var oPanel8 = new sap.ui.commons.Panel("ttFilters",{showCollapseIcon :false});
		oPanel8.setAreaDesign(sap.ui.commons.enums.AreaDesign.Plain);
		oPanel8.setBorderDesign(sap.ui.commons.enums.BorderDesign.Box);
		//Set the title of the panel
		oPanel8.setTitle(new sap.ui.core.Title({text:"Filters"}));
		var textView1 = new sap.ui.commons.TextView({
			text:"Select semesters to display\nUse ctrl for multi select"
		});
		var semListBox = new sap.ui.commons.ListBox("semFilterBox",{
			allowMultiSelect:true,
			items : [
				new sap.ui.core.ListItem({text : 'first'}),
				new sap.ui.core.ListItem({text : 'second'}),
				new sap.ui.core.ListItem({text : 'third'}),
				new sap.ui.core.ListItem({text : 'fourth'}),
				new sap.ui.core.ListItem({text : 'fifth'}),
				new sap.ui.core.ListItem({text : 'sixth'}),
				new sap.ui.core.ListItem({text : 'seventh'}),
				new	sap.ui.core.ListItem({text : 'eighth'})
			],
			select : oController.filtersSem
		});
		var textView2 = new sap.ui.commons.TextView({
			text:"Enter batch names\nUse space between multiple batch names"
		});
		var textField1 = new sap.ui.commons.TextField("batchFilterText");
		var textView3 = new sap.ui.commons.TextView({
			text:"Enter room names\nUse space between multiple room names"
		});
		var textField2 = new sap.ui.commons.TextField("roomFilterText");
		var textView4 = new sap.ui.commons.TextView({
			text:"Enter teacher name"
		});
		var textField3 = new sap.ui.commons.TextField("teacherFilterText");
		var oFilterBtn = new sap.ui.commons.Button({width:"130px",text:"Apply",press:oController.applyFilters});
		var oRemFilterBtn = new sap.ui.commons.Button({width:"130px",text:"Remove Filters",press:oController.resetFilters});
		var oBackBtn = new sap.ui.commons.Button({width:"130px",text:"Back",press:oController.showBegin});
		oLayoutVertical = new sap.ui.layout.VerticalLayout({
			content: [textView1,semListBox,textView2,textField1,textView3,textField2,textView4,textField3,oFilterBtn,oRemFilterBtn,oBackBtn]
		});
		oPanel8.addContent(oLayoutVertical);
		oPanel8.addStyleClass("panelSpacing");
		/////////////////////////////////////////////////
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
		
		///////////////////// batches part ///////////////////////
		/////////////////////////////////////////////////////////
		
		var oTable3 = new sap.ui.table.Table("table3",{
			title:"Batches",
			visibleRowCount:10,
			width:"40%",
			navigationMode:sap.ui.table.NavigationMode.Paginator,
			selectionMode:sap.ui.table.SelectionMode.Single
		});
		
		oTable3.addColumn(new sap.ui.table.Column("tab3Col1",{
			label: new sap.ui.commons.Label({text:"Name"}),
			template: new sap.ui.commons.TextView().bindProperty("text","name"),
			sortProperty:"name",
			filterProperty:"name"
		}));
		
		oTable3.addColumn(new sap.ui.table.Column("tab3Col2",{
			label: new sap.ui.commons.Label({text:"Semester"}),
			template: new sap.ui.commons.TextView().bindProperty("text","semester"),
			sortProperty:"semester",
			filterProperty:"semester"
		}));
		
		oTable3.addColumn(new sap.ui.table.Column("tab3Col3",{
			label: new sap.ui.commons.Label({text:"Branch"}),
			template: new sap.ui.commons.TextView().bindProperty("text","branch"),
			sortProperty:"branch",
			filterProperty:"branch"
		}));
				
		var oModel3 = new sap.ui.model.json.JSONModel();		
		oModel3.refresh(true);
		oTable3.setModel(oModel3);
		oTable3.bindRows("/modelData");
				
		var oToolbar1 = new sap.ui.commons.Toolbar("tb1Batch",{width:"40%"});
		oToolbar1.setDesign(sap.ui.commons.ToolbarDesign.Standard);
		
		var button = new sap.ui.commons.Button("editBatchBtn",{
						text:"Edit",
						icon: "sap-icon://edit",
						press: oController.editBatch
					});
		var button2 = new sap.ui.commons.Button("deleteBatchBtn",{
						text:"Delete",
						icon: "sap-icon://delete",
						press: oController.deleteBatch
					});
		oToolbar1.addItem(button);
		oToolbar1.addItem(button2);
		oToolbar1.addStyleClass("toolbar_color");
		
		oLayoutVertical = new sap.ui.layout.VerticalLayout("batchTable",{
			content: [oTable3,oToolbar1]
		}).addStyleClass("table1");
		
		//// batch subjects table ///////
		
		var oTable4 = oTable2.clone("4");
		oTable4.setTitle("Batch's Subjects");
		oTable4.setWidth("90%");
		oTable4.setVisibleRowCount(6);
		oTable4.removeColumn("tab2Col4-4");
		oTable4.setNavigationMode(sap.ui.table.NavigationMode.Scrollbar);
		var oModel4 = new sap.ui.model.json.JSONModel();		
		oModel4.refresh(true);
		oTable4.setModel(oModel4);
		oTable4.bindRows("/modelData");
				
		var oToolbar1 = new sap.ui.commons.Toolbar("tb4Sub",{width:"90%"});
		oToolbar1.setDesign(sap.ui.commons.ToolbarDesign.Standard);
		
		var button = new sap.ui.commons.Button("addBatchSubBtn",{
						text:"Add subjects",
						icon: "sap-icon://add",
						press: oController.addBatchSubject
					});
		var button2 = new sap.ui.commons.Button("deleteBatchSubBtn",{
						text:"Delete subject",
						icon: "sap-icon://delete",
						press: oController.deleteBatchSubject
					});
		oToolbar1.addItem(button);
		oToolbar1.addItem(button2);
		oToolbar1.addStyleClass("toolbar_color");
		
		oLayoutVertical = new sap.ui.layout.VerticalLayout("batchSubjectTable",{
			content: [oTable4,oToolbar1]
		}).addStyleClass("table4");
		
		///////////// add subjects to batch table ////////
		
		var oTable5 = oTable2.clone("5");
		oTable5.setTitle("Pick Subjects");
		oTable5.setWidth("100%");
		oTable5.setVisibleRowCount(6);
		oTable5.setNavigationMode(sap.ui.table.NavigationMode.Scrollbar);
		//oTable5.removeColumn("tab2Col5-5");
		var oModel5 = new sap.ui.model.json.JSONModel();
		oModel5.refresh(true);
		oTable5.setModel(oModel5);
		oTable5.bindRows("/modelData");
		
		var oToolbar1 = new sap.ui.commons.Toolbar("tb5Sub",{width:"100%"});
		oToolbar1.setDesign(sap.ui.commons.ToolbarDesign.Standard);
		
		var button = new sap.ui.commons.Button("addBatchSubBtn1",{
						text:"Add",
						icon: "sap-icon://add",
						press: oController.addBatchSubject1
					});
		oToolbar1.addItem(button);
		oToolbar1.addStyleClass("toolbar_color");
		
		oLayoutVertical = new sap.ui.layout.VerticalLayout("batchAddSubjectTable",{
			content: [oTable5,oToolbar1]
		}).addStyleClass("table5");
		
		///////////////  edit batch (form and toolbar) ////////////
		var oLayout1 = new sap.ui.layout.form.GridLayout("L3", {singleColumn: true});
		var oFormId = "F1Batch";
		var oFormContainerId = "formC1Batch";
		var oForm1 = new sap.ui.layout.form.Form(oFormId,{
			title: new sap.ui.core.Title({text: "Edit Batch"}),
			width: "300px",
			layout: oLayout1,
			formContainers: [
				new sap.ui.layout.form.FormContainer(oFormContainerId,{
					formElements: [						
						new sap.ui.layout.form.FormElement({
							label: new sap.ui.commons.Label({
								text: "Batch Name",
								layoutData: new sap.ui.layout.form.GridElementData({hCells: "3"})
							}),
							fields: [new sap.ui.commons.TextField({
								layoutData: new sap.ui.layout.form.GridElementData({hCells: "auto"})})
							]
						}),
						new sap.ui.layout.form.FormElement({
							label: new sap.ui.commons.Label({
								text: "Semester",
								layoutData: new sap.ui.layout.form.GridElementData({hCells: "3"})
							}),
							fields: [
								// Create a DropdownBox
								new sap.ui.commons.DropdownBox("DropdownBox1Batch",{
									layoutData: new sap.ui.layout.form.GridElementData({hCells: "auto"})})
								.setTooltip("Semester")
								.setEditable(true)
								.setWidth("200px")
								.addItem(
									new sap.ui.core.ListItem()
									.setText("first")
								)
								.addItem(
									new sap.ui.core.ListItem()
									.setText("second")
								)	
								.addItem(
									new sap.ui.core.ListItem()
									.setText("third")
								)
								.addItem(
									new sap.ui.core.ListItem()
									.setText("fourth")
								)
								.addItem(
									new sap.ui.core.ListItem()
									.setText("fifth")
								)	
								.addItem(
									new sap.ui.core.ListItem()
									.setText("sixth")
								)
								.addItem(
									new sap.ui.core.ListItem()
									.setText("seventh")
								)
								.addItem(
									new sap.ui.core.ListItem()
									.setText("eighth")
								)
							]
						}),
						new sap.ui.layout.form.FormElement({
							label: new sap.ui.commons.Label({
								text: "Branch",
								layoutData: new sap.ui.layout.form.GridElementData({hCells: "3"})
							}),
							fields: [
								// Create a DropdownBox
								new sap.ui.commons.DropdownBox("DropdownBox2Batch",{
									layoutData: new sap.ui.layout.form.GridElementData({hCells: "auto"})})
								.setTooltip("Branch")
								.setEditable(true)
								.setWidth("200px")
								.addItem(
									new sap.ui.core.ListItem()
									.setText("cse")
								)
								.addItem(
									new sap.ui.core.ListItem()
									.setText("ece")
								)	
								.addItem(
									new sap.ui.core.ListItem()
									.setText("IT")
								)
								.addItem(
									new sap.ui.core.ListItem()
									.setText("biotech")
								)
							]
						})
					]
				})
			]
		});
		
		var oToolbar2 = new sap.ui.commons.Toolbar("tb2Batch",{width:"300px"});
		//oToolbar2.setDesign(sap.ui.commons.ToolbarDesign.Standard);		
		var button = new sap.ui.commons.Button("updateBatchBtn",{
						text:"Update",
						icon: "sap-icon://save",
						press: oController.updateEditBatch
					});
		var button2 = new sap.ui.commons.Button({
						text:"Cancel",
						icon: "sap-icon://decline",
						press: oController.cancelEditBatch
					});
		oToolbar2.addItem(button);
		oToolbar2.addItem(button2);
		oForm1.setTitle("Edit Batch");
		oLayoutVertical = new sap.ui.layout.VerticalLayout("editBatchForm",{
			content: [oForm1,oToolbar2]
		}).addStyleClass("editRoom");

		/////// new batch (prev. form, new toolbar, new layout) /////
		
		var oToolbar3 = new sap.ui.commons.Toolbar("tb3Batch",{width:"300px"});
		var button = new sap.ui.commons.Button("newBatchBtn",{
						text:"Add",
						icon: "sap-icon://save",
						press: oController.addNewBatch
					});
		var button2 = new sap.ui.commons.Button({
						text:"Cancel",
						icon: "sap-icon://decline",
						press: oController.cancelNewBatch
					});
		oToolbar3.addItem(button);
		oToolbar3.addItem(button2);		
		oToolbar3.addStyleClass("toolbar3Spacing");
		var oFormId = "F2Batch";
		var oFormContainerId = "formC2Batch";
		var oForm2 = oForm1.clone("2");
		oForm2.setTitle("New Batch");
		oLayoutVertical = new sap.ui.layout.VerticalLayout("newBatchForm",{
			content: [oForm2,oToolbar3]
		}).addStyleClass("newBatch");
		
		///////////////////// backlog students ////////////////////
		///////////////////////////////////////////////////////////
		
		var oTable8 = new sap.ui.table.Table("table8",{
			title:"Students with backlogs",
			width:"40%",
			visibleRowCount:10,
			selectionMode:sap.ui.table.SelectionMode.Single
		});
		oTable8.addColumn( new sap.ui.table.Column({
			label: new sap.ui.commons.Label({text:"id"}),
			template: new sap.ui.commons.TextView().bindProperty("text","id")
		}));
		oTable8.addColumn( new sap.ui.table.Column({
			label: new sap.ui.commons.Label({text:"name"}),
			template: new sap.ui.commons.TextView().bindProperty("text","name")
		}));
		oTable8.addColumn( new sap.ui.table.Column({
			label: new sap.ui.commons.Label({text:"batch"}),
			template: new sap.ui.commons.TextView().bindProperty("text","batchName")
		}));
		oTable8.addColumn( new sap.ui.table.Column({
			label: new sap.ui.commons.Label({text:"semester"}),
			template: new sap.ui.commons.TextView().bindProperty("text","semester")
		}));
		oTable8.addColumn( new sap.ui.table.Column({
			label: new sap.ui.commons.Label({text:"branch"}),
			template: new sap.ui.commons.TextView().bindProperty("text","branch")
		}));
		
		var oModel = new sap.ui.model.json.JSONModel();
		oTable8.setModel(oModel);
		oTable8.bindRows("/modelData");
		
		var oToolbar1 = new sap.ui.commons.Toolbar("tb1Backlog",{width:"40%"});
		oToolbar1.setDesign(sap.ui.commons.ToolbarDesign.Standard);
		
		var button = new sap.ui.commons.Button("editBacklogBtn",{
						text:"Edit",
						icon: "sap-icon://edit",
						press: oController.editBacklog
					});
		var button2 = new sap.ui.commons.Button("deleteBacklogBtn",{
						text:"Delete",
						icon: "sap-icon://delete",
						press: oController.deleteBacklog
					});
		oToolbar1.addItem(button);
		oToolbar1.addItem(button2);
		oToolbar1.addStyleClass("toolbar_color");
		
		oLayoutVertical = new sap.ui.layout.VerticalLayout("backlogTable",{
			content: [oTable8,oToolbar1]
		}).addStyleClass("table1");
		
		///////////////// new backlog  ///////////////
		
		var oModel = new sap.ui.model.json.JSONModel();		
		oModel.setData({modelData:[{bName:"b1"},{bName:"b2"}]});
		var batchDropdown = new sap.ui.commons.DropdownBox("newBaklgBatchDD",{
			layoutData: new sap.ui.layout.form.GridElementData({hCells: "auto"})
		});
		batchDropdown.setModel(oModel);
		var oItemTemplate = new sap.ui.core.ListItem();
		oItemTemplate.bindProperty("text","bName");
		batchDropdown.bindItems("/modelData",oItemTemplate);
		
		var oLayout1 = new sap.ui.layout.form.GridLayout( {singleColumn: true});
		var oFormId = "F1Backlog";
		var oFormContainerId = "formC1Backlog";
		var oForm1 = new sap.ui.layout.form.Form(oFormId,{
			title: new sap.ui.core.Title({text: "New backlog student"}),
			width: "300px",
			layout: oLayout1,
			formContainers: [
				new sap.ui.layout.form.FormContainer(oFormContainerId,{
					formElements: [						
						new sap.ui.layout.form.FormElement({
							label: new sap.ui.commons.Label({
								text: "Id",
								layoutData: new sap.ui.layout.form.GridElementData({hCells: "3"})
							}),
							fields: [new sap.ui.commons.TextField({
								layoutData: new sap.ui.layout.form.GridElementData({hCells: "auto"})})
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
								text: "Semester",
								layoutData: new sap.ui.layout.form.GridElementData({hCells: "3"})
							}),
							fields: [
								// Create a DropdownBox
								new sap.ui.commons.DropdownBox({
									layoutData: new sap.ui.layout.form.GridElementData({hCells: "auto"})})
								.setTooltip("Semester")
								.setEditable(true)
								.setWidth("200px")
								.addItem(
									new sap.ui.core.ListItem()
									.setText("first")
								)
								.addItem(
									new sap.ui.core.ListItem()
									.setText("second")
								)	
								.addItem(
									new sap.ui.core.ListItem()
									.setText("third")
								)
								.addItem(
									new sap.ui.core.ListItem()
									.setText("fourth")
								)
								.addItem(
									new sap.ui.core.ListItem()
									.setText("fifth")
								)	
								.addItem(
									new sap.ui.core.ListItem()
									.setText("sixth")
								)
								.addItem(
									new sap.ui.core.ListItem()
									.setText("seventh")
								)
								.addItem(
									new sap.ui.core.ListItem()
									.setText("eighth")
								).attachEvent("change",oController.newBacklogSemChange)
							]
						}),
						new sap.ui.layout.form.FormElement({
							label: new sap.ui.commons.Label({
								text: "Branch",
								layoutData: new sap.ui.layout.form.GridElementData({hCells: "3"})
							}),
							fields: [
								// Create a DropdownBox
								new sap.ui.commons.DropdownBox({
									layoutData: new sap.ui.layout.form.GridElementData({hCells: "auto"})})
								.setTooltip("Branch")
								.setEditable(true)
								.setWidth("200px")
								.addItem(
									new sap.ui.core.ListItem()
									.setText("cse")
								)
								.addItem(
									new sap.ui.core.ListItem()
									.setText("ece")
								)	
								.addItem(
									new sap.ui.core.ListItem()
									.setText("IT")
								)
								.addItem(
									new sap.ui.core.ListItem()
									.setText("biotech")
								).attachEvent("change",oController.newBacklogBranchChange)
							]
						}),
						new sap.ui.layout.form.FormElement({
							label: new sap.ui.commons.Label({
								text: "Current batch",
								layoutData: new sap.ui.layout.form.GridElementData({hCells: "3"})
							}),
							fields: [
								batchDropdown
							]
						})
					]
				})
			]
		});
		
		var oToolbar2 = new sap.ui.commons.Toolbar("tb2Backlog",{width:"300px"});
		//oToolbar2.setDesign(sap.ui.commons.ToolbarDesign.Standard);		
		var button = new sap.ui.commons.Button("createBacklogBtn",{
						text:"Create",
						icon: "sap-icon://save",
						press: oController.createBacklog
					});
		var button2 = new sap.ui.commons.Button({
						text:"Cancel",
						icon: "sap-icon://decline",
						press: oController.cancelBacklog
					});
		oToolbar2.addItem(button);
		oToolbar2.addItem(button2);
		oLayoutVertical = new sap.ui.layout.VerticalLayout("createBacklogForm",{
			content: [oForm1,oToolbar2]
		}).addStyleClass("newBacklog");
		
		///////////////// backlog subjects //////////////
		
		var oTable9 = oTable2.clone("9");
		oTable9.setTitle("Backlog Subjects");
		oTable9.setWidth("90%");
		oTable9.setVisibleRowCount(6);
		oTable9.removeColumn("tab2Col4-9");
		oTable9.setNavigationMode(sap.ui.table.NavigationMode.Scrollbar);
		var oModel4 = new sap.ui.model.json.JSONModel();		
		oModel4.refresh(true);
		oTable9.setModel(oModel4);
		oTable9.bindRows("/modelData");
				
		var oToolbar1 = new sap.ui.commons.Toolbar("tb9Sub",{width:"90%"});
		oToolbar1.setDesign(sap.ui.commons.ToolbarDesign.Standard);
		
		var button = new sap.ui.commons.Button("addBacklogSubBtn",{
						text:"Add subjects",
						icon: "sap-icon://add",
						press: oController.addBacklogSubject
					});
		var button2 = new sap.ui.commons.Button("deleteBacklogSubBtn",{
						text:"Delete subject",
						icon: "sap-icon://delete",
						press: oController.deleteBacklogSubject
					});
		oToolbar1.addItem(button);
		oToolbar1.addItem(button2);
		oToolbar1.addStyleClass("toolbar_color");
		
		oLayoutVertical = new sap.ui.layout.VerticalLayout("backlogSubjectTable",{
			content: [oTable9,oToolbar1]
		}).addStyleClass("table4");
		
		var oTable11 = oTable9.clone("11");	//to be placed at view backlogs id: table2-9-11
		var oModel = new sap.ui.model.json.JSONModel();
		oTable11.setModel(oModel);
		oTable11.bindRows("/modelData");
		oTable11.setWidth("50%");
		oTable11.addStyleClass("table4");
		///////////// add subjects to backlog table ////////
		
		var oTable10 = oTable2.clone("10");
		oTable10.setTitle("Pick Subjects");
		oTable10.setWidth("100%");
		oTable10.setVisibleRowCount(6);
		oTable10.setNavigationMode(sap.ui.table.NavigationMode.Scrollbar);
		//oTable5.removeColumn("tab2Col5-5");
		var oModel = new sap.ui.model.json.JSONModel();
		oModel.refresh(true);
		oTable10.setModel(oModel);
		oTable10.bindRows("/modelData");
		
		var oToolbar1 = new sap.ui.commons.Toolbar("tb10Sub",{width:"100%"});
		oToolbar1.setDesign(sap.ui.commons.ToolbarDesign.Standard);
		
		var button = new sap.ui.commons.Button("addBacklogSubBtn1",{
						text:"Add",
						icon: "sap-icon://add",
						press: oController.addBacklogSubject1
					});
		oToolbar1.addItem(button);
		oToolbar1.addStyleClass("toolbar_color");
		
		oLayoutVertical = new sap.ui.layout.VerticalLayout("backlogAddSubjectTable",{
			content: [oTable10,oToolbar1]
		}).addStyleClass("table5");
		
		//////////////////// course preferences ///////////////////
		///////////////////////////////////////////////////////////
		
		var oTable6 = oTable2.clone("6");
		oTable6.setTitle("Course preferences");
		oTable6.setWidth("80%");
		oTable6.setVisibleRowCount(5);
		oTable6.setNavigationMode(sap.ui.table.NavigationMode.Scrollbar);
		//oTable6.removeColumn("tab2Col1-6");
		//oTable6.removeColumn("tab2Col5-6");
		
		oTable6.addColumn(new sap.ui.table.Column("tab2Col7",{
			label: new sap.ui.commons.Label({text:"Options"}),
			template: new sap.ui.commons.SegmentedButton({
				id:"prefOptions",
				buttons:[
					new sap.ui.commons.Button({
						icon:"sap-icon://navigation-up-arrow",
						//iconHovered:"images/sb/list_hover.png",
						iconSelected:"sap-icon://navigation-up-arrow",
						tooltip:"move up"
					}),
					new sap.ui.commons.Button({
						icon:"sap-icon://navigation-down-arrow",
						//iconHovered:"images/sb/list_hover.png",
						iconSelected:"sap-icon://navigation-down-arrow",
						tooltip:"move down"
					}),
					new sap.ui.commons.Button({
						icon:"sap-icon://sys-cancel",
						//iconHovered:"images/sb/list_hover.png",
						iconSelected:"sap-icon://sys-cancel",
						tooltip:"remove"
					})
				]
			}).attachSelect(oController.prefChangeBtn)
		}));
		var oModel6 = new sap.ui.model.json.JSONModel();
		oModel6.refresh(true);
		oTable6.setModel(oModel6);
		oTable6.bindRows("/modelData");
		oTable6.addStyleClass("table1");
		
		/////// choose subjects from this table ////////
	
		var oTable7 = oTable2.clone("7");
		oTable7.setTitle("Pick Subjects");
		oTable7.setWidth("80%");
		oTable7.setVisibleRowCount(8);
		oTable7.setNavigationMode(sap.ui.table.NavigationMode.Scrollbar);
		
		oTable7.addColumn(new sap.ui.table.Column("ll",{
			label: new sap.ui.commons.Label({text:"Add"}),
			template: new sap.ui.commons.SegmentedButton({
				id:"addPrefSubj",
				buttons:[
					new sap.ui.commons.Button({
						lite:true,
						icon:"sap-icon://sys-add",						
						tooltip:"add"
					})
				]
			}).attachSelect(oController.addPrefSubject)
		}));
		
		var oModel7 = new sap.ui.model.json.JSONModel();
		oModel7.refresh(true);
		oTable7.setModel(oModel7);
		oTable7.bindRows("/modelData");
		oTable7.addStyleClass("table1_down");
		
		var btn = new sap.ui.commons.Button("updatePrefsBtn",{
			text:"Update preferences",
			press:oController.updatePrefs
		}).addStyleClass("updatePrefsBtn");
		
		/////////////////////////////////////////////////
		////////////////// Time Table ///////////////////
		
		var oTableT1 = new sap.ui.table.Table("tableT1",{
			title:"Monday",
			visibleRowCount:5,
			width:"100%",
			selectionMode:sap.ui.table.SelectionMode.Single
		}).setEditable(true);
		
		oTableT1.addColumn(new sap.ui.table.Column("tabTCol1",{
			label: new sap.ui.commons.Label({text:"9-10"}),
			template: new sap.ui.commons.TextView().bindProperty("text","nine")
		}));
		
		oTableT1.addColumn(new sap.ui.table.Column("tabTCol2",{
			label: new sap.ui.commons.Label({text:"10-11"}),
			template: new sap.ui.commons.TextView().bindProperty("text","ten")
		}));
		
		oTableT1.addColumn(new sap.ui.table.Column("tabTCol3",{
			label: new sap.ui.commons.Label({text:"11-12"}),
			template: new sap.ui.commons.TextView().bindProperty("text","eleven")
		}));
		
		oTableT1.addColumn(new sap.ui.table.Column("tabTCol4",{
			label: new sap.ui.commons.Label({text:"12-1"}),
			template: new sap.ui.commons.TextView().bindProperty("text","twelve")
		}));
		
		oTableT1.addColumn(new sap.ui.table.Column("tabTCol5",{
			label: new sap.ui.commons.Label({text:"1-2"}),
			template: new sap.ui.commons.TextView().bindProperty("text","one")
		}));
		
		oTableT1.addColumn(new sap.ui.table.Column("tabTCol6",{
			label: new sap.ui.commons.Label({text:"2-3"}),
			template: new sap.ui.commons.TextView().bindProperty("text","two")
		}));
		
		oTableT1.addColumn(new sap.ui.table.Column("tabTCol7",{
			label: new sap.ui.commons.Label({text:"3-4"}),
			template: new sap.ui.commons.TextView().bindProperty("text","three")
		}));
		
		oTableT1.addColumn(new sap.ui.table.Column("tabTCol8",{
			label: new sap.ui.commons.Label({text:"4-5"}),
			template: new sap.ui.commons.TextView().bindProperty("text","four")
		}));
		oTableT1.addStyleClass("panelSpacing");
		var oModel = new sap.ui.model.json.JSONModel();		
		oModel.refresh(true);
		oTableT1.setModel(oModel);
		oTableT1.bindRows("/modelData");		
		
		//var dat = '[{"nine":"1,b1b2b3,operating system lecture,Utkarsh Siwach","ten":"werwer"}]';
		//var da = JSON.parse(dat);
		//oModel.setData({modelData:da});
		
		var oTable2 = oTableT1.clone("2");
		oTable2.setTitle("Tuesday");
		oTable2.addStyleClass("panelSpacing");
		oModel = new sap.ui.model.json.JSONModel();		
		oModel.refresh(true);
		oTable2.setModel(oModel);
		oTable2.bindRows("/modelData");
		
		var oTable3 = oTableT1.clone("3");
		oTable3.setTitle("Wednesday");
		oTable3.addStyleClass("panelSpacing");
		oModel = new sap.ui.model.json.JSONModel();		
		oModel.refresh(true);
		oTable3.setModel(oModel);
		oTable3.bindRows("/modelData");
		
		var oTable4 = oTableT1.clone("4");
		oTable4.setTitle("Thursday");
		oTable4.addStyleClass("panelSpacing");
		oModel = new sap.ui.model.json.JSONModel();		
		oModel.refresh(true);
		oTable4.setModel(oModel);
		oTable4.bindRows("/modelData");
		
		var oTable5 = oTableT1.clone("5");
		oTable5.setTitle("Friday");
		oTable5.addStyleClass("panelSpacing");
		oModel = new sap.ui.model.json.JSONModel();		
		oModel.refresh(true);
		oTable5.setModel(oModel);
		oTable5.bindRows("/modelData");
		
		var oTable6 = oTableT1.clone("6");
		oTable6.setTitle("Saturday");
		oTable6.addStyleClass("panelSpacing");
		oModel = new sap.ui.model.json.JSONModel();		
		oModel.refresh(true);
		oTable6.setModel(oModel);
		oTable6.bindRows("/modelData");
		
		var oTable = new sap.ui.table.Table("tableUT",{
			title:"Unplaced slots",
			visibleRowCount:10,
			width:"100%",
			selectionMode:sap.ui.table.SelectionMode.Single
		}).addStyleClass("panelSpacing");
		
		oTable.addColumn(new sap.ui.table.Column("tabUTCol1",{
			label: new sap.ui.commons.Label({text:"Slots"}),
			template: new sap.ui.commons.TextView().bindProperty("text","slot")
		}));
		oModel = new sap.ui.model.json.JSONModel();		
		oModel.refresh(true);
		oTable.setModel(oModel);
		oTable.bindRows("/modelData");
		oLayoutVertical = new sap.ui.layout.VerticalLayout("allTimeTable",{
			content: [oTableT1,oTable2,oTable3,oTable4,oTable5,oTable6,oTable]
		}).addStyleClass("allTimeTable");
		
		////////////////  create timetable /////////////////
		
		var oLayout1 = new sap.ui.layout.form.GridLayout("L4", {singleColumn: true});		
		var oForm1 = new sap.ui.layout.form.Form("createTTForm",{
			title: new sap.ui.core.Title({text: "Connect to server"}),
			width: "330px",
			layout: oLayout1,
			formContainers: [
				new sap.ui.layout.form.FormContainer("createTTFormCont",{
					formElements: [						
						new sap.ui.layout.form.FormElement({
							label: new sap.ui.commons.Label({
								text: "IP Address of server",
								layoutData: new sap.ui.layout.form.GridElementData({hCells: "4"})
							}),
							fields: [new sap.ui.commons.TextField({
								value:"127.0.0.1",
								layoutData: new sap.ui.layout.form.GridElementData({hCells: "auto"})})
							]
						}),
						new sap.ui.layout.form.FormElement({
							label: new sap.ui.commons.Label({
								text: "Port number of server",
								layoutData: new sap.ui.layout.form.GridElementData({hCells: "4"})
							}),
							fields: [new sap.ui.commons.TextField({
								value:"27015",
								layoutData: new sap.ui.layout.form.GridElementData({hCells: "auto"})})
							]
						}),
						new sap.ui.layout.form.FormElement({
							label: new sap.ui.commons.Label({
								text: "Number of iterations",
								layoutData: new sap.ui.layout.form.GridElementData({hCells: "4"})
							}),
							fields: [new sap.ui.commons.TextField({
								value:"50",
								layoutData: new sap.ui.layout.form.GridElementData({hCells: "auto"})})
							]
						})
					]
				})
			]
		});		
		var connectBtn = new sap.ui.commons.Button("conBtn",{
			text:"Connect",
			press:oController.connectToCppServer
		}).addStyleClass("toolbar3Spacing");		
		oLayoutVertical = new sap.ui.layout.VerticalLayout("createTT",{
			content: [oForm1,connectBtn]
		}).addStyleClass("connectToServer");
			
		
	} // createContent

});
