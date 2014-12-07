<?php
session_start();
if(!isset($_SESSION['SESS_EMAIL'])) {
	die("login first");
}
include_once("../3/db_conx.php");

if($_POST['toDo'] == "displayRooms") {
	displayRooms();
}
elseif($_POST['toDo'] == "deleteRoom") {
	deleteRoom($_POST['roomId']);
}
elseif($_POST['toDo'] == "updateRoom") {
	updateRoom();
}
elseif($_POST['toDo'] == "addRoom") {
	addRoom();
}

function displayRooms() {
	global $con;
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
}

function deleteRoom($id) {
	global $con;
	$query="delete from room where RID = $id";
	mysqli_query($con, $query) or die(mysqli_error($con));
}

function updateRoom() {
	
	global $con;
	
	$type = $_POST['type'];
	$name = $_POST['name'];
	$cap = $_POST['cap'];
	$id = $_POST['rid'];
	$loc = $_POST['loc'];
	
	$query = "UPDATE ROOM SET Capacity='$cap', Type='$type', Name='$name',"
		."Location='$loc' WHERE RID = '$id' ";
	$result = mysqli_query($con, $query) or die(mysqli_error($con));
}

function addRoom() {
	global $con;
	
	$type = $_POST['type'];
	$name = $_POST['name'];
	$cap = $_POST['cap'];
	$loc = $_POST['loc'];
	$query = "insert into room (Name,Type,Capacity,Location) values ("
		."'$name','$type',$cap,'$loc')";
	$result = mysqli_query($con, $query) or die(mysqli_error($con));
	
	$query = "select last_insert_id()as id";
	$result = mysqli_query($con, $query) or die(mysqli_error($con));
	$row=mysqli_fetch_array($result);
	if($row) {
		echo '{"roomName":"'.$name.'","type":"'.$type.'","capacity":"'
			.$cap.'","location":"'.$loc.'","id":"'.$row['id'].'"}';
	}
	
}

?>