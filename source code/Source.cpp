#include<iostream>
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

	void display();

}oTeachersArr[10];

class Subjects {
public:
	int id;
	char * name;
	void display();
}oSubjectsArr[10];

class Batches {
public:
	int id;
	Students * studentArr;
	void display();
}oBatchesArr[10];

class Students {
public:
	int id;
	char * name;
	int batchId;
	Subjects *subArr;
	void display();
}oStudentsArr[10];
void Teachers::display() {
	cout<<"\nTeaccher id:"<<id<<" name:"<<name;
	subArr->display();
	batchArr->display();
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
	char temp[10];
	for(int i=0;i<10;i++) {
		oStudentsArr[i].id=i+1;		
		oStudentsArr[i].name = (char*) malloc(sizeof(char)*10);
		strcpy_s(temp,"student");
		temp[7]=(char)(48+i);
		temp[8]='\0';
		strcpy_s(oStudentsArr[i].name,sizeof(char)*10,temp);	
		
		oSubjectsArr[i].id=i+1;
		oSubjectsArr[i].name = (char*) malloc(sizeof(char)*10);
		strcpy_s(temp,"subject");
		temp[7]=(char)(48+i);
		temp[8]='\0';
		strcpy_s(oSubjectsArr[i].name,sizeof(char)*10,temp);
		oStudentsArr[i].subArr=&oSubjectsArr[i];
		oBatchesArr[i].id=i+1;
		oBatchesArr[i].studentArr = &oStudentsArr[i];

		oTeachersArr[i].id=i+1;
		oTeachersArr[i].name = (char*) malloc(sizeof(char)*10);
		strcpy_s(temp,"teacher");
		temp[7]=(char)(48+i);
		temp[8]='\0';
		strcpy_s(oTeachersArr[i].name,sizeof(char)*10,temp);
		oTeachersArr[i].subArr = &oSubjectsArr[i];
		oTeachersArr[i].batchArr = &oBatchesArr[i];
		
		oStudentsArr[i].display();
		oBatchesArr[i].display();
		oSubjectsArr[i].display();
		oTeachersArr[i].display();
		cout<<"\n";
	}
	system("pause");
}