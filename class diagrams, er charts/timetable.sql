
-- Database: `timetable`

CREATE TABLE IF NOT EXISTS `batch` (
  `BID` int(11) NOT NULL AUTO_INCREMENT,
  `Name` varchar(20) NOT NULL,
  `Type` varchar(20) NOT NULL,
  `Year` varchar(10) NOT NULL,
  PRIMARY KEY (`BID`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=12 ;

--
-- Dumping data for table `batch`
--

INSERT INTO `batch` (`BID`, `Name`, `Type`, `Year`) VALUES
(1, 'B1', 'cse', 1),
(5, 'B3', 'cse',  1),
(7, 'B3', 'ece',  2),
(8, 'B5', 'ece',  2),
(9, 'B2', 'bio',  3),
(10, 'B6', 'cse', 4),
(11, 'B7', 'cse', 4);

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
(4, 'Operating System', 'lab', '54643', 'second', 4, 'cse'),
(5, 'Cloud Computing', 'tut', '10CI13846', 'fourth', 3, 'ece');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE IF NOT EXISTS `users` (
  `UserID` int(10) AUTO_INCREMENT,
  `FName` varchar(30) NOT NULL,
  `LName` varchar(30) NOT NULL,
  `Email` varchar(100),
  `Phone` varchar(20),
  `Password` varchar(50) NOT NULL,
  `Gender` varchar(10) NOT NULL,
  `Department` varchar(30),
  `CreatedBy` varchar(100),
  `CreatedDate` datetime,
  `CreatedIP` varchar(100),
  `ModifiedBy` varchar(100),
  `ModifiedDate` timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `ModifiedIP` varchar(100),
  PRIMARY KEY (`Email`,`Phone`,`UserID`),
  UNIQUE KEY `UserID` (`UserID`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=5 ;

create table batchSubjects (
	batchId	integer,
	subjectId	integer,
	constraint fk_batchIdBS foreign key (batchId) references batch (bid),
	constraint fk_subjectIdBS foreign key (subjectId) references subjects (sid)
);
 insert into batchSubjects values(1,2),(1,3),(1,4),(5,1),(5,5),(1,1);
 
 create table teachers (
	id integer primary key,
	name varchar(40),
	dept varchar(40)
);

create table teacherSubjects (
	teacherId integer,
	subjectId integer,
	foreign key (teacherId) references teachers (id),
	foreign key (subjectId) references subjects (id)
);
 