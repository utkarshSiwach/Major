<?php
session_start();
?>



<?php
if(isset($_POST["f"]) && isset($_POST["l"]) && isset($_POST["g"]) && ( isset($_POST["e"]) || isset($_POST["phone"]))){

	include_once("db_conx.php");
	include_once("tables.php");
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
?>


<html>
<script src="js/ajax.js"></script>
<script src="js/main.js"></script>
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
</script>

<script>
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

</script>

<script>
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

<center>

<span id="mail" style="float:right">
<?php if (($_SESSION['SESS_EMAIL'])!="") {
				echo "<b>";
				echo $_SESSION['SESS_EMAIL']." ";
				echo "</b>";
			}		
			else echo "User's Email/Phone ";
?>
<a href="logout.php">Logout</a>
</span></div>


<center>
<?php
include_once("db_conx.php");
$user = $_SESSION['SESS_EMAIL'];
if(is_numeric($user)) {
$query = "SELECT * FROM USERS WHERE Phone = '$user'";
}
else {$query = "SELECT * FROM USERS WHERE Email = '$user'";}
$result = mysqli_query($con, $query) or die(mysqli_error($con));
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
?>

</body>
</html>