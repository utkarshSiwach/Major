#undef UNICODE
#define WIN32_LEAN_AND_MEAN
#include <windows.h>
#include <winsock2.h>
#include <ws2tcpip.h>
// Need to link with Ws2_32.lib
#pragma comment (lib, "Ws2_32.lib")
// #pragma comment (lib, "Mswsock.lib")
#define DEFAULT_BUFLEN 512
#define DEFAULT_PORT "27015"

#include<iostream>
#include<stdlib.h>
#include<stdio.h>
#include<time.h>
#include<string>
#include<vector>
#include<unordered_map>
#include<unordered_set>
#include "MySqlCon.h"

using namespace std;
class Teachers;
class Subjects;
class Batches;
class Students;
class Slots;


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
	string code;
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
	// Used by Teachers::assignSubjects(), initialized by Subjects::initializeMap()
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
	// maximum number of backlogs allowed to attend a batch's particular subject class, 
	// these are extra students(seniors)
	static int maxBackAtt;

	// uo_map(subject -> no. of backlogs): number of backlog students (seniors)
	// currently associated with this batch's particular subject. init in Batches::fetchSubjectsFromDB()
	unordered_map<Subjects*,int> currBackAtt;

	// currently only those students that have backlogs, but the vector 
	// can hold 'back free' students also
	vector<Students *> studentArr;
	// all distinct backlog batches(in one place) assigned to all
	// the backs of each student in this batch
	unordered_set<Batches *> backBatches;
	vector<Subjects *> subjectArr;
	void display();
	static int fetchRecordsFromDB();
	static int fetchSubjectsFromDB();
	static int groupBatchesForLectures();
	static Batches* findBatch(int);
	static int assignBacklogBatches();
	static Batches* bestFitBatchForBacklog(string,int,unordered_map<Subjects*,int>);
};
int Batches::maxBackAtt = 10;


// this class just contains a pairing of a backlog subject with
// the backlog batch that will be assigned for it.
class Backlogs {
public:
	// which subject the backlog is for
	Subjects* subject;

	// which batch the student will be attending the backlog in
	Batches* batch;
};


// this class currently holds only those students that have
// backlogs, though normal students can fit just as well
class Students {
public:
	int id;
	string name;
	int batchId;
	int semester;
	vector<Backlogs> backs;	// have to assign a batch to each backlog
	void display();
	static Students * findStudent(int);
	static int fetchRecordsFromDB();
	static int fetchBacklogsFromDB();
};


class Rooms {
public:
	
	static int TUT_SIZE; // number of tut rooms
	static int CLASS_SIZE1; //number of rooms for < 4 batches
	static int CLASS_SIZE2; //number of rooms for >=4 batches
	static int LAB_SIZE;  // number of labs
	
	int id;
	string name;
	string branch;
	int capacity;
	int index;	// to find which column of ttArr is which room
	string type;
	
	void display();
	static int fetchRecordsFromDB();
	static int ttArrayIndexTORoomName(int,int,int,int);
	static string nameFromIndex(int);
	static Rooms* getRoomFromIndex(int);
};
int Rooms::TUT_SIZE=0;
int Rooms::CLASS_SIZE1=0;
int Rooms::CLASS_SIZE2=0;
int Rooms::LAB_SIZE=0;
// will be updated in Rooms::fetchRecordsFromDB()
// Rooms::TUT_SIZE + Rooms::CLASS_SIZE1 + Rooms::CLASS_SIZE2 + Rooms::LAB_SIZE;
int ROOM_SIZE;


class Slots {
public:
	struct softConstScore {
		int pos;
		int score;
	};
	int id;
	Batches * batch;
	Teachers * teacher;
	Subjects * subject;
	vector<softConstScore> sConst;
	string _conflict;
	string _noConflict;
	string isProcessed;
};


std::vector<Batches*> batchVector;
std::vector<Teachers*> teacherVector;
std::vector<Subjects*> subjectVector;
std::vector<Students*> studentVector;
std::vector<Rooms*> roomVector;
std::list<Slots*> slotList; // it is populated by Teachers::assignBatches()

