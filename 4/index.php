<?php
session_start();
?>

<?php if (isset($_POST['username']) && isset($_POST['remember'])) {
if($_POST['remember']) {
	$year = time() + 3600*24*14;
	setcookie('remember_me', $_POST['username'], $year);
	echo "success";
}

elseif(!$_POST['remember']) {
	if(isset($_COOKIE['remember_me'])) {
		$past = time() - 100;
		setcookie('remember_me', "", $past);
		echo "Failed to Create Cookie";
	}
 }
}
?>

<?php
if(isset($_POST["f"]) && isset($_POST["l"]) && isset($_POST["g"]) && isset($_POST["p"]) && ( isset($_POST["e"]) || isset($_POST["phone"])) && isset($_POST['d'])){
	
	include_once("db_conx.php");	
	
	$f = preg_replace('#[^a-z]#i', '', $_POST['f']);
	$l = preg_replace('#[^a-z]#i', '', $_POST['l']);
	$pass = $_POST['p'];
	$p= md5($pass);
	$g = preg_replace('#[^a-z]#', '', $_POST['g']);
	$d = $_POST["d"];

		//validate pre-existing email or phone
		if ($_POST["e"]!="") {
		 $e = mysqli_real_escape_string($con, $_POST['e']); 
		 $sql1 = "SELECT * FROM users WHERE email='$e' LIMIT 1";
	 	 $query = mysqli_query($con, $sql1); 
		 $e_check = mysqli_num_rows($query);
		 if ($e_check!= 0){ 
			echo "That email address is already in use in the system";
			exit();
		 }
		}
		
		else if ($_POST["phone"]!=""){
		 $e = mysqli_real_escape_string($con, $_POST['phone']); 
		 $sql1 = "SELECT * FROM users WHERE phone='$e' LIMIT 1";
		 $query = mysqli_query($con, $sql1); 
		 $e_check = mysqli_num_rows($query);
		 if ($e_check!= 0){ 
			echo "That phone number is already in use in the system";
			exit();
		 }
		}

	
	//IP address retrieval
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
		
		//system registration  time
		
		
    //insertion into DB
			$phone = $_POST["phone"];
			$e = $_POST["e"];
			$sql3 = "INSERT INTO users(fname, lname, email, phone, password, gender, CreatedDate, CreatedIP, Department) VALUES('$f', '$l' ,'$e', '$phone' , '$p' , '$g', NOW(),'$ipaddress', '$d')";		
			$query2 = mysqli_query($con, $sql3); 
			
			if ($phone == "") {
				$sql = "SELECT * FROM users WHERE Email = '$e'";
			}
			else {
				$sql = "SELECT * FROM users WHERE Phone = '$phone'";
			}
			$query = mysqli_query($con, $sql);
			$result = mysqli_fetch_assoc($query);
			$uid = $result['UserID'];
			//instantly create secondary db foreign key
			$sql = "INSERT INTO USERPROFILE(UserID, CreatedDate) VALUES('$uid', NOW())";
			$query = mysqli_query($con, $sql);
			echo "success";
			exit();

}
?>

<?php
if (isset($_POST['username']) && isset($_POST['password'])) {
	include_once("db_conx.php");
	$u = $_POST["username"];
	$p1 = $_POST["password"];
	$p = md5($p1);
	if ($u!=""){
		if (is_numeric($u)) {
			$sql = "SELECT * FROM users WHERE phone='$u' AND password='$p' LIMIT 1"; //check against phone numbers
			$query = mysqli_query($con, $sql);
			$e_check = mysqli_num_rows($query);
			
			 if ($e_check != 0) {
				echo "Success!";
				$member = mysqli_fetch_assoc($query);			
				$_SESSION['SESS_FIRST_NAME'] = $member['FName'];
				$_SESSION['SESS_LAST_NAME'] = $member['LName'];
				$_SESSION['SESS_EMAIL']= $member['Phone'];
				//echo $_SESSION['SESS_FIRST_NAME'] ;
				exit();
			}
			else {
				echo "Password is incorrect";
				exit();
			} 
		}
		
		else {
			$sql = "SELECT * FROM users WHERE email='$u' AND password='$p' LIMIT 1"; //check against email
			$query = mysqli_query($con, $sql);
			
		$e_check = mysqli_num_rows($query);
			//var_dump($e_check);
			 if ($e_check != 0) {
				echo "success";
				$member = mysqli_fetch_assoc($query);			
				$_SESSION['SESS_FIRST_NAME'] = $member['FName'];
				$_SESSION['SESS_LAST_NAME'] = $member['LName'];
				$_SESSION['SESS_EMAIL']= $member['Email'];
				//echo $_SESSION['SESS_FIRST_NAME'] ;
				exit();
			}
			else {
				echo "Password is incorrect";
				exit();
			} 
		
		}
	}
}
	
?>


<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    
    <title>Timetable</title>
	
	 <link href="css/bootstrap.min.css" rel="stylesheet">
    <link href="css/bootstrap.css" rel="stylesheet">
    <link href="css/sticky-footer.css" rel="stylesheet">
	<link href="css/custom.css" rel="stylesheet">

	<script src="js/restrict_elem.js"></script>
	
	
