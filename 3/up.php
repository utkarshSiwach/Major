<?php
session_start();
?>



<?php
////////////////////  if user is logged in update database with users ip address ///////////////
if(isset($_POST["f"]) && isset($_POST["l"]) && isset($_POST["g"]) && ( isset($_POST["e"]) || isset($_POST["phone"]))){

	include_once("db_conx.php");
	$f = preg_replace('#[^a-z]#i', '', $_POST['f']);
	$l = preg_replace('#[^a-z]#i', '', $_POST['l']);
	$g = preg_replace('#[^a-z]#', '', $_POST['g']);
	
	//update main table
	
	$ipaddress = '';
    if (getenv('HTTP_CLIENT_IP'))
        $ipaddress = getenv('HTTP_CLIENT_IP');
    else if(getenv('HTTP_X_FORWARDED_FOR'))
        $ipaddress = getenv('HTTP_X_FORWARDED_FOR'&quot);
    else if(getenv('HTTP_X_FORWARDED'))
        $ipaddress = getenv('HTTP_X_FORWARDED');
    else if(getenv('HTTP_FORWARDED_FOR'))
        $ipaddress = getenv('HTTP_FORWARDED_FOR');
    else if(getenv('HTTP_FORWARDED'))
       $ipaddress = getenv('HTTP_FORWARDED');
    else if(getenv('REMOTE_ADDR'))
        $ipaddress = getenv('REMOTE_ADDR');
    else
        $ipaddress = 'UNKNOWN';
	
	//obtain uid to insert into userprofile
	$u = $_SESSION['SESS_EMAIL'];
	if (is_numeric($u)) {
		$query = "UPDATE USERS SET FName='$f', LName='$l', Gender='$g', ModifiedIP = '$ipaddress' WHERE phone='$u'";
		//$query1 = "SELECT UserID FROM USERS WHERE phone='$u'";
	}
	else {
		$query = "UPDATE USERS SET FName='$f', LName='$l', Gender='$g', ModifiedIP = '$ipaddress' WHERE email='$u'";
		//$query1 = "SELECT UserID FROM USERS WHERE email='$u'";
	}
	
	$run=mysqli_query($con, $query);
	echo "Success!";
	exit();
}
////////// end /////////
?>


