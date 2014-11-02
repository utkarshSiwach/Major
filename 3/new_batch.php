<?php
session_start();
?>


<?php
 if (isset($_POST["choice"])) {
	include_once("db_conx.php");
	$choice = mysql_real_escape_string($_POST['choice']);
	
	$query = "SELECT * FROM subjects WHERE Year='$choice'";
	$result = mysqli_query($con, $query) or die(mysqli_error($con));
	if ($result) {
	
	echo "<center><form id='bform' name='bform' onSubmit='return false;'>";
	echo "Name : <input type='text' id='bname' name='bname'/><br><br>";
	echo "Course: <select name='btype' id='btype'>
			<option value='default'>Select a Type</option>
		   <option value='cse'>Computer Science</option>
		   <option value='ece'>ECE</option>
		   <option value='bio'>Biotech</option>
		   </select><br><br>";
	while ($row = mysqli_fetch_array($result)) {
   		echo "<input type='checkbox' name='subject[]' value=".$row['Scode']."/>" . $row['Sname'] . "<br>";
	}
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
if (isset($_POST['bname']) && isset($_POST['btype']) && isset($_POST['subject']) && isset($_POST['year'])) {
	include_once("db_conx.php");
	$bname = $_POST['bname'];
	$btype = $_POST['btype'];
	$subject = $_POST['subject'];
	$year = $_POST['year'];

		$query="INSERT INTO batch (name, type, subject, year) VALUES ('$bname', '$btype', '$subject', '$year')";
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
   function addbat() {
    var bname = document.getElementById("bname").value;
	var btype = document.getElementById("btype").value;
	var  i;

	var checkboxes = document.getElementsByName('subject[]');
	var subject = "";
	for (var i=0, n=checkboxes.length;i<n;i++) {
	if (checkboxes[i].checked) 
	{
		subject += ","+checkboxes[i].value;
	}
	}
	if (subject) 
		{
		subject = subject.substring(1);
	 }
	 
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
					status.innerHTML = "Sucessfully updated!";
				}
				else {
					
					status.innerHTML = ajax.responseText;
				}
	        }
        }
        ajax.send("bname="+bname+"&btype="+btype+"&subject="+subject+"&year="+year); //shoots variable to php  
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
	
	Year : <select name="year" id="year">
			<option value="default">Select a Year</option>
		   <option value="first">First Year<br>
		   <option value="second">Second Year<br>
		   <option value="third">Third Year<br>
		   <option value="fourth">Fourth Year<br>
		   <option value="fifth">Fifth Year<br>
		   </select>
    <h4><span id="status" ></span></h4>
	</center>
</body>
</html>