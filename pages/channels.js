import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Enter.module.css'
import currentUser from '../lib/profile'
import Profile from '../components/profile'
import NewChannel from '../components/newChannel'
import Link from 'next/link'
import { useState } from 'react'

export default function Channels({global, channels}) {

  const currentusername = currentUser(state => state.username);
  const currentpfp = currentUser(state => state.profilePic);
  const setPFP = currentUser(state => state.setPFP);
  const setNameColor = currentUser(state => state.setNameColor);

  const [username, setName] = useState(currentusername);
  const [pfp, setProfile] = useState(currentpfp);

  const [pfvisible, setpfVisible] = useState(false);

  const toggleProfile = (vis) => {
    setpfVisible(!vis);
  }

  const [ncvisible, setncVisible] = useState(false);

  const toggleNewChannel = (vis) => {
    setncVisible(!vis);
  }

  const getUserData = fetch("http://localhost:3000/api/users", {
  method: "GET",
  headers: 
  {
    "Content-Type": 
    "application/json",
  },
  }).then((response) => response.json()).then((data) =>{
    for(let i = 0; i < data.data.length; i++){
      if(data.data[i].username === username){
        let pfp = data.data[i].profilePic;
        let color = data.data[i].nameColor;
        setPFP(pfp)
        setProfile(pfp);
        setNameColor(color);
        break;
      }
    }
  })

  const currentChannels = new Array();
  let x = 0;
  for(let i = 1; i < channels.data.length; i++){
    if(channels.data[i].members.includes(username)){
      let channel = new Array();
      channel[0] = channels.data[i].title;
      channel[1] = channels.data[i].description;
      channel[2] = channels.data[i].icon;
      channel[3] = channels.data[i].roomID;
      currentChannels[x] = channel;
      x++;
    }
  }
  return (
    <div className={styles.container}>
        <Head>
            <title>Chat App</title>
            <meta name="description" content="Simple chat app for my portfolio" />
            <link rel="icon" href="/favicon.ico" />
        </Head>
        <main className={styles.main}>
            <div className={styles.chatcontainer} id="container">
                <div className={styles.header}>
                  <p style={{margin: 0}}>Welcome, <b>{username}</b></p>
                  <p style={{fontSize: 2 + 'vw', margin: 0}}>Your channels:</p>
                  <img className={styles.profileimg} src={pfp} width={40 + 'vw'} height={40+ 'vw'} onClick={() => {toggleProfile(pfvisible)}}></img>
                </div>
                {pfvisible === true ? (
                  <div>
                    <Profile></Profile>
                    <img src="/left-arrow.png" className={styles.backbutton} width={30} height={30} onClick={() => toggleProfile(pfvisible)}/>
                  </div>
                ) : (<div></div>)}
                {ncvisible === true ? (
                  <div>
                    <NewChannel></NewChannel>
                    <img src="/left-arrow.png" className={styles.backbutton2} width={30} height={30} onClick={() => toggleNewChannel(ncvisible)}/>
                  </div>
                ) : (<div></div>)}
                <div className={styles.channels}>
                  <ol style={{listStyleType: 'none'}}>
                    <li key={"global"}>
                      <div className={styles.channel}>
                        <img className={styles.icon} src={global.icon} width={50 + 'vw'} height={50 + 'vw'}></img>
                        <Link className={styles.title} href={{ pathname: '/room', query: {id: '1'} }}>{global.title}</Link>
                        <p style={{margin: 0}} className={styles.description}>{global.description}</p>
                        <img src='/right-arrow.png' width={30 + 'vw'} height={30 + 'vw'} style={{gridColumn: 3}}></img>
                      </div>
                    </li>
                    {currentChannels.map((chan) => (
                      <li key={currentChannels.index}>
                        <div className={styles.channel}>
                          <img className={styles.icon} src={chan[2]} width={50 + 'vw'} height={50 + 'vw'}></img>
                          <Link className={styles.title} href={{ pathname: '/room', query: {id: `${chan[3]}`} }}>{chan[0]}</Link>
                          <p style={{margin: 0}} className={styles.description}>{chan[1]}</p>
                          <img src='/right-arrow.png' width={30 + 'vw'} height={30 + 'vw'} style={{gridColumn: 3}}></img>
                        </div>
                      </li>
                    ))}
                    <li key={"newChan"}>
                      <div className={styles.channel} onClick={() => {toggleNewChannel(ncvisible)}}>
                        <img className={styles.icon} src='/plus.png' width={50 + 'vw'} height={50 + 'vw'}></img>
                        <p className={styles.title} style={{paddingTop: 1 + 'vh', margin: 0}}>New Channel </p><br></br>
                      </div>
                    </li>
                  </ol>
                </div>
            </div>
        </main>
    </div>
  )
}

export async function getServerSideProps(){
  try{
    const channels = await fetch("http://localhost:3000/api/channels", {
      method: "GET",
      headers: 
      {
        "Content-Type": 
        "application/json",
      },
    })
    const data = await channels.json();
    const global = data.data[0];
    return {props: {global: JSON.parse(JSON.stringify(global)), channels: JSON.parse(JSON.stringify(data))}}; 
  } catch(err){
    console.log(err);
    return {props: {title: "Error"}};
  }
}