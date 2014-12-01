-- phpMyAdmin SQL Dump
-- version 4.0.4.1
-- http://www.phpmyadmin.net
--
-- Host: 127.0.0.1
-- Generation Time: Nov 21, 2014 at 06:55 PM
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
  `Name` varchar(20) NOT NULL,
  `Type` varchar(20) NOT NULL,
  `Year` varchar(10) NOT NULL,
  PRIMARY KEY (`BID`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=22 ;

-- --------------------------------------------------------

--
-- Table structure for table `batchsubjects`
--

CREATE TABLE IF NOT EXISTS `batchsubjects` (
  `batchId` int(11) NOT NULL,
  `subjectId` int(11) NOT NULL,
  `studentNos` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `batchsubjects`
--

INSERT INTO `batchsubjects` (`batchId`, `subjectId`, `studentNos`) VALUES
(21, 54643, 30);

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
  `Sem` varchar(10) NOT NULL,
  `Hours` int(10) NOT NULL,
  `Branch` varchar(30) NOT NULL,
  PRIMARY KEY (`SID`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=7 ;

--
-- Dumping data for table `subjects`
--

INSERT INTO `subjects` (`SID`, `Sname`, `Type`, `Scode`, `Sem`, `Hours`, `Branch`) VALUES
(1, 'Maths', 'lab', '12', 'third', 3, 'maths'),
(2, 'English', 'lecture', '!0Ba123', 'third', 3, 'pd'),
(3, 'Data Mining', 'tut', '10CI321', 'fourth', 3, 'cse'),
(4, 'Operating System', 'lab', '54643', 'second', 4, 'cse'),
(5, 'Cloud Computing', 'tut', '10CI13846', 'fourth', 3, 'ece'),
(6, 'Cryptography', 'lecture', '10B1CI124', 'sixth', 3, 'cse');

-- --------------------------------------------------------

--
-- Table structure for table `teachers`
--

CREATE TABLE IF NOT EXISTS `teachers` (
  `Id` int(10) NOT NULL,
  `Name` varchar(40) NOT NULL,
  `Dept` varchar(40) NOT NULL,
  PRIMARY KEY (`Id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `teachersubjects`
--

CREATE TABLE IF NOT EXISTS `teachersubjects` (
  `teacherID` int(11) NOT NULL,
  `preference` int(10) NOT NULL,
  `subjectID` int(10) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `teachersubjects`
--

INSERT INTO `teachersubjects` (`teacherID`, `preference`, `subjectID`) VALUES
(5, 1, 3),
(5, 2, 4),
(5, 3, 6),
(5, 4, 4),
(5, 5, 4);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE IF NOT EXISTS `users` (
  `UserID` int(10) NOT NULL AUTO_INCREMENT,
  `FName` varchar(30) NOT NULL,
  `LName` varchar(30) NOT NULL,
  `Email` varchar(100) NOT NULL DEFAULT '',
  `Phone` varchar(20) NOT NULL DEFAULT '',
  `Password` varchar(50) NOT NULL,
  `Gender` varchar(10) NOT NULL,
  `Department` varchar(30) DEFAULT NULL,
  `CreatedBy` varchar(100) DEFAULT NULL,
  `CreatedDate` datetime DEFAULT NULL,
  `CreatedIP` varchar(100) DEFAULT NULL,
  `ModifiedBy` varchar(100) DEFAULT NULL,
  `ModifiedDate` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `ModifiedIP` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`Email`,`Phone`,`UserID`),
  UNIQUE KEY `UserID` (`UserID`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=6 ;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`UserID`, `FName`, `LName`, `Email`, `Phone`, `Password`, `Gender`, `Department`, `CreatedBy`, `CreatedDate`, `CreatedIP`, `ModifiedBy`, `ModifiedDate`, `ModifiedIP`) VALUES
(5, 'Vasundhra', 'Gupta', 'vasundhragupta@gmail.com', '', 'e10adc3949ba59abbe56e057f20f883e', 'f', 'cse', NULL, '2014-11-21 14:01:17', '::1', NULL, '2014-11-21 09:16:05', '::1');

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
