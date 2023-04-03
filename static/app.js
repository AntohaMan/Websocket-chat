const socket = io('http://localhost:3000');
const msgBox = document.getElementById('exampleFormControlTextarea1');
const msgCont = document.getElementById('data-container');
const email = document.getElementById('email');
const room = document.getElementById('room');

//Получаем старые сообщения с сервера
const messages = [];
let conRoom='';

function getMessages() {
    fetch('http://localhost:3000/api/chat')
        .then((response) => response.json())
        .then((data) => {
            loadDate(data);
            data.forEach((el) => {
                messages.push(el);
            });
        })
        .catch((err) => console.error(err));
}
getMessages();

//Когда пользователь нажимает клавишу enter key, отправляем сообщение.
msgBox.addEventListener('keydown', (e) => {
    if (e.keyCode === 13) {console.log(conRoom)
        sendMessage({ email: email.value, text: e.target.value,room:conRoom });
        e.target.value = '';
    }
});

room.addEventListener('keydown',(e)=>{
    if (e.keyCode === 13) {

        if(conRoom==='' && e.target.value!==''){
            joinRoom({ room: e.target.value });
        }
        else if(e.target.value===conRoom && e.target.value!==''){
            leaveRoom({ room: conRoom})
            joinRoom({ room: e.target.value });
        }
        else if(e.target.value!==conRoom && e.target.value!==''){
            leaveRoom({ room: conRoom})
            joinRoom({ room: e.target.value });
        }


    }
})

//Отображаем сообщения пользователям
function loadDate(data) {
    let messages = '';
    data.map((message) => {
        messages += ` <li class="bg-primary p-2 rounded mb-2 text-light">
      <span class="fw-bolder">${message.email}: </span>
      ${message.text}
    </li>`;
    });
    msgCont.innerHTML = messages;
}


//socket.io
//Создаём событие sendMessage, чтобы передать сообщение
function sendMessage(message) {
    socket.emit('sendMessage', message);
}

function leaveRoom(room) {
    socket.emit('leaveRoom', room);
}
function joinRoom(room) {
    socket.emit('joinRoom', room);
}

//Слушаем событие recMessage, чтобы получать сообщения, отправленные пользователями
socket.on('recMessage', (message) => {
    console.log(message+"llllllllllll")

    messages.push(message);
    console.log(messages)
    loadDate(messages);
})

socket.on('con',(res)=>{
    alert(`You connect to ${res}`);
    conRoom=res;
})
socket.on('dis',(res)=>{
    alert(`You disconnect to ${res}`);

})