<html>
<script src="js/ajax.js"></script>
<script src="./js/jquery.js"></script>
<script src="js/main.js"></script>
<link rel="stylesheet" type="text/css" href="./css/custom.css">
<script>
function restrict(elem){ //runs for checking the email id and username
	var tf = _(elem);
	var rx = new RegExp;
	if(elem == "email"){
		rx = /[' "]/g; // no ' or "
	} else if(elem == "fname" || elem == "lname"){
		rx = /[^a-z]/gi; //username only accepts alphabets, and its not case sensitive (global means works throughot the string)
	}
	tf.value = tf.value.replace(rx, "");
}

function emptyElement(x){
	_(x).innerHTML = "";
}

function update_profile(){
	var f = _("fname").value;
	var l = _("lname").value;
	var e = _("email").value;
	var phone = _("phon").value;
	
	var g = _("gender").value;
	var status = _("status");
	
	
	if(f == "" || l== "" || (e == "" && phone == "") || g == "" ){ 
		status.innerHTML = "Main data cannot be left empty";
	}
	
	
	else {
		status.innerHTML = 'Please wait...';
		var ajax = ajaxObj("POST", "up.php"); // accepted
        ajax.onreadystatechange = function() {
	        if(ajaxReturn(ajax) == true) {
	            if(ajax.responseText.trim() === "Success!"){ ///returned from php file
					status.innerHTML = ajax.responseText;
				}
				else {
					//window.scrollTo(0,0); //take to the top of the screen
					
					status.innerHTML = ajax.responseText;
					//window.location.assign("index.php");
					
				}
	        }
        }
        ajax.send("f="+f+"&l="+l+"&e="+e+"&phone="+phone+"&g="+g); //shoots variable to php 
	}
}

function showRooms() {
	$.ajax({
		url:"room.php",
		success: function(data) {
			$("#myDiv").html(data);
		}
	});
}
function showBatches() {
	$.ajax({
		url:"batch.php",
		success: function(data) {
			$("#myDiv").html(data);
		}
	});

}
function showSubjects() {
	$.ajax({
		url:"subjects.php",
		success: function(data) {
			$("#myDiv").html(data);
		}
	});

}
function showProfile() {
	$("#myDiv").html('');
	$("#userDetailsDiv").toggle();
}
function startProcessing() {

}
</script>


<body background= "bg.png">

<div style="background:#00b300; height: 100px; width: 100%">
	<span id="name" style="float:left">
		<?php if (($_SESSION['SESS_FIRST_NAME']!="") && ($_SESSION['SESS_LAST_NAME']!="" )) {
				echo "<b>";
				echo $_SESSION['SESS_FIRST_NAME']." ".$_SESSION['SESS_LAST_NAME'];
				echo "</b>";
			}	
			else echo "User's Name";
		?>
	</span>

	<span id="mail" style="float:right">
		<?php if (($_SESSION['SESS_EMAIL'])!="") {
				echo "<b>";
				echo $_SESSION['SESS_EMAIL']." ";
				echo "</b>";
			}		
			else echo "User's Email/Phone ";
		?>
		<a href="logout.php">Logout</a>
	</span>
</div>

<!-- left column for user options -->
<div style="width:200px;height:550px; background-color:lightslategrey;">
	<span onclick="showRooms()" class="newsButtons" 
		style="width:170px;height:25px; margin:16px;">
		Rooms
	</span></br>
	<span onclick="showSubjects()" class="newsButtons" 
		style="width:170px;height:25px; margin:16px;">
		Subjects
	</span></br>
	<span onclick="showBatches()" class="newsButtons" 
		style="width:170px;height:25px; margin:16px;">
		Batches
	</span></br>
	<span onclick="showProfile()" class="newsButtons" 
		style="width:170px;height:25px; margin:16px;">
		Edit Profile
	</span></br>
		<span onclick="startProcessing()" class="newsButtons" 
		style="width:170px;height:25px; margin:16px;">
		Create Time table
	</span></br>
</div>
<div id="myDiv" style="position:absolute;left:220px;top:120px;"></div>
<?php
	/////////////////  edit user profile page ///////////////
	/////////////////////////////////////////////////////////
	include_once("db_conx.php");
	$user = $_SESSION['SESS_EMAIL'];
	if(is_numeric($user)) {
		$query = "SELECT * FROM USERS WHERE Phone = '$user'";
	}
	else {$query = "SELECT * FROM USERS WHERE Email = '$user'";}
	$result = mysqli_query($con, $query) or die(mysqli_error($con));
	echo"<div id='userDetailsDiv' style=' display:none;".
		"position:absolute;left:250px;top:130px;'><center>";
	echo "<form id='user-profile' onSubmit='return false;'>";
	if($result){
		$info = mysqli_fetch_assoc($result);		
		echo"<h2>Basic Information</h2>";
		echo "<div>First Name: </div>";
		echo "<input id='fname' type='text' onKeyUp='restrict('fname')' maxlength='20' value='".$info['FName']."'>";
		echo "<div>Last Name: </div>";
		echo "<input id='lname' type='text'  onKeyUp='restrict('lname')' maxlength='20' value='".$info['LName']."'>";
		echo "<div>Email Address:</div>";
		echo "<input id='email' type='text'  onKeyUp='restrict('email')' maxlength='60' value='".$info['Email']."'>";
		echo "<br><br>OR<br><br>";
		echo" <div>Phone Number: </div>";
		echo" <input id='phon' type='text'  maxlength='20' value='".$info['Phone']."'>";
		echo "<div>Gender:</div>";
		echo "<select id='gender'>";
		echo "<option value=''></option>";
		echo "<option value='m'>Male</option>";
		echo "<option value='f'>Female</option></select>";
		echo "<br><br>";
		echo" <div>Department: </div>";
		echo" <input id='phon' type='text'  maxlength='20' value='".$info['Department']."'>";
	
	}

	echo "<div>Subject List </div>"; // on change should generate 5 inputs for preference of subjects
	echo "<select name='branch' id='branch'>
			<option value=''>Choose a Branch</option>
		   <option value='math'>Math</option>
		   <option value='phy'>Physics</option>
		   <option value='pd'>PD</option>
		   <option value='ece'>ECE</option>
		   <option value='cse'>CSE</option>
		   <option value='biotech'>Biotech</option>
		   </select><br><br>";

	echo "<button id='signupbtn' onClick='update_profile()' style='background-color:#000; color: white; padding: 9px 15px'>Save Changes</button><br>";
	echo"<span id='status' style='color: red'></span> ";
	echo "</form>";
	echo"</center></div>";
?>

</body>
</html>