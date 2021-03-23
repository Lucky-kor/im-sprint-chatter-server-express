// const githubID = 'kimcoding'

// const app = {
//   server: `http://localhost:3000`,
//   init: () => {
//     app.addEventHandlers();
//     app.fetch((json) => {
//       json.forEach(app.renderMessage);
//     });
//   },
//   fetchAndRender: () => {
//     app.fetch(data => {
//       data.forEach(app.renderMessage);
//     });
//   },
//   addEventHandlers: () => {
//     let submit = document.querySelector('#send .submit');
//     if (submit) {
//       submit.addEventListener('submit', app.handleSubmit);
//     }
//   },
//   fetch: callback => {
//     window
//       .fetch(`http://localhost:3000/file.json`)
//       .then(resp => {
//         return resp.json();
//       })
//       .then(callback);
//   },
//   send: (data, callback) => {
//     window
//       .fetch(app.server, {
//         method: 'POST',
//         body: JSON.stringify(data),
//         headers: {
//           'Content-Type': 'application/json'
//         }
//       })
//       .then(resp => {
//         return resp.json();
//       })
//       .then(callback);
//   },
//   clearMessages: () => {
//     document.querySelector('#chats').innerHTML = '';
//   },
//   clearForm: () => {
//     document.querySelector('.inputUser').value = '';
//     document.querySelector('.inputChat').value = '';
//   },
//   renderMessage: ({ username, text, date, roomname }) => {
//     const tmpl = `<div class="chat">
//       <div class="username">${username
//         .replace(/</g, '&lt;')
//         .replace(/>/g, '&gt;')}</div>
//       <div>${text
//         .replace(/</g, '&lt;')
//         .replace(/>/g, '&gt;')}</div>
//       <div>${date}</div>
//       <div>${roomname
//         .replace(/</g, '&lt;')
//         .replace(/>/g, '&gt;')}</div>
//     </div>`;

//     document.querySelector('#chats').innerHTML =
//       tmpl + document.querySelector('#chats').innerHTML;
//   },
//   handleSubmit: e => {
//     e.preventDefault();
//     app.clearMessages();
//     app.send(
//       {
//         username: document.querySelector('.inputUser').value,
//         text: document.querySelector('.inputChat').value,
//         roomname: '코드스테이츠'
//       },
//       () => {
//         app.fetchAndRender();
//         app.clearForm();
//       }
//     );
//   }
// };

// app.init();

// // 테스트를 위한 코드입니다.
// if(window.isNodeENV){
//   module.exports = app;
// }

const githubID = 'Lucky-kor' // 여러분의 아이디로 바꿔주세요

