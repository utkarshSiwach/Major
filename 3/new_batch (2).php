<?php
session_start();
?>


<?php
 if (isset($_POST["choice"])) {
	include_once("db_conx.php");
	//$choice = mysql_real_escape_string($_POST['choice']);
	$choice=$_POST['choice'];
	$query = "SELECT * FROM subjects WHERE Sem='$choice'";
	$result = mysqli_query($con, $query) or die(mysqli_error($con));
	if ($result) {
	
	echo "<center><form id='bform' name='bform' onSubmit='return false;'>";
	echo "Name : <input type='text' id='bname' name='bname' /><br><br>";
	echo "Course: <select name='btype' id='btype'>
			<option value='default'>Select a Type</option>
		   <option value='cse'>Computer Science</option>
		   <option value='ece'>ECE</option>
		   <option value='bio'>Biotech</option>
		   </select><br><br>";
		   
	echo "<br><button id='but1' style='background:black; color: white; padding: 10px;' onclick='addbat();'>Add Batch</button>";
	echo "</form></center>";
	
	}
	else {
		echo "Something went wrong!";
	}
	exit();
}
?>

<?php
if (isset($_POST['bid']) && isset($_POST['size']) && isset($_POST['scode'])) {
	include_once("db_conx.php");
	$bid = $_POST['bid'];
	$size = $_POST['size'];
	$scode= $_POST['scode'];
	$query = "INSERT into batchsubjects VALUES($bid, $scode, $size)"; //batchId , subjectId, studentNos
	$result = mysqli_query($con, $query) or die(mysqli_error($con));
	if ($result) echo "Success";
	else echo "Something went wrong..";
	exit();
}	
?>

<?php
if (isset($_POST['table']) && isset($_POST['bname']) && isset($_POST['year'])) {
	include_once("db_conx.php");
	$bname = $_POST['bname'];
	$year = $_POST['year'];
	$query = "SELECT * FROM Subjects WHERE Sem='$year'";
	$result = mysqli_query($con, $query) or die(mysqli_error($con));
	if ($result) {
		$query2 = "SELECT * FROM batch WHERE name = '$bname' AND year = '$year'";
		$result2 = mysqli_query($con, $query2) or die(mysqli_error($con));
		$bid2 = mysqli_fetch_array($result2);
		$bid = $bid2['BID'];
		echo "<table id='param-table' align='center' style=' border: 1px solid black;'><tr style=' border: 1px solid black; padding: 15px'><td style=' border: 1px solid black; padding: 15px;'>Subject Code</td><td style='  padding: 15px; border: 1px solid black;'>Subject Name</td><td style='  padding: 15px; border: 1px solid black;'>Batch Size</td> <td style='  padding: 15px; border: 1px solid black;'>Add Subject</td><tr>";
		while ($row_users = mysqli_fetch_array($result)) {
			echo "<form onSubmit='return false;' method='POST' style='float:left;'><tr style=' border: 1px solid black;  padding: 15px;'><td style=' border: 1px solid black;  padding: 15px;'>".$row_users['Scode']."</td><td style=' border: 1px solid black;  padding: 15px;'>".$row_users['Sname']."</td><td style=' border: 1px solid black;  padding: 15px;'>"."<input name='size' type='text'  maxlength='20'>"."</td><td style=' border: 1px solid black;  padding: 15px;'>"."<button onclick='editParam(\"" . $row_users['Scode'] . "\", \"".$bid."\", this)'>Edit</button>"."</td></form></tr>";
		}
		echo "</table>";
	}
	exit();
}
?>

<?php
if (isset($_POST['bname']) && isset($_POST['btype'])  && isset($_POST['year'])) {
	include_once("db_conx.php");
	$bname = $_POST['bname'];
	$btype = $_POST['btype'];
	//$subject = $_POST['subject'];
	$year = $_POST['year']; //year is actually sem

		$query="INSERT INTO batch (name, type, year) VALUES ('$bname', '$btype','$year')";
		$result = mysqli_query($con, $query) or die (mysqli_error($con));		
	
	if ($result) {
		echo "success";
	}
	
	exit();
}
?>

