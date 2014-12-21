<?php
	session_start();
	if(!isset($_SESSION['dept'])) {
		die("unathorized");
	}
?>

<!DOCTYPE HTML>
<html>
	<head>
	<meta http-equiv="X-UA-Compatible" content="IE=edge">
	<meta http-equiv='Content-Type' content='text/html;charset=UTF-8'/>
	
		<link href="styl.css" type="text/css" rel="stylesheet" />
		<script src="https://openui5.hana.ondemand.com/resources/sap-ui-core.js"		
			id="sap-ui-bootstrap"
			data-sap-ui-libs="sap.ui.commons, sap.ui.table,sap.ui.ux3"
			data-sap-ui-theme="sap_bluecrystal">
			</script>
			<!-- add sap.ui.table,sap.ui.ux3 and/or other libraries to 'data-sap-ui-libs' if required -->
			
			<script>
			
			var userDept = "<?php echo $_SESSION['dept'] ?>";
			var userName = "<?php echo $_SESSION['name'] ?>";
			var userId 	 =  <?php echo $_SESSION['userId'] ?>;	// table teachers.id
			
			sap.ui.localResources("major1");			
			var view = sap.ui.view({id:"idrooms1", viewName:"major1.rooms", type:sap.ui.core.mvc.ViewType.JS});
			
		</script>
	</head>
	<body class="sapUiBody" role="application">		
		<div id="content" style='background-color:lavenderblush'></div>
	</body>
</html>