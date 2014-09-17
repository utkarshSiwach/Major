import QtQuick 2.2
import QtQuick.Controls 1.2
import QtQuick.Window 2.1

Window {
    visible: true
    width: 1000
    height: 600

    // Title
    Rectangle {
        x:100
        y:41
        width:100
        height:40
        border.width:1
        border.color:black

        Text {
            text: qsTr("Room")
            anchors.verticalCenterOffset: 1
            anchors.horizontalCenterOffset: 1
            font.pointSize: 16
            anchors.centerIn: parent
            renderType: Text.NativeRendering
        }
        MouseArea {
            anchors.rightMargin: 1
            anchors.bottomMargin: 0
            anchors.leftMargin: -1
            anchors.topMargin: 0
            anchors.fill: parent
            onClicked: {
                Qt.quit();
            }
        }

    }

    ListModel {
       id: libraryModel
       ListElement{
           roomId: "1";
           roomName: "LT 1";
           roomSeatsNum:   "150";
           roomCategory:   "1";
           roomDesc:    "Lecture theatre, ideal for group of 3 to 5 batches or seminars"
       }
       ListElement{
           roomId: "2";
           roomName: "LT 2";
           roomSeatsNum:   "150";
           roomCategory:   "1";
           roomDesc:    "Lecture theatre, ideal for group of 3 to 5 batches or seminars"
       }
       ListElement{
           roomId: "3";
           roomName: "G 1";
           roomSeatsNum:   "80";
           roomCategory:   "2";
           roomDesc:    "Class Room, ideal for group of 2 to 3 batches"
       }
    }
    // table of rooms already entered
    TableView {
        x:100
        y:100
        width:600
        height:300
        TableViewColumn{ role: "roomId"  ; title: "Room Id" ; width: 50 }
        TableViewColumn{ role: "roomName" ; title: "Room Name" ; width: 75 }
        TableViewColumn{ role: "roomSeatsNum" ; title: "Number of Seats" ; width: 50 }
        TableViewColumn{ role: "roomCategory" ; title: "Category" ; width: 50 }
        TableViewColumn{ role: "roomDesc" ; title: "Description" ; width: 200 }
        model: libraryModel
    }
    // options for edit delete, etc
    Rectangle {
        x:100
        y:417
        width:240
        height:33
        border.width:1
        border.color:black

        // individual options
        Rectangle {
            x:8
            y:5
            width:62
            height:23
            color:"red"
            border.width:1
            border.color:black
            radius:5
            Text {
                text: qsTr("Edit")
                font.pointSize: 8
                anchors.centerIn: parent
                renderType: Text.NativeRendering
            }
        }
        Rectangle {
            x:89
            y:5
            width:63
            height:23
            color:"red"
            border.width:1
            border.color:black
            radius:5
            Text {
                text: qsTr("Delete")
                font.pointSize: 8
                anchors.centerIn: parent
                renderType: Text.NativeRendering
            }
        }
        Rectangle {
            x:169
            y:5
            width:63
            height:23
            color:"red"
            border.width:1
            border.color:black
            radius:5
            Text {
                text: qsTr("Duplicate")
                font.pointSize: 8
                anchors.centerIn: parent
                renderType: Text.NativeRendering
            }
        }
    }
    // option to enter new entry
    Rectangle {
        x:572
        y:417
        width:128
        height:33
        color:"red"
        border.width:1
        border.color:black
        radius:5
        Text {
            text: qsTr("Enter a new room")
            font.pointSize: 8
            anchors.centerIn: parent
            renderType: Text.NativeRendering
        }
    }

}
