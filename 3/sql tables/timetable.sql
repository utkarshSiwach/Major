-- phpMyAdmin SQL Dump
-- version 4.0.4.1
-- http://www.phpmyadmin.net
--
-- Host: 127.0.0.1
-- Generation Time: Oct 30, 2014 at 10:35 AM
-- Server version: 5.5.32
-- PHP Version: 5.4.16

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Database: `timetable`
--
CREATE DATABASE IF NOT EXISTS `timetable` DEFAULT CHARACTER SET latin1 COLLATE latin1_swedish_ci;
USE `timetable`;

-- --------------------------------------------------------

--
-- Table structure for table `batch`
--

CREATE TABLE IF NOT EXISTS `batch` (
  `BID` int(11) NOT NULL AUTO_INCREMENT,
  `Name` varchar(10) NOT NULL,
  `Type` varchar(20) NOT NULL,
  `Subject` varchar(100) NOT NULL,
  `Year` varchar(10) NOT NULL,
  PRIMARY KEY (`BID`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=12 ;

--
-- Dumping data for table `batch`
--

INSERT INTO `batch` (`BID`, `Name`, `Type`, `Subject`, `Year`) VALUES
(1, 'B1', 'cse', 'Maths, Computer/', 'first'),
(5, 'B3', 'cse', 'Maths, Science/', 'first'),
(7, 'B3', 'ece', 'Maths/', 'second'),
(8, 'B5', 'ece', 'Maths/', 'second'),
(9, 'B2', 'bio', '', 'first'),
(10, 'B6', 'cse', 'Data', 'fourth'),
(11, 'B7', 'cse', '10CI321/', 'fourth');

-- --------------------------------------------------------

--
-- Table structure for table `room`
--

CREATE TABLE IF NOT EXISTS `room` (
  `RID` int(11) NOT NULL AUTO_INCREMENT,
  `Name` varchar(20) NOT NULL,
  `Capacity` int(10) NOT NULL,
  `Type` varchar(20) NOT NULL,
  `Location` varchar(20) NOT NULL,
  PRIMARY KEY (`RID`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=3 ;

--
-- Dumping data for table `room`
--

INSERT INTO `room` (`RID`, `Name`, `Capacity`, `Type`, `Location`) VALUES
(1, 'G1', 2, 'Lecture', 'Academic'),
(2, 'TS1', 1, 'tut', 'Academic');

-- --------------------------------------------------------

--
-- Table structure for table `subjects`
--

CREATE TABLE IF NOT EXISTS `subjects` (
  `SID` int(11) NOT NULL AUTO_INCREMENT,
  `Sname` varchar(20) NOT NULL,
  `Type` varchar(20) NOT NULL,
  `Scode` varchar(20) NOT NULL,
  `Year` varchar(10) NOT NULL,
  `Hours` int(10) NOT NULL,
  `Branch` varchar(30) NOT NULL,
  PRIMARY KEY (`SID`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=6 ;

--
-- Dumping data for table `subjects`
--

INSERT INTO `subjects` (`SID`, `Sname`, `Type`, `Scode`, `Year`, `Hours`, `Branch`) VALUES
(1, 'Maths', 'lab', '12', 'second', 3, 'maths'),
(2, 'English', 'lecture', '!0Ba123', 'third', 3, 'pd'),
(3, 'Data Mining', 'tut', '10CI321', 'fourth', 3, 'cse'),
(4, 'Data Mining', 'lab', '54643', 'second', 4, 'cse'),
(5, 'Cloud Computing', 'tut', '10CI13846', 'fourth', 3, 'ece');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE IF NOT EXISTS `users` (
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
  UNIQUE KEY `UserID` (`UserID`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=5 ;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`UserID`, `FName`, `LName`, `Email`, `Phone`, `Password`, `Gender`, `Department`, `CreatedBy`, `CreatedDate`, `CreatedIP`, `ModifiedBy`, `ModifiedDate`, `ModifiedIP`) VALUES
(3, 'abc', 'def', 'abc@gmail.com', '', 'e10adc3949ba59abbe56e057f20f883e', 'm', '', '', '2014-10-28 21:00:31', '::1', '', '2014-10-28 15:30:31', ''),
(4, 'Anjali', 'T', 'anjali@gmail.com', '', 'e10adc3949ba59abbe56e057f20f883e', 'f', 'biotech', '', '2014-10-30 15:02:32', '::1', '', '2014-10-30 09:32:32', ''),
(2, 'Nisha', 'Sharma', 'n@gmail.com', '', 'e10adc3949ba59abbe56e057f20f883e', 'f', '', '', '2014-10-12 14:12:48', '::1', '', '2014-10-12 08:45:52', '::1'),
(1, 'Vasundhra', 'Gupta', 'vasundhragupta@gmail.com', '', 'e10adc3949ba59abbe56e057f20f883e', 'f', '', '', '2014-10-10 09:37:09', '::1', '', '2014-10-28 13:44:50', '::1');

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
