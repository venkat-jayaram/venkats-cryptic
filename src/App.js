import './App.css';
import React,{useState} from 'react';
import {ethers} from 'ethers';
import {createRoot} from 'react-dom/client';
//import lock from './artifacts/contracts/Lock.sol/Lock.json';

const lock = require("./artifacts/contracts/Lock.sol/Lock.json");

const deployer_address = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

function App() {
  const [curr, update] = useState("");
  let user;
  async function inbox_check(instance)
  {
      try
      {
        const resp = await instance.receiveMessages();
        return resp;
      }
      catch(err)
      {
        console.log(err.message);
      }
  }
  async function signuse(e)
  {
    e.preventDefault();
    if(typeof window.ethereum != 'undefined')
    {
      try
      {
          accounts();
          const provider = new ethers.providers.Web3Provider(window.ethereum); //instance of web3 provider
          const signature = provider.getSigner();
          let instance = new ethers.Contract(deployer_address,lock.abi,signature);
          instance.connect(signature);

          const resp = await instance.checkUserRegistration();
          
          if(!resp)
          {
            const transaction = await instance.registerUser();
            await transaction.wait();
          }
          let messages = await inbox_check(instance);
          inbox_send();
          inbox_display(messages);

      }
      catch(err)
      {
        console.log(err);
      }
    }
  }
  async function inbox_display(messages)
  {
      var i;
      var ind1=0;
      for(i=0;i<=15;i++)
      {
          if(ethers.utils.parseBytes32String(messages[0][i]) != "")
          {
            let user = document.createElement("div");
            user.classList.add("userMsg");
            let msgAddr = document.createElement("p");
            msgAddr.classList.add("msgAddr");
            let msgdiv = document.getElementsByClassName("messages"); 
            msgAddr.innerHTML = "From: " + messages[2][i] + "";
            let msg = document.createElement("p");
            msg.classList.add("msg");
            msg.innerHTML = "Message: " + ethers.utils.parseBytes32String(messages[0][i]) + "<br>";
            user.appendChild(msgAddr);
            user.appendChild(msg);
            msgdiv[0].appendChild(user);
            console.log(msgAddr);
            ind1 = 1;
          }
         
      }
      if(ind1 == 0)
      {
        let heading = document.getElementsByClassName("heading")[0];
        heading.innerHTML = "Your Inbox is empty";
      }

  }
  async function inbox_send()
  {
      document.getElementById("root").innerHTML = "";
      
      let container = document.createElement("div");
      container.classList.add("container");

      let heading = document.createElement("p");
      heading.innerHTML = "Your Inbox";
      heading.classList.add("heading");

      /*let seperator = document.createElement("div");
      seperator.classList.add("seperator");

      let inbox = document.createElement("div");
      inbox.classList.add("inbox");*/

      let curr_message = document.createElement("div");
      curr_message.classList.add("curr_message");

      let messages = document.createElement("div");
      messages.classList.add("messages");

      let messageList = document.createElement("form");
      messageList.classList.add("message-send");

      let send_btn = document.createElement("button");
      send_btn.classList.add("send_btn");
      send_btn.addEventListener("click", e => send(e));
      send_btn.innerHTML = "Send";

      let input1 = document.createElement("div");
      input1.classList.add("input-container");
      let rec_addr = document.createElement("input");
      rec_addr.classList.add("rec_addr");
      rec_addr.setAttribute("type", "text");
      rec_addr.setAttribute("placeholder", "Receiver's Address");

      let input2 = document.createElement("div");
      input2.classList.add("input-container");
      let send_msg = document.createElement("input");
      send_msg.classList.add("send_msg");
      send_msg.setAttribute("type", "text");
      send_msg.setAttribute("placeholder","Enter a message")

      input2.appendChild(send_msg);
      //input2.appendChild(label2);

      input1.appendChild(rec_addr);
      //input1.appendChild(label1);

      messageList.appendChild(input1);
      messageList.appendChild(input2);

      curr_message.appendChild(messages);
      curr_message.appendChild(messageList);
     curr_message.appendChild(send_btn);

      /*seperator.appendChild(inbox);
      seperator.appendChild(curr_message);*/

      container.appendChild(heading);
      container.appendChild(curr_message);

      document.getElementById("root").appendChild(container);
      document.getElementById("root").style.height="800px";
      document.getElementById("root").style.width="600px";
      document.body.style.marginTop="0px";
  }

  async function send(e)
  {
    e.preventDefault();
    try
    {
      accounts();
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signature = provider.getSigner(); 
      const instance = new ethers.Contract(deployer_address,lock.abi,signature);
      instance.connect(signature);
      await instance.sendMessage(document.getElementsByClassName("rec_addr")[0].value,document.getElementsByClassName("send_msg")[0].value);
    }
    catch(err)
    {
      console.log(err);
    }
  }
  async function accounts()
  {
    await window.ethereum.request({method:"eth_requestAccounts"}); // this will fetch our accounts from metamask
  }

  return (
    <div class="container">
      <p class="heading">Cryptic Chat</p>
      <p class="tagline">Decentralise your chatting</p>
    <div class="form">
      <form>
        <button type="submit" class="send_btn" onClick={e => signuse(e)}>Start</button><br></br>
      </form>
      <div>
        <p id = "in"></p>
      </div>
    </div>
    </div>
    
  );
}

export default App;
