<?php
session_start();
?>


<?php
if ( isset($_POST['name']) && isset($_POST['rtype']) && isset($_POST['cap']) ) {

include_once("db_conx.php");

	// obtain ip
	/*$ipaddress = '';
    if (getenv('HTTP_CLIENT_IP'))
        $ipaddress = getenv('HTTP_CLIENT_IP');
    else if(getenv('HTTP_X_FORWARDED_FOR'))
        $ipaddress = getenv('HTTP_X_FORWARDED_FOR'&quot);
    else if(getenv('HTTP_X_FORWARDED'))
        $ipaddress = getenv('HTTP_X_FORWARDED');
    else if(getenv('HTTP_FORWARDED_FOR'))
        $ipaddress = getenv('HTTP_FORWARDED_FOR');
    else if(getenv('HTTP_FORWARDED'))
       $ipaddress = getenv('HTTP_FORWARDED');
    else if(getenv('REMOTE_ADDR'))
        $ipaddress = getenv('REMOTE_ADDR');
    else
        $ipaddress = 'UNKNOWN';*/

	//user id 	
	/*$u = $_SESSION['SESS_EMAIL'];
	if (is_numeric($u)) {
		//$query = "UPDATE USERS SET FName='$f', LName='$l', Gender='$g', ModifiedIP = '$ipaddress' WHERE phone='$u'";
		$query1 = "SELECT UserID FROM USERS WHERE phone='$u'";
	}
	else {
		//$query = "UPDATE USERS SET FName='$f', LName='$l', Gender='$g', ModifiedIP = '$ipaddress' WHERE email='$u'";
		$query1 = "SELECT UserID FROM USERS WHERE email='$u'";
	}
	
	
	$result = mysqli_query($con, $query1);
	$member = mysqli_fetch_assoc($result);	
	
	$uid = $member['UserID']; //will be stored in 'created by' */
	//$subject =  $_POST['subject'];
	$rtype = $_POST['rtype'];
	$name = $_POST['name'];
	$cap = $_POST['cap'];
	
	$query = "UPDATE ROOM SET Capacity='$cap', Type='$rtype' WHERE Name = '$name' ";
	$result = mysqli_query($con, $query) or die(mysqli_error($con));
	if ($result) {
	echo "Success!";
	exit(); }
	else echo "Failed";
}
?>





<?php

if (isset ($_POST['rid'])) {
	require_once("db_conx.php");
	
	$rid = $_POST['rid'];
	if ($rid == "all") $query = "SELECT * FROM ROOM";
	else $query = "SELECT * FROM ROOM where type='$rid'";
	$results=mysqli_query($con,$query) or die(mysqli_error($con));
	
	if ($results) {
	
	echo "<table id='param-table' align='center' style=' border: 1px solid black;'><tr style=' border: 1px solid black; padding: 15px'><td style=' border: 1px solid black; padding: 15px;'>Room Name</td><td style=' border: 1px solid black;  padding: 15px;'>Type</td><td style='  padding: 15px; border: 1px solid black;'>Capacity</td><td style='  padding: 15px; border: 1px solid black;'>Location</td> <td style='  padding: 15px; border: 1px solid black;'>Edit Room</td><tr>";
	while ($row_users = mysqli_fetch_array($results)) {
		echo "<form onSubmit='return false;' method='POST' style='float:left;'><tr style=' border: 1px solid black;  padding: 15px;'><td style=' border: 1px solid black;  padding: 15px;'>".$row_users['Name']."</td><td style=' border: 1px solid black;  padding: 15px;'>"."<input name='rtype' type='text'  maxlength='50' value='".$row_users['Type']."'>"."</td><td style=' border: 1px solid black;  padding: 15px;'>"."<input name='cap' type='text'  maxlength='50' value='".$row_users['Capacity']."'>"."</td><td style=' border: 1px solid black;  padding: 15px;'>".$row_users['Location']."</td><td style=' border: 1px solid black;  padding: 15px;'>"."<button onclick='editParam(\"" . $row_users['Name'] . "\", this)'>Edit</button>"."</td></form></tr>";
	}
	echo "</table>";
	}
	//echo "Success!";
	//echo "</form>";
	else echo "something went wrong!";
	exit();
	
}
?>

<html>
   <script src="js/main.js"></script>
<script src="js/ajax.js"></script>
<script>
function filter() {
var rid = document.getElementById('rid').value;
var status = document.getElementById('status');
var ajax = ajaxObj("POST", "room.php"); // accepted
status.innerHTML = "Please wait..";
        ajax.onreadystatechange = function() {
	        if(ajaxReturn(ajax) == true) {
	            if(ajax.responseText.trim() === "Success!"){ ///returned from php file
					
					status.innerHTML = ajax.responseText;
				}
				
				else {status.innerHTML = ajax.responseText;}
	        }
        }
        ajax.send("rid="+rid); //shoots variable to php 

}
</script>

<script>
function editParam(name, button) {
    var tr, rtype, cap;
	var status = document.getElementById('status');
    // Find the row containing these inputs
    tr = button.parentNode;
    while (tr && tr.nodeName.toUpperCase() !== "TR" && tr.nodeName.toUpperCase() !== "BODY") {
        tr = tr.parentNode;
    }
    if (!tr || tr.nodeName.toUpperCase() !== "TR") {
        return; // Something went wrong
    }
	
	rtype = tr.querySelector("input[name='rtype']").value;
    //year  = tr.querySelector("input[name='year']").value;
	cap  = tr.querySelector("input[name='cap']").value;

	//alert(subject+btype+bname+year);
	
	if ( rtype == "" || cap == "") {
		status.innerHTML = "You cannot leave information blank";
		return;
	}

	

	if (rtype.length > 50){
		status.innerHTML = "Type cannot be greater than 50 characters.";
		return;
	}
	
	if (rtype!='Lecture' || rtype!= 'Lab' || rtype!= 'Tut') {
		status.innerHTML = "Room must be Lecture, Lab or Tut";
		return;
	}

	if ( cap <=0 ||cap >= 5 ) {
		status.innerHTML = "Capacity must be between 1-5 batches.";
		return;
	}
	
	

 else {
		status.innerHTML = 'Please wait...';
		var ajax = ajaxObj("POST", "room.php"); // accepted
        ajax.onreadystatechange = function() {
	        if(ajaxReturn(ajax) == true) {
	            if(ajax.responseText.trim() === "Success!"){ ///returned from php file
					
					status.innerHTML = ajax.responseText;
				}
				
				else {status.innerHTML = ajax.responseText;}
	        }
        }
        ajax.send("name="+name+"&rtype="+rtype+"&cap="+cap); //shoots variable to php 
	
}
	
	
    
}

</script>


<body>
	<a href="new_room.php" style="float:right;">New Room</a>
	
	<form id="filter-batch" onsubmit="return false;"  align="center">
		Room Type :<select name="rid" id="rid" autofocus>
		<option value="all" selected>ALL</option>
		<option value="lecture" >Lecture</option>
		<option value="tut">Tutorial</option>
		<option value="lab" >Lab</option>
		
	</select>
	<button onclick="filter()">Filter</button>
</form>

<center><span id="status" style="color:red"></span></center>

	</form>
</body>
</html>