import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Room.module.css'
import { useState } from 'react';
import currentUser from '../lib/profile';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useRef } from 'react';
import { SHA256 } from 'crypto-js';
import * as Realm from "realm-web"

export default function Room() {
  
  const app = new Realm.App({id: "chatplus-iwcoj"});

  const [username, setUser] = useState(currentUser(state => state.username));
  const [pfp, setProfile] = useState(currentUser(state => state.profilePic));
  const [namecolor, setColor] = useState(currentUser(state => state.nameColor));
  const [icon, setIcon] = useState('');
  const [admin, setAdmin] = useState('');
  const [roomtitle, setTitle] = useState('');
  const [description, setDesc] = useState('');
  const [members, setMembers] = useState(new Array());
  const [messages, setMessages] = useState(new Array());
  const memberarray = new Array();
  const currentmembers = new Array();
  var messagearray = new Array();
  const [civisible, setciVisible] = useState(false);
  const apikey = process.env.NEXT_PUBLIC_API_KEY;
  const apisecret = process.env.NEXT_PUBLIC_API_SECRET;
  const messagesEndRef = useRef(null);

  const router = useRouter();
  const id = router.query.id;

  const toggleChannelInfo = (vis) => {
    if(id !== '1' && username === admin){
      setciVisible(!vis);
    }
  }

  const populateData = async () => {
    const res = await fetch("https://chatplus.vercel.app/api/channels", {
      method: "GET",
      headers: {
        "Content-Type":
        "application/json"
      },
    });
    const data = await res.json();
    for(let i = 0; i < data.data.length; i++){
      if(data.data[i].roomID.toString() === id){
        setTitle(`${data.data[i].title}`);
        setDesc(`${data.data[i].description}`);
        setIcon(`${data.data[i].icon}`);
        setAdmin(`${data.data[i].admin}`);
        if(id !== '1'){
          for(let j = 0; j < data.data[i].members.length; j++){
            memberarray[j] = data.data[i].members[j];
          }
        }
        break;
      }
    }

    const users = await fetch("https://chatplus.vercel.app/api/users", {
      method: "GET",
      headers: {
        "Content-Type":
        "application/json"
      },
    });
    const userdata = await users.json();
    let x = 0;
    if(id !== '1'){
      for(let k = 0; k < userdata.data.length; k++){
        if(memberarray.includes(userdata.data[k].username)){
          let member = new Array();
          member[0] = userdata.data[k].username;
          member[1] = userdata.data[k].profilePic;
          currentmembers[x] = member;
          x++;
        }
      }
    } else{
      let member = new Array();
      member[0] = "Everyone"
      member[1] = "https://cdn.glitch.global/e15a2c7a-9b1c-4ca0-8bfb-2388168381af/Globe_icon_2.svg.png?v=1669150844655";
      currentmembers[0] = member;
    }
    setMembers(currentmembers);

    const messagedata = await fetch("https://chatplus.vercel.app/api/messages", {
      method: "GET",
      headers: {
        "Content-Type":
        "application/json"
      },
    });
    const roommessages = await messagedata.json();
    for(let l = 0; l < roommessages.data.length; l++){
      if(roommessages.data[l].roomID === id){
        messagearray = roommessages.data[l].messages;
        break;
      }
    }
    setMessages(messagearray);
  }

  const sendMessage = async (event) =>{
    event.preventDefault();
    let message = event.target.textbox.value;
    if(message !== ''){
      document.getElementById("textbox").reset();
      let color = "";
      switch(namecolor){
        case 1:
          color = "#000000";
          break;
        case 2:
          color = "#f2564b";
          break;
        case 3:
          color = "#2e8fb3";
          break;
        case 4:
          color = "#852cde";
          break;
        case 5:
          color = "linear-gradient(to right, #f250b4, #31b2f7)";
          break;
      }
      let obj = {
        id: `${id}`,
        sender: `${username}`,
        message: `${message}`,
        icon: `${pfp}`,
        color: `${color}`
      }
      const req = await fetch("https://chatplus.vercel.app/api/messages", {
        method: "POST",
        body: JSON.stringify(obj),
        headers: {
          "Content-Type":
          "application/json"
        },
      });
      const result = await req.json();
      console.log(result);
      populateData();
    }
  }

  const updatePFP = (file) =>{
    const reader = new FileReader();
    reader.onloadend = () =>{
        let filedata = reader.result;
        document.getElementById("icon").setAttribute("src", filedata);
    }
    if(file instanceof Blob){
        reader.readAsDataURL(file);
    }
  }

  const deleteChannel = async (event) => {
    event.preventDefault();
    let obj = {
      type: "delete",
      id: id
    }
    console.log(obj);
    const deletechan = await fetch("https://chatplus.vercel.app/api/updatechannel", {
      method: "POST",
      body: JSON.stringify(obj),
      headers: {
        "Content-Type":
        "application/json"
      },
    });
    const deletedata = await deletechan.json();
    console.log(deletedata);
    router.push("/channels")
  }

  const updateChannel = async (event) => {
    event.preventDefault();
    let img;
    let name;
    let members = event.target.users.value;
    let memberarray = members.replace(' ', "").split(',');
    if(event.target.channame.value === ""){
      name = roomtitle;
    } else{
      name = event.target.channame.value;
    }
    if(event.target.chanicon.files[0] === undefined){
      img = icon;
      let obj = {
        type: "update",
        id: id,
        image: `${img}`,
        name: `${name}`,
        members: memberarray
      }
      const updatechan = await fetch("https://chatplus.vercel.app/api/updatechannel", {
        method: "POST",
        body: JSON.stringify(obj),
        headers: {
          "Content-Type":
          "application/json"
        },
      });
      const updatedata = await updatechan.json();
      router.push(`/channels`);
    } else{
      img = event.target.chanicon.files[0];
      const reader = new FileReader();
      const formData = new FormData();
      reader.onloadend = async () =>{
        let image = reader.result;
        formData.append("file", image);
        formData.append("api_key", apikey);
        let time = Math.round((new Date()).getTime() / 1000);
        formData.append("timestamp", time);
        let sig = `timestamp=${time}${apisecret}`;
        let signature = SHA256(sig);
        formData.append("signature", signature);
        const upload = await fetch(`https://api.cloudinary.com/v1_1/dfh2ouxw4/auto/upload`, {
            method: "POST",
            body: formData
        });
        const uploaddata = await upload.json();
        let icon = uploaddata.url;
        let obj = {
          type: "update",
          id: id,
          image: `${icon}`,
          name: `${name}`
        }
        const updatechan = await fetch("https://chatplus.vercel.app/api/updatechannel", {
          method: "POST",
          body: JSON.stringify(obj),
          headers: {
            "Content-Type":
            "application/json"
          },
        });
        const updatedata = await updatechan.json();
        router.push(`/channels`);
      }
      if(img instanceof Blob){
        reader.readAsDataURL(img);
      }
    }
  }
  

  const popMessages = async () => {
    const user = await app.logIn(Realm.Credentials.anonymous());
    const mongodb = app.currentUser.mongoClient("mongodb-atlas");
    const collection = mongodb.db("ChatAppDB").collection("messages");
    for await (const change of collection.watch()){
      let last = Object.keys(change.updateDescription.updatedFields)[0];
      let message = change.updateDescription.updatedFields[last];
      let messageobj = {
        sender: message.sender,
        message: message.message,
        time: message.time,
        icon: message.icon,
        color: message.color
      }
      setMessages(message => [...message, messageobj]);
      scrollToBottom();
    }
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({behavior: "instant"});
  }

  useEffect(() => {
    populateData();
    popMessages();
  }, []);
  
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className={styles.container}>
        <Head>
            <title>Chat App</title>
            <meta name="description" content="Simple chat app for my portfolio" />
            <link rel="icon" href="/favicon.ico" />
        </Head>
        <main className={styles.main}>
            <div className={styles.chatcontainer}>
              {civisible === true ? (
                <div className={styles.cicontainer}>
                  <form id='updatechannel' onSubmit={updateChannel}>
                    <div className={styles.hoverdiv}>
                      <label htmlFor="chanicon">
                          <img className={styles.chanicon} id='icon' src={icon}></img>
                          <p1 className={styles.hovertext}>Change<br></br>Image</p1>
                      </label>
                      <input type="file" id="chanicon" name="chanicon" form='updatechannel' className={styles.chaniconinput} accept="image/png, image/jpeg" onChange={(e) =>{updatePFP(e.target.files[0])}}></input>
                    </div>
                    <input type='text' id='channame' name='channame' className={styles.channame} placeholder={roomtitle} autoComplete='off'></input>
                    <textarea form="updatechannel" type="text" id="fusers" name="users" className={styles.usersinput} placeholder="Add members seperated by a comma(,)" rows={3}></textarea>
                    <button className={styles.deletechan} onClick={deleteChannel}>Delete Channel</button> 
                    <button type='submit' className={styles.savechange}>Save Changes</button> 
                  </form>
                </div>
              ) : (<div></div>)}
              <div className={styles.profile}>
                <img src={pfp} width={50} height={50} className={styles.profileimg}></img>
              </div>
                <div className={styles.roominfo}>
                  <img src="/left-arrow.png" style={{float: 'left', marginRight: 15 + 'px', marginTop: 12 + 'px'}} width={25} height={25} onClick={() => router.push('/channels')}/>
                  <img src={icon} width={50} height={50} style={{borderRadius: 50 + "%", float: 'left', marginRight: 10 + 'px', cursor: 'pointer'}} onClick={() => toggleChannelInfo(civisible)}></img>
                  <p className={styles.title} style={{margin: 0, float: 'left'}}>{roomtitle}</p><br></br>
                  <p className={styles.description} style={{margin: 0, float: 'left'}}>{description}</p>
                </div>
                <div className={styles.memberlist}>
                  <p style={{position: 'fixed', fontFamily: 'Nova_Bold', fontSize: 0.75 + 'vw'}}>Members</p>
                  <ol style={{listStyle: 'none', marginTop: 50 + 'px', padding: 0}}>
                    {members.map((member) => (
                      <li key={member[0]}>
                        <img className={styles.memberimg} src={member[1]} width={50} height={50} style={{borderRadius: 50 + "%"}}></img>
                        <p className={styles.member}>{member[0]}</p>
                      </li>
                    ))}
                  </ol>
                </div>
                <div className={styles.chatbox}>
                  <form id="textbox" style={{width: 100 + "%", height: 100 + '%'}} onSubmit={sendMessage}>
                    <div className={styles.chatboxcontainer}>
                      <input type='text' name='textbox' className={styles.textbox} placeholder="Start typing here..." autoComplete='off' autoCorrect='off'></input>
                      <button type='submit' className={styles.submit}>
                        <img src='/send.png' width={35} height={35}></img>
                      </button>
                    </div>
                  </form>
                </div>
                <div className={styles.messagebox}>
                  <ol style={{listStyle: 'none', marginTop: 'auto', paddingLeft: 5 + 'px'}}>
                    {messages.map((message) =>(
                      <li key={message.time}>
                        <div className={styles.messagecontainer}>
                          <img className={styles.messageimg} src={message.icon} width={50} height={50} style={{borderRadius: 50 + "%"}}></img>
                          {message.color === 'linear-gradient(to right, #f250b4, #31b2f7)' ? (
                          <p className={styles.membername} style={{WebkitTextFillColor: 'transparent', background: `${message.color}`, WebkitBackgroundClip: 'text', backgroundSize: (message.sender.length * 2.5) + '%'}}>{message.sender}</p>
                          ) : (
                            <p className={styles.membername} style={{color: `${message.color}`}}>{message.sender}</p>
                          )}
                          <p className={styles.time}>{formatDate(message.time)}</p>
                          <p className={styles.message}>{message.message}</p>
                        </div>
                      </li>
                    ))}
                  </ol>
                </div>
            </div>
        </main>
    </div>
  )
}

