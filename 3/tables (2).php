<?php

include_once("db_conx.php");

//users table
$query = "SELECT * FROM USERS";
$result = mysqli_query($con, $query);
if(empty($result)) {

		$query = "CREATE TABLE IF NOT EXISTS `users` (
  `UserID` int(10) NOT NULL AUTO_INCREMENT,
  `FName` varchar(30) NOT NULL,
  `LName` varchar(30) NOT NULL,
  `Email` varchar(100) NOT NULL,
  `Phone` varchar(20) NOT NULL,
  `Password` varchar(50) NOT NULL,
  `Gender` varchar(10) NOT NULL,
  `Department` varchar(30) NOT NULL,
  `CreatedBy` varchar(100) NOT NULL,
  `CreatedDate` datetime NOT NULL,
  `CreatedIP` varchar(100) NOT NULL,
  `ModifiedBy` varchar(100) NOT NULL,
  `ModifiedDate` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `ModifiedIP` varchar(100) NOT NULL,
  PRIMARY KEY (`Email`,`Phone`,`UserID`),
  UNIQUE KEY `UserID` (`UserID`))";
 $result = mysqli_query($con, $query);
 /*if ($result == 1) {
 echo "Success";}
 else echo "Failed:";
}
*/
}

$query = "SELECT * FROM BATCH";
$result = mysqli_query($con, $query);
if(empty($result)) {

$query = "CREATE TABLE IF NOT EXISTS `batch` (
  BID int(11) NOT NULL AUTO_INCREMENT,
  Name varchar(10) NOT NULL,
  Type varchar(20) NOT NULL,
  Subject varchar(100) NOT NULL,
  Year varchar(10) NOT NULL,
  PRIMARY KEY (`BID`))";
  $result = mysqli_query($con, $query);
   /*if ($result == 1) {
 echo "Success";}
 else echo "Failed:";
}
*/
 }
 
 $query = "SELECT * FROM SUBJECTS";
$result = mysqli_query($con, $query);
if(empty($result)) {

$query = "CREATE TABLE IF NOT EXISTS `subjects` (
  SID int(11) NOT NULL AUTO_INCREMENT,
  Sname varchar(20) NOT NULL,
  Type varchar(20) NOT NULL,
  Scode varchar(20) NOT NULL,
  Year varchar(10) NOT NULL,
  Hours INT(10) NOT NULL,
  Branch VARCHAR( 30 ) NOT NULL ,
  PRIMARY KEY (`SID`))";
 $result = mysqli_query($con, $query);
   /*if ($result == 1) {
 echo "Success";}
 else echo "Failed:";
}
*/
 }
 
 
 
 $query = "SELECT * FROM ROOM";
$result = mysqli_query($con, $query);
if(empty($result)) {

$query = "CREATE TABLE IF NOT EXISTS `room` (
  `RID` int(11) NOT NULL AUTO_INCREMENT,
  `Name` varchar(20) NOT NULL,
  `Capacity` int(10) NOT NULL,
  `Type` varchar(20) NOT NULL,
  PRIMARY KEY (`RID`))";
  $result = mysqli_query($con, $query);
   /*if ($result == 1) {
 echo "Success";}
 else echo "Failed:";
}
*/
 } 
 
?>