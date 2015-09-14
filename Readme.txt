Project setup guide

Software required to build and run the application:
1. XAMPP or any other php server
2. visual studio 2012 (free edition will do to)
3. mysql (comes with xampp, can be installed separately)
4. mysql c++ connector 32bit
5. boost libraries version 1_53 (smaller in size, latest will work too)

Steps to set up the project:
1. import new 3/timetable.sql file into your database preferably through phpmyadmin.
    this sets up the database schema along with college data.

2. Copy the 'new 3' folder over to the htdocs directory of xampp,
    for other php servers, copy it over to their php application deployment directory.

3. Open file: new 3/db_conx.php and edit the line < $con=mysqli_connect("localhost","root","ticket1","timetable"); >
    to contain your mysql username instead of <root> and your mysql password instead of <ticket1>
    the default configuration of mysql looks like < $con=mysqli_connect("localhost","root","","timetable"); >
    
3. Copy the source code folder to a new c++ project in the ide.

4. Configure mysql c++ connector in visual studio 2012:

    check out the link : http://dev.mysql.com/doc/connector-cpp/en/connector-cpp-apps-windows-visual-studio.html
    for detailed instructions on setting it up
    
    4.1: download mysql c++ connector 32bit (latest) and install
    4.2 download boost libraries version 1_53 (smaller in size, latest will work too) and unzip on desktop
    4.3 set up visual studio project properties
    4.4 uncomment source1.cpp and do a testing of the mysql c++ connector, if the file executes then the
        connector is properly installed.
    4.5 change the project to release version

5. Compile and run the c++ source code (c++ application forms the back end)

6. Open the webpage, localhost://new 3/index.php to run the web user interface
