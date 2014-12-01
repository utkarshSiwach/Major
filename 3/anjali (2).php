<?php
if(isset($_POST["branch"])) {

	include_once("db_conx.php");
 
	 
	$branch = $_POST['branch'];
	$query = "select Sname , SID from subjects where Branch='$branch'";
	$results=mysqli_query($con,$query) or die(mysqli_error($con));
	echo "<div>Subject List </div>";
	if ($results) {
	echo "<select id='choice1' name='choice1'>
			  <option value='default'>Select 1st preference </option>";
    while ($row_users = mysqli_fetch_array($results)) {
		
		   echo"<option value=".$row_users['SID'].">". $row_users['Sname'] ."</option>";
	}    
	echo "</select><br><br>";
	}
	
	
	$results=mysqli_query($con,$query) or die(mysqli_error($con));
	if ($results) {
	echo "<select id='choice2' name='choice2'>
			  <option value='default'>Select 2nd preference </option>";
    while ($row_users = mysqli_fetch_array($results)) {
		
		   echo"<option value=".$row_users['SID'].">". $row_users['Sname'] ."</option>";
	}    
	echo "</select><br><br>";
	}
	
	
	$results=mysqli_query($con,$query) or die(mysqli_error($con));
	if ($results) {
	echo "<select id='choice3' name='choice3'>
			  <option value='default'>Select 3rd preference </option>";

    while ($row_users = mysqli_fetch_array($results)) {
	echo"<option value=".$row_users['SID'].">". $row_users['Sname'] ."</option>";
	}    
	echo "</select><br><br>";
	}
	
	
	$results=mysqli_query($con,$query) or die(mysqli_error($con));
	if ($results) {
	echo "<select id='choice4' name='choice4'>
			  <option value='default'>Select 4th preference </option>";
    while ($row_users = mysqli_fetch_array($results)) {
		
		   echo"<option value=".$row_users['SID'].">". $row_users['Sname'] ."</option>";
	}    
	echo "</select><br><br>";
	}	
	
	
	$results=mysqli_query($con,$query) or die(mysqli_error($con));
	if ($results) {
	echo "<select id='choice5' name='choice5'>
			  <option value='default'>Select 5th preference </option>";
    while ($row_users = mysqli_fetch_array($results)) {
		
		   echo"<option value=".$row_users['SID'].">". $row_users['Sname'] ."</option>";
	}    
	echo "</select><br><br>";
	 
	}
	
	
}
?>