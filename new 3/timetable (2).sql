-- phpMyAdmin SQL Dump
-- version 4.0.4.1
-- http://www.phpmyadmin.net
--
-- Host: 127.0.0.1
-- Generation Time: Dec 21, 2014 at 08:56 PM
-- Server version: 5.1.42-community
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
  `Sem` varchar(10) DEFAULT NULL,
  PRIMARY KEY (`BID`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=37 ;

--
-- Dumping data for table `batch`
--

INSERT INTO `batch` (`BID`, `Name`, `Type`, `Sem`) VALUES
(1, 'b1', 'cse', 'first'),
(5, 'b3', 'cse', 'first'),
(12, 'a1', 'ece', 'first'),
(17, 'b2', 'cse', 'first'),
(18, 'b4', 'cse', 'first'),
(19, 'b5', 'cse', 'first'),
(20, 'b6', 'cse', 'first'),
(21, 'b7', 'cse', 'first'),
(22, 'b8', 'cse', 'first'),
(23, 'b9', 'cse', 'first'),
(24, 'a2', 'ece', 'first'),
(25, 'a3', 'ece', 'first'),
(26, 'a4', 'ece', 'first'),
(27, 'a5', 'ece', 'first'),
(28, 'b1', 'cse', 'second'),
(29, 'b2', 'cse', 'second'),
(30, 'b3', 'cse', 'second'),
(31, 'b4', 'cse', 'second'),
(32, 'b5', 'cse', 'second'),
(33, 'c1', 'biotech', 'second'),
(34, 'c2', 'biotech', 'second'),
(35, 'c3', 'biotech', 'second'),
(36, 'c4', 'biotech', 'second');

-- --------------------------------------------------------

--
-- Table structure for table `batchsubjects`
--

CREATE TABLE IF NOT EXISTS `batchsubjects` (
  `batchId` int(11) DEFAULT NULL,
  `subjectId` int(11) DEFAULT NULL,
  `studentNos` int(11) DEFAULT NULL,
  KEY `subjectId` (`subjectId`),
  KEY `batchId` (`batchId`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `batchsubjects`
--

INSERT INTO `batchsubjects` (`batchId`, `subjectId`, `studentNos`) VALUES
(1, 69, 30),
(1, 70, 30),
(1, 74, 30),
(1, 75, 30),
(1, 87, 30),
(1, 77, 30),
(1, 78, 30),
(1, 79, 30),
(1, 80, 30),
(1, 81, 30),
(1, 82, 30),
(1, 83, 30),
(1, 84, 30),
(1, 85, 30),
(1, 86, 30),
(17, 69, 30),
(17, 70, 30),
(17, 74, 30),
(17, 75, 30),
(17, 87, 30),
(17, 77, 30),
(17, 78, 30),
(17, 79, 30),
(17, 80, 30),
(17, 81, 30),
(17, 82, 30),
(17, 83, 30),
(17, 84, 30),
(17, 85, 30),
(17, 86, 30),
(5, 69, 30),
(5, 70, 30),
(5, 74, 30),
(5, 75, 30),
(5, 87, 30),
(5, 77, 30),
(5, 78, 30),
(5, 79, 30),
(5, 80, 30),
(5, 81, 30),
(5, 82, 30),
(5, 83, 30),
(5, 84, 30),
(5, 85, 30),
(5, 86, 30),
(18, 69, 30),
(18, 70, 30),
(18, 74, 30),
(18, 75, 30),
(18, 87, 30),
(18, 77, 30),
(18, 78, 30),
(18, 79, 30),
(18, 80, 30),
(18, 81, 30),
(18, 82, 30),
(18, 83, 30),
(18, 84, 30),
(18, 85, 30),
(18, 86, 30),
(19, 69, 30),
(19, 70, 30),
(19, 74, 30),
(19, 75, 30),
(19, 87, 30),
(19, 77, 30),
(19, 78, 30),
(19, 79, 30),
(19, 80, 30),
(19, 81, 30),
(19, 82, 30),
(19, 83, 30),
(19, 84, 30),
(19, 85, 30),
(19, 86, 30),
(21, 69, 30),
(21, 70, 30),
(21, 74, 30),
(21, 75, 30),
(21, 87, 30),
(21, 77, 30),
(21, 78, 30),
(21, 79, 30),
(21, 80, 30),
(21, 81, 30),
(21, 82, 30),
(21, 83, 30),
(21, 84, 30),
(21, 85, 30),
(21, 86, 30),
(20, 69, 30),
(20, 70, 30),
(20, 74, 30),
(20, 75, 30),
(20, 87, 30),
(20, 77, 30),
(20, 78, 30),
(20, 79, 30),
(20, 80, 30),
(20, 81, 30),
(20, 82, 30),
(20, 83, 30),
(20, 84, 30),
(20, 85, 30),
(20, 86, 30),
(22, 69, 30),
(22, 70, 30),
(22, 74, 30),
(22, 75, 30),
(22, 87, 30),
(22, 77, 30),
(22, 78, 30),
(22, 79, 30),
(22, 80, 30),
(22, 81, 30),
(22, 82, 30),
(22, 83, 30),
(22, 84, 30),
(22, 85, 30),
(22, 86, 30),
(23, 69, 30),
(23, 70, 30),
(23, 74, 30),
(23, 75, 30),
(23, 87, 30),
(23, 77, 30),
(23, 78, 30),
(23, 79, 30),
(23, 80, 30),
(23, 81, 30),
(23, 82, 30),
(23, 83, 30),
(23, 84, 30),
(23, 85, 30),
(23, 86, 30),
(12, 85, 30),
(12, 84, 30),
(12, 83, 30),
(12, 81, 30),
(12, 82, 30),
(12, 79, 30),
(12, 80, 30),
(12, 86, 30),
(12, 69, 30),
(12, 70, 30),
(12, 74, 30),
(12, 75, 30),
(12, 87, 30),
(12, 77, 30),
(12, 78, 30),
(24, 69, 30),
(24, 70, 30),
(24, 74, 30),
(24, 75, 30),
(24, 87, 30),
(24, 77, 30),
(24, 78, 30),
(24, 79, 30),
(24, 80, 30),
(24, 81, 30),
(24, 82, 30),
(24, 83, 30),
(24, 84, 30),
(24, 85, 30),
(24, 86, 30),
(25, 69, 30),
(25, 70, 30),
(25, 74, 30),
(25, 75, 30),
(25, 87, 30),
(25, 77, 30),
(25, 78, 30),
(25, 79, 30),
(25, 80, 30),
(25, 81, 30),
(25, 82, 30),
(25, 83, 30),
(25, 84, 30),
(25, 85, 30),
(25, 86, 30),
(26, 69, 30),
(26, 70, 30),
(26, 74, 30),
(26, 75, 30),
(26, 87, 30),
(26, 77, 30),
(26, 78, 30),
(26, 79, 30),
(26, 80, 30),
(26, 81, 30),
(26, 82, 30),
(26, 83, 30),
(26, 84, 30),
(26, 85, 30),
(26, 86, 30),
(27, 69, 30),
(27, 70, 30),
(27, 74, 30),
(27, 75, 30),
(27, 87, 30),
(27, 77, 30),
(27, 78, 30),
(27, 79, 30),
(27, 80, 30),
(27, 81, 30),
(27, 82, 30),
(27, 83, 30),
(27, 84, 30),
(27, 85, 30),
(27, 86, 30),
(28, 88, 30),
(28, 89, 30),
(28, 90, 30),
(28, 91, 30),
(28, 92, 30),
(28, 93, 30),
(28, 94, 30),
(28, 95, 30),
(28, 96, 30),
(28, 97, 30),
(28, 98, 30),
(28, 99, 30),
(28, 100, 30),
(28, 101, 30),
(29, 88, 30),
(29, 89, 30),
(29, 90, 30),
(29, 91, 30),
(29, 92, 30),
(29, 93, 30),
(29, 94, 30),
(29, 95, 30),
(29, 96, 30),
(29, 97, 30),
(29, 98, 30),
(29, 99, 30),
(29, 100, 30),
(29, 101, 30),
(30, 88, 30),
(30, 89, 30),
(30, 90, 30),
(30, 91, 30),
(30, 92, 30),
(30, 93, 30),
(30, 94, 30),
(30, 95, 30),
(30, 96, 30),
(30, 97, 30),
(30, 98, 30),
(30, 99, 30),
(30, 100, 30),
(30, 101, 30),
(31, 88, 30),
(31, 89, 30),
(31, 90, 30),
(31, 91, 30),
(31, 92, 30),
(31, 93, 30),
(31, 94, 30),
(31, 95, 30),
(31, 96, 30),
(31, 97, 30),
(31, 98, 30),
(31, 99, 30),
(31, 100, 30),
(31, 101, 30),
(32, 90, 30),
(32, 91, 30),
(32, 92, 30),
(32, 93, 30),
(32, 94, 30),
(32, 95, 30),
(32, 96, 30),
(32, 97, 30),
(32, 98, 30),
(32, 99, 30),
(32, 100, 30),
(32, 101, 30),
(32, 88, 30),
(33, 104, 30),
(33, 102, 30),
(33, 103, 30),
(33, 101, 30),
(33, 88, 30),
(33, 89, 30),
(33, 105, 30),
(33, 106, 30),
(33, 94, 30),
(33, 95, 30),
(33, 96, 30),
(33, 97, 30),
(33, 99, 30),
(33, 100, 30),
(34, 102, 30),
(34, 103, 30),
(34, 101, 30),
(34, 88, 30),
(34, 89, 30),
(34, 105, 30),
(34, 106, 30),
(34, 94, 30),
(34, 95, 30),
(34, 96, 30),
(34, 97, 30),
(34, 99, 30),
(34, 100, 30),
(34, 104, 30),
(32, 89, 30),
(35, 102, 30),
(35, 103, 30),
(35, 101, 30),
(35, 88, 30),
(35, 89, 30),
(35, 105, 30),
(35, 106, 30),
(35, 94, 30),
(35, 95, 30),
(35, 96, 30),
(35, 97, 30),
(35, 99, 30),
(35, 100, 30),
(36, 102, 30),
(36, 103, 30),
(36, 101, 30),
(36, 88, 30),
(36, 89, 30),
(36, 105, 30),
(36, 106, 30),
(36, 94, 30),
(36, 95, 30),
(36, 96, 30),
(36, 97, 30),
(36, 99, 30),
(36, 100, 30);

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
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=36 ;

--
-- Dumping data for table `room`
--

INSERT INTO `room` (`RID`, `Name`, `Capacity`, `Type`, `Location`) VALUES
(1, 'G1', 2, 'Lecture', 'Academic'),
(2, 'TS1', 2, 'tut', 'Academic'),
(4, 'g1', 3, 'lecture', 'Academic'),
(5, 'g2', 3, 'lecture', 'Academic'),
(6, 'g3', 3, 'lecture', 'Academic'),
(8, 'g5', 4, 'lecture', 'Academic'),
(9, 'g6', 3, 'lecture', 'Academic'),
(10, 'g7', 3, 'lecture', 'Academic'),
(11, 'cl1', 4, 'lab', 'Academic'),
(12, 'cl2', 5, 'lab', 'Academic'),
(13, 'MML', 5, 'lab', 'Academic'),
(14, 'ts1', 4, 'tut', 'Academic'),
(15, 'ts2', 1, 'tut', 'Academic'),
(16, 'ts3', 1, 'tut', 'Academic'),
(17, 'ts4', 1, 'tut', 'Academic'),
(18, 'ts5', 1, 'tut', 'Academic'),
(19, 'ts6', 1, 'tut', 'Academic'),
(20, 'ts7', 1, 'tut', 'Academic'),
(21, 'ts8', 1, 'tut', 'Academic'),
(25, 'asd', 2, 'dfsg', 'f'),
(34, 'qwe', 2, 'tut', 'wer'),
(35, 'asd23', 2, 'tut', 'asdd');

-- --------------------------------------------------------

--
-- Table structure for table `students`
--

CREATE TABLE IF NOT EXISTS `students` (
  `id` int(11) NOT NULL,
  `name` varchar(40) DEFAULT NULL,
  `batchId` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `batchId` (`batchId`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `students`
--

INSERT INTO `students` (`id`, `name`, `batchId`) VALUES
(1, 'us', 1);

-- --------------------------------------------------------

--
-- Table structure for table `subjects`
--

CREATE TABLE IF NOT EXISTS `subjects` (
  `SID` int(11) NOT NULL AUTO_INCREMENT,
  `Sname` varchar(100) DEFAULT NULL,
  `Type` varchar(20) NOT NULL,
  `Scode` varchar(20) DEFAULT NULL,
  `Sem` varchar(10) DEFAULT NULL,
  `Hours` int(10) NOT NULL,
  `Branch` varchar(30) NOT NULL,
  PRIMARY KEY (`SID`),
  UNIQUE KEY `Type` (`Type`,`Scode`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=107 ;

--
-- Dumping data for table `subjects`
--

INSERT INTO `subjects` (`SID`, `Sname`, `Type`, `Scode`, `Sem`, `Hours`, `Branch`) VALUES
(69, 'presentation skills', 'lecture+tut', '120', 'first', 2, 'pd'),
(70, 'presentation skills', 'tut', '120', 'first', 1, 'pd'),
(74, 'english', 'lecture', '121', 'first', 2, 'pd'),
(75, 'maths 1', 'lecture+tut', '122', 'first', 3, 'math'),
(77, 'physics 1', 'lecture+tut', '124', 'first', 4, 'physics'),
(78, 'physics 1', 'tut', '124', 'first', 4, 'physics'),
(79, 'electrical circuits', 'lecture+tut', '125', 'first', 3, 'ece'),
(80, 'electrical circuits', 'tut', '125', 'first', 1, 'ece'),
(81, 'icp', 'lecture+tut', '126', 'first', 3, 'cse'),
(82, 'icp', 'tut', '126', 'first', 1, 'cse'),
(83, 'physics lab 1', 'lab', '127', 'first', 2, 'physics'),
(84, 'e circuits lab', 'lab', '128', 'first', 2, 'ece'),
(85, 'computer programming lab', 'lab', '129', 'first', 2, 'cse'),
(86, 'institutional orientation', 'lecture', '130', 'first', 2, 'cse'),
(87, 'maths 1', 'tut', '122', 'first', 1, 'math'),
(88, 'group and cooperative process', 'lecture+tut', '201', 'second', 2, 'pd'),
(89, 'group and cooperative process', 'tut', '201', 'second', 2, 'pd'),
(90, 'discrete maths', 'lecture+tut', '202', 'second', 3, 'maths'),
(91, 'discrete maths', 'tut', '202', 'second', 3, 'maths'),
(92, 'physics 2', 'lecture+tut', '203', 'second', 3, 'physics'),
(93, 'physics 2', 'tut', '203', 'second', 3, 'physics'),
(94, 'basic electronic devices and circuits', 'lecture+tut', '204', 'second', 3, 'ece'),
(95, 'basic electronic devices and circuits', 'tut', '204', 'second', 3, 'ece'),
(96, 'data structures', 'lecture+tut', '205', 'second', 3, 'cse'),
(97, 'data structures', 'tut', '205', 'second', 1, 'cse'),
(98, 'physics lab 2', 'lab', '206', 'second', 2, 'physics'),
(99, 'basic electronics lab', 'lab', '207', 'second', 2, 'ece'),
(100, 'data structures and computer programming lab', 'lab', '208', 'second', 4, 'cse'),
(101, 'departmental orientation', 'lecture', '209', 'second', 2, 'cse'),
(102, 'biophysical techniques', 'lecture+tut', '210', 'second', 3, 'biotech'),
(103, 'biophysical techniques', 'tut', '210', 'second', 1, 'biotech'),
(104, 'basic bio science lab', 'lab', '211', 'second', 2, 'biotech'),
(105, 'maths 2', 'lecture+tut', '301', 'third', 3, 'maths'),
(106, 'maths 2', 'tut', '301', 'third', 1, 'maths');

-- --------------------------------------------------------

--
-- Table structure for table `teachers`
--

CREATE TABLE IF NOT EXISTS `teachers` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(40) DEFAULT NULL,
  `dept` varchar(40) DEFAULT NULL,
  `userId` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=10 ;

--
-- Dumping data for table `teachers`
--

INSERT INTO `teachers` (`id`, `name`, `dept`, `userId`) VALUES
(1, 'baani', 'cse', NULL),
(2, 'naami', 'cse', NULL),
(3, 'gaami', 'cse', NULL),
(4, 'abc', 'ece', NULL),
(5, 'bbc', 'ece', NULL),
(6, 'cbc', 'ece', NULL),
(7, 'dbc', 'pd', NULL),
(8, 'Utkarsh Siwach', 'cse', 1),
(9, 'asd', 'cse', 0);

-- --------------------------------------------------------

--
-- Table structure for table `teachersubjects`
--

CREATE TABLE IF NOT EXISTS `teachersubjects` (
  `teacherId` int(11) DEFAULT NULL,
  `preference` int(11) DEFAULT NULL,
  `subjectId` int(11) DEFAULT NULL,
  KEY `teacherId` (`teacherId`),
  KEY `subjectId` (`subjectId`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

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
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=2 ;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`UserID`, `FName`, `LName`, `Email`, `Phone`, `Password`, `Gender`, `Department`, `CreatedBy`, `CreatedDate`, `CreatedIP`, `ModifiedBy`, `ModifiedDate`, `ModifiedIP`) VALUES
(1, 'Utkarsh', 'Siwach', 'utkarsh.siwach@gmail.com', '', '7809b2a5b4dae0abe348aca4da22b1d8', 'm', 'cse', NULL, '2014-12-12 18:22:40', '127.0.0.1', NULL, '2014-12-12 07:22:40', NULL);

--
-- Constraints for dumped tables
--

--
-- Constraints for table `batchsubjects`
--
ALTER TABLE `batchsubjects`
  ADD CONSTRAINT `batchsubjects_ibfk_1` FOREIGN KEY (`subjectId`) REFERENCES `subjects` (`SID`) ON DELETE CASCADE,
  ADD CONSTRAINT `batchsubjects_ibfk_2` FOREIGN KEY (`batchId`) REFERENCES `batch` (`BID`) ON DELETE CASCADE;

--
-- Constraints for table `students`
--
ALTER TABLE `students`
  ADD CONSTRAINT `students_ibfk_1` FOREIGN KEY (`batchId`) REFERENCES `batch` (`BID`);

--
-- Constraints for table `teachersubjects`
--
ALTER TABLE `teachersubjects`
  ADD CONSTRAINT `teachersubjects_ibfk_1` FOREIGN KEY (`teacherId`) REFERENCES `teachers` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `teachersubjects_ibfk_2` FOREIGN KEY (`subjectId`) REFERENCES `subjects` (`SID`) ON DELETE CASCADE;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
