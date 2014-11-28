#include<iostream>
#include<string>
#include<unordered_map>
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
	string dept;
	int hrsCurrentlyTeaching;
	// in prefferedSubjects first one is most preferred,last one - least
	vector<Subjects *> allocatedSubjects,preferredSubjects;	
	vector<Batches *> allocatedBatches;
	static int const maxTeachingHours = 16;
	static int fetchRecordsFromDB();
	static int fetchSubjectsFromDB();
	static int assignSubjects();
	static Teachers* findTeacher(int);
	void display();
};

class Subjects {
public:
	int id;
	string name;
	string type;
	string year;
	int hours;
	string branch;

	// will be incremented by Batches::fetchSubjectsFromDB()
	int numOfBatchesTakingIt;

	static const int maxPreferencesAllowed = 5;

	// onordered map from (subjectId -> isAllocated) to check if a 
	// subject has been allocated to a teacher
	// 0 for not allocated, 1 - allocated
	// Used be Teachers::assignSubjects(), init. by Subjects::fetchRecordsFromDB()
	static unordered_map<int,int> subjectsAllocated;
	static int fetchRecordsFromDB();
	static Subjects* findSubject(int);
	void display();
};

class Batches {
public:
	vector<int> id;
	string name;
	string type;
	string sem;
	vector<Students *> studentArr;
	vector<Subjects *> subjectArr;
	void display();
	static int fetchRecordsFromDB();
	static int fetchSubjectsFromDB();
	static int groupBatchesForLectures();
	static Batches* findBatch(int);
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
	string type;
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
// it is essential that Teachers::fetchRecordsFromDB()
// and Subjects::fetchRecordsFromDB() have been called before this function.
// foreign key references in DB will help in maintaining records integrity
int Teachers::fetchSubjectsFromDB() {
	if(teacherVector.empty()) {
		return 0;
	}
	MySqlDatabase oDB;
	if(!oDB.createConn()) {
		return 0;
	}
	ResultSet *rs = oDB.execute("select * from teacherSubjects order by teacherId,preference");
	int teacherId,subjectId;
	Teachers *curTeacher=teacherVector[0];
	Subjects *subject=subjectVector[0];
	while(rs->next()) {
		teacherId = rs->getInt(1);
		subjectId = rs->getInt(3);
		if(curTeacher->id != teacherId) {
			curTeacher = findTeacher(teacherId);
		}
		curTeacher->preferredSubjects.push_back(Subjects::findSubject(subjectId));
	}
	delete rs;
	return 1;
}

// finds and returns a Teachers *  from teacherVector
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

// fills the allocatedSubjects vector of teachers
// by looking up preferredSubjects of each teacher
// allocating the first preferences of each teacher if not already taken.
// Also assigns tutorials of that subject, if available.
// Then moves on to second preferences of every teacher and so on..
int Teachers::assignSubjects() {
	
	int i=0;
	for(int prefNum=0;prefNum < Subjects::maxPreferencesAllowed; prefNum++) {
		Subjects * tempSub;
		for(Teachers * teacher : teacherVector) {
			if(prefNum>=teacher->preferredSubjects.size()) {
				break;
			}
			else {	// there are prefereed subjects left for this teacher
				tempSub=teacher->preferredSubjects[i];
				if(Subjects::subjectsAllocated[tempSub->id]==0 && 
				 teacher->hrsCurrentlyTeaching < Teachers::maxTeachingHours) {
					Subjects::subjectsAllocated[tempSub->id]=1;
					teacher->hrsCurrentlyTeaching+=tempSub->hours;
					teacher->allocatedSubjects.push_back(tempSub);
				}
				// now try to assign the respective tut
				if(tempSub->type=="lecture" && Subjects::subjectsAllocated[tempSub->id+1]==0 && 
				 teacher->hrsCurrentlyTeaching < Teachers::maxTeachingHours) {
					Subjects::subjectsAllocated[tempSub->id]=1;
					teacher->hrsCurrentlyTeaching+=tempSub->hours;
					teacher->allocatedSubjects.push_back(tempSub);
				}
			}
		}
	}

	// now try to allocate unallocated subjects

	for( auto it = Subjects::subjectsAllocated.begin(); it!=Subjects::subjectsAllocated.end();it++) {
		if(it->second!=1) { // allocate it
			
		}
	}


}

////////////

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
        temp->year = rs->getString(5);
        temp->branch = rs->getString(7);
        temp->type = rs->getString(3);
        temp->hours = rs->getInt(6);
        /*
		// won't be needed once database entries of subjects are corrected
		if (temp->type.compare("lect+tut") == 0) { //split lect+tut into lect, tut
			temp->type.assign("lecture"); 
            Subjects *node;
            node= new Subjects();
            node->id = temp->id;
            node->name.assign(temp->name);
            node->type.assign("tut");
            temp->hours = temp->hours - 1; 
            node->hours = 1;
            node->year.assign(temp->year);
            node->branch.assign(temp->branch);
            subjectVector.push_back(node);
        }
		*/
        subjectVector.push_back(temp);

