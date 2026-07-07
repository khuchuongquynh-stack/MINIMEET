const socket = io();

console.log("MiniMeet script loaded");


let currentRoom = "";


// Lấy phần tử HTML

const createBtn = document.getElementById("create");
const codeText = document.getElementById("code");

const joinBtn = document.getElementById("join");

const nameInput = document.getElementById("name");
const roomInput = document.getElementById("room");

const msgInput = document.getElementById("msg");
const sendBtn = document.getElementById("send");

const chatBox = document.getElementById("chat");



// =================
// TẠO PHÒNG
// =================

createBtn.onclick = async function () {

    console.log("Đang tạo phòng...");


    try {

        const response = await fetch("/create-room");


        const data = await response.json();


        currentRoom = data.room;


        codeText.innerText = data.room;


        alert(
            "Mã phòng của bạn: " + data.room
        );


        console.log(
            "Room created:",
            data.room
        );


    } catch(error) {

        console.error(error);

        alert(
            "Không kết nối được server!"
        );

    }

};




// =================
// THAM GIA PHÒNG
// =================

joinBtn.onclick = function () {


    let room =
    roomInput.value
    .toUpperCase()
    .trim();


    let name =
    nameInput.value.trim();



    if(room === "") {

        alert(
            "Nhập mã phòng!"
        );

        return;

    }


    if(name === "") {

        name = "Guest";

    }



    currentRoom = room;



    socket.emit(
        "join-room",
        {
            room: room,
            name: name
        }
    );


    console.log(
        "Joining:",
        room
    );


};





// =================
// GỬI CHAT
// =================


sendBtn.onclick = function () {


    let text =
    msgInput.value.trim();



    if(text === "") return;


    socket.emit(
        "message",
        {

            room: currentRoom,

            name:
            nameInput.value || "Guest",

            text: text

        }
    );



    msgInput.value = "";

};





// =================
// NHẬN CHAT
// =================


socket.on(
"message",
function(data){


    let p =
    document.createElement("p");


    p.innerText =
    data.name + ": " + data.text;


    chatBox.appendChild(p);


});





// =================
// LỖI PHÒNG
// =================


socket.on(
"error-room",
function(msg){

    alert(msg);

});