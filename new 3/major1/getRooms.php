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
elseif($_POST['toDo'] == "displaySubjects") {
	displaySubjects();
}
elseif($_POST['toDo'] == "updateSubject") {
	updateSubject();
}
elseif($_POST['toDo'] == "deleteSubject") {
	deleteSubject($_POST['subId']);
}
elseif($_POST['toDo'] == "addSubject") {
	addSubject();
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

function displaySubjects() {
	global $con;
	$query="select * from subjects";
	$result = mysqli_query($con, $query) or die(mysqli_error($con));
	echo "[";
	$row=mysqli_fetch_array($result);
	if($row) {
		echo '{"id":"'.$row['SID'].'","subCode":"'.$row['Scode'].'","type":"'.$row['Type'].'","name":"'.
			$row['Sname'].'","semester":"'.$row['Sem'].'","branch":"'
			.$row['Branch'].'","hours":"'.$row['Hours'].'"}';
	}
	while($row=mysqli_fetch_array($result)) {
		echo ',{"id":"'.$row['SID'].'","subCode":"'.$row['Scode'].'","type":"'.$row['Type'].'","name":"'.
			$row['Sname'].'","semester":"'.$row['Sem'].'","branch":"'
			.$row['Branch'].'","hours":"'.$row['Hours'].'"}';
	}
	echo "]";
}

function updateSubject() {
	global $con;
	$id = $_POST['sid'];
	$subCode = $_POST['subCode'];
	$type = $_POST['type'];
	$prevType = $_POST['prevType'];
	$name = $_POST['name'];
	$sem = $_POST['sem'];
	$branch = $_POST['branch'];
	$hours = $_POST['hours'];
	
	if ($type == "lecture+tut" && prevType !="lecture+tut") {
		// update one record and add new tut
		$hours-=1;
		$query = "UPDATE subjects SET Scode='$subCode', Type='$type', Sname='$name',"
			."Sem='$sem', Branch='$branch', Hours='$hours' WHERE SID = '$id' ";
		$result = mysqli_query($con, $query) or die(mysqli_error($con));
		
		$query = "insert into subjects(Scode,Type,Sname,Sem,Branch,Hours) values("
				."'$subCode','tut','$name','$sem','$branch',1)";
		$result = mysqli_query($con, $query) or die(mysqli_error($con));
	}
	else {
		$query = "UPDATE subjects SET Scode='$subCode', Type='$type', Sname='$name',"
			."Sem='$sem', Branch='$branch', Hours='$hours' WHERE SID = '$id' ";
		$result = mysqli_query($con, $query) or die(mysqli_error($con));
	}
}

function deleteSubject($id) {
	global $con;
	$query="delete from subjects where SID = $id";
	mysqli_query($con, $query) or die(mysqli_error($con));
}

// add new subject into database
// if subject type is lecture+tut then split into two inserts
// 	one for lecture one for tut
// else insert normally
// return subject data in JSON format
function addSubject() {
	global $con;
	$subCode = $_POST['subCode'];
	$type = $_POST['type'];
	$name = $_POST['name'];
	$sem = $_POST['sem'];
	$branch = $_POST['branch'];
	$hours = $_POST['hours'];
	
	if($type == "lecture+tut") {	// do two inserts
		$type="lecture";
		$hours-=1;
		$query = "insert into subjects(Scode,Type,Sname,Sem,Branch,Hours) values("
				."'$subCode','$type','$name','$sem','$branch',$hours)";
		$result = mysqli_query($con, $query) or die(mysqli_error($con));
	
		$query = "select last_insert_id()as id";
		$result = mysqli_query($con, $query) or die(mysqli_error($con));
		$row=mysqli_fetch_array($result);
		$id = $row['id'];
		if($row) {
			$type="tut";
			$hours1=1;
			$query = "insert into subjects(Scode,Type,Sname,Sem,Branch,Hours) values("
				."'$subCode','$type','$name','$sem','$branch',$hours1)";
			$result = mysqli_query($con, $query) or die(mysqli_error($con));
			
			echo $id;
			/*			
			$type="lecture+tut";
			$hours+=1;
			echo '{"id":"'.$id.'","subCode":"'.$subCode.'","type":"'.$type.'","name":"'.
				$name.'","semester":"'.$sem.'","branch":"'
				.$branch.'","hours":"'.$hours.'"}';
			*/
		}
	}
	else {	// just do one insert
		$query = "insert into subjects(Scode,Type,Sname,Sem,Branch,Hours) values("
			."'$subCode','$type','$name','$sem','$branch',$hours)";
		$result = mysqli_query($con, $query) or die(mysqli_error($con));
	
		$query = "select last_insert_id()as id";
		$result = mysqli_query($con, $query) or die(mysqli_error($con));
		$row=mysqli_fetch_array($result);
		if($row) {
			echo $row['id'];
			/*
			echo '{"id":"'.$row['id'].'","subCode":"'.$subCode.'","type":"'.$type.'","name":"'.
				$name.'","semester":"'.$sem.'","branch":"'
				.$branch.'","hours":"'.$hours.'"}';
			*/				
		}
	}
}
?>
