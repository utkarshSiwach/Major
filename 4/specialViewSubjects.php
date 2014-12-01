<?php
	include_once("db_conx.php");
	
	$sql="select batchId,subjectId,Sname,SUBJECTS.Type from batchSubjects, SUBJECTS where batchId=".$_GET['BID']." and subjectId=SID";
	
	$result=mysqli_query($con,$sql) or die(mysqli_error($con));
	if($result) {
		while($row=mysqli_fetch_array($result)) {
			echo " ".$row['Sname']." ".$row['Type']."\n";
		}
	}
	else {
		echo"0 Empty";
	}	
?>
