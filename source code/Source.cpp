#include<iostream>
#include<string>
#include "MySqlCon.h"

using namespace std;

class Teachers;
class Subjects;
class Batches;
class Students;

class Teachers {
public:
	int id;
	string name;
	vector<Subjects *> allocatedSubjects,preferredSubjects;
	vector<Batches *> allocatedBatches;
	static int fetchRecordsFromDB();
	static int fetchSubjectsFromDB();
	static Teachers* findTeacher(int);
	void display();
};

class Subjects {
public:
	int id;
	string name;
	static int fetchRecordsFromDB();
	static Subjects* findSubject(int);
	void display();
};

class Batches {
public:
	int id;
	vector<Students *> studentArr;
	vector<Batches *> batchArr;
	void display();
	static int fetchRecordsFromDB();
};

class Students {
public:
	int id;
	string name;
	int batchId;	
	void display();
	static int fetchRecordsFromDB();
};

class Rooms {
public:
	int id;
	string name;
	int capacity;
	int type;
	void display();
	static int fetchRecordsFromDB();
};

class Slots {
public:
	int time;
	int batchId;
	int roomId;
	int teacherId;
	int subjectId;

};

std::vector<Batches*> batchVector;
std::vector<Teachers*> teacherVector;
std::vector<Subjects*> subjectVector;
std::vector<Students*> studentVector;
std::vector<Rooms*> roomVector;
std::vector<Slots> slotVector;


int Teachers::fetchRecordsFromDB() {
	MySqlDatabase oDB;
	if(!oDB.createConn()) {
		return 0;	// some exception occoured
	}
	ResultSet *rs = oDB.execute("select * from teachers");
	int n = rs->rowsCount();
	Teachers *temp;	
	while(rs->next()) {
		temp= new Teachers();
		temp->id = rs->getInt(1);
		temp->name=rs->getString(2);
		teacherVector.push_back(temp);
	}
	delete rs;
	return 1;
}

// fetches preffered subjects from DB and fills the
// prefferedSubjects vector of each teacher
int Teachers::fetchSubjectsFromDB() {
	if(teacherVector.empty()) {
		return 0;
	}
	MySqlDatabase oDB;
	if(!oDB.createConn()) {
		return 0;
	}
	ResultSet *rs = oDB.execute("select * from teacherSubjects order by teacherId");
	int teacherId,subjectId;
	Teachers *curTeacher=teacherVector[0];
	Subjects *subject;
	while(rs->next()) {
		teacherId = rs->getInt(1);
		subjectId = rs->getInt(2);
		if(curTeacher->id != teacherId) {
			curTeacher = findTeacher(teacherId);
		}
		curTeacher->preferredSubjects.push_back(Subjects::findSubject(subjectId));
	}
}

// finds and returns a Teachers *  from techerVector
// whose id matches with the argument given
// if no match is found returns NULL
Teachers* Teachers::findTeacher(int id) {
	int size = teacherVector.size();
	for(int i=0;i<size;i++) {
		if(id==teacherVector[i]->id) {
			return teacherVector[i];
		}
	}
	return NULL;	// not found
}

int Subjects::fetchRecordsFromDB() {
	MySqlDatabase oDB;
	if(!oDB.createConn()) {
		return 0;
	}
	ResultSet *rs = oDB.execute("select * from subjects");
	int n = rs->rowsCount();
	Subjects *temp;	
	while(rs->next()) {
		temp= new Subjects();
		temp->id = rs->getInt(1);
		temp->name = rs->getString(2);
		subjectVector.push_back(temp);
	}
	delete rs;
	return 1;
}

// finds and returns a Subjects*  from subjectVector
// whose id matches with the argument given
// if no match is found returns NULL
Subjects* Subjects::findSubject(int id) {
	int size = subjectVector.size();
	for(int i=0;i<size;i++) {
		if(id==subjectVector[i]->id) {
			return subjectVector[i];
		}
	}
	return NULL;	// not found
}

int Batches::fetchRecordsFromDB() {
	MySqlDatabase oDB;
	if(!oDB.createConn()) {
		return 0;
	}
	ResultSet *rs = oDB.execute("select * from batches");
	int n = rs->rowsCount();
	Batches *temp;	
	while(rs->next()) {
		temp= new Batches();
		temp->id = rs->getInt(1);
		batchVector.push_back(temp);
	}
	delete rs;
	return 1;
}
int Students::fetchRecordsFromDB() {
	MySqlDatabase oDB;
	if(!oDB.createConn()) {
		return 0;
	}
	ResultSet *rs = oDB.execute("select * from students");
	int n = rs->rowsCount();
	Students *temp;	
	while(rs->next()) {
		temp= new Students();
		temp->id = rs->getInt(1);
		temp->name = rs->getString(2);
		temp->batchId = rs->getInt(3);
		studentVector.push_back(temp);
	}
	delete rs;
	return 1;
}

int Rooms::fetchRecordsFromDB() {
	MySqlDatabase oDB;
	if(!oDB.createConn()) {
		return 0;
	}
	ResultSet *rs = oDB.execute("select * from rooms");
	int n = rs->rowsCount();
	Rooms * room;
	while(rs->next()) {
		room = new Rooms();
		room->id = rs->getInt(1);
		room->name = rs->getString(2);
		room->capacity = rs->getInt(3);
		room->type = rs->getInt(4);
		roomVector.push_back(room);
	}
	delete rs;
	return 1;
}

void Teachers::display() {
	cout<<"\nTeacher id:"<<id<<" name:"<<name;	
	if(!allocatedSubjects.empty())//subArr->display();
	if(!allocatedBatches.empty())//batchArr->display();
	cout<<endl;
}
void Subjects::display() {
	cout<<"\nSubject id:"<<id<<" name:"<<name;
}
void Batches::display() {
	cout<<"\nBatch id:"<<id<<" student arr length : "<<studentArr.size();
	//studentArr->display();
}
void Students::display() {
	cout<<"\nStudent id:"<<id<<" name:"<<name<<"batchId :"<<batchId;
}
void Rooms::display() {
	cout<<"\nRoom id:"<<id<<" name:"<<name<<"capacity :"<<capacity<<" type :"<<type;
}

void main() {

	Teachers::fetchRecordsFromDB();
	Students::fetchRecordsFromDB();
	Subjects::fetchRecordsFromDB();
	Batches::fetchRecordsFromDB();
	Rooms::fetchRecordsFromDB();

	for(unsigned int i=0;i<teacherVector.size();i++) {
		teacherVector[i]->display();
	}

	for(unsigned int i=0;i<batchVector.size();i++) {
		batchVector[i]->display();
	}

	for(unsigned int i=0;i<subjectVector.size();i++) {
		subjectVector[i]->display();
	}
	for(unsigned int i=0;i<studentVector.size();i++) {
		studentVector[i]->display();
	}
	for(unsigned int i=0;i<roomVector.size();i++) {
		roomVector[i]->display();
	}
	system("pause");
}