int Teachers::fetchRecordsFromDB() {
	MySqlDatabase oDB;
	if(!oDB.createConn()) {
		return 0; // some exception occoured
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
// finds and returns a Teachers * from teacherVector
// whose id matches with the argument given
// if no match is found returns NULL
Teachers* Teachers::findTeacher(int id) {
	int size = teacherVector.size();
	for(int i=0;i<size;i++) {
		if(id==teacherVector[i]->id) {
			return teacherVector[i];
		}
	}
	return NULL; // not found
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
	int isIncomplete = 0;
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
			else {	// there are preferred subjects left for this teacher
				tempSub=teacher->preferredSubjects[i];
				if(Subjects::subjectsAllocated[tempSub->id]!=0 && 
					(teacher->hrsCurrentlyTeaching+tempSub->hours) <= Teachers::maxTeachingHours) {
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
			int x=teacherVector.size();
			Subjects *tempSub= Subjects::findSubject(it->first);
			Teachers * tempT;			
			int loop = 0;

			while(i>0 && loop<x) {	// i instances of this subjects remain, to be allocated		
			
				tempT=teacherVector[j];
				if(tempT->dept == tempSub->branch && (tempT->hrsCurrentlyTeaching+tempSub->hours) <= Teachers::maxTeachingHours) {
					i--;
					it->second--;
					tempT->hrsCurrentlyTeaching+=tempSub->hours;
					tempT->allocatedSubjects.push_back(tempSub);
					loop=0;
				}
				else {
					loop++;
				}
				j++;	// select next teacher in circular array fashion
				if(j==teacherVector.size() ) {j=0;}
				
			}
			if(i>0) {
				isIncomplete=1;
				// no more teachers available to teach that subject
				// raise exception!!
				// either make one teacher teach more or club few batches together
				// return 1;	// function failed
			}
		}
	}
	
	return isIncomplete;	// all allocation done
}
// for every subject a batch is taking, find a teacher taking it
// and assign him/her to that batch.
// Also add this combination of (teacher-batch-subject) to slotList 'x' times
// where x = classesPerWeek of that subject
// Can be optimized further, also there can be multiple bindings of teacher-batch
int Teachers::assignBatches() {
	bool done=false;
	Slots * slot;
	
	int **alreadyMatched = new int*[teacherVector.size()];
	for(int i=0;i<teacherVector.size();i++) {
		alreadyMatched[i] = new int[Teachers::maxTeachingHours+1];
		for(int j=0;j<Teachers::maxTeachingHours+1;j++) {
			alreadyMatched[i][j]=0;
		}
	}

	for(Batches * batch : batchVector) {
		for(Subjects * subject : batch->subjectArr) {
			done=false;
			int tNum=-1;
			for(Teachers * teacher : teacherVector) {
				tNum++;
				if(teacher->dept != subject->branch) { continue; }
				int subNum=-1;
				for(Subjects *tempSub : teacher->allocatedSubjects) {
					subNum++;
					if(tempSub==subject && alreadyMatched[tNum][subNum]!=1) {
						teacher->allocatedBatches.push_back(batch);
						int slotNos=1;	// number of slots to make, =1 works for tut
						if(tempSub->type=="lecture") {
							slotNos=tempSub->hours;
						}
						else if(tempSub->type=="lab") {
							slotNos=tempSub->hours/2;
							slotNos+=tempSub->hours%2;
						}
						for(int i=0;i<slotNos;i++) {
							slot = new Slots();
							slot->id = slotList.size() + 1;
							slot->batch = batch;
							slot->subject = tempSub;
							slot->teacher = teacher;
							slotList.push_back(slot);
						}
						alreadyMatched[tNum][subNum]=1;
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
// finds and returns a Subjects* from subjectVector
// whose id matches with the argument given
// if no match is found returns NULL
Subjects* Subjects::findSubject(int id) {
	int size = subjectVector.size();
	for(int i=0;i<size;i++) {
		if(id==subjectVector[i]->id) {
			return subjectVector[i];
		}
	}
	return NULL; // not found
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
		subject->numOfBatchesTakingIt++; // validate this
		batch->subjectArr.push_back(subject);
		batch->currBackAtt[subject]=0;
	}
	delete rs;
	return 1;
}
// groups the individual batches into combined ones
// static grouping is being performed with no optimization yet,
// just make groups of 3 batches that have exactly same subjects.
// creates a new Batch object with id vector having ids of all constituent batches.
// Lecture subjects from individual batches are removed from that batch's subject list
// vector and added to the combined batch's subjectList vector.
// backlog students are moved to grouped batches according to their back subjects.
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
	Batches *b1,*b2,*b3; //b1,b2,b3 for correcting backlog entries
	for(auto it = sameSubs.begin(); it!=sameSubs.end(); it++) {
		//cout<<"\naa:"<<aa;
		//aa++;
		list<Batches*> tempL = it->second;
		for(int i=0;tempL.size()>=3;i++) {
			
			Batches* curBatch = tempL.front();
			b1=curBatch;
			tempL.pop_front();
			Batches * newBatch = new Batches();			
			newBatch->id.push_back(curBatch->id[0]);
			newBatch->name = curBatch->name;
			// copy the backlog students to the new batch, as some students in individual batches
			// have some backlogs
			for(Students* student : curBatch->studentArr) {
				newBatch->studentArr.push_back(student);
			}
			//int bb=1;
			for(auto it1 = curBatch->subjectArr.begin();it1!=curBatch->subjectArr.end();it1++) {  // remove lecture from indi. batch
				//cout<<" "<<bb;
				//bb++;				
				//cout<<(*it1)->name;
				if((*it1)->type == "lecture") {
					//erase lecture entry from curBatch
					curBatch->currBackAtt.erase(*it1);
					curBatch->subjectArr.erase(it1);
					it1--;
					if(it1 == curBatch->subjectArr.end()) {
						break;
					}
				}
			}

			curBatch = tempL.front();
			b2=curBatch;
			tempL.pop_front();
			newBatch->id.push_back(curBatch->id[0]);
			newBatch->name += curBatch->name;
			for(auto it1 = curBatch->subjectArr.begin();it1!=curBatch->subjectArr.end();it1++) {  // remove lecture from indi. batch
				//cout<<(*it1)->name;
				if((*it1)->type == "lecture") {
					curBatch->currBackAtt.erase(*it1);
					curBatch->subjectArr.erase(it1);
					it1--;
					if(it1 == curBatch->subjectArr.end()) {
						break;
					}
				}
			}
			// copy the backlog students to the new batch, as some students in individual batches
			// have some backlogs
			for(Students* student : curBatch->studentArr) {
				newBatch->studentArr.push_back(student);
			}
			
			curBatch = tempL.front();
			b3=curBatch;
			tempL.pop_front();
			newBatch->id.push_back(curBatch->id[0]);
			newBatch->name += curBatch->name;			
			newBatch->sem = curBatch->sem;
			newBatch->type = curBatch->type;
			// copy the backlog students to the new batch, as some students in individual batches
			// have some backlogs
			for(Students* student : curBatch->studentArr) {
				newBatch->studentArr.push_back(student);
			}
			for(auto it1 = curBatch->subjectArr.begin();it1!=curBatch->subjectArr.end();it1++) {  // populate subjectArr
				//cout<<(*it1)->name;
				if((*it1)->type == "lecture") {
					//to be done only once {
					newBatch->subjectArr.push_back(*it1);
					newBatch->currBackAtt[*it1]=0;
					(*it1)->numOfBatchesTakingIt-=2;					
					if(Subjects::subjectsAllocated.find((*it1)->id)!=Subjects::subjectsAllocated.end()) {
						Subjects::subjectsAllocated[(*it1)->id]-=2;
					}
					// }
					curBatch->currBackAtt.erase(*it1);
					curBatch->subjectArr.erase(it1);
					it1--;
					if(it1 == curBatch->subjectArr.end()) {
						break;
					}
				}
			}
			batchVector.push_back(newBatch);
			Backlogs back;
			bool updateBackBatches = FALSE;
			Batches *studCurBatch;
			// now transfer backlog (seniors) of lecture types to new batch
			for(Students* stud : studentVector) {
				updateBackBatches = FALSE;
				studCurBatch = findBatch(stud->batchId);
				for(int i=0;i<stud->backs.size();i++) {
					back=stud->backs[i];
					if(back.subject->type=="lecture" && (back.batch==b1 || back.batch==b2 || back.batch==b3)) {						
						newBatch->currBackAtt[back.subject]++;
						stud->backs[i].batch=newBatch;
						studCurBatch->backBatches.erase(back.batch);
						updateBackBatches = TRUE;
					}
				}
				if(updateBackBatches) {
					studCurBatch->backBatches.insert(newBatch);
				}
			}
			for(Students* stud : studentVector) {
				studCurBatch = findBatch(stud->batchId);
				for(int i=0;i<stud->backs.size();i++) {
					back=stud->backs[i];
					if(back.subject->type=="tut" && (back.batch==b1 || back.batch==b2 || back.batch==b3)) {												
						studCurBatch->backBatches.insert(back.batch);
					}
				}
			}
		}

	}
	return 0;
}
// finds and returns a Batches* from batchVector
// whose id matches with the argument given
// if no match is found returns NULL
Batches* Batches::findBatch(int id) {
	int size = batchVector.size();
	for(int i=0;i<size;i++) {
		if(id==batchVector[i]->id[0]) {
			return batchVector[i];
		}
	}
	return NULL; // not found
}

int semToInt(string sem) {
	string arr[] = {"first","second","third","fourth","fifth","sixth","seventh","eighth"};
	for(int i=0;i<8;i++) {
		if(sem==arr[i]) {
			return i;
		}
	}
	return -1;
}
int findSemForSub(Subjects* sub, string branch) {
	for(Batches* batch : batchVector) {
		if(batch->type == branch) {
			for(Subjects* s :batch->subjectArr) {
				if(s==sub) {
					return semToInt(batch->sem);
				}
			}
		}
	}
	return -1;
}
int Batches::assignBacklogBatches() {		
	for(Batches* batch :batchVector) {		
		unordered_map<Subjects*,int>subCnt[8];
		for(Students* student : batch->studentArr) {
			for(Backlogs back: student->backs) {
				subCnt[findSemForSub(back.subject,batch->type)][back.subject]+=1;
			}
		}

		Batches* bestBatch=NULL;
		for(int i=0;i<8;i++) { // for each semester
			bestBatch = bestFitBatchForBacklog(batch->type,i,subCnt[i]); //find best batch then update its currBackAtt
			if(bestBatch!=NULL) {
				batch->backBatches.insert(bestBatch);				
				auto itEnd = subCnt[i].end();
				for(Subjects* tempSub : bestBatch->subjectArr) {
					if(subCnt[i].find(tempSub)!=itEnd) {
						bestBatch->currBackAtt[tempSub]+=subCnt[i][tempSub];

						// for every backlog in this batch, assign the appropriate bestBatch
						// which was found just now, when this is repeated for every semester
						// every backlog in the batch gets a bestBatch if it was ever found.
						for(Students* student : batch->studentArr) {
							for(int j=0;j<student->backs.size();j++) {								
								if(findSemForSub(student->backs[j].subject,batch->type)==i) {
									student->backs[j].batch=bestBatch;
								}
							}
						}

					}
				}
			}
			else { // find any batch that can hold it

			}
		}
	}
}

Batches* Batches::bestFitBatchForBacklog(string branch,int sem, unordered_map<Subjects*,int>assoc) {
	int max=0;
	Batches* bestBatch=NULL;
	for(Batches* batch : batchVector) {
		if(batch->type == branch && semToInt(batch->sem)==sem) {
			int sum=0;
			int flag=0;
			auto assocEnd = assoc.end();
			for(Subjects* sub: batch->subjectArr) {
				if(assoc.find(sub)!= assocEnd) { // subject is there in assoc also
					int avail = maxBackAtt - batch->currBackAtt[sub]; // batch-subject slot is available/free
					int temp = avail-assoc[sub];
					if(temp< 0) {
						flag=1;
						break;
					}
					sum+=temp;
				}
			}
			if(flag==0) {
				if(sum>max) {
					max=sum;
					bestBatch=batch;
				}
			}
		}
	}
	//cout<<" bestBatch:";bestBatch->display();
	return bestBatch;
}

/////////////

// fetches student id, name, batchId, semester and add them to studentVector
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
		temp->semester = rs->getInt(4);
		studentVector.push_back(temp);
		if(batch->id[0] != temp->batchId) {
			batch=Batches::findBatch(temp->batchId);
		}
		batch->studentArr.push_back(temp);
	}
	delete rs;
	return 1;
}
Students * Students::findStudent(int id) {	
	for(Students *temp:studentVector) {
		if(temp->id==id) {
			return temp;
		}
	}
	return NULL;	
}
int Students::fetchBacklogsFromDB() {
	MySqlDatabase oDB;
	if(!oDB.createConn()) {
		return 0;
	}
	ResultSet *rs = oDB.execute("select * from studentbacklogs");
	int n = rs->rowsCount();
	if(n==0) {
		return 1;
	}

	Students *temp;
	Subjects *tempSub;

	while(rs->next()) {
		temp = findStudent(rs->getInt(1));
		tempSub = Subjects::findSubject(rs->getInt(2));
		Backlogs back;
		back.subject = tempSub;
		back.batch = NULL;
		temp->backs.push_back(back);
	}
}

//////////////  rooms /////////

// labs can have capacity only as one
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
	TUT_SIZE=0;
	CLASS_SIZE1=0;
	CLASS_SIZE2=0;
	LAB_SIZE=0;
	Rooms * room;
	while(rs->next()) {
		room = new Rooms();
		room->id = rs->getInt(1);
		room->name = rs->getString(2);
		room->capacity = rs->getInt(3);
		room->type = rs->getString(4);
		room->branch = rs->getString(6);
		roomVector.push_back(room);

		if(room->type == "lecture") {
			if(room->capacity < 4)
				CLASS_SIZE1++;
			else
				CLASS_SIZE2++;
		}
		else if(room->type == "tut") {
			TUT_SIZE++;
		}
		else { // lab
			LAB_SIZE++;
		}
	}
	ROOM_SIZE = TUT_SIZE + CLASS_SIZE1 + CLASS_SIZE2 + LAB_SIZE;
	delete rs;
	return 1;
}
// create mapping of column number of time table array
// to room object record.
// a is start of tut rooms, b small rooms, c large rooms, d labs
int Rooms::ttArrayIndexTORoomName(int a,int b,int c, int d) {
	int tempA=a;	// start of tut pos
	int tempB=b;	// start of small rooms pos.
	int tempC=c;	// start of large rooms pos.
	int tempD=d;	// start of labs pos.
	for(Rooms *room : roomVector) {
		if(room->type == "tut") {
			room->index = tempA;
			tempA++;
		}
		else if (room->type == "lecture") {
			if(room->capacity<4) {
				room->index = tempB;
				tempB++;
			}
			else {
				room->index = tempC;
				tempC++;
			}
		}
		else { // lab
			room->index = tempD;
			tempD++;			
		}
	}
}
string Rooms::nameFromIndex(int j) {
	for(Rooms * room :roomVector) {
		if(room->index==j) {
			return room->name;
		}
	}
	return "not found";
}
Rooms* Rooms::getRoomFromIndex(int j) {
	for(Rooms * room :roomVector) {
		if(room->index==j) {
			return room;
		}
	}
	return NULL;

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

// pick tt from here

const int PERIODS = 44;
int **table = NULL;
list<Slots*> placedList;
Slots ***ttArr = NULL; // 2d array of Slots*
////////////// old TT algo /////////

const int BATCH_SIZE = 100;
const int TEACH_SIZE = 100;
//count number of iterations
int TT_COUNT = 0;
int MAX_ITER = 0;	// will be set when input recv. in server request
int MAX_UNPLACED = 0;	// will be set when input recv. in server request
int fitnessFunc ();

//display final timetable
void result() {
	std::cout<<"\nproducing results after completing "<<TT_COUNT<<" iterations\n";
	for (int i =0 ; i < PERIODS ;i++) {
		for (int j =0 ; j< ROOM_SIZE; j++) {
			std::cout<<table[i][j]<<" ";
		}
		std::cout<<"\n";
	}
	
	/*std::cout<<"\nUnplaced slot List...\n";
	list<Slots*>::iterator it = slotList.begin();
	while (it!=slotList.end()) {
		std::cout<<(*it)->id<<"  ";
		++it;
	}*/
	std::cout<<"\n";
}

void iterateTT_part(int i) {
	list<Slots*>::iterator it;
			it = slotList.begin();
			
			int a = Rooms::TUT_SIZE;	// class1 pos
			int b = Rooms::TUT_SIZE + Rooms::CLASS_SIZE1; // class2 pos
			int c = 0;	// tut pos
			int d = Rooms::TUT_SIZE + Rooms::CLASS_SIZE1 + Rooms::CLASS_SIZE2; // lab pos

			while (c < Rooms::TUT_SIZE && table[i][c] != 0) c++;
			while (a < (Rooms::TUT_SIZE + Rooms::CLASS_SIZE1) && table[i][a] != 0) a++;
			while (b < (Rooms::TUT_SIZE + Rooms::CLASS_SIZE1 + Rooms::CLASS_SIZE2) && table[i][b] != 0) b++;
			while (d < (ROOM_SIZE) && table[i][d]!= 0) d++; 

			//std::cout<<a<<"\t"<<b<<"\t"<<c<<"\t"<<d;

			while (!slotList.empty() && it != slotList.end()) {

				if ((*it)->subject->type == "lecture") { /*subject-type = 'lecture'*/
					//std::cout<<"Lecture..\n";
					if ( (*it)->batch->id.size() < 3 ) { /*ls-size == 3*/
						if ((a < (Rooms::TUT_SIZE + Rooms::CLASS_SIZE1) ) && (table[i][a] == 0) ) {

							table[i][a] = (*it)->id;
							a++;
							//remove slot from unplaced list
							placedList.push_back((*it));
							list<Slots*>::iterator node;
							node = it;
							++it;
							//std::cout<<"assigned lecct";
							slotList.remove((*node));
							//++it;
						}
						else {
							while (a < (Rooms::TUT_SIZE + Rooms::CLASS_SIZE1) && table[i][a] != 0) a++;
							//don't assign, move to next vector	
							++it;
						}
					}
					else {
						if ((b < Rooms::TUT_SIZE + Rooms::CLASS_SIZE1 + Rooms::CLASS_SIZE2 ) && (table[i][b] == 0) ) {

							table[i][b] = (*it) -> id;
							b++;
							//remove slot from unplaced list
							placedList.push_back((*it));
							list<Slots*>::iterator node;
							node = it;
							++it;
							//std::cout<<"Lecture placed.\n";
							//std::cout<<"assigned lect";
							slotList.remove((*node));
							//++it;
						}
						else {
							//don't assign, move on to next vector entry
							while (b < (Rooms::TUT_SIZE + Rooms::CLASS_SIZE1 + Rooms::CLASS_SIZE2) && table[i][b] != 0) b++;
							++it;
						}
					}
				}
				else if ((*it) -> subject -> type == "tut") { /*subject-type = 'tut'''*/
					//std::cout<<"Tut..\n";
					if ((c < Rooms::TUT_SIZE ) && (table[i][c] == 0)) {

						table[i][c] = (*it) -> id;
						c++;
						//remove from unplaced subj list
						placedList.push_back((*it));
						list<Slots*>::iterator node;
						node = it;
						++it;
						//std::cout<<"Tut placed\n";
						//std::cout<<"assigned tut";
						slotList.remove((*node));
						//++it;
					}
					else {
						//don't assign, move on to next vector entry
						while (c < Rooms::TUT_SIZE && table[i][c] != 0) c++;
						++it;

					}
				}
				else {
					//std::cout<<"Lab.\n";

					if ((i < PERIODS - 1)  && (d < (ROOM_SIZE - 1 )) && (table[i][d] == 0) && (table[i + 1][d] == 0) ) {
						/*lab blocked for 2 hours*/
						table[i][d] = (*it) -> id ;
						table[i + 1][d] =  (*it) -> id;

						d++;
						//remove from unplaced list
						placedList.push_back((*it));
						list<Slots*>::iterator node;
						node = it;
						++it;
						//std::cout<<"Lab placed..\n";
						//std::cout<<"assigned lab";
						slotList.remove((*node));
						//++it;
					}
					else {
						//don't assign, move on to next vector entry
						while (d < (ROOM_SIZE) && table[i][d]!= 0) d++; 
						++it;

					}

					//++it;
				}
			}
			it = slotList.begin();
			//go to next time slot
			//++i;
}
void iterateTT(int unplacedNos) {
	int aa = unplacedNos;
	while (aa>5 && TT_COUNT < MAX_ITER) {
		srand ( time(NULL) );
		int number = rand() % PERIODS + 1;
		int i = number; //starting point of i 
		while (i < PERIODS) {
			// create timetable for i to Periods
			iterateTT_part(i);
			i++;
		}
		i = 0;
		while (i < number) {
			iterateTT_part(i);
			i++;
		}
		TT_COUNT++;
		aa = fitnessFunc();
		cout<<" a "<<aa;
		//result();
	}
}

// removes conflicting slots from placedList and puts them back on soltList
// returns the number of slots in slotList
int fitnessFunc () {
	int  batch[BATCH_SIZE] = {0}, teacher[TEACH_SIZE] = {0};
	int  bid, tid, i = 0;
	int  d = ROOM_SIZE; // a : class1 pos, b : class2 pos, c : tut pos, d: lab pos
	int pos ;
	int flag = 0;
	list<Slots*>::iterator it;

	while (i< PERIODS && !placedList.empty()) {		
		for(int c = 0;c<PERIODS;c++) {
		
			//read id of teach+batch+room
			int isFree = 1;
			int g;
			for(g=c;g<ROOM_SIZE;g++) {
				pos = table[i][g];
				if(pos!=0) {
					isFree = 0;
					break;
				}
			}
			c=g;
			
			if (isFree == 0) {				
				int flaga=0;
				for(it = placedList.begin();it!= placedList.end();it++) {
					if((*it)->id==pos) {
						flaga=1;
						break;
					}
				}
				if(flaga==0) {
					cout<<" error in finding ";
					break;
				}
				tid = (*it)->teacher->id;
				int count = 0; //for how many batches are free in that slot
				int check_class = 0;
				int bSize = (*it)->batch->id.size();
				for(int bi=0;bi<bSize;bi++) { //for every individual batch id 
					bid = (*it)->batch->id[bi];
					if (batch[bid] == 0 && teacher[tid] == 0) { //teacher and batch are available
						if ((*it)->subject->type == "lab") {
							batch[bid] = 2;
							teacher[tid] = 2;
							break;
						}
						else if ((*it)->subject->type == "tut") {
							batch[bid] = 1;
							teacher[tid] = 1;
							break;
						}
						else { // lecture
							count++;
							check_class = 1;
						}
					}

					else { //remove entry from that time slot						
						table[i][c] = 0;
						if ((*it)->subject->type == "lab"){
							if (i< (PERIODS - 1) && c<d && pos == table[i+1][c])
								table[i+1][c] = 0;
							else if (i<PERIODS && c<d && pos == table[i-1][c])
								table[i-1][c] = 0;
						}
						list<Slots*>::iterator node;
						node = it;
						slotList.push_back((*it));
						//++it;
						placedList.remove((*node));
						break;
					}
				}

				if (check_class == 1 && count == bSize) {
					//place class for all batches and the teacher
					teacher[tid] = 1;
					for(int bi=0;bi<(*it)->batch->id.size();bi++) { //for every individual batch id 
						bid = (*it)->batch->id[bi];
						batch[bid] = 1;
					}
					count = 0;
					check_class = 0;
				}
			}		
		}

		//reset all arrays  - if 0, let it remain 0, if 1 or 2, decrement count 
		for (int k = 0; k < BATCH_SIZE; k++) {
			if (batch[k] == 0) ; //do nothing
			else batch[k] = batch[k] - 1;
		}
		for (int k = 0; k < TEACH_SIZE; k++) {
			if (teacher[k] == 0) ; //do nothing
			else teacher[k] = teacher[k] - 1;
		}
		++i;
		//increase vector value to next time slot
	} // while ends, next time slot
	return slotList.size();
}

void generateTable () {

	//int table[PERIODS][ROOM_SIZE] = {0}; //  row i : mon (9-5)-sat (9 -1)  , column j : (0-9 tut) (10 - 29 class1) (30 - 49 class2) ( PERIODS - 59 labs)
	table = new int * [PERIODS];
	for (int i = 0 ; i< PERIODS; i++) {
		table[i] = new int [ROOM_SIZE];
		for (int j= 0; j < ROOM_SIZE; j++) {
			table[i][j] = 0;
		}
	}
	int i = 0; 
	int a = Rooms::TUT_SIZE;	// class1 pos
	int b = Rooms::TUT_SIZE + Rooms::CLASS_SIZE1; // class2 pos
	int c = 0;	// tut pos
	int d = Rooms::TUT_SIZE + Rooms::CLASS_SIZE1 + Rooms::CLASS_SIZE2; // lab pos
	Rooms::ttArrayIndexTORoomName(c,a,b,d);
	//list<Slots*> placedList; // move elements here once inserted into tt

	list<Slots*>::iterator it;
	it = slotList.begin();
	std::cout<<"Generating Timetable....\n";
	/*generate tt*/
	int flag = 0;

	do {	// while (slotList.size() > 0 && i < PERIODS  );

		//std::cout<<"at list head\n";
		a = Rooms::TUT_SIZE;	// class1 pos
		b = Rooms::TUT_SIZE + Rooms::CLASS_SIZE1; // class2 pos
		c = 0;	// tut pos
		d = Rooms::TUT_SIZE + Rooms::CLASS_SIZE1 + Rooms::CLASS_SIZE2; // lab pos

		do {	// while (it != slotList.end());

			if ((*it)->subject->type == "lecture") { /*subject-type = 'lecture'*/
				//std::cout<<"Lecture..\n";
				if ( (*it)->batch->id.size() < 3 ) { /*ls-size == 3*/
					if ((table[i][a] == 0) && (a < b )) {

						table[i][a] = (*it)->id;
						a++;
						//remove slot from unplaced list
						placedList.push_back((*it));
						list<Slots*>::iterator node;
						node = it;
						++it;
						//std::cout<<"Lecture placed.\n";
						slotList.remove((*node));
						//it--;
					}
					else {
						//don't assign, move to next vector	
						++it;
					}
				}
				else {
					if ((table[i][b] == 0) && (b < d )) {

						table[i][b] = (*it) -> id;
						b++;
						//remove slot from unplaced list
						placedList.push_back((*it));
						list<Slots*>::iterator node;
						node = it;
						++it;
						//std::cout<<"Lecture placed.\n";
						slotList.remove((*node));
						//it--;
					}
					else {
						//don't assign, move on to next vector entry
						++it;
					}
				}
			}
			else if ((*it) -> subject -> type == "tut") { /*subject-type = 'tut'''*/
				//std::cout<<"Tut..\n";
				if ((table[i][c] == 0) && (c < Rooms::TUT_SIZE  )) {

					table[i][c] = (*it) -> id;
					c++;
					//remove from unplaced subj list
					placedList.push_back((*it));
					list<Slots*>::iterator node;
					node = it;
					++it;
					//std::cout<<"Tut placed\n";
					slotList.remove((*node));
					//it--;
				}
				else {
					//don't assign, move on to next vector entry
					++it;

				}
			}
			else {
				//std::cout<<"Lab.\n";
				if ((table[i][d] == 0) && (table[i + 1][d] == 0)  && (d < ROOM_SIZE - 1 )) {

					/*lab blocked for 2 hours*/
					table[i][d] = (*it) -> id ;
					table[i + 1][d] =  (*it) -> id;

					d++;
					//remove from unplaced list
					placedList.push_back((*it));
					list<Slots*>::iterator node;
					node = it;
					++it;
					//std::cout<<"Lab placed..\n";
					slotList.remove((*node));
					//it--;
				}
				else {
					//don't assign, move on to next vector entry
					++it;

				}
			}

		} while (it != slotList.end()); /*list of entities isn't traversed'*/

		//std::cout <<"Done iterating for this slot\n";

		it = slotList.begin();
		i++;
	} while (slotList.size() > 0 && i < PERIODS  );

	//std::cout << "Done iterating the timetable";
	
	TT_COUNT++;

	int unplacedNos = fitnessFunc();
	iterateTT(unplacedNos);
}
////////////////// old TT algo ends //////////////

bool isSemLess(Slots* a, Slots *b) {
	return semToInt(a->batch->sem) < semToInt(b->batch->sem);
}

int shuffleList(int seed) {
	if(slotList.size()<2)
		return 0;

	srand(seed);

	slotList.sort(isSemLess);
	struct col {
		list<Slots*>::iterator semStart;
		list<Slots*>::iterator semEnd;
		int sSize;
	};
	col cols[8];
	for(int i=0;i<8;i++) {
		cols[i].sSize=0;
	}

	string arr[] = {"first","second","third","fourth","fifth","sixth","seventh","eighth"};
	int semI = semToInt((*slotList.begin())->batch->sem);
	
	cols[semI].sSize = 0;
	cols[semI].semStart = slotList.begin();
	cols[semI].semEnd = cols[semI].semStart;

	for(auto it = slotList.begin();it!=slotList.end();it++) {
		if((*it)->batch->sem==arr[semI]) {
			cols[semI].semEnd=it;
			cols[semI].sSize++;
		}
		else {
			semI++;
			cols[semI].sSize = 1;
			cols[semI].semStart = it;
			cols[semI].semEnd = it;
		}
	}
	for(int i=0;i<8;i++) {
		if(cols[i].sSize>0) {
			int sSize = cols[i].sSize;
			auto slotI = cols[i].semStart;
			auto slotJ = slotI;
			for(int i=0;i<sSize-1;i++) {
				int a = rand()%(sSize-i); // get a random no. b/w 0,sSize-1
				Slots *temp;
				slotJ=slotI;
				for(int j=0;j<a;j++) {
					slotJ++;
				}		
				temp = *slotJ;
				slotJ=slotList.erase(slotJ);
				slotList.insert(slotJ,*slotI);		
				slotI=slotList.erase(slotI);
				slotList.insert(slotI,temp);
				//slotI++;
			}
		}
	}
}

// returns true if posI is 3,11,19,27 or 35 for odd sem
// and 4,12,20,28 or 36 for even sem
bool isBreakPeriod(int posI,string sem) {
	int s = semToInt(sem);
	if(s%2==0) {
		switch(posI) {
		case 4: return TRUE;
		case 12: return TRUE;
		case 20: return TRUE;
		case 28: return TRUE;
		case 36: return TRUE;
		}
	}
	else {
		switch(posI) {
		case 3: return TRUE;
		case 11: return TRUE;
		case 19: return TRUE;
		case 27: return TRUE;
		case 35: return TRUE;
		}
	}
	return FALSE;
}

// returns TRUE if teacher is free for a break period
// if not lab then if posI at 1200 hrs check for 1300hrs or if
// posI at 1300hrs then check for 1200hrs for a free teacher time
// lab can't be at 1200hrs as there would be no break for teacher
// if lab at 1100hrs check if teacher free for break at 1300hrs
// if lab at 1300hrs then check for 1200hrs
bool teacherFreeForBreak(Teachers* teacher, int posI, bool isLab) {
	
	bool flag = FALSE;
	if(!isLab) {
		if((posI+5)%8==0) { // posI one of 3,11,19..
			posI++;
			flag=TRUE;
		}
		else if((posI+4)%8==0) { // posI one of 4,12,..
			posI--;
			flag=TRUE;
		}
		if(!flag) {
			return TRUE;
		}
		for(int j=0;j<ROOM_SIZE;j++) {
			if(ttArr[posI][j]!=NULL && ttArr[posI][j]->teacher==teacher) {
				return FALSE;
			}
		}
	}
	else { // isLab		
		if((posI+5)%8==0) // posI one of 3,11,..
			return FALSE;
		if((posI+6)%8==0) {
			posI+=2;
			flag=TRUE;
		}
		else if((posI+4)%8==0) {
			posI--;
			flag=TRUE;
		}
		if(!flag) {
			return TRUE;
		}
		for(int j=0;j<ROOM_SIZE;j++) {
			if(ttArr[posI][j]!=NULL && ttArr[posI][j]->teacher==teacher) {
				return FALSE;
			}
		}
	}
	return TRUE;
}


// returns true if a room is  not occupied for a certain time slot and is appropriate
// i.e. (if room type matches, capacity is in range, and if lab then branch matches) for the given slot
// if the slot requires a lab then it also checks the next time slot to see if the room is free
bool isRoomFree(Slots* slot, int posI, int posJ) {
	if(ttArr[posI][posJ]!=NULL) { // this room is taken
		slot->_conflict =slot->_conflict+" "+to_string(posI)+","+to_string(posJ)+"-rNotFree";
		return FALSE;
	}
	// room not yet taken
	// see if room type matches, capacity in range, and if lab then branch matches
	bool rMatches = FALSE;
	string rTypeReq = slot->subject->type; // room type required
	int bSizeReq = slot->batch->id.size(); // batch size required
	string rBranchReq = slot->subject->branch; // room branch required, (for labs only)
	Rooms *room = Rooms::getRoomFromIndex(posJ);
	if(rTypeReq=="tut") {
		if(posJ>=0 && posJ<Rooms::TUT_SIZE && bSizeReq<=room->capacity) {
			// rType matches, capacity in range
			rMatches = TRUE;
		}
		else {
			rMatches = FALSE;
		}
	}
	else if(rTypeReq=="lecture") {
		if(posJ>=Rooms::TUT_SIZE && posJ<(Rooms::TUT_SIZE + Rooms::CLASS_SIZE1 + Rooms::CLASS_SIZE2) 
		 && bSizeReq<=room->capacity) {
			// rType matches, capacity in range
			rMatches = TRUE;
		}
		else {
			rMatches = FALSE;
		}
	}
	else if(rTypeReq=="lab") {
		if(posJ>=(Rooms::TUT_SIZE + Rooms::CLASS_SIZE1 + Rooms::CLASS_SIZE2) && posJ<ROOM_SIZE
		 && rBranchReq == room->branch && posI<(PERIODS-1) && ttArr[posI+1][posJ]==NULL) {
			 rMatches = TRUE;
		}
		else {
			rMatches = FALSE;
		}
	}
	if(!rMatches) { // room not according to requirement
		slot->_conflict=slot->_conflict+" "+to_string(posI)+","+to_string(posJ)+"-rNotMatch";
		return FALSE;
	}
	return TRUE;
}

bool batchMatches(Batches *a, Batches *b) {
	if(a==b) {
		return FALSE;
	}
	for(int i=0;i<a->id.size();i++) {
		for(int j=0;j<b->id.size();j++) {
			if(a->id[i]==b->id[j]) {
				return FALSE;
			}
		}
	}
	return TRUE;
}

bool isTeacherAndBatchFree(Slots * slot, int posI) {

	if(slot->subject->type=="lab" && (posI+1)%8==0) { // lab can't be on the last hr of a day
		slot->_conflict=slot->_conflict+" "+to_string(posI)+"-labOnLastHr";
		return FALSE;
	}

	if(posI<40 && isBreakPeriod(posI,slot->batch->sem)) { // don't check for breaks on sat
		slot->_conflict=slot->_conflict+" "+to_string(posI)+"-isBreakPeriod";
		return FALSE;
	}
	
	for(int j=0;j<ROOM_SIZE;j++) {
		if(ttArr[posI][j]!=NULL) {
			if(ttArr[posI][j]->teacher == slot->teacher) {
				slot->_conflict=slot->_conflict+" "+to_string(posI)+"-teacherNotFree";
				return FALSE;
			}
			if(!batchMatches(ttArr[posI][j]->batch,slot->batch)) {
				slot->_conflict=slot->_conflict+" "+to_string(posI)+"-batchNotFree";
				return FALSE;
			}
			if(slot->batch->backBatches.find(ttArr[posI][j]->batch)!=slot->batch->backBatches.end()) {
				slot->_conflict=slot->_conflict+" "+to_string(posI)+"-backBatchNotFree";
				return FALSE;
			}
		}
	}
	//cout<<slot->id<<"  "<<posI; ////////////
	if(posI<40 && !teacherFreeForBreak(slot->teacher,posI,FALSE)) {
		slot->_conflict=slot->_conflict+" "+to_string(posI)+"-teacherNotFreeBreak";
		return FALSE;
	}

	if(slot->subject->type=="lab") {
		if(posI>=(PERIODS-1)) {
			slot->_conflict=slot->_conflict+" "+to_string(posI)+"-labOnSatEnd";
			return FALSE;
		}
		posI++;
		if(posI<40 && isBreakPeriod(posI,slot->batch->sem)) {
			slot->_conflict=slot->_conflict+" "+to_string(posI)+"-breakOnNxtHrLab";
			return FALSE;
		}	
		for(int j=0;j<ROOM_SIZE;j++) {
			if(ttArr[posI][j]!=NULL) {
				if(ttArr[posI][j]->teacher == slot->teacher) {
					slot->_conflict=slot->_conflict+" "+to_string(posI)+"-teacherNotFreeNxtHrLab";
					return FALSE;
				}
				if(!batchMatches(ttArr[posI][j]->batch,slot->batch)) {
					slot->_conflict=slot->_conflict+" "+to_string(posI)+"-batchNotFreeNxtHrLab";
					return FALSE;
				}
				if(slot->batch->backBatches.find(ttArr[posI][j]->batch)!=slot->batch->backBatches.end()) {
					slot->_conflict=slot->_conflict+" "+to_string(posI)+"-backBatchNotFreeNxtHrLab";
					return FALSE;
				}
			}
		}
		if(posI<40 && !teacherFreeForBreak(slot->teacher,posI,TRUE)) {
			slot->_conflict=slot->_conflict+" "+to_string(posI)+"-teacherNotFreeForBreakNxtHrLab";
			return FALSE;
		}
	}
	return TRUE;
}

// calculate the soft constraint score of placing the slot
// at the given time
int getScore(Slots *slot, int posI) {
	int score=500;

	int dStart,dEnd;
	dStart=posI-(posI%8);
	dEnd=dStart+8;
	if(dEnd>=PERIODS)
		dEnd-=4;

	unordered_map<Subjects*,int> lectCount; // to count instances of a lecture in a day
	int labCount = 0;
	int tutCount = 0;

	int labLPosB = -3; // lab last position for a batch
	int lecLPosB = -2; // lecture last position for a batch
	int contLecCntB = 0; // continuous lecture count for batch

	int labLPosT = -3; // lab last position for a teacher
	int lecLPosT = -2; // lecture last position for a teacher
	int contLecCntT = 0; // continuous lecture count for teacher
	//cout<<"\ndStart:"<<dStart<<" dEnd:"<<dEnd; /////////////
	for(int i=dStart;i<dEnd;i++) {
		for(int j=0;j<ROOM_SIZE;j++) {			
			if(ttArr[i][j]!=NULL) {
				if(ttArr[i][j]->batch==slot->batch) {
					if(ttArr[i][j]->subject->type=="lecture") {
						int a = lectCount[ttArr[i][j]->subject];
						lectCount[ttArr[i][j]->subject]+=1;

						if(lecLPosB==(i-1)) {
							contLecCntB++;
							if(contLecCntB >= 3) {
								score-=40;
							}
						}
						else {
							contLecCntB=0;
						}
						lecLPosB=i;						
					}
					else if(ttArr[i][j]->subject->type=="lab") {
						labCount++;

						if(labLPosB==(i-2)) {
							score-=40;
						}

						if(i==dStart) {
							labLPosB = 0;
						}
						else if(!(ttArr[i-1][j]!=NULL && ttArr[i-1][j]->batch==slot->batch &&
							ttArr[i-1][j]->subject==ttArr[i][j]->subject)) {
							labLPosB=i;
						}
					}
					else { // tut
						tutCount++;
					}
				}
				if(ttArr[i][j]->teacher==slot->teacher) {
					if(ttArr[i][j]->subject->type=="lecture") {
						
						if(lecLPosT==(i-1)) {
							contLecCntT++;
							if(contLecCntT >= 3) {
								score-=40;
							}
						}
						else {
							contLecCntT=0;
						}
						lecLPosT=i;						
					}
					else if(ttArr[i][j]->subject->type=="lab") {
						
						if(labLPosT==(i-2)) {
							score-=40;
						}

						if(i==dStart) {
							labLPosT = 0;
						}
						else if(!(ttArr[i-1][j]!=NULL && ttArr[i-1][j]->teacher==slot->teacher &&
							ttArr[i-1][j]->subject==ttArr[i][j]->subject)) {
							labLPosT=i;
						}
					}
				}
			}
		}
	}
	for(auto it=lectCount.begin();it!=lectCount.end();it++) {
		score-=(it->second-1)*40;
	}
	if(labCount>=2) {
		score-=(labCount-2)*40;
	}
	if(tutCount>=3) {
		score-=(tutCount-3)*40;
	}
	if(score!=500) {
		cout<<" score"<<score;//<<" labC"<<labCount<<" tutCount"<<tutCount<<" lectCount"<<lectCount.size();
	}
	for(auto a=lectCount.begin();a!=lectCount.end();a++) {
		if(a->second!=1) {
			cout<<" lecCnt"<<a->second;
		}
	}

	return score;
}

// get the maximum soft constraint score position
// which was calculated for this slot
int getBestPos(Slots* slot){
	int max = slot->sConst[0].score;
	int pos=slot->sConst[0].pos;
	for(int i=1;i<slot->sConst.size();i++) {
		if(slot->sConst[i].score>max) {
			max=slot->sConst[i].score;
			pos=slot->sConst[i].pos;
		}
	}
	return pos;
}

void placeEm() {
	ttArr = new Slots ** [PERIODS];
	for (int i = 0 ; i< PERIODS; i++) {
		ttArr[i] = new Slots* [ROOM_SIZE];
		for (int j= 0; j < ROOM_SIZE; j++) {
			ttArr[i][j] = NULL;
		}
	}
	int a = 0;	// tut pos
	int b = Rooms::TUT_SIZE;	// class1 pos
	int c = Rooms::TUT_SIZE + Rooms::CLASS_SIZE1; // class2 pos	
	int d = Rooms::TUT_SIZE + Rooms::CLASS_SIZE1 + Rooms::CLASS_SIZE2; // lab pos
	Rooms::ttArrayIndexTORoomName(a,b,c,d);
	shuffleList(time(NULL)); // have to do this semester wise		
	for(auto it=slotList.begin();it!=slotList.end();) {		
		(*it)->isProcessed="yes";
		bool isPlaced = FALSE;
		for(int posI=0;posI<PERIODS;posI++) {			
			if(isTeacherAndBatchFree(*it,posI)) {
				int jStart,jEnd;
				if((*it)->subject->type=="tut") {
					jStart=a;
					jEnd=b;
				}
				else if((*it)->subject->type=="lecture") {
					jStart=b;
					jEnd=d;
				}
				else {
					jStart=d;
					jEnd=ROOM_SIZE;
				}
				(*it)->_noConflict=(*it)->_noConflict+" "+to_string(posI)+"-tNbFree("+to_string(jStart)+","+to_string(jEnd)+")";
				for(int j=jStart;j<jEnd;j++) {
					if(isRoomFree(*it,posI,j)) {
						(*it)->_noConflict=(*it)->_noConflict+" j:"+to_string(j)+"-rFree";
						Slots::softConstScore s;
						s.pos = posI*ROOM_SIZE+j;
						s.score = getScore(*it,posI);
						(*it)->sConst.push_back(s);
						if((*it)->subject->type=="lab") {
							// as next pos is occupied by the just placed slot
							// but wont show in any checks until it is picked as best choice
							posI++;
						}
						isPlaced=TRUE;
						break;
					}
				}
			}
		}
		if(!isPlaced) {
			// (re)move last placed slot and try again
			// if still not placed then restore placedList as it was
			// before trying and move on to next one
			it++;
		}
		if(isPlaced) {
			int p = getBestPos(*it);
			ttArr[p/ROOM_SIZE][p%ROOM_SIZE] = *it;
			if((*it)->subject->type=="lab") {
				ttArr[(p/ROOM_SIZE)+1][p%ROOM_SIZE] = *it;
			}
			placedList.push_back(*it);
			it=slotList.erase(it);
		}
	}	
}

int timeTableFunctions() {

	Subjects::subjectsAllocated = unordered_map<int,int>() ;
	batchVector = std::vector<Batches*>();
	teacherVector = vector<Teachers*>();
	subjectVector = vector<Subjects*>();
	studentVector = vector<Students*>();
	roomVector = vector<Rooms*>();
	slotList = list<Slots*>();
	if(table!=NULL) {
		for(int i=0;i<PERIODS;i++) {
			free(table[i]);
		}
	}
	placedList = list<Slots*>();
	TT_COUNT=0;

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
	Students::fetchBacklogsFromDB();
	Batches::assignBacklogBatches();
	Batches::groupBatchesForLectures();
	int a = Teachers::assignSubjects();
	Teachers::assignBatches();
	placeEm();
	//generateTable();
	if(a!=0) {
		return 102;
	}
	return 0;	// all went well
}

Slots* findSlot(int id) {
	
	for(auto it=placedList.begin();it!=placedList.end();it++) {
		if((*it)->id == id) {
			return (*it);
		}
	}
	
	return NULL;
}
int maxSizeOfAnyList(list<string>time[],int siz) {
	int max=0;
	for(int i=0;i<siz;i++) {
		if(time[i].size()>max) max=time[i].size();
	}
	return max;
}

string dayJSON(string daySt,int s,int e) {
	Slots * slot;
	list<string> time[8];
	for(int j=0;j<ROOM_SIZE;j++) {		
		for(int i=s,ti=0;i<e;i++,ti++) {
			/*
			if(table[i][j] != 0) { // get a string of all the details of the slot together
				slot = findSlot(table[i][j]);
				if(slot == NULL) {
					cout<<"no slot matched:"<<table[i][j];
				}*/
			if(ttArr[i][j] != NULL) { // get a string of all the details of the slot together
				slot = ttArr[i][j];				
				string temp;
				temp=slot->batch->sem+","+slot->batch->name+","+
					slot->subject->name+" "+slot->subject->type+","+slot->teacher->name+","+Rooms::nameFromIndex(j);
				time[ti].push_back(temp);
			}
		}
	}

	string sEmpty = "";
	string tmp;
	int m = maxSizeOfAnyList(time,8);
	string day;
	day=day+"\""+daySt+"\" : [ ";
	if(m>0) {
		tmp = (time[0].size() > 0)?time[0].front():sEmpty;
		day+=" { \"nine\" : \""+tmp+"\"";
		tmp = (time[1].size() > 0)?time[1].front():sEmpty;
		day+=" , \"ten\" : \""+tmp+"\"";
		tmp = (time[2].size() > 0)?time[2].front():sEmpty;
		day+=" , \"eleven\" : \""+tmp+"\"";
		tmp = (time[3].size() > 0)?time[3].front():sEmpty;
		day+=" , \"twelve\" : \""+tmp+"\"";
		tmp = (time[4].size() > 0)?time[4].front():sEmpty;
		day+=" , \"one\" : \""+tmp+"\"";
		tmp = (time[5].size() > 0)?time[5].front():sEmpty;
		day+=" , \"two\" : \""+tmp+"\"";
		tmp = (time[6].size() > 0)?time[6].front():sEmpty;
		day+=" , \"three\" : \""+tmp+"\"";
		tmp = (time[7].size() > 0)?time[7].front():sEmpty;
		day+=" , \"four\" : \""+tmp+"\"";		
		day+=" } ";
		for(int i=0;i<8;i++) {
			if(time[i].size()>0) {
				time[i].pop_front();
			}
		}
	}
	for(int i=1;i<m;i++) {
		tmp = (time[0].size() > 0)?time[0].front():sEmpty;
		day+=" ,{ \"nine\" : \""+tmp+"\"";
		tmp = (time[1].size() > 0)?time[1].front():sEmpty;
		day+=" , \"ten\" : \""+tmp+"\"";
		tmp = (time[2].size() > 0)?time[2].front():sEmpty;
		day+=" , \"eleven\" : \""+tmp+"\"";
		tmp = (time[3].size() > 0)?time[3].front():sEmpty;
		day+=" , \"twelve\" : \""+tmp+"\"";
		tmp = (time[4].size() > 0)?time[4].front():sEmpty;
		day+=" , \"one\" : \""+tmp+"\"";
		tmp = (time[5].size() > 0)?time[5].front():sEmpty;
		day+=" , \"two\" : \""+tmp+"\"";
		tmp = (time[6].size() > 0)?time[6].front():sEmpty;
		day+=" , \"three\" : \""+tmp+"\"";
		tmp = (time[7].size() > 0)?time[7].front():sEmpty;
		day+=" , \"four\" : \""+tmp+"\"";		
		day+=" } ";
		for(int ii=0;ii<8;ii++) {
			if(time[ii].size()>0) {
				time[ii].pop_front();
			}
		}
	}
	day+="],";
	return day;	
}

string saturdayJSON() {
	Slots * slot;
	list<string> time[4];
	for(int j=0;j<ROOM_SIZE;j++) {
		for(int i=40,ti=0;i<44;i++,ti++) {
			/*if(table[i][j] != 0) { // get a string of all the details of the slot together
				slot = findSlot(table[i][j]);
				if(slot == NULL) {
					cout<<"no slot matched:"<<table[i][j];
				}*/
			if(ttArr[i][j] != NULL) { // get a string of all the details of the slot together
				slot = ttArr[i][j];				
				string temp;
				temp=slot->batch->sem+","+slot->batch->name+","+
					slot->subject->name+" "+slot->subject->type+","+slot->teacher->name+","+Rooms::nameFromIndex(j);
				time[ti].push_back(temp);
			}
		}
	}

	string sEmpty = "";
	string tmp;
	int m = maxSizeOfAnyList(time,4);
	string day="";
	day+="\"saturday\" : [ ";
	if(m>0) {
		tmp = (time[0].size() > 0)?time[0].front():sEmpty;
		day+=" { \"nine\" : \""+tmp+"\"";
		tmp = (time[1].size() > 0)?time[1].front():sEmpty;
		day+=" , \"ten\" : \""+tmp+"\"";
		tmp = (time[2].size() > 0)?time[2].front():sEmpty;
		day+=" , \"eleven\" : \""+tmp+"\"";
		tmp = (time[3].size() > 0)?time[3].front():sEmpty;
		day+=" , \"twelve\" : \""+tmp+"\"";		
		day+=" } ";
		for(int i=0;i<4;i++) {
			if(time[i].size()>0) {
				time[i].pop_front();
			}
		}
	}
	for(int i=1;i<m;i++) {
		tmp = (time[0].size() > 0)?time[0].front():sEmpty;
		day+=" ,{ \"nine\" : \""+tmp+"\"";
		tmp = (time[1].size() > 0)?time[1].front():sEmpty;
		day+=" , \"ten\" : \""+tmp+"\"";
		tmp = (time[2].size() > 0)?time[2].front():sEmpty;
		day+=" , \"eleven\" : \""+tmp+"\"";
		tmp = (time[3].size() > 0)?time[3].front():sEmpty;
		day+=" , \"twelve\" : \""+tmp+"\"";		
		day+=" } ";
		for(int ii=0;ii<4;ii++) {
			if(time[ii].size()>0) {
				time[ii].pop_front();
			}
		}
	}
	day+="]";
	return day;	
}

string unplacedJSON() {
	string out=",\"unplacedSlots\":[";
	list<Slots*>::iterator it;
	int isFirst=1;
	for(it = slotList.begin();it!=slotList.end();it++) {
		if(isFirst==1) {
			out+="{ \"slot\":\""+(*it)->batch->sem+","+(*it)->batch->name+","+
				(*it)->subject->name+","+(*it)->teacher->name+"\"}";
			isFirst=0;
		}
		else {
			out+=",{ \"slot\":\""+(*it)->batch->sem+","+(*it)->batch->name+","+
				(*it)->subject->name+","+(*it)->teacher->name+"\"}";
		}
	}
	out+="]";
	return out;
}

string notAllocatedJSON() {
	string out=",\"unAllocatedSubs\":[";
	Subjects *sub;
	int isFirst=1;
	for(auto it=Subjects::subjectsAllocated.begin();it!=Subjects::subjectsAllocated.end();it++) {
		if(it->second!=0) {
			sub=Subjects::findSubject(it->first);		
			if(isFirst==1) {
				out+="{ \"subject\":\""+sub->name+","+sub->type+","+sub->branch+"\",\"instances\":\""+to_string(it->second)+"\"}";
				isFirst=0;
			}
			else {
				out+=",{ \"subject\":\""+sub->name+","+sub->type+","+sub->branch+"\",\"instances\":\""+to_string(it->second)+"\"}";
			}
		}
	}
		out+="],";
	return out;	
}

string teacherDataJSON() {
	string out=",\"teachers\":[";
	Subjects *sub;
	int isFirst=1;
	for(auto it=teacherVector.begin();it!=teacherVector.end();it++) {
		if(isFirst==1) {
			out+="{ \"name\":\""+(*it)->name+"\",\"dept\":\""+(*it)->dept+"\",\"hrs\":\""+to_string((*it)->hrsCurrentlyTeaching)+"\"}";
			isFirst=0;
		}
		else {
			out+=",{ \"name\":\""+(*it)->name+"\",\"dept\":\""+(*it)->dept+"\",\"hrs\":\""+to_string((*it)->hrsCurrentlyTeaching)+"\"}";
		}	
	}
	out+="]";
	return out;
}

string convertToJSON() {
	string json = "";
	string days[] = {"monday","tuesday","wednesday","thursday","friday"};
	int s=0,e=0;
	for(int i=0;i<5;i++) {
		s=i*8;
		e=s+8;
		json+=dayJSON(days[i],s,e);
	}
	json+=saturdayJSON();
	json+=",\"unplaced\":\""+to_string(slotList.size())+"\"";
	json+=unplacedJSON();
	json+=teacherDataJSON();
	return json;
}

int __cdecl main(void) {

	// create a server socket with tcp,
	// accept a client and then close server
#pragma region
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
#pragma endregion
    // Receive until the peer shuts down the connection
    do {
		memset(recvbuf,0,DEFAULT_BUFLEN);
        iResult = recv(ClientSocket, recvbuf, recvbuflen, 0);
        if (iResult > 0) {
            printf("Bytes received: %d\n", iResult);
			printf(" data: %s",recvbuf);
			string input(recvbuf);
			size_t pos = input.find("iterNos");
			if(pos!=string::npos) {				
				string iters;
				int iterNos=0;
				try{
					iters = input.substr(pos+8,3);
					iterNos = stoi(iters);
					MAX_ITER = iterNos;
				}catch(exception &e) {
					try{
						iters = input.substr(pos+8,2);
						iterNos = stoi(iters);
						MAX_ITER = iterNos;
					}catch(exception &e) {
						try{
							iters = input.substr(pos+8,1);
							iterNos = stoi(iters);
							MAX_ITER = iterNos;
						}catch(exception &e) {
							cout<<e.what();
							MAX_ITER = 50;
						}
					}
				}
				if(MAX_ITER < 0 || MAX_ITER >999) {					
					MAX_ITER = 50;
				}
			}
			else {
				MAX_ITER = 50;
			}
			MAX_ITER = 1e4;
			MAX_UNPLACED = 5;
			// form a response	
			string respJSON="{ \"status\": ";			
			
			int status = timeTableFunctions();			
			
			if(status == 0) {
				respJSON+= "\"ok\", \"error_string\": \"no error\",";
				respJSON+= convertToJSON();
			}
			else {
				respJSON+= "\"error\", \"error_string\": ";
				if(status == 101) {
					respJSON+="\"some tables are empty, cannot generate time table\"";
				}
				if(status == 102) {
					respJSON+="\"some subjects were left unallocated\"";
					respJSON+=notAllocatedJSON();
					respJSON+= convertToJSON();
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

// this main is to test functionality without web input
int main12() {
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
	7Students::fetchBacklogsFromDB();
	8)Batches::assignBacklogBatches();
	9)Batches::groupBatchesForLectures()
	10)Rooms::fetchRecordsFromDB()
	11)Teachers::assignSubjects()
	12)Teachers::assignBatches()
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
	Students::fetchBacklogsFromDB();
	Batches::assignBacklogBatches();
	Batches::groupBatchesForLectures();
	cout<<" fn ret:"<<Teachers::assignSubjects()<<" | ";
	Teachers::assignBatches();
	/*
	//display
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
	*/
	cout<<endl;
	MAX_ITER=5000;
	placeEm();
	//generateTable();
	//result();
	system("pause");
	return 1;
}