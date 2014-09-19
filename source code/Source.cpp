#include<iostream>
#include "MySqlCon.h"

using namespace std;

class Teachers;
class Subjects;
class Batches;
class Students;

class Teachers {
public:
	int id;
	char * name;
	Subjects *subArr;
	Batches * batchArr;
	static void fetchRecordsFromDB();
	void display();

};

class Subjects {
public:
	int id;
	const char * name;
	static void fetchRecordsFromDB();
	void display();
};

class Batches {
public:
	int id;
	Students * studentArr;
	void display();
	static void fetchRecordsFromDB();
};

class Students {
public:
	int id;
	const char * name;
	int batchId;
	Subjects *subArr;
	void display();
	static void fetchRecordsFromDB();
};

std::vector<Batches*> batchVector;
std::vector<Teachers*> teacherVector;
std::vector<Subjects*> subjectVector;
std::vector<Students*> studentVector;

void Teachers::fetchRecordsFromDB() {
	MySqlDatabase oDB;
	oDB.createConn();
	ResultSet *rs = oDB.execute("select * from teachers");
	int n = rs->rowsCount();
	Teachers *temp;	
	while(rs->next()) {
		temp= new Teachers();
		temp->id = rs->getInt(1);
		temp->name = new char[40];
		strcpy_s(temp->name,40,rs->getString(2).c_str());
		teacherVector.push_back(temp);
	}
	delete rs;
}
void Subjects::fetchRecordsFromDB() {
	MySqlDatabase oDB;
	oDB.createConn();
	ResultSet *rs = oDB.execute("select * from subjects");
	int n = rs->rowsCount();
	Subjects *temp;	
	while(rs->next()) {
		temp= new Subjects();
		temp->id = rs->getInt(1);
		temp->name = rs->getString(2).c_str();
		subjectVector.push_back(temp);
	}
	delete rs;
}
void Batches::fetchRecordsFromDB() {
	MySqlDatabase oDB;
	oDB.createConn();
	ResultSet *rs = oDB.execute("select * from batches");
	int n = rs->rowsCount();
	Batches *temp;	
	while(rs->next()) {
		temp= new Batches();
		temp->id = rs->getInt(1);
		batchVector.push_back(temp);
	}
	delete rs;
}
void Students::fetchRecordsFromDB() {
	MySqlDatabase oDB;
	oDB.createConn();
	ResultSet *rs = oDB.execute("select * from students");
	int n = rs->rowsCount();
	Students *temp;	
	while(rs->next()) {
		temp= new Students();
		temp->id = rs->getInt(1);
		temp->name = rs->getString(2).c_str();
		temp->batchId = rs->getInt(3);
		studentVector.push_back(temp);
	}
	delete rs;
}

void Teachers::display() {
	cout<<"\nTeaccher id:"<<id<<" name:"<<name;
	if(subArr!=NULL)subArr->display();
	if(batchArr!=NULL)batchArr->display();
	cout<<endl;
}
void Subjects::display() {
	cout<<"\nSubject id:"<<id<<" name:"<<name;
}
void Batches::display() {
	cout<<"\nBatch id:"<<id<<" student arr:";
	studentArr->display();
}
void Students::display() {
	cout<<"\nStudent id:"<<id<<" name:"<<name<<"batchId :"<<batchId<<"subject arr:";
	subArr->display();
}

void main() {

	Teachers::fetchRecordsFromDB();
	Students::fetchRecordsFromDB();
	Subjects::fetchRecordsFromDB();
	Batches::fetchRecordsFromDB();

	for(int i=0;i<teacherVector.size();i++) {
		teacherVector[i]->display();
	}
	
	system("pause");
}