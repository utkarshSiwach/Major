<?php
session_start();
?>


<?php
 if (isset($_POST['sname']) && isset($_POST['type']) && isset($_POST['scode']) && isset($_POST['year']) && isset ($_POST['branch']) && isset($_POST['shours'])) {
	include_once("db_conx.php");
	$name = mysqli_real_escape_string($con, $_POST['sname']);
	$type = mysqli_real_escape_string($con, $_POST['type']);
	$scode = mysqli_real_escape_string($con, $_POST['scode']);
	$year = mysqli_real_escape_string($con, $_POST['year']);
	$branch = mysqli_real_escape_string($con, $_POST['branch']);
	$hours = mysqli_real_escape_string($con, $_POST['shours']);
	//echo $name, $type, $scode, $year;
	
	$query = "INSERT INTO subjects(Sname,Type,Scode,Year,Hours, Branch) VALUES ('$name', '$type', '$scode', '$year', '$hours', '$branch')";
	
	$result = mysqli_query($con, $query) or die(mysqli_error($con));
	if ($result) {
	echo "success";
	}
	exit();
}
?>


<html>

   
   <script>
   function newsub() {
    var sname = document.getElementById("sname").value;
	var type = document.getElementById("type").value;
	var shours = document.getElementById("shours").value;
	var branch = document.getElementById("branch").value;
	var scode = document.getElementById("scode").value;
	var year = document.getElementById("year").value;
	var status = document.getElementById("status");
	
	status.innerHTML="Verifying...";
	
	if (sname=="" || type=="" || shours== ""|| branch==""|| scode == "" || year == "")
	{
		status.innerHTML = "Please fill in all details";
		
	}
	else {
		var ajax = ajaxObj("POST", "new_subjects.php"); // accepted
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
        ajax.send("sname="+sname+"&type="+type+"&scode="+scode+"&year="+year+"&branch="+branch+"&shours="+shours); //shoots variable to php  
	}
   }
   </script>
   <script src="js/main.js"></script>
<script src="js/ajax.js"></script>
  
<body>
	
	<center><form onSubmit="return false;" name="sform" id="sform">
	Name : <input type="text" id="sname" name="sname"></input><br><br>
	Type : <select name="type" id="type">
		   <option value="lab">Lab </option>
		   <option value="tut">Lecture+Tut</option>
		   <option value="lecture">Only Lectures</option>
		   </select><br><br>
	Code : <input type="text" id="scode" name="scode"></input><br><br>
	Hours : <input type="text" id="shours" name="shours"></input><br><br>
	Year : <select name="year" id="year">
		   <option value="first">First Year</option>
		   <option value="second">Second Year</option>
		   <option value="third">Third Year</option>
		   <option value="fourth">Fourth Year</option>
		   <option value="fifth">Fifth Year</option>
		   </select><br><br>
	Branch :   <select name="branch" id="branch">
		   <option value="math">Math</option>
		   <option value="phy">Physics</option>
		   <option value="pd">PD</option>
		   <option value="ece">ECE</option>
		   <option value="cse">CSE</option>
		   <option value="biotech">Biotech</option>
		 
		   </select><br><br>
		   
	<button style=" background: black; padding : 10px; color: #fff;" id="sub" onClick="newsub()"> Enter Subject</button>
			<br><br>
	</form>
	
    <h4><span id="status" style="color: red"></span></h4></center>
</body>
</html>