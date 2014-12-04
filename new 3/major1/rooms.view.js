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
				
		var oTable = new sap.ui.table.Table("table1",{
			title:"Rooms data",
			visibleRowCount:10,
			navigationMode:sap.ui.table.NavigationMode.Paginator			
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
		
		var segBtn = new sap.ui.commons.SegmentedButton({
				buttons:[
					new sap.ui.commons.Button({
						text:"Edit",
						icon: "sap-icon://edit"
					}),
					new sap.ui.commons.Button({
						text:"Delete",
						icon: "sap-icon://delete"
					})
				]
			});
			
		oTable.addColumn(new sap.ui.table.Column("tabCol5",{
			label: new sap.ui.commons.Label({text:"Options"}),
			template: segBtn.bindProperty("tooltip","id")
			.attachSelect(function(oEvent) {
				oController.table1Option(oEvent);
			})
				
			/*
			template: new sap.ui.commons.Toolbar("toolbar1")
				.setStandalone(false)
				.bindProperty("tooltip","id")
				.bindProperty("visible","visible")
				.setDesign(sap.ui.commons.ToolbarDesign.Flat)
				.addItem(new sap.ui.commons.Button({
					press:oController.table1Option,text:"Edit",icon: "sap-icon://edit"})
				)
				.addItem(new sap.ui.commons.Button({
					press:oController.table1Option,text:"Delete",icon: "sap-icon://delete",})
				)
				*/
						    
		}));
		
		var oModel = new sap.ui.model.json.JSONModel();		
		oTable.setModel(oModel);
		oTable.bindRows("/modelData");
		oTable.placeAt("content");
	}

});
