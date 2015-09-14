Project setup guide

Software required to build and run the application:
1. XAMPP or any other php server
2. c++ compiler  (visual studio preferred)
3. mysql (comes with xampp, can be installed separately)

Steps to set up the project:
1. import new 3/timetable.sql file into your database preferably through phpmyadmin.
    this sets up the database schema along with college data.

2. Copy the 'new 3' folder over to the htdocs directory of xampp,
    for other php servers, copy it over to their php application deployment directory.

3. Open file: new 3/db_conx.php and edit the line < $con=mysqli_connect("localhost","root","ticket1","timetable"); >
    to contain your mysql username instead of <root> and your mysql password instead of <ticket1>
    the default configuration of mysql looks like < $con=mysqli_connect("localhost","root","","timetable"); >
    
3. Copy the source code folder to the c++ ide folder of your choice (vs2010 os other).

4. Compile and run the c++ source code (c++ application forms the back end)

5. Open the webpage, localhost://new 3/index.php to run the web user interface
