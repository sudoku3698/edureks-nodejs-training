const socket=io();

const messageForm=document.getElementById('message-form');
const messageInput=document.getElementById('message-input');
const messageContainer=document.getElementById('chat-messages');
const sendLocationButton=document.getElementById('send-location');
const roomsData=document.getElementById('room-select');
const urlParams = new URLSearchParams(window.location.search);
const myName = urlParams.get('name');

socket.emit('join',{username:myName!==undefined && myName!==''?myName:'User1',room:'General'},(error)=>{
    if(error){
        alert(error);
        location.href='/';
    }
    messageContainer.innerHTML='';
    socket.emit('getMessages',roomsData.value,(messages)=>{
        console.log(messages);
        messages.forEach(message=>{
            let msg=JSON.parse(message)
            const messageElement=document.createElement('div');
            messageElement.innerHTML=`${msg.time} - ${msg.username}: ${msg.msg}`;
            messageContainer.append(messageElement);
        })
    })
});

roomsData.addEventListener('change',()=>{
    socket.emit('join',{username:myName!==undefined && myName!==''?myName:'User1',room:roomsData.value},(error)=>{
        if(error){
            alert(error);
            location.href='/';
        }
        messageContainer.innerHTML='';
        socket.emit('getMessages',roomsData.value,(messages)=>{
            console.log(messages);
            messages.forEach(message=>{
                let msg=JSON.parse(message)
                const messageElement=document.createElement('div');
                messageElement.innerHTML=`${msg.time} - ${msg.username}: ${msg.msg}`;
                messageContainer.append(messageElement);
            })
        })
    });
})


sendLocationButton.addEventListener('click',()=>{
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition((position)=>{
            const {latitude,longitude}=position.coords;
            socket.emit('sendLocation',{latitude,longitude},()=>{
                console.log('location shared');
            });
        });
    }else{
        alert('browser doesnt support geolocation');
    }
});


socket.on('message',(message)=>{
    console.log(message);
    const messageElement=document.createElement('div');
    messageElement.innerText=`${message.time} - ${message.username}: ${message.msg}`;
    messageContainer.append(messageElement);
})

socket.on('locationMessage',(message)=>{
    console.log(message);
    const messageElement=document.createElement('div');
    messageElement.innerHTML=`${message.time} - ${message.username}: <a href=${message.msg} target="_blank">Location</a>`;
    messageContainer.append(messageElement);
})

messageForm.addEventListener('submit',(e)=>{
    e.preventDefault();
    const message=messageInput.value;
    if(message.trim()!==''){
        socket.emit('chatMessage',message,(error)=>{
            if(error){
                console.log(error);
            }
        });
        messageInput.value='';
        messageInput.focus();
    }
})