<html>
	
	 <script src="js/jquery.js"></script>
	<script src ="js/jquery1.js"></script>
	<script src ="js/jquery2.js"></script>
	<script src="js/main.js"></script>
	<script src="js/ajax.js"></script>
	<script>
        $(document).ready(function() {
            $("#year").on('change', function(){
                loadform();
			
            });   
        });
   </script>
  <script>
  function editParam(scode, bid, button) {
	var tr, size;
	//echo 
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
    size = tr.querySelector("input[name='size']").value;
	if (size == "" || size < 1 || size > 30) {
	status.innerHTML = "Batch size must be between 1-30";
	return;
	}
	else {
		status.innerHTML = 'Please wait...';
		var ajax = ajaxObj("POST", "new_batch.php"); // accepted
        ajax.onreadystatechange = function() {
	        if(ajaxReturn(ajax) == true) {
	            if(ajax.responseText.trim() === "Success!"){ ///returned from php file
					
					status.innerHTML = ajax.responseText;
				}
				
				else {status.innerHTML = ajax.responseText;}
	        }
        }
        ajax.send("scode="+scode+"&bid="+bid+"&size="+size); //shoots variable to php 
	
	
	}

  }
  </script>
   <script>
   function addbat() {
    var bname = document.getElementById("bname").value;
	var btype = document.getElementById("btype").value;
	var  i;

	//var checkboxes = document.getElementsByName('subject[]');
	/* var subject = "";
	for (var i=0, n=checkboxes.length;i<n;i++) {
	if (checkboxes[i].checked) 
	{
		subject += ","+checkboxes[i].value;
	}
	}
	if (subject) 
		{
		subject = subject.substring(1);
	 } */
	 
	var year = document.getElementById("year").value;
	var status = document.getElementById("status");
	//alert (subject);
	status.innerHTML="Verifying...";
	
	if (bname=="" || btype=="" || year == "")
	{
		status.innerHTML = "Please fill in all details";
		
	}
	
	
	else {
		var ajax = ajaxObj("POST", "new_batch.php"); // accepted
		status.innerHTML = "Adding subject...";
      ajax.onreadystatechange = function() {
	    if(ajaxReturn(ajax) == true) {
	            if(ajax.responseText.trim() === "success"){ ///returned from php file
					//status.innerHTML = "Sucessfully updated!";
					//create table for list of subjects
					var ajax2 = ajaxObj("POST", "new_batch.php"); // accepted
					var table = 1;
					//status.innerHTML = "Adding subject...";
					ajax2.onreadystatechange = function() {
					if(ajaxReturn(ajax2) == true) {
						if(ajax2.responseText.trim() === "success"){ ///returned from php file
						status.innerHTML = "Sucessfully updated!";
						}
					else {
						status.innerHTML = ajax2.responseText;
						}
					}	
				}
			ajax2.send("table="+table+"&bname="+bname+"&year="+year); //shoots variable to php  
				}
				else {
					
					status.innerHTML = ajax2.responseText;
				}
	        }
        }
        ajax.send("bname="+bname+"&btype="+btype+"&year="+year); //shoots variable to php  
	}
   }
   
   </script>
 
   
   <script>
   function loadform() {
    var choice = document.getElementById("year").value;
	var status = document.getElementById("status");
	var ajax = ajaxObj("POST", "new_batch.php"); // accepted
        ajax.onreadystatechange = function() {
	        if(ajaxReturn(ajax) == true) {
	            if(ajax.responseText.trim() === "success"){ ///returned from php file
					//do nothing
				}
				else {
					
					status.innerHTML = ajax.responseText;
				}
	        }
        }
        ajax.send("choice="+choice); //shoots variable to php 
   }
   </script>
  
<body>
	<center>
	
	Sem : <select name="year" id="year">
			<option value="default">Select a Sem</option>
		   <option value="first">First <br>
		   <option value="second">Second <br>
		   <option value="third">Third <br>
		   <option value="fourth">Fourth <br>
		   <option value="fifth">Fifth <br>
		   <option value="sixth">Sixth <br>
		   <option value="seventh">Seventh<br>
		   <option value="eigth">Eigth <br>
		   </select>
    <h4><span id="status" ></span></h4>
	</center>
</body>
</html>