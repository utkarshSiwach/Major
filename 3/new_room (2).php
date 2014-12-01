<?php
session_start();
?>

<?php
if (isset($_POST['rname']) && isset($_POST['rtype']) && isset($_POST['cap']) && isset($_POST['loc'])) {
	include_once("db_conx.php");
	$rname = $_POST['rname'];
	$rtype = $_POST['rtype'];
	$cap = $_POST['cap'];
	$loc = $_POST['loc'];

		$query="INSERT INTO room (name, type, capacity, location) VALUES ('$rname', '$rtype', '$cap', '$loc')";
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
   function newroom() {
    var rname = document.getElementById("rname").value;
	var rtype = document.getElementById("rtype").value;
	var cap = document.getElementById("cap").value;
	var loc = document.getElementById("loc").value;
	//var  i;

	/* var checkboxes = document.getElementsByName('cap[]');
	var cap = "";
	for (var i=0, n=checkboxes.length;i<n;i++) {
	if (checkboxes[i].checked) 
	{
		cap += ","+checkboxes[i].value;
	}
	}
	if (cap) 
		{
		cap = cap.substring(1);
	 }
	  */
	//var year = document.getElementById("year").value;
	var status = document.getElementById("status");
	//alert (cap);
	status.innerHTML="Verifying...";
	
	if (rname=="" || rtype=="" || cap == "" || loc === "")
	{
		status.innerHTML = "Please fill in all details";
		
	}
	else {
		var ajax = ajaxObj("POST", "new_room.php"); // accepted
		status.innerHTML = "Adding room...";
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
        ajax.send("rname="+rname+"&rtype="+rtype+"&cap="+cap+"&loc="+loc); //shoots variable to php  
	}
   }
   
   </script>

  
<body>
	<center><form onSubmit="return false;" name="rform" id="rform">
	Name : <input type="text" id="rname" name="rname"></input><br><br>
	Type : <select name="rtype" id="rtype">
		   <option value="lab">Lab </option>
		   <option value="tut">Tut</option>
		   <option value="lecture">Lectures</option>
		   </select><br><br>
	<!--Code : <input type="text" id="scode" name="scode"></input><br><br>-->
	<!--Capacity : <input type="text" id="cap" name="cap"></input><br><br>-->
	Capacity : <select name="cap" id="cap">
		   <option value="1">One Batch</option>
		   <option value="2">Two Batches</option>
		   <option value="3">Three Batches</option>
		   <option value="4">Four Batches</option>
		   <option value="5">Five Batches</option>
		   </select><br><br>
		   
	Location : <select name="loc" id="loc">
		   <option value="Academic">Academic Block</option>
		   <option value="JBS">JBS</option>
		   </select><br><br>
		   
	<button style=" background: black; padding : 10px; color: #fff;" id="room" onClick="newroom()"> Create Room</button>
			<br><br>
	</form>
	
    <h4><span id="status" style="color: red"></span></h4></center>

</body>
</html>