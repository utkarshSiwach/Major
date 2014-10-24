#include"MySqlCon.h"

MySqlDatabase::MySqlDatabase() {
	DBHOST =  "tcp://127.0.0.1:3306";
	USER = "root";
	PASSWORD = "ticket1";
	DATABASE = "major";
}

int MySqlDatabase::createConn(){
	try {
		driver = get_driver_instance();

		con = driver->connect(DBHOST,USER,PASSWORD);
		con -> setSchema(DATABASE);
	}catch(SQLException &e) {
		std::cout<<"ERROR :"<<e.what();
		return 0;
	}
	return 1;
}

ResultSet* MySqlDatabase::execute(char *qry) {
	stmt = con->createStatement();
	return stmt->executeQuery(qry);	
}