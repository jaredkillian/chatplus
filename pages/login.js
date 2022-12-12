import clientPromise from "../lib/mongodb";
import Head from 'next/head';
import styles from '../styles/Home.module.css';
import { decryptWithAES} from '../lib/crypto'
import { useRouter } from "next/router";
import currentUser from "../lib/profile";

export default function Login({users}) {

    const setUsername = currentUser(state => state.setUsername)

    const router = useRouter();

    const handleLogin = async (event) =>{
        event.preventDefault();
        let username = event.target.username.value;
        let password = event.target.password.value;
        for(let i = 0; i < users.length; i++){
            if(users[i].username === username){
                let decPass = decryptWithAES(users[i].password);
                if(decPass === password){
                  setUsername(username);
                  document.getElementById("failure").style.opacity = "0";
                  router.push('/channels');
                  break;
                }else{
                  document.getElementById("failure").style.opacity = "1";
                }
            } else{
              document.getElementById("failure").style.opacity = "1";
            }
        }
    }

    return (
    <div className={styles.container}>
      <Head>
        <title>Chat+</title>
        <meta name="description" content="Simple chat app for my portfolio" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <div className={styles.chatcontainer}>
            <button className={styles.backbutton} onClick={() => router.push('/')}>
            <img src="/left-arrow.png" width={30} height={30}/>
          </button>
          <h1 className={styles.heading}>CHAT+</h1>
          <div className={styles.form}>
            <form id="loginform" className={styles.loginform} onSubmit={handleLogin}>
                <label htmlFor="fname" id="namelabel" className={styles.label}>Username</label><br></br>
                <input type="text" id="fname" name="username" className={styles.nameinput}></input><br></br><br></br><br></br>
                <label htmlFor="fpass" id="passlabel" className={styles.label}>Password</label><br></br>
                <input type="password" id="fpass" name="password" className={styles.passinput}></input><br></br><br></br><br></br>
                <button type="submit" id="fsubmit" className={styles.submit}>LOGIN</button>
            </form>
            <p1 id="failure" className={styles.failure}><b>Incorrect Login</b><br></br>Please try again</p1>
          </div>
        </div>
      </main>
    </div>
  )
}

export async function getServerSideProps(){
    try{
      const client = await clientPromise;
      const db = client.db("ChatAppDB");
      const users = await db.collection("users").find({}).toArray();
      return {props: {users: JSON.parse(JSON.stringify(users))},};
    } catch(e) {
        console.log(e)
      return {props: {title: "Error"}};
    }
}