function formatDate(date){
  let currentdate = new Date(date);
  let now = new Date();
  let day;
  let month;
  let hours;
  let year = currentdate.getFullYear();
  let minutes;
  if(currentdate.getMinutes() < 10){
    minutes = `0${currentdate.getMinutes()}`;
  } else{
    minutes = `${currentdate.getMinutes()}`;
  }
  if(currentdate.getHours() < 10){
    hours = `0${currentdate.getHours()}`;
  } else{
    hours = `${currentdate.getHours()}`;
  }
  if(currentdate.getMonth() < 10){
    month = `0${currentdate.getMonth() + 1}`;
  } else{
    month = `${currentdate.getMonth() + 1}`;
  }
  if(currentdate.getDate() < 10){
    day = `0${currentdate.getDate()}`;
  } else{
    day = `${currentdate.getDate()}`;
  }
  if(now.getDate() === currentdate.getDate() && (now.getMonth() + 1) === (currentdate.getMonth() + 1) && now.getFullYear() === year){
    let dateString = `Today ${hours}:${minutes}`;
    return dateString;
  } else if((now.getDate() - 1) === currentdate.getDate() && (now.getMonth() + 1) === (currentdate.getMonth() + 1) && now.getFullYear() === year){
    let dateString = `Yesterday ${hours}:${minutes}`;
    return dateString;
  } else{
    let dateString = `${year}/${month}/${day} ${hours}:${minutes}`;
    return dateString;
  }
}
