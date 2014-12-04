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
	static int maxTeachingHours;
	static int fetchRecordsFromDB();
	static int fetchSubjectsFromDB();
	static int assignSubjects();
	static int assignBatches();
	static Teachers* findTeacher(int);
	void display();
};
int Teachers::maxTeachingHours = 16;

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

	static int maxPreferencesAllowed;

	// unordered map from (subjectId -> numOfAllocsLeft) to check if a 
	// subject can still be allocated to a teacher
	// 0 for every instance allocated, >0 for number of possible allocations left
	// Used be Teachers::assignSubjects(), initialized by Subjects::initializeMap()
	static unordered_map<int,int> subjectsAllocated;
	static int fetchRecordsFromDB();
	static void initializeMap();
	static Subjects* findSubject(int);
	void display();
};
int Subjects::maxPreferencesAllowed = 5;
unordered_map<int,int> Subjects::subjectsAllocated;

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
	int id;
	Batches * batch;
	Teachers * teacher;
	Subjects * subject;
};

std::vector<Batches*> batchVector;
std::vector<Teachers*> teacherVector;
std::vector<Subjects*> subjectVector;
std::vector<Students*> studentVector;
std::vector<Rooms*> roomVector;
std::list<Slots*> slotList;	// it is populated by Teachers::assignBatches()

