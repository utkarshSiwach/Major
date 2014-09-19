#include<cppconn/driver.h>
#include<cppconn/exception.h>
#include<cppconn/statement.h>
#include<cppconn/resultset.h>
#include<vector>

using namespace sql;
class Student;

class MySqlDatabase {

	char *DBHOST;
	char *USER;
	char *PASSWORD;
	char *DATABASE;

	Driver *driver;
	Connection *con;
	Statement *stmt;
	ResultSet *res;

public:
	MySqlDatabase();

	int createConn();
	ResultSet* execute(char*);
};