		// now mark the subject as unallocated
		subjectsAllocated[temp->id]=0;
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
/////////////

// fills the batchVector with basic details of batches from the 
// database
int Batches::fetchRecordsFromDB() {
	MySqlDatabase oDB;
	if(!oDB.createConn()) {
		return 0;
	}
	ResultSet *rs = oDB.execute("select * from batch");
	int n = rs->rowsCount();
	Batches *temp;	
	while(rs->next()) {
		temp= new Batches();
		temp->id.push_back(rs->getInt(1));
		temp->name = rs->getString(2);
		temp->type = rs->getString(3);
		temp->sem = rs->getString(4);
		batchVector.push_back(temp);
	}
	delete rs;
	return 1;
}

// fills the subjectArr vector of each batch by looking
// up the common subjects of each of its students(in that batch)
// the backlog subjects are not added to the vector
// also increments the respective subject object's numOfBatchesTakingIt by 1
// every time a subject is added to the batch's list
// both functions Batches::fetchRecordsFromDB() and Subjects::fetchRecordsFromDB()
// must be called before this function
int Batches::fetchSubjectsFromDB() {
	MySqlDatabase oDB;
	if(!oDB.createConn()) {
		return 0;
	}
	ResultSet *rs = oDB.execute("select * from batchSubjects order by batchId");
	Batches * batch=batchVector[0];
	Subjects *subject=subjectVector[0];
	int batchId,subjectId;
	while(rs->next()) {
		batchId = rs->getInt(1);
		subjectId = rs->getInt(2);
		if(batchId != batch->id[0]) {
			batch = findBatch(batchId);
		}
		if(subjectId != subject->id) {
			subject=Subjects::findSubject(subjectId);
		}
		subject->numOfBatchesTakingIt++;	// validate this
		batch->subjectArr.push_back(subject);
	}
	delete rs;
	return 1;
}

// groups the individual batches into combined ones
// static grouping is being performed with no optimization yet, just make groups of 3
// creates a new Batch object with id vector having ids of all constituent batches
// lecture subjects from individual batches are removed from that batch's subject
// list vector and added to the combined batch's subjectList vector
// also updates the numOfBatchesTakingIt integer of Subject objects
int Batches::groupBatchesForLectures() {

}

// finds and returns a Batches*  from batchVector
// whose id matches with the argument given
// if no match is found returns NULL
Batches* Batches::findBatch(int id) {
	int size = batchVector.size();
	for(int i=0;i<size;i++) {
		if(id==batchVector[i]->id) {
			return batchVector[i];
		}
	}
	return NULL;	// not found
}
/////////////

// fetches student id, name, batchId and add them to studentVector
// also adds the student* to respective batch's studentArr vector
int Students::fetchRecordsFromDB() {
	MySqlDatabase oDB;
	if(!oDB.createConn()) {
		return 0;
	}
	ResultSet *rs = oDB.execute("select * from students order by batchId");
	int n = rs->rowsCount();
	Students *temp;	
	Batches *batch = batchVector[0];	
	while(rs->next()) {
		temp= new Students();
		temp->id = rs->getInt(1);
		temp->name = rs->getString(2);
		temp->batchId = rs->getInt(3);
		studentVector.push_back(temp);

		if(batch->id != temp->batchId) {
			batch=Batches::findBatch(temp->batchId);
		}
		batch->studentArr.push_back(temp);
	}
	delete rs;
	return 1;
}


int Rooms::fetchRecordsFromDB() {
	MySqlDatabase oDB;
	if(!oDB.createConn()) {
		return 0;
	}
	ResultSet *rs = oDB.execute("select * from room");
	int n = rs->rowsCount();
	Rooms * room;
	while(rs->next()) {
		room = new Rooms();
		room->id = rs->getInt(1);
		room->name = rs->getString(2);
		room->capacity = rs->getInt(3);
		room->type = rs->getString(4);
		roomVector.push_back(room);
	}
	delete rs;
	return 1;
}


void Teachers::display() {
	cout<<"\nTeacher id:"<<id<<" name:"<<name<<" pref. sub nos :"<<preferredSubjects.size();	
	if(!allocatedSubjects.empty())//subArr->display();
	if(!allocatedBatches.empty())//batchArr->display();
	cout<<endl;
}
void Subjects::display() {
	cout<<"\nSubject id: "<<id<<" name: "<<name;
}
void Batches::display() {
	cout<<"\nBatch id:"<<id[0]<<" stu arr len :"<<studentArr.size()<<" sub arr len :"<<subjectArr.size();
	//studentArr->display();
}
void Students::display() {
	cout<<"\nStudent id: "<<id<<" name: "<<name<<" batchId : "<<batchId;
}
void Rooms::display() {
	cout<<"\nRoom id:"<<id<<" name:"<<name<<" capacity :"<<capacity<<" type :"<<type;
}

void main() {

	/*
		a complete ordering needs to be maintained while calling fetch
		data from db functions, only then will all objects be correctly
		linked/associated.
		1)Subjects::fetchRecordsFromDB()
		2)Batches::fetchRecordsFromDB()
		3)Teachers::fetchRecordsFromDB()
		4)Teachers::fetchSubjectsFromDB()
		5)Students::fetchRecordsFromDB()
		6)Batches::fetchSubjectsFromDB()
		7)Rooms::fetchRecordsFromDB()
	*/
	Subjects::fetchRecordsFromDB();
	Batches::fetchRecordsFromDB();
	Teachers::fetchRecordsFromDB();
	Teachers::fetchSubjectsFromDB();
	Students::fetchRecordsFromDB();
	Batches::fetchSubjectsFromDB();	
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
	cout<<endl;
	system("pause");
}