int Teachers::fetchRecordsFromDB() {
	MySqlDatabase oDB;
	if(!oDB.createConn()) {
		return 0;	// some exception occoured
	}
	ResultSet *rs = oDB.execute("select * from teachers");
	int n = rs->rowsCount();
	if(n==0) {
		return 0;
	}
	Teachers *temp;	
	while(rs->next()) {
		temp= new Teachers();
		temp->id = rs->getInt(1);
		temp->name=rs->getString(2);
		temp->dept=rs->getString(3);
		temp->hrsCurrentlyTeaching=0;
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
// after performing the allocation, decrement subjectsAllocated map by 1
// Also assigns tutorials of that subject, if available.
// Then moves on to second preferences of every teacher and so on..
// After finishing with all prefs. if any subject instance is left, it is
// assigned to a free teacher.
// Returns 1 if it is unable to assign all subjects to a teacher, 0 otherwise
int Teachers::assignSubjects() {
	Subjects::initializeMap();
	int i=0;
	for(int prefNum=0;prefNum < Subjects::maxPreferencesAllowed; prefNum++) {
		Subjects * tempSub;

		// instead of linear iteration, random selection of teacher	will be more 'fair'
		// as right now 1st teacher getting all pref subjects
		for(Teachers * teacher : teacherVector) {
			if(prefNum>=teacher->preferredSubjects.size()) {
				break;
			}
			else {	// there are prefereed subjects left for this teacher
				tempSub=teacher->preferredSubjects[i];
				if(Subjects::subjectsAllocated[tempSub->id]!=0 && 
				 teacher->hrsCurrentlyTeaching < Teachers::maxTeachingHours) {
					Subjects::subjectsAllocated[tempSub->id]--;
					teacher->hrsCurrentlyTeaching+=tempSub->hours;
					teacher->allocatedSubjects.push_back(tempSub);
				}
				// now try to assign the respective tut
				if(tempSub->type=="lecture" && Subjects::subjectsAllocated[tempSub->id+1]!=0 && 
				 teacher->hrsCurrentlyTeaching < Teachers::maxTeachingHours) {
					Subjects::subjectsAllocated[tempSub->id]--;
					teacher->hrsCurrentlyTeaching+=tempSub->hours;
					teacher->allocatedSubjects.push_back(tempSub);
				}
			}
		}
	}

	// now try to allocate unallocated subjects

	for( auto it = Subjects::subjectsAllocated.begin(); it!=Subjects::subjectsAllocated.end();it++) {
		if(it->second!=0) { // allocate it
			// first find a teacher who is of the same dept.
			// and is free for more subjects
			int i = it->second;
			int j=0;
			Subjects * tempSub = Subjects::findSubject(it->first);
			Teachers * tempT;
			int loops = (Teachers::maxTeachingHours/tempSub->hours)+1;	// no. of times to loop around looking for a teacher
			while(i>0 && loops>0) {	// i instances of this subjects remain, to be allocated		
				tempT=teacherVector[j];
				if(tempT->dept == tempSub->branch && tempT->hrsCurrentlyTeaching < Teachers::maxTeachingHours) {
					i--;
					it->second--;
					tempT->hrsCurrentlyTeaching+=tempSub->hours;
					tempT->allocatedSubjects.push_back(tempSub);
				}
				j++;	// select next teacher in circular array fashion
				if(j==teacherVector.size() ) {j=0; loops--;}
			}
			if(i>0) {
				// no more teachers available to teach that subject
				// raise exception!!
				// either make one teacher teach more or club few batches together
				return 1;	// function failed
			}
		}
	}
	return 0;	// all allocation done
}

// for every subject a batch is taking, find a teacher taking it
// and assign him/her to that batch.
// Also add this combination of (teacher-batch-subject) to slotList
// Can be optimized further, also there can be multiple bindings of teacher-batch
int Teachers::assignBatches() {
	bool done=false;
	Slots * slot;
	for(Batches * batch : batchVector) {
		for(Subjects * subject : batch->subjectArr) {
			done=false;
			for(Teachers * teacher : teacherVector) {
				if(teacher->dept != subject->branch) { continue; }
				for(Subjects *tempSub : teacher->allocatedSubjects) {
					if(tempSub==subject) {
						teacher->allocatedBatches.push_back(batch);
						slot = new Slots();
						slot->id = slotList.size();
						slot->batch = batch;
						slot->subject = tempSub;
						slot->teacher = teacher;
						slotList.push_back(slot);
						done=true;
						break;
					}
				}
				if(done) break;
			}
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
	if(n==0) {
		return 0;
	}
	Subjects *temp;	
	while(rs->next()) {
		temp= new Subjects();
        temp->id = rs->getInt(1);
        temp->name = rs->getString(2);
        temp->year = rs->getString(5);
        temp->branch = rs->getString(7);
        temp->type = rs->getString(3);
        temp->hours = rs->getInt(6);
		temp->numOfBatchesTakingIt=0;
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
		//subjectsAllocated.insert(pair<int,int>(temp->id,0));
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

// initialize the unordered_map subjectsAllocated with the correct values
// of the number of batches taking that subject
// must be called after Batches::fetchSubjectsFromDB()
void Subjects::initializeMap() {
	for(Subjects * subject : subjectVector) {
		subjectsAllocated[subject->id]=subject->numOfBatchesTakingIt;
	}
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
	if(n==0) {
		return 0;
	}
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
		if(id==batchVector[i]->id[0]) {
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
	if(n==0) {
		return 0;
	}
	Students *temp;	
	Batches *batch = batchVector[0];
	while(rs->next()) {
		temp= new Students();
		temp->id = rs->getInt(1);
		temp->name = rs->getString(2);
		temp->batchId = rs->getInt(3);
		studentVector.push_back(temp);

		if(batch->id[0] != temp->batchId) {
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
	if(n==0) {
		return 0;
	}
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
	cout<<"\nTeacher id:"<<id<<" name:"<<name<<"\npref. subs:"<<preferredSubjects.size();	
	if(!allocatedSubjects.empty()) { 
		cout<<" sub allotted:"<<allocatedSubjects.size();
		cout<<" hrs teaching:"<<hrsCurrentlyTeaching;
		cout<<" batches allotted:"<<allocatedBatches.size();
	}
	if(!allocatedBatches.empty()){
		cout<<"";
	}
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

int main() {

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
		8)Teachers::assignSubjects()
		9)Teachers::assignBatches()
	*/
	
	int tempArr[5];
	tempArr[0]=Subjects::fetchRecordsFromDB();
	tempArr[1]=Batches::fetchRecordsFromDB();
	tempArr[2]=Teachers::fetchRecordsFromDB();	
	tempArr[3]=Students::fetchRecordsFromDB();
	tempArr[4]=Rooms::fetchRecordsFromDB();
	bool proceed = true;
	for(int i:tempArr) {
		if(i==0) proceed=false;
	}
	if(!proceed) {
		cout<<"error some tables might be empty";
		return 0;
	}
	Teachers::fetchSubjectsFromDB();
	Batches::fetchSubjectsFromDB();	
	
	cout<<" fn ret:"<<Teachers::assignSubjects()<<" | ";
	Teachers::assignBatches();

	for(unsigned int i=0;i<teacherVector.size();i++) {
		teacherVector[i]->display();
	}

	for(unsigned int i=0;i<batchVector.size();i++) {
		batchVector[i]->display();
	}

	for(unsigned int i=0;i<subjectVector.size();i++) {
		subjectVector[i]->display();
	}
	/*
	for(unsigned int i=0;i<studentVector.size();i++) {
		studentVector[i]->display();
	}
	*/
	for(unsigned int i=0;i<roomVector.size();i++) {
		roomVector[i]->display();
	}
	cout<<endl;
	system("pause");
	return 1;
}