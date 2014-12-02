<?php
 $con=mysqli_connect("localhost","root","","timetable");
 if (mysqli_connect_errno())
  {
  echo "Failed to connect to MySQL: " . mysqli_connect_error(); //this shows the error retrieved from the server
  }
  
?>