/*
1.서버에서 값을 받아오는 함수 --fetch;
2.입력한 값을 서버로 보내는 함수 // 함수이름은 send /
3.renderMessage함수를 만듭니다. 해당 함수는 한가지 메시지를 DOM으로 출력합니다.
1번에서 가져온 값을 하나 출력하는 메소드입니다.
4.1번 서버에서 가져온 값을 3번 데이터를 여러번 사용해 출력하는 함수.
5. clearMessages함수를 만듭니다. 해당 함수는 DOM에서 모든 출력된 메시지를 삭제합니다.

advance 
1. room별로 나누어 정렬, 입력시에 현재 있는 room의 정보 함께 입력.
2. 새로고침을 하지 않아도 메시지를 주기적으로 출력..
*/
const inputRoomName = document.querySelector('.inputRoom');
const mainPage = document.querySelector('#main');
const inputText = document.querySelector('.inputChat');
const inputUser = document.querySelector('.inputUser');
const textButton = document.querySelector('.inputButton');
const chatArea = document.querySelector('#chats');
const roomList = document.querySelector('#roomlist');
const roomButton = document.querySelector('.roombutton');
const roomText = document.querySelector('.createRoom')
let backupData;
let q1 ;
const app = {
  server: `http://localhost:3000/messages`,
  init: () => {
    app.print();    //최초 실행시 모든 메시지 출력
    // app.isChangeData();   //정해진 시간마다 데이터 확인후 변동사항 있을시 출력하는 함수 실행
  },

  isChangeData: () => {   //3초마다 데이터를 받아와 현재 출력된 값과 다르면 재출력하는 함수
    let cur;

    app.fetch().then(value => {   //최초 1회 실행시 서버에서 데이터 받아옴 오류방지
      cur = value;
    });

    setInterval(() => {
      if(roomList.value === 'AllChats'){    //roomname이 allchats일때는 모든 자료를 받아옴
        app.fetch().then(value => {
          cur = value;
        });
      }else{
        app.fetch(roomList.value).then(value => {   //이외의 roomname일시 해당 방이름에 맞는 데이터를 받아옴
          cur = value.results;
        });
      }
      
      if(backupData.length !== cur.length) app.setRoomUser();   //현재 출력된 데이터와 서버에서 받아온 데이터 비교후 다르면 새로 출력 // 객체로 값비교가 어려워 갯수로 비교
    }, 3000);
  },

  fetch: (room) => {    //서버에서 데이터를 받아오는 함수
    if(!room || room === 'AllChats') {  //room을 입력받지 않거나, allchats일때는 모든 메시지를 서버에서 받아옴
      return window.fetch(`http://localhost:3000/messages`, { method : 'GET'})
      .then((Response) => Response.json())
    }else{    //이외의 경우 해당 이름에 맞는 데이터만 받아옴
      return window.fetch(`http://localhost:3000/messages?roomname=${room}`, { method : 'GET'})
      .then((Response) => Response.json())
    }
  },

  send: (text) => {   //서버에 입력된 메시지를 전달하는 함수
    window.fetch(`http://localhost:3000/messages`, {
      method : 'POST',
      body : JSON.stringify(text),
      headers : {
        "Content-Type": "application/json"
      }
    })
    .then((Response) => Response.json());
  },

  renderMessage: (text) => {    // 한가지의 메시지를 화면에 출력하는 함수
    let textArea = document.createElement('div');
    let userName = document.createElement('div');
    let isText = document.createElement('div');
    let isData = document.createElement('div');
    let userRoom = text.roomname;

    textArea.classList.add('textDiv');
    userName.textContent = text.username;
    isText.textContent = text.text;
    isData.textContent = text.data;

    textArea.appendChild(userName);
    textArea.appendChild(isText);
    textArea.appendChild(isData);
    chatArea.prepend(textArea);
    app.checkRoom(userRoom);    //출력후 입력된 데이터의 room값이 있는지 없는지 확인후 없으면 새로 만듬
  },

  print: (room) =>{   //입력받은 데이터를 출력하는 함수 위에 renderMessage함수를 이용해 모두 출력
    app.clearMessages();

    if(!room || room === 'AllChats'){   //room을 입력받지 않거나, allchats일때는 모든 자료를 받아옴
      app.fetch().then(value => {
        backupData = value.results;   //백업데이터에 입력 초마다 서버값과 변화가 있는지 검증할때 사용
        console.log(value);
        q1 = value;
        for(let i = 0; i < backupData.length; i++) app.renderMessage(backupData[i]);    //반복문을 돌려 renderMessage함수를 사용해 모두 화면에 출력
      })
    }else{
      app.fetch(room).then(value => {   //이외에는 입력된 방이름으로 데이터를 받아옴
        const roomArr = value.results;
        backupData = roomArr;   //백업데이터에 입력 초마다 서버값과 변화가 있는지 검증할때 사용
        for(let k = 0; k < roomArr.length; k++) {
          app.renderMessage(roomArr[k]);     //반복문을 돌려 renderMessage함수를 사용해 모두 화면에 출력
        }
      })
    } 
  },

  clearMessages: () => {    //화면에 출력된 메시지를 모두 지워주는 함수
    let textList = document.querySelector('#chats').querySelectorAll('.textDiv');
    for(let i = 0; i < textList.length; i++) document.querySelector('#chats').querySelector('.textDiv').remove();
    textList = document.querySelector('#chats').querySelectorAll('div');
    if(textList.length !== 0) {
      for(let i = 0; i < textList.length; i++) document.querySelector('#chats').querySelector('div').remove();
    }
  },

  clickEvent: () => {   //닉네임과 텍스트 입력후 버튼 클릭시 작동하는 함수
    if(!inputText.value || !inputUser.value) {    //값이 입력되지 않았을떄 오류설정
      alert('정확한 메시지를 입력하세요.');
      inputText.value = '';
      inputUser.value = '';
    }else{
      let curText = { 
        username : inputUser.value,
        roomname : roomList.value,
        data : Date(),
        text : inputText.value
      }
      app.send(curText);    //서버에 데이터 전송
      app.renderMessage(curText);   //화면에 입력한 데이터 출력
      inputText.value = '';
      inputUser.value = '';
    }
  },

  checkRoom: (text) => {    //입력된 roomname이 현재 존재하는지 확인하는 함수
    if(roomList){
      let check = false;
      for(let i=0;i<roomList.length;i++){
        if(text===roomList[i].value) check = true;
      }
      if(!check) app.addRoom(text);
    // }else{
      // app.addRoom(text);
    }
  },

  addRoom: (text) => {    //roomname을 select에 추가해주는 함수
    const roomName = text;
    const newRoom = new Option();
    newRoom.text = roomName;
    roomList.add(newRoom);
  },

  setRoomUser: () => {    //입력된 room에 따라 해당 데이터만 출력해주는 함수 or add room 클릭시도 해당 함수 사용하여 입력받는 창 노출시키는 역활 추가
    const roomName = roomList.value;
    if(roomName==='Add Room'){
      chatArea.style.display = 'none';
      mainPage.style.display = 'none';
      inputRoomName.style.display = 'flex';
    }else app.print(roomName);

  },

  clear: () => {    //서버에 데이터값 삭제하는 함수
    window.fetch(`http://localhost:3000/clear`, { method: 'POST'})
    .then(Response => Response.json());
  },

  xssAttack: () => {    //xss공격 확인하는 함수
    window.fetch(`http://localhost:3000/malicious`, { method: 'POST'})
    .then(Response => Response.json());
  },

  roomClickEvent: () => {   //add room입력후 나오는 창에서 버튼 클릭시 사용할 이벤트
    for(let i=0;i<roomList.length;i++){   //중복여부 확인
      if(roomText.value===roomList[i].value) return alert('정확한 대화방을 입력해주세요')
    }
    app.addRoom(roomText.value)   //addroom함수를 사용해 select에 추가
    chatArea.style.display = 'flex';
    mainPage.style.display = 'inline';
    inputRoomName.style.display = 'none';   //기존 화면으로 돌아감
    app.print(roomText.value);    //새로 입력받은 roomname의 자료를 정렬
    roomList.value = roomText.value;    //select변경 해당 라인이 없으면 계속 add room으로 인식되어 창이 변경됨
    roomText.value = '';
    // roomList.selectedIndex[0];
  }
};

app.init();

if(textButton) textButton.onclick = app.clickEvent;
if(roomButton) roomButton.onclick = app.roomClickEvent;
// 테스트를 위한 코드입니다. 아래 내용은 지우지 마세요
if(window.isNodeENV){
  module.exports = app;
}