<script src="js/main.js"></script>
<script src="js/ajax.js"></script>
<script>
function restrict(elem){ //runs for checking the email id and username
	var tf = _(elem);
	var rx = new RegExp;
	if(elem == "email"){
		rx = /[' "]/g; // no ' or "
	} else if(elem == "fname" || elem == "lname"){
		rx = /[^a-z]/gi; //username only accepts alphabets , and its not case sensitive (global means works throughot the string)
	}
	tf.value = tf.value.replace(rx, "");
}

function emptyElement(x){
	_(x).innerHTML = "";
}

function signup(){
	var f = document.getElementById("fname").value;
	var l = document.getElementById("lname").value;
	var e = document.getElementById("email").value;
	var phone = document.getElementById("phon").value;
	var p1 = document.getElementById("pass1").value;
	var p2 = document.getElementById("pass2").value;
	var g = document.getElementById("gender").value;
	var d = document.getElementById("department").value;
	var status = document.getElementById("status");
	
	if(f == "" || l== "" || (e == "" && phone == "") || p1 == "" || p2 == "" || g == "" || d == "" ){ 
		status.innerHTML = "Fill out all of the form data.";
	}
	else if(p1 != p2){
		status.innerHTML = "Your password fields do not match.";
	}
	
	else {
		status.innerHTML = 'Please wait...';
		var ajax = ajaxObj("POST", "index.php"); // accepted
        ajax.onreadystatechange = function() {
	        if(ajaxReturn(ajax) == true) {
	            if(ajax.responseText.trim() === "success"){ ///returned from php file
					window.scrollTo(0,0); //take to the top of the screen
					_("signupform").innerHTML = 'Welcome, '+f;
					alert("Now log in with your username");
					//window.location.assign("index.php");
					
				}
				else {
					
					status.innerHTML = ajax.responseText;
				}
	        }
        }
        ajax.send("f="+f+"&l="+l+"&e="+e+"&phone="+phone+"&p="+p1+"&g="+g+"&d="+d); //shoots variable to php 
	}
}


function login(){
	var username = document.getElementById("username").value;
	var password = document.getElementById("pwd").value;
	var status = document.getElementById("status2");
	var remember = document.getElementById("remember").checked;
	 if (document.getElementById("remember").checked) {
		var ajax = ajaxObj("POST", "index.php");
		ajax.onreadystatechange = function() {
	        if(ajaxReturn(ajax) == true) {
	            if(ajax.responseText.trim() === "Success!"){ ///returned from php file
				
				}
				else {
					return;
					
				}
	        }
        }
       ajax.send("username="+username+"&remember="+remember);
	} 
	
	if (username=="" || password == "") {
		status.innerHTML = "Email/Phone or Password is missing";
	}
	
	else {
		status.innerHTML = "Please wait...";
		var ajax = ajaxObj("POST", "index.php");
		ajax.onreadystatechange = function() {
	        if(ajaxReturn(ajax) == true) {
	            if(ajax.responseText.trim() === "success"){ ///returned from php file
					
					window.location.assign("up.php");
					
				}
				else {
					status.innerHTML = ajax.responseText;
					//alert("ajaxReturn = false");
					//do nothing
				}
	        }
        }
       ajax.send("username="+username+"&password="+password); //shoots variable to php 
		
	}
	
}

</script>
	
	<script>
	
	</script>

	</head>

  <body>
    <div id="wrap" style="background: #eeeeee">
      <div class="navbar navbar-default navbar-fixed-top" style = "background-color:#00b300; height :140px; padding : 12px;">
        <div class="container" >
          <div class="navbar-header">
            <button type="button" class="navbar-toggle" data-toggle="collapse" data-target=".navbar-collapse">
              <span class="icon-bar"></span>
              <span class="icon-bar"></span>
              <span class="icon-bar"></span>
            </button>
            <a class="navbar-brand" href="#"><img src=""></a>
          </div>
		 <div class="navbar-collapse collapse" style="float:left;">
          <ul class="nav navbar-nav hidden-xs">
	        <li><a href="#">&nbsp;</a></li>
			
            <li><a href="#" style="color:#FFFFFF; font-size: 14px">Timetable</a></li>
       
            <li class="dropdown">
              <a href="#" class="dropdown-toggle" data-toggle="dropdown" style="color:#FFFFFF; font-size: 14px; background:none;">More <b class="caret"></b></a>
              <ul class="dropdown-menu">
                <li><a href="#">About Us</a></li>
                    <li><a href="#">Our Motto</a></li>
                    <li><a href="#">Features Available for You</a></li>
                    <li><a href="#">Help</a></li>
                   
               
              </ul>
            </li>
          </ul>
        
        </div>
		  <div class="collapse navbar-collapse">
           	<form class="navbar-form navbar-right" onSubmit="return false;" id="sign-up" method="POST">
			<div class="lt-left">
				<div class="form-group">
				
					<label for="exampleInputEmail2">Email</label><br>
					<input type="text" class="form-control input-sm" style="width:200px; height:40px; -webkit-border-radius: 4;-moz-border-radius: 4; border-radius: 4px; box-shadow: 0px 0px 0px #a4e388;" id="username" placeholder="<?php if (isset($_COOKIE['remember_me'])) { echo $_COOKIE['remember_me']; } else { echo 'EmailID/Phone'; } ?>" value="<?php if (isset($_COOKIE['remember_me'])) { echo $_COOKIE['remember_me']; }?>" >
				</div>
				<div class="form-group">
				<label for="exampleInputPassword2" >Password</label><br>
				<input type="password" id="pwd" style="width:200px; height:40px; -webkit-border-radius: 4; -moz-border-radius: 4; border-radius: 4px; box-shadow: 0px 0px 0px #a4e388;" placeholder="<?php echo 'Password'; ?>">
				</div> 
				<div class="checkbox">
						<label>
						  <input type="checkbox"  id="remember" name="remember" value = '1' <?php if(isset($_COOKIE['remember_me'])) { echo 'checked="checked"'; } else { echo ''; }?>> Remember me
						</label>
					  </div>
			</div>
			<div class="lt-right">
				<button id="signin" class="login-btn" onClick="login()" style = "width: 100px; background-color:#000; height:40px; -webkit-border-radius: 4; -moz-border-radius: 4; border-radius: 4px; box-shadow: 0px 0px 0px #a4e388; ">Sign In </button><br>
				<span id="status2" style="color: white"></span>
			</div>		  
		</form>
            
          </div>
        </div>
      </div>
      <div class="container" id="home" >
		<div class="row">
		 
			<div class="col-md-7">
				<img src="main_pic.jpg" style="margin-top: 22%; width:515px; height: 240px;">
			</div>
			<div class="col-md-5">
			
			
			<form onSubmit="return false;"name="signupform" id="signupform"class="form" >
			<br><br>
			<legend><b>Create your account</b></legend>
            <h4>Teacher Registration</h4>
			<h4><span id="status" style="color: red"></span></h4>
            <div class="row">
                <div class="col-xs-6 col-md-6">
                    <input class="form-control input-lg" id="fname"  placeholder="First Name" type="text" onFocus="emptyElement('status')" onKeyUp="restrict('fname')" maxlength="20" autofocus />
                </div>
                <div class="col-xs-6 col-md-6">
                    <input class="form-control input-lg" id="lname"  placeholder="Last Name" type="text" onFocus="emptyElement('status')" onKeyUp="restrict('lname')" maxlength="20" />
                </div>
            </div>
            <input class="form-control input-lg" id="email"  placeholder="Your Email" type="email" onFocus="emptyElement('status')" onKeyUp="restrict('email')" maxlength="60"/>
			<center><h4>OR</h4></center>
			<input class="form-control input-lg" id="phon" placeholder="Your Phone" type="text" onFocus="emptyElement('status')" maxlength="20" />
			<h5></h5>
			<input class="form-control input-lg" id="pass1"  placeholder="Password" type="password" onFocus="emptyElement('status')" maxlength="20" pattern=".{6,20}" required title="6-20 characters required!"/>
		   <input class="form-control input-lg" id="pass2"  placeholder="Re-enter Password" type="password" onFocus="emptyElement('status')" maxlength="20" pattern=".{6,20}" required title="6-20 characters required!"/>
            
            <select id="gender" onFocus="emptyElement('status')"  class="form-control input-lg">
				<option value="">Gender</option>
				<option value="m">Male</option>
				<option value="f">Female</option>
			</select>
			
			<select id="department" class="form-control input-lg"> 
				<option value="">Select a Department</option>
				<option value="math">Math</option>
				<option value="phy">Physics</option>
				<option value="pd">PD</option>
				<option value="ece">ECE</option>
				<option value="cse">CSE</option>
				<option value="biotech">Biotech</option>
			</select>
          
			<span class="help-block">By clicking Create my account, you agree to our Terms and that you have read our Data Use Policy, including our Cookie Use.</span>
            <button style="width:65%; margin:0 auto; background: black;" id="signupbtn" onClick="signup()"  class="btn btn-lg btn-primary btn-block signup-btn"> Create Account</button>
			
            </form>
			</div>
			</div>
		</div>
		
      </div>
      
      
    </div>

    <div id="footer">
      <div class="container">
        <p class="text-muted credit"><a href="#">Timetable</a> | <a href="#">Sitemap</a> | <a href="#">Terms & Conditions</a> | <a href="#">Privacy Policy</a> | <a href="#">Disclaimer</a></p>
		
		
		
      </div>
    </div>

    <script src="js/jquery.js"></script>
	<script src ="js/jquery1.js"></script>
	<script src ="js/jquery2.js"></script>
    <script src="js/bootstrap.js"></script>    	
    <script src="http://wsnippets.com/secure_download.js"></script>
    

  </body>
</html>