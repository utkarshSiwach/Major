<?php
session_start();
if(!isset($_SESSION['SESS_EMAIL'])) {
	die("login first");
}
include_once("../db_conx.php");

if($_POST['toDo'] == "logOff") {
	session_destroy();
}
else if($_POST['toDo'] == "displayRooms") {
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
elseif($_POST['toDo'] == "displayBacklogs") {
	displayBacklogs();
}
elseif($_POST['toDo'] == "addBacklog") {
	$obj = json_decode($_POST['json'],true);
	addBacklog($obj["id"],$obj['name'],$obj['batchId'],$obj['batchName'],$obj['semester'],
		$obj['branch'],$obj['subIds']);
}
elseif($_POST['toDo'] == "deleteBacklog") {
	deleteBacklog($_POST['id']);
}
elseif($_POST['toDo'] == "displayPrefs") {
	displayPrefs($_POST['id']);
}
elseif($_POST['toDo'] == "updatePrefs") {
	updatePrefs($_POST['json']);
}

function displayRooms() {
	global $con;
	$query="select * from room";
	$result = mysqli_query($con, $query) or die(mysqli_error($con));
	echo "[";
	$row=mysqli_fetch_array($result);
	if($row) {
		echo '{"roomName":"'.$row['Name'].'","type":"'.$row['Type'].'","branch":"'.$row['Branch'].'","capacity":"'.
			$row['Capacity'].'","location":"'.$row['Location'].'","id":"'.$row['RID'].'"}';
	}
	while($row=mysqli_fetch_array($result)) {
		echo ',{"roomName":"'.$row['Name'].'","type":"'.$row['Type'].'","branch":"'.$row['Branch'].'","capacity":"'.
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
	$branch = $_POST['branch'];
	$cap = $_POST['cap'];
	$id = $_POST['rid'];
	$loc = $_POST['loc'];
	
	$query = "UPDATE ROOM SET Capacity='$cap', Type='$type', Branch ='$branch', Name='$name',"
		."Location='$loc' WHERE RID = '$id' ";
	$result = mysqli_query($con, $query) or die(mysqli_error($con));
}

function addRoom() {
	global $con;
	
	$type = $_POST['type'];
	$name = $_POST['name'];
	$branch = $_POST['branch'];
	$cap = $_POST['cap'];
	$loc = $_POST['loc'];
	$query = "insert into room (Name,Type,Capacity,Location,Branch) values ("
		."'$name','$type',$cap,'$loc','$branch')";
	$result = mysqli_query($con, $query) or die(mysqli_error($con));
	
	$query = "select last_insert_id()as id";
	$result = mysqli_query($con, $query) or die(mysqli_error($con));
	$row=mysqli_fetch_array($result);
	if($row) {
		echo '{"roomName":"'.$name.'","type":"'.$type.'","branch":"'.$branch.'","capacity":"'
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
	$query="select BID,Name,Type,Sem,subjectId from batch left join batchsubjects"
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

function toStringForSemester($sem) {
	$arr = ["first","second","third","fourth","fifth","sixth","seventh","eighth"];
	return $arr[$sem-1];
}
function displayBacklogs() {
	global $con;
	$query="select id,students.name,batchId,batch.Name,semester,branch,subjectId from batch, students left join studentbacklogs on id = studentId where batchId=BID";
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
			$sem = toStringForSemester($row['semester']);
			echo '"id":"'.$row['id'].'","name":"'.$row['name'].'","batchId":"'.
				$row['batchId'].'","batchName":"'.$row['Name'].'","semester":"'.$sem.
				'","branch":"'.$row['branch'].'","subIds":[{"id":"'.$row['subjectId'].'"}';
			$prevId = $row['id'];
			
			while(($row=mysqli_fetch_array($result)) && $row['id'] == $prevId ) {
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
			$sem = toStringForSemester($row['semester']);
			echo '"id":"'.$row['id'].'","name":"'.$row['name'].'","batchId":"'.
				$row['batchId'].'","batchName":"'.$row['Name'].'","semester":"'.$sem.
				'","branch":"'.$row['branch'].'","subIds":[]}';
			$prevId = $row['id'];
			$isFirst=false;
			// get next row
			$row = mysqli_fetch_array($result);
		}		
	}
	echo']';
}

function addBacklog($id,$name,$bid,$batch,$sem,$branch,$subs) {
	global $con;
	
	$arr = ["first","second","third","fourth","fifth","sixth","seventh","eighth"];
	$semester = 0;
	for($i=0;$i<count($arr);$i++) {
		if($sem==$arr[$i]) {
			$semester = $i+1;
			break;
		}
	}
	$sql = "insert into students values ($id,'$name',$bid,$semester,'$branch')";
	mysqli_query($con,$sql) or die(mysqli_error($con));
	
	if(count($subs)>0) {
		$str ='('.$id.','.$subs[0]["id"].')';
		for($i=1;$i<count($subs);$i++) {
			$str=$str.',('.$id.','.$subs[$i]["id"].')';
		}	
		$query='insert into studentbacklogs values '.$str;
		mysqli_query($con,$query) or die(mysqli_error($con));
		$query="call add_tuts($id)";
		mysqli_query($con,$query) or die(mysqli_error($con));
	}
	echo "done";
}

function deleteBacklog($id) {
	global $con;
	$query="delete from students where id = $id";
	mysqli_query($con, $query) or die(mysqli_error($con));
}
function displayPrefs($id) {
	global $con;
	$query="select preference,subjectId from teachersubjects where teacherId = $id order by preference";
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

function updatePrefs($json) {
	global $con;
	$obj = json_decode($json,true);
	if (count($obj) == 0) {
		die();
	}
	$id = $obj[0]["id"];
	$query="delete from teachersubjects where teacherId=$id";
	mysqli_query($con,$query) or die(mysqli_error($con));
	$str='('.$obj[0]["id"].','.$obj[0]["prefNum"].','.$obj[0]["subId"].')';
	for($i=1;$i<count($obj);$i++) {
		$str=$str.',('.$obj[$i]["id"].','.$obj[$i]["prefNum"].','.$obj[$i]["subId"].')';
	}
	$query='insert into teachersubjects values '.$str;
	mysqli_query($con,$query) or die(mysqli_error($con));
}
?>