#undef UNICODE
#define WIN32_LEAN_AND_MEAN
#include <windows.h>
#include <winsock2.h>
#include <ws2tcpip.h>
#include <stdlib.h>
#include <stdio.h>
// Need to link with Ws2_32.lib
#pragma comment (lib, "Ws2_32.lib")
// #pragma comment (lib, "Mswsock.lib")
#define DEFAULT_BUFLEN 512
#define DEFAULT_PORT "27015"

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
int Teachers::maxTeachingHours = 30;

class Subjects {
public:
	int id;
	string code;
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
	static int batchSemToInt(string);
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
				// now try to assign the respective tut if there is one for this subj.
				//if(tempSub->type == "lecture+tut") {
					int tutId=-1;
					for(Subjects* subject : subjectVector) {
						if( subject->type == "tut" && tempSub->code == subject->code) {
							tutId = subject->id;
						}
					}
				
					if(Subjects::subjectsAllocated[tutId]!=0 && 
					teacher->hrsCurrentlyTeaching < Teachers::maxTeachingHours) {
						Subjects::subjectsAllocated[tempSub->id]--;
						teacher->hrsCurrentlyTeaching+=tempSub->hours;
						teacher->allocatedSubjects.push_back(tempSub);
					}
				//}
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
			Subjects *tempSub= Subjects::findSubject(it->first);
			Teachers * tempT;
			int loops = (Teachers::maxTeachingHours/(tempSub->hours))+1;	// no. of times to loop around looking for a teacher
			
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
				// return 1;	// function failed
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
						slot->id = slotList.size()+1;
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
	return 0;
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
		temp->code = rs->getString(4);
        temp->year = rs->getString(5);
        temp->branch = rs->getString(7);
        temp->type = rs->getString(3);
		if(temp->type == "lecture+tut") { // split is managed in frontend and database
			temp->type = "lecture";
		}
        temp->hours = rs->getInt(6);
		temp->numOfBatchesTakingIt=0;        
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
	// ordering by subjectId is imp. for function Batches::groupBatchesForLectures()
	ResultSet *rs = oDB.execute("select * from batchSubjects order by batchId, subjectId");
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
// static grouping is being performed with no optimization yet,
// just make groups of 3 batches that have exactly same subjects.
// creates a new Batch object with id vector having ids of all constituent batches
// lecture subjects from individual batches are removed from that batch's subject
// list vector and added to the combined batch's subjectList vector
// also updates the numOfBatchesTakingIt integer of Subject objects
// To function, batchSubjects must be sorted
int Batches::groupBatchesForLectures() {
	unordered_map<string,list<Batches*>> sameSubs;
	string allSubs;
	for(Batches* batch : batchVector) {
		allSubs="";
		for(Subjects * sub : batch->subjectArr) {
			allSubs = allSubs+to_string(sub->id)+" ";
		}
		sameSubs[allSubs].push_back(batch);	// add entry (unique list of Subjects -> batches taking them)
	}
	//int aa = 1;
	for(auto it = sameSubs.begin(); it!=sameSubs.end(); it++) {
		//cout<<"\naa:"<<aa;
		//aa++;
		list<Batches*> tempL = it->second;
		for(int i=0;tempL.size()>=3;i++) {
			Batches* curBatch = tempL.front();
			tempL.pop_front();
			Batches * newBatch = new Batches();
			
			newBatch->id.push_back(curBatch->id[0]);
			newBatch->name = curBatch->name;
			//int bb=1;
			for(auto it1 = curBatch->subjectArr.begin();it1!=curBatch->subjectArr.end();it1++) {  // remove lecture from indi. batch
				//cout<<" "<<bb;
				//bb++;				
				//cout<<(*it1)->name;
				if((*it1)->type == "lecture") {					
					curBatch->subjectArr.erase(it1);
					it1--;
					if(it1 == curBatch->subjectArr.end()) {
						break;
					}
				}
			}
			curBatch = tempL.front();
			tempL.pop_front();
			newBatch->id.push_back(curBatch->id[0]);
			newBatch->name += curBatch->name;
			for(auto it1 = curBatch->subjectArr.begin();it1!=curBatch->subjectArr.end();it1++) {  // remove lecture from indi. batch
				//cout<<(*it1)->name;
				if((*it1)->type == "lecture") {					
					curBatch->subjectArr.erase(it1);
					it1--;
					if(it1 == curBatch->subjectArr.end()) {
						break;
					}
				}
			}

			curBatch = tempL.front();
			tempL.pop_front();
			newBatch->id.push_back(curBatch->id[0]);
			newBatch->name += curBatch->name;
			
			newBatch->sem = curBatch->sem;
			newBatch->type = curBatch->type;
			for(auto it1 = curBatch->subjectArr.begin();it1!=curBatch->subjectArr.end();it1++) {  // populate subjectArr
				//cout<<(*it1)->name;
				if((*it1)->type == "lecture") {
					//to be done only once {
					newBatch->subjectArr.push_back(*it1);
					(*it1)->numOfBatchesTakingIt-=2;					
					if(Subjects::subjectsAllocated.find((*it1)->id)!=Subjects::subjectsAllocated.end()) {
						Subjects::subjectsAllocated[(*it1)->id]-=2;
					}
					// }
					curBatch->subjectArr.erase(it1);
					it1--;
					if(it1 == curBatch->subjectArr.end()) {
						break;
					}
				}
			}
			batchVector.push_back(newBatch);
		}

	}
	return 0;
}

int Batches::batchSemToInt(string sem) {
	if(sem == "first")
		return 1;
	if(sem == "second") {
		return 2;
	}
	if(sem == "third") {
		return 3;
	}
	if(sem == "fourth") {
		return 4;
	}
	if(sem == "fifth")
		return 5;
	if(sem == "sixth") {
		return 6;
	}
	if(sem == "seventh") {
		return 7;
	}
	if(sem == "eighth") {
		return 8;
	}
	return -1;
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

// tt 
const int TUT_SIZE = 10; // number of tut rooms
const int CLASS_SIZE1 = 10; //number of rooms for 3 batches
const int CLASS_SIZE2 = 10; //number of rooms for 4 batches
const int LAB_SIZE = 10;  // number of labs

//count number of iterations
int TT_COUNT = 0;

const int ROOM_SIZE = TUT_SIZE + CLASS_SIZE1 + CLASS_SIZE2 + LAB_SIZE; 
const int PERIODS = 10;

int **table;
list<Slots*> placedSlots; // move elements here once inserted into tt

void generateTable (list<Slots*> slotList) {
	
	int i = 0; 
	int a = TUT_SIZE, b = TUT_SIZE + CLASS_SIZE1, c = 0, d = TUT_SIZE + CLASS_SIZE1 + CLASS_SIZE2; // a : class1 pos, b : class2 pos, c : tut pos, d: lab pos

	int lab[PERIODS][LAB_SIZE] = {0}; // stores number of batches per lab, per hour
	int e = 0;
	
	//int table[PERIODS][ROOM_SIZE] = {0}; //  row i : mon (9-5)-sat (9 -1)  , column j : (0-9 tut) (10 - 29 class1) (30 - 49 class2) ( PERIODS - 59 labs)	
	
	table = new int*[PERIODS];
	for(int i=0;i<PERIODS;i++) {
		table[i] = new int[ROOM_SIZE];
		for(int j=0;j<ROOM_SIZE;j++) {
			table[i][j]=0;
		}
	}
	
	list<Slots*>::iterator it;
	it = slotList.begin();
	std::cout<<"Generating Timetable....\n";
	/*generate tt*/
	int flag = 0;

	do {

		//std::cout<<"at list head\n";
		a = TUT_SIZE;
		b = TUT_SIZE + CLASS_SIZE1;
		c = 0;
		d = TUT_SIZE + CLASS_SIZE1 + CLASS_SIZE2; // a : class1 pos, b : class2 pos, c : tut pos, d: lab pos
		e = 0;
		do {
			
			if ((*it)->subject->type == "lecture") { /*subject-type = 'lecture'*/
				//std::cout<<"Lecture..\n";
				if ( (*it)->batch->id.size() < 3 ) { /*ls-size == 3*/
					if ((table[i][a] == 0) && (a < TUT_SIZE + CLASS_SIZE1 )) {
						
						table[i][a] = (*it)->id;
						a++;
						//remove slot from unplaced list
						placedSlots.push_back((*it));
						list<Slots*>::iterator node;
						node = it;
						++it;
						//std::cout<<"Lecture placed.\n";
						slotList.remove((*node));

					}
					else {
						//don't assign, move to next vector	
						++it;
					}
				}
				else {
					if ((table[i][b] == 0) && (b < TUT_SIZE + CLASS_SIZE1 + CLASS_SIZE2 )) {

						table[i][b] = (*it) -> id;
						b++;
						//remove slot from unplaced list
						placedSlots.push_back((*it));
						list<Slots*>::iterator node;
						node = it;
						++it;
						//std::cout<<"Lecture placed.\n";
						slotList.remove((*node));
					}
					else {
						//don't assign, move on to next vector entry
						++it;
					}


				}

			}
			else if ((*it) -> subject -> type == "tut") { /*subject-type = 'tut'''*/
				//std::cout<<"Tut..\n";
				if ((table[i][c] == 0) && (c < TUT_SIZE  )) {

					table[i][c] = (*it) -> id;
					c++;
					//remove from unplaced subj list
					placedSlots.push_back((*it));
					list<Slots*>::iterator node;
					node = it;
					++it;
					//std::cout<<"Tut placed\n";
					slotList.remove((*node));

				}
				else {
					//don't assign, move on to next vector entry
					++it;

				}
			}
			else {
				//std::cout<<"Lab.\n";				
				if ((table[i][d] == 0) && (table[i + 1][d] == 0)  && (d < TUT_SIZE + CLASS_SIZE1 + CLASS_SIZE2 + LAB_SIZE )) {
					
					lab[i][e] = lab[i][e] + 1; 
					lab[i+1][e]  = lab[i+1][e] + 1;
					/*lab blocked for 2 hours*/
					table[i][d] = (*it) -> id ;
					table[i + 1][d] =  (*it) -> id;

					if (lab[i][e] <= 4) {
						//don't change lab numberr
					} 

					else {
						d++;
						e++;
					}
					//remove from unplaced list
					placedSlots.push_back((*it));
					list<Slots*>::iterator node;
					node = it;
					++it;
					//std::cout<<"Lab placed..\n";
					slotList.remove((*node));
				}
				else {
					//don't assign, move on to next vector entry
					++it;

				}
			}	


		} while (it != slotList.end()); /*list of entities isn't traversed'*/
		
		//std::cout <<"Done iterating for this slot\n";
		
		it = slotList.begin();
		//if ((*it) == NULL) flag = 1;

		//std::cout<<slotList.size()<<"\n";
		++i;
	} while (slotList.size() > 0 && i < PERIODS  );
	 
	//std::cout << "Done iterating the timetable";
	//std::cout << "Displaying timetable\n";
	//TT_COUNT++;
	//for (int i =0 ; i < PERIODS ;i++) {
	//	for (int j =0 ; j< ROOM_SIZE; j++) {
	//		std::cout<<table[i][j]<<" ";
	//	}
	//	std::cout<<"\n";
	//}
	//std::system("PAUSE");
	//fitnessFunc(table, slotList);
}


//tt close

int timeTableFunctions() {
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
		system("pause");
		return 101;
	}
	Teachers::fetchSubjectsFromDB();
	Batches::fetchSubjectsFromDB();	
	Batches::groupBatchesForLectures();
	int a = Teachers::assignSubjects();
	Teachers::assignBatches();
	
	generateTable(slotList);

	if(a!=0) {
		return 102;
	}
	return 0;	// all went well
}

Slots* findSlot(int id) {
	
	for(auto it=placedSlots.begin();it!=placedSlots.end();it++) {
		if((*it)->id == id) {
			return (*it);
		}
	}
	
	return NULL;
}
int maxSizeOfAnyList(list<string>time[]) {
	int max=0;
	for(int i=0;i<8;i++) {
		if(time[i].size()>max) max=time[i].size();
	}
	return max;
}
string convertToJSON() {
	Slots * slot;
	list<string> time[8];
	for(int j=0;j<ROOM_SIZE;j++) {
		for(int i=0;i<8;i++) {			
			if(table[i][j] != 0) { // get a string of all the detals of the slot together
				slot = findSlot(table[i][j]);
				if(slot == NULL) {
					cout<<"no slot matched:"<<table[i][j];
				}				
				string temp;
				temp=temp+slot->batch->sem+","+slot->batch->name+","+
					slot->subject->name+","+slot->teacher->name+","+to_string(j);
				time[i].push_back(temp);
			}			
		}
	}
	
	string sEmpty = "";
	string tmp;
	int m = maxSizeOfAnyList(time);
	string monday;
	monday+="\"monday\" : [ ";
	if(m>0) {
		tmp = (time[0].size() > 0)?time[0].front():sEmpty;
		monday+=" { \"nine\" : \""+tmp+"\"";
		tmp = (time[1].size() > 0)?time[1].front():sEmpty;
		monday+=" , \"ten\" : \""+tmp+"\"";
		tmp = (time[2].size() > 0)?time[2].front():sEmpty;
		monday+=" , \"eleven\" : \""+tmp+"\"";
		tmp = (time[3].size() > 0)?time[3].front():sEmpty;
		monday+=" , \"twelve\" : \""+tmp+"\"";
		tmp = (time[4].size() > 0)?time[4].front():sEmpty;
		monday+=" , \"one\" : \""+tmp+"\"";
		tmp = (time[5].size() > 0)?time[5].front():sEmpty;
		monday+=" , \"two\" : \""+tmp+"\"";
		tmp = (time[6].size() > 0)?time[6].front():sEmpty;
		monday+=" , \"three\" : \""+tmp+"\"";
		tmp = (time[7].size() > 0)?time[7].front():sEmpty;
		monday+=" , \"four\" : \""+tmp+"\"";		
		monday+=" } ";
		for(int i=0;i<8;i++) {
			if(time[i].size()>0) {
				time[i].pop_front();
			}
		}
	}
	for(int i=1;i<m;i++) {
		tmp = (time[0].size() > 0)?time[0].front():sEmpty;
		monday+=" ,{ \"nine\" : \""+tmp+"\"";
		tmp = (time[1].size() > 0)?time[1].front():sEmpty;
		monday+=" , \"ten\" : \""+tmp+"\"";
		tmp = (time[2].size() > 0)?time[2].front():sEmpty;
		monday+=" , \"eleven\" : \""+tmp+"\"";
		tmp = (time[3].size() > 0)?time[3].front():sEmpty;
		monday+=" , \"twelve\" : \""+tmp+"\"";
		tmp = (time[4].size() > 0)?time[4].front():sEmpty;
		monday+=" , \"one\" : \""+tmp+"\"";
		tmp = (time[5].size() > 0)?time[5].front():sEmpty;
		monday+=" , \"two\" : \""+tmp+"\"";
		tmp = (time[6].size() > 0)?time[6].front():sEmpty;
		monday+=" , \"three\" : \""+tmp+"\"";
		tmp = (time[7].size() > 0)?time[7].front():sEmpty;
		monday+=" , \"four\" : \""+tmp+"\"";		
		monday+=" } ";
		for(int ii=0;ii<8;ii++) {
			if(time[ii].size()>0) {
				time[ii].pop_front();
			}
		}
	}
	monday+="]";
	return monday;	
}
int main1() {

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
		system("pause");
		return 0;
	}
	Teachers::fetchSubjectsFromDB();
	Batches::fetchSubjectsFromDB();	
	Batches::groupBatchesForLectures();
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

