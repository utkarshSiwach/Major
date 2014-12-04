<?php
session_start();
if(!isset($_SESSION['SESS_EMAIL'])) {
	die("login first");
}

include_once("../3/db_conx.php");

$query="select * from room";
$result = mysqli_query($con, $query) or die(mysqli_error($con));
echo "[";
$row=mysqli_fetch_array($result);
if($row) {
	echo '{"roomName":"'.$row['Name'].'","type":"'.$row['Type'].'","capacity":"'.
	 $row['Capacity'].'","location":"'.$row['Location'].'","id":"'.$row['RID'].'"}';
}
while($row=mysqli_fetch_array($result)) {
	echo ',{"roomName":"'.$row['Name'].'","type":"'.$row['Type'].'","capacity":"'.
	 $row['Capacity'].'","location":"'.$row['Location'].'","id":"'.$row['RID'].'"}';
}
echo "]";
?>