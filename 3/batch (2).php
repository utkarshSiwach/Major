<?php
session_start();
?>


<?php
if ( isset($_POST['bname']) && isset($_POST['btype']) && isset($_POST['year']) && isset($_POST['subject'])) {

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
	$subject =  $_POST['subject'];
	$btype = $_POST['btype'];
	$bname = $_POST['bname'];
	$year = $_POST['year'];
	
	$query = "UPDATE BATCH SET Type='$btype' WHERE Name = '$bname' AND Year='$year'";
	$result = mysqli_query($con, $query) or die(mysqli_error($con));
	if ($result) {
	echo "Success!";
	exit(); }
	else echo "Failed";
}
?>





<?php

if (isset ($_POST['sid'])) {
	require_once("db_conx.php");
	//$u = $_SESSION['SESS_EMAIL'];
	/*if (is_numeric($u)) {
		$query1 = "SELECT UserID FROM users WHERE phone='$u'";
	}
	else {
		$query1 = "SELECT UserID FROM users WHERE email='$u'";
	}
	$result = mysqli_query($con, $query1);
	$member = mysqli_fetch_assoc($result);
	$member = $member['UserID'];*/
	
	//echo "<form id='param-main' onsubmit = 'return false;'>";
	
	$sid = $_POST['sid'];
	if ($sid == "all") {
		$query = " select BID,Name,Type,Year from batch";
	}
	else $query = "select BID,Name,Type,Year from batch where Year='$sid'";
	$results=mysqli_query($con,$query) or die(mysqli_error($con));
	
	if ($results) {
	
	echo "<table id='param-table' align='center' style=' border: 1px solid black;'>".
			"<tr style=' border: 1px solid black; padding: 15px'>".
				"<td style=' border: 1px solid black; padding: 15px;'>Batch Name</td>".
				"<td style=' border: 1px solid black;  padding: 15px;'>Type</td>".
				"<td style='  padding: 15px; border: 1px solid black;'>Subjects</td>".
				"<td style='  padding: 15px; border: 1px solid black;'>Year</td>".
				"<td style='  padding: 15px; border: 1px solid black;'>Edit Batch</td>".
			"</tr>";
		
	while ($prev_row = mysqli_fetch_array($results)) {
		echo "<tr style=' border: 1px solid black;  padding: 15px;'>".
			"<form onSubmit='return false;' method='POST' style='float:left;'>".
				"<td style=' border: 1px solid black;  padding: 15px;'>".$prev_row['Name']."</td>".
				"<td style=' border: 1px solid black;  padding: 15px;'>".
					"<input name='btype' type='text'  maxlength='50' value='".$prev_row['Type']."'>".
				"</td>".
				"<td style=' border: 1px solid black;  padding: 15px;'>".
					"<button onclick='viewSubjects($prev_row[BID])'>View Subjects</button>".
					"<button onclick='addSubjects($prev_row[BID])'>Add Subjects</button>".
				"</td>".
				"<td style=' border: 1px solid black;  padding: 15px;'>".$prev_row['Year']."</td>".
				"<td style=' border: 1px solid black;  padding: 15px;'>".
					"<button onclick='editParam(\"" . $prev_row['Name'] . "\",\"" . $prev_row['Year'] . "\", this)'>Edit</button>".
				"</td>".
			"</form>".
		"</tr>";
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
var sid = document.getElementById('sid').value;
var status = document.getElementById('status');
var ajax = ajaxObj("POST", "batch.php"); // accepted
status.innerHTML = "Please wait..";
        ajax.onreadystatechange = function() {
	        if(ajaxReturn(ajax) == true) {
	            if(ajax.responseText.trim() === "Success!"){ ///returned from php file
					
					status.innerHTML = ajax.responseText;
				}
				
				else {status.innerHTML = ajax.responseText;}
	        }
        }
        ajax.send("sid="+sid); //shoots variable to php 

}
</script>

<script>
function editParam(bname, year, button) {
    var tr, btype, subject;
	//var year = document.getElementById('sid').value;
	//alert(bname+year);
	var status = document.getElementById('status');
    // Find the row containing these inputs
    tr = button.parentNode;
    while (tr && tr.nodeName.toUpperCase() !== "TR" && tr.nodeName.toUpperCase() !== "BODY") {
        tr = tr.parentNode;
    }
    if (!tr || tr.nodeName.toUpperCase() !== "TR") {
        return; // Something went wrong
    }
	//alert(bname+year);
    //stype = tr.querySelector("input[name='stype']").value;
	btype = tr.querySelector("input[name='btype']").value;
    //year  = tr.querySelector("input[name='year']").value;
	subject  = tr.querySelector("input[name='subject']").value;

	alert(subject+btype+bname+year);
	
	if ( btype == "" || year == "" || subject == "" || bname == "") {
		status.innerHTML = "You cannot leave information blank";
		return;
	}

	

	if (btype.length > 50){
		status.innerHTML = "Type cannot be greater than 50 characters.";
		return;
	}

	if (year.length > 20) {
		status.innerHTML = "Year cannot be greater than 20 characters.";
		return;
	}
	
	if (subject.length > 50) {
		status.innerHTML = "Subject cannot be greater than 50 characters.";
		return;
	}

 else {
		status.innerHTML = 'Please wait...';
		var ajax = ajaxObj("POST", "batch.php"); // accepted
        ajax.onreadystatechange = function() {
	        if(ajaxReturn(ajax) == true) {
	            if(ajax.responseText.trim() === "Success!"){ ///returned from php file
					
					status.innerHTML = ajax.responseText;
				}
				
				else {status.innerHTML = ajax.responseText;}
	        }
        }
        ajax.send("bname="+bname+"&btype="+btype+"&year="+year+"&subject="+subject); //shoots variable to php 
	
}
	
	
    
}

function viewSubjects(bid) {
	$.ajax({
		url:"specialViewSubjects.php?BID="+bid,
		success:function(data) {
			alert(data);
		}
	});
}

function addSubjects(bid) {

}

</script>


<body>
	<a href="new_batch.php" style="float:right;">New Batch</a>
	
	<form id="filter-batch" onsubmit="return false;"  align="center">
		Year :<select name="sid" id="sid" autofocus>
		<option value="all" selected>ALL</option>
		<option value="first" >First Year</option>
		<option value="second">Second Year</option>
		<option value="third" >Third Year</option>
		<option value="fourth">Fourth Year</option>
		<option value="fifth">Fifth Year</option>
	</select>
	<button onclick="filter()">Filter</button>
</form>

<center><span id="status" style="color:red"></span></center>

	</form>
</body>
</html>