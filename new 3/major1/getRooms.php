<?php
session_start();
if(!isset($_SESSION['SESS_EMAIL'])) {
	die("login first");
}
include_once("../db_conx.php");

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
elseif($_POST['toDo'] == "displayBatches"){
	displayBatches();
}
elseif($_POST['toDo'] == "addBatch") {
	addBatch();
}
elseif($_POST['toDo'] == "updateBatch") {
	updateBatch();
}
elseif($_POST['toDo'] == "deleteBatch") {
	deleteBatch($_POST['id']);
}
elseif($_POST['toDo'] == "deleteBatchSubject") {
	deleteBatchSubject($_POST['bid'],$_POST['sid']);
}
elseif($_POST['toDo'] == "addBatchSubject") {
	addBatchSubject($_POST['bid'],$_POST['sid'],$_POST['subType'],$_POST['subCode']);
}
elseif($_POST['toDo'] == "displayPrefs") {
	displayPrefs($_POST['id']);
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
	if($row && $row['Type']!="tut") {
		if($row['Type'] == "lecture+tut") {
			$row['Hours']+=1;
		}
		echo '{"id":"'.$row['SID'].'","subCode":"'.$row['Scode'].'","type":"'.$row['Type'].'","name":"'.
			$row['Sname'].'","semester":"'.$row['Sem'].'","branch":"'
			.$row['Branch'].'","hours":"'.$row['Hours'].'"}';
	}
	while($row=mysqli_fetch_array($result)) {
		if($row['Type']!="tut") {
			if($row['Type'] == "lecture+tut") {
				$row['Hours']+=1;
			}
			echo ',{"id":"'.$row['SID'].'","subCode":"'.$row['Scode'].'","type":"'.$row['Type'].'","name":"'.
				$row['Sname'].'","semester":"'.$row['Sem'].'","branch":"'
				.$row['Branch'].'","hours":"'.$row['Hours'].'"}';
		}
	}
	echo "]";
}

function updateSubject() {
	global $con;
	$id = $_POST['sid'];
	$subCode = $_POST['subCode'];
	$type = $_POST['type'];
	$prevType = $_POST['prevType'];
	$prevCode = $_POST['prevCode'];
	$name = $_POST['name'];
	$sem = $_POST['sem'];
	$branch = $_POST['branch'];
	$hours = $_POST['hours'];
	
	if ($type == "lecture+tut" && $prevType !="lecture+tut") {
		// update one record and add new tut
		$hours-=1;
		$query = "UPDATE subjects SET Scode='$subCode', Type='$type', Sname='$name',"
			."Sem='$sem', Branch='$branch', Hours='$hours' WHERE SID = '$id' ";
		$result = mysqli_query($con, $query) or die(mysqli_error($con));
		
		$query = "insert into subjects(Scode,Type,Sname,Sem,Branch,Hours) values("
				."'$subCode','tut','$name','$sem','$branch',1)";
		$result = mysqli_query($con, $query) or die(mysqli_error($con));
	}
	else if($type == "lecture+tut") {	// && prevType=="lecture+tut"
		$hours-=1;
		$query = "UPDATE subjects SET Scode='$subCode', Type='$type', Sname='$name',"
			."Sem='$sem', Branch='$branch', Hours='$hours' WHERE SID = '$id' ";
		$result = mysqli_query($con, $query) or die(mysqli_error($con));
		
		$query = "UPDATE subjects SET Scode='$subCode', Type='tut', Sname='$name',"
			."Sem='$sem', Branch='$branch', Hours='$hours' WHERE Type = 'tut' and Scode='$prevCode' ";
		$result = mysqli_query($con, $query) or die(mysqli_error($con));
	}
	else if($prevType == "lecture+tut" && $type!="lecture+tut") {		
		$query = "UPDATE subjects SET Scode='$subCode', Type='$type', Sname='$name',"
			."Sem='$sem', Branch='$branch', Hours='$hours' WHERE SID = '$id' ";
		$result = mysqli_query($con, $query) or die(mysqli_error($con));
		
		$query = "delete from subjects WHERE Type = 'tut' and Scode='$prevCode' ";
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

function displayBatches() {
	global $con;
	$query="select BID,Name,Type,Sem,subjectId from batch left join batchSubjects"
		." on BID = batchId";
	$result = mysqli_query($con, $query) or die(mysqli_error($con));
	echo "[";
	$row=mysqli_fetch_array($result);
	$prevId = "";
	$isFirst = true;
	while($row) {
		if(!is_null($row['subjectId'])) {
			if($isFirst) {
				echo '{';
			}
			else {
				echo ',{';
			}
			echo '"id":"'.$row['BID'].'","name":"'.$row['Name'].'","branch":"'.
				$row['Type'].'","semester":"'.$row['Sem'].'","subIds":[{"id":"'.$row['subjectId'].'"}';
			$prevId = $row['BID'];
			
			while(($row=mysqli_fetch_array($result)) && $row['BID'] == $prevId ) {
				// echo subids
				echo ',{"id":"'.$row['subjectId'].'"}';
			}
			echo ']}';	
			$isFirst=false;
		}
		elseif ($row){
			// dont print subids
			if($isFirst) {
				echo '{';
			}
			else {
				echo ',{';
			}
			echo '"id":"'.$row['BID'].'","name":"'.$row['Name'].'","branch":"'.
				$row['Type'].'","semester":"'.$row['Sem'].'","subIds":[]}';
			$prevId = $row['BID'];
			$isFirst=false;
			// get next row
			$row = mysqli_fetch_array($result);
		}		
	}
	echo']';
}

function addBatch() {
	global $con;

	$name = $_POST['name'];
	$sem = $_POST['sem'];
	$branch = $_POST['branch'];
	$query = "insert into batch (Name,Type,Sem) values ("
		."'$name','$branch','$sem')";
	$result = mysqli_query($con, $query) or die(mysqli_error($con));
	
	$query = "select last_insert_id()as id";
	$result = mysqli_query($con, $query) or die(mysqli_error($con));
	$row=mysqli_fetch_array($result);
	if($row) {
		echo '{"id":"'.$row['id'].'","name":"'.$name.'","branch":'.
				'"'.$branch.'","semester":"'.$sem.'","subIds":[]}';
	}	
}

function updateBatch() {
	global $con;
	
	$name = $_POST['name'];
	$sem = $_POST['sem'];
	$id = $_POST['id'];
	$branch = $_POST['branch'];
	
	$query = "UPDATE batch SET Name='$name', Type='$branch', Sem='$sem'"
		."WHERE BID = '$id' ";
	$result = mysqli_query($con, $query) or die(mysqli_error($con));
}

function deleteBatch($id) {
	global $con;
	$query="delete from batch where BID = $id";
	mysqli_query($con, $query) or die(mysqli_error($con));
}

function deleteBatchSubject($bid,$sid) {
	global $con;
	$query="delete from batchsubjects where batchId = $bid and subjectId=$sid";
	mysqli_query($con, $query) or die(mysqli_error($con));
}

function addBatchSubject($bid,$sid,$subType,$subCode) {
	global $con;
	if($subType == "lecture+tut") {
		$query = "select SID from subjects where Scode='$subCode' and Type='tut'";
		$result = mysqli_query($con, $query) or die(mysqli_error($con));
		$row = mysqli_fetch_array($result);
		$id2 = $row['SID'];
		$query="insert into batchsubjects values ($bid,$sid,30),($bid,$id2,30)";
		mysqli_query($con, $query) or die(mysqli_error($con));
	}
	else {
		$query="insert into batchsubjects values ($bid,$sid,30)";
		mysqli_query($con, $query) or die(mysqli_error($con));
	}
}

function displayPrefs($id) {
	global $con;
	$query="select preference,subjectId from teacherSubjects where teacherId = $id order by preference";
	$result = mysqli_query($con, $query) or die(mysqli_error($con));
	echo "[";
	$row=mysqli_fetch_array($result);
	if($row) {
		echo '{"prefNum":"'.$row['preference'].'","subId":"'.$row['subjectId'].'"}';
	}
	while($row=mysqli_fetch_array($result)) {
		echo ',{"prefNum":"'.$row['preference'].'","subId":"'.$row['subjectId'].'"}';
	}
	echo "]";
}
?>