	generateTable(slotList);

	system("pause");
	return 1;
}

int __cdecl main(void) {
//#pragma region
	WSADATA wsaData;
    int iResult;

    SOCKET ListenSocket = INVALID_SOCKET;
    SOCKET ClientSocket = INVALID_SOCKET;

    struct addrinfo *result = NULL;
    struct addrinfo hints;

    int iSendResult;
    char recvbuf[DEFAULT_BUFLEN];
    int recvbuflen = DEFAULT_BUFLEN;
    
    // Initialize Winsock
    iResult = WSAStartup(MAKEWORD(2,2), &wsaData);
    if (iResult != 0) {
        printf("WSAStartup failed with error: %d\n", iResult);
        return 1;
    }

    ZeroMemory(&hints, sizeof(hints));
    hints.ai_family = AF_INET;
    hints.ai_socktype = SOCK_STREAM;
    hints.ai_protocol = IPPROTO_TCP;
    hints.ai_flags = AI_PASSIVE;

    // Resolve the server address and port
    iResult = getaddrinfo(NULL, DEFAULT_PORT, &hints, &result);
    if ( iResult != 0 ) {
        printf("getaddrinfo failed with error: %d\n", iResult);
        WSACleanup();
        return 1;
    }

    // Create a SOCKET for connecting to server
    ListenSocket = socket(result->ai_family, result->ai_socktype, result->ai_protocol);
    if (ListenSocket == INVALID_SOCKET) {
        printf("socket failed with error: %ld\n", WSAGetLastError());
        freeaddrinfo(result);
        WSACleanup();
        return 1;
    }

    // Setup the TCP listening socket
    iResult = bind( ListenSocket, result->ai_addr, (int)result->ai_addrlen);
    if (iResult == SOCKET_ERROR) {
        printf("bind failed with error: %d\n", WSAGetLastError());
        freeaddrinfo(result);
        closesocket(ListenSocket);
        WSACleanup();
        return 1;
    }

    freeaddrinfo(result);

    iResult = listen(ListenSocket, SOMAXCONN);
    if (iResult == SOCKET_ERROR) {
        printf("listen failed with error: %d\n", WSAGetLastError());
        closesocket(ListenSocket);
        WSACleanup();
        return 1;
    }

    // Accept a client socket
    ClientSocket = accept(ListenSocket, NULL, NULL);
    if (ClientSocket == INVALID_SOCKET) {
        printf("accept failed with error: %d\n", WSAGetLastError());
        closesocket(ListenSocket);
        WSACleanup();
        return 1;
    }

    // No longer need server socket
    closesocket(ListenSocket);
//#pragma endregion
    // Receive until the peer shuts down the connection
    do {

        iResult = recv(ClientSocket, recvbuf, recvbuflen, 0);
        if (iResult > 0) {
            printf("Bytes received: %d\n", iResult);
			printf(" data: %s",recvbuf);

			// form a response	
			string respJSON="{ \"status\": ";			
			
			int status = timeTableFunctions();			
			
			if(status == 0) {
				respJSON+= "\"ok\", \"error string\": \"no error\",";
				respJSON+= convertToJSON();
			}
			else {
				respJSON+= "\"error\", \"error string\": ";
				if(status == 101) {
					respJSON+="\"some tables are empty, cannot generate time table\"";
				}
				if(status == 102) {
					respJSON+="\"some subjects were left unallocated\"";
				}
			}
			respJSON+="}";
			
					
			string resp = "HTTP/1.1 200 OK\r\nContent-type: text/html\r\n";
			resp+="Access-Control-Allow-Origin: *\r\nContent-Length: "+to_string(respJSON.length())+"\r\n\r\n";
			resp+=respJSON;
			
			iSendResult = send( ClientSocket, resp.c_str(),resp.length(), 0 );
            if (iSendResult == SOCKET_ERROR) {
                printf("send failed with error: %d\n", WSAGetLastError());
                //closesocket(ClientSocket);
                //WSACleanup();
                //return 1;
            }
            printf("Bytes sent: %d\n", iSendResult);
        }
        else if (iResult == 0)
            printf("Connection closing...\n");
        else  {
            printf("recv failed with error: %d\n", WSAGetLastError());
            closesocket(ClientSocket);
            WSACleanup();
            return 1;
        }

    } while (iResult > 0);

    // shutdown the connection since we're done
    iResult = shutdown(ClientSocket, SD_SEND);
    if (iResult == SOCKET_ERROR) {
        printf("shutdown failed with error: %d\n", WSAGetLastError());
        closesocket(ClientSocket);
        WSACleanup();
        return 1;
    }

    // cleanup
    closesocket(ClientSocket);
    WSACleanup();

    return 0;
}

void main11() {
	int a =timeTableFunctions();
	convertToJSON();
}