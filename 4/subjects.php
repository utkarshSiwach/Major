

<?php
if ( isset($_POST['scode']) && isset($_POST['stype']) && isset($_POST['year']) && isset($_POST['sname']) && isset($_POST['branch']) && isset($_POST['hours'])) {

include_once("db_conx.php");

	$scode =  $_POST['scode'];
	$stype = $_POST['stype'];
	$sname = $_POST['sname'];
	$year = $_POST['year'];
	$branch = $_POST['branch'];
	$hours = $_POST['hours'];
	
	$query = "UPDATE SUBJECTS SET Sname='$sname', Type='$stype', Sem='$year', hours = '$hours', Branch = '$branch' WHERE Scode = '$scode'";
	$result = mysqli_query($con, $query) or die(mysqli_error($con));
	if ($result) {
		echo "Success!";
		exit(); 
	}
	else echo "Failed";
}
?>





<?php

if (isset ($_POST['sid'])) {
	require_once("db_conx.php");
	
	$sid = $_POST['sid'];
	if ($sid == "all") $query = "SELECT * FROM SUBJECTS";
	else $query = "SELECT * FROM SUBJECTS where Sem='$sid'";
	$results=mysqli_query($con,$query) or die(mysqli_error($con));
	
	if ($results) {
	
	echo "<table id='param-table' align='center' style=' border: 1px solid black;'><tr style=' border: 1px solid black; padding: 15px'><td style=' border: 1px solid black; padding: 15px;'>Subject Code</td><td style=' border: 1px solid black;  padding: 15px;'>Type (lab, tut or lecture)</td><td style='  padding: 15px; border: 1px solid black;'>Subject Name</td><td style='  padding: 15px; border: 1px solid black;'>Semester</td><td style='  padding: 15px; border: 1px solid black;'>Branch</td><td style='  padding: 15px; border: 1px solid black;'>Hours</td> <td style='  padding: 15px; border: 1px solid black;'>Edit Subject</td><tr>";
	while ($row_users = mysqli_fetch_array($results)) {
		echo "<form onSubmit='return false;' method='POST' style='float:left;'><tr style=' border: 1px solid black;  padding: 15px;'><td style=' border: 1px solid black;  padding: 15px;'>".$row_users['Scode']."</td><td style=' border: 1px solid black;  padding: 15px;'>"."<input name='stype' type='text'  maxlength='50' value='".$row_users['Type']."'>"."</td><td style=' border: 1px solid black;  padding: 15px;'>"."<input name='sname' type='text'  maxlength='50' value='".$row_users['Sname']."'>"."</td><td style=' border: 1px solid black;  padding: 15px;'>"."<input name='sem' type='text'  maxlength='20' value='".$row_users['Sem']."'>"."</td><td style=' border: 1px solid black;  padding: 15px;'>"."<input name='branch' type='text'  maxlength='20' value='".$row_users['Branch']."'>"."</td><td style=' border: 1px solid black;  padding: 15px;'>"."<input name='hour' type='text'  maxlength='20' value='".$row_users['Hours']."'>"."</td><td style=' border: 1px solid black;  padding: 15px;'>"."<button onclick='editParam(\"" . $row_users['Scode'] . "\", this)'>Edit</button>"."</td></form></tr>";
	}
	echo "</table>";
	}
	
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
var ajax = ajaxObj("POST", "subjects.php"); // accepted
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
function editParam(scode, button) {
	//alert(scode);
    var tr, stype, sname, year, branch, hours;
	var status = document.getElementById('status');
    // Find the row containing these inputs
    tr = button.parentNode;
    while (tr && tr.nodeName.toUpperCase() !== "TR" && tr.nodeName.toUpperCase() !== "BODY") {
        tr = tr.parentNode;
    }
    if (!tr || tr.nodeName.toUpperCase() !== "TR") {
        return; // Something went wrong
    }
	//alert(scode);
    stype = tr.querySelector("input[name='stype']").value;
	sname = tr.querySelector("input[name='sname']").value;
    year  = tr.querySelector("input[name='sem']").value;
    branch  = tr.querySelector("input[name='branch']").value;
    hours  = tr.querySelector("input[name='hour']").value;

	//alert(scode+stype+sname+year+branch+hours);
	
	if ( stype == "" || year == "" || sname == "" || branch == "" || hours == "") {
		status.innerHTML = "You cannot leave information blank";
		return;
	}

	if (stype != "lab" && stype!="tut" && stype!="lecture") {
		status.innerHTML = "Subject type can only be 'lab', 'tut' or 'lecture'";
		return;
	}
	
	if (hours < 1 || hours > 10) {
		status.innerHTML = "Hours must be between 1 to 10";
		return;
	}
	
	if (stype.length > 50){
		status.innerHTML = "Type cannot be greater than 50 characters.";
		return;
	}

	if (year.length > 20) {
		status.innerHTML = "Year cannot be greater than 20 characters.";
		return;
	}
	
	if (sname.length > 50) {
		status.innerHTML = "Subject cannot be greater than 20 characters.";
		return;
	}

 else {
		status.innerHTML = 'Please wait...';
		var ajax = ajaxObj("POST", "subjects.php"); // accepted
        ajax.onreadystatechange = function() {
	        if(ajaxReturn(ajax) == true) {
	            if(ajax.responseText.trim() === "Success!"){ ///returned from php file
					
					status.innerHTML = ajax.responseText;
				}
				
				else {status.innerHTML = ajax.responseText;}
	        }
        }
        ajax.send("scode="+scode+"&stype="+stype+"&year="+year+"&sname="+sname+"&branch="+branch+"&hours="+hours); //shoots variable to php 
	
}
	
	
    
}

</script>


<body>
	<a href="new_subjects.php" style="float:right;">New Subject</a>
	
	<form id="filter-sub" onsubmit="return false;"  align="center">
		Sem :<select name="sid" id="sid" autofocus>
		<option value="all" selected>ALL</option>
		<option value="first" >First </option>
		<option value="second">Second</option>
		<option value="third" >Third </option>
		<option value="fourth">Fourth </option>
		<option value="fifth">Fifth</option>
		<option value="sixth">Sixth</option>
		<option value="seventh">Seventh</option>
		<option value="eigth">Eigth</option>
	</select>
	<button onclick="filter()">Filter</button>
</form>

<center><span id="status" style="color:red"></span></center>

	</form>
</body>
</html>