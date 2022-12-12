import clientPromise from "../lib/mongodb";
import Head from 'next/head';
import styles from '../styles/Home.module.css';
import { encryptWithAES} from '../lib/crypto'
import { useRouter } from "next/router";
import { defaultPFP, pfpAsDataURI } from "../lib/profile";

export default function SignUp({users}) {

    const router = useRouter();

    const focusIn = () => {
        document.getElementById("passinfo").style.opacity = "1";
        document.getElementById("leftarrow").style.opacity = "1";
    }
    
    const focusOut = () => {
        document.getElementById("passinfo").style.opacity = "0";
        document.getElementById("leftarrow").style.opacity = "0";
    }

    const handleSubmit = async (event) => {
        var passreg = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[-\!\@\#\$\.\%\&\*])(?!.*\s).{8,20}$/
        let username = event.target.username.value.toString();
        let password = event.target.password.value.toString();
        event.preventDefault();
        if(!passreg.test(password)){
            document.getElementById("fpass").style.borderBottomColor = "red";
            document.getElementById("passlabel").innerText = "Incorrect format";
            document.getElementById("passlabel").style.color = "red";
        } else{
            for(let i = 0; i < users.length; i++){
                if(users[i].username === username){
                    document.getElementById("fname").style.borderBottomColor = "red";
                    document.getElementById("namelabel").innerText = "Username taken";
                    document.getElementById("namelabel").style.color = "red";
                    break;
                }
            };
            let encPass = encryptWithAES(password);
            const obj = {
              username: `${username}`,
              password: `${encPass}`,
              nameColor: 1,
              profilePic: `${defaultPFP()}`
            }
            const res = await fetch("http://localhost:3000/api/users", {
              method: "POST",
              body: JSON.stringify(obj),
              headers: 
              {
                "Content-Type": 
                "application/json",
              },
            });
            const data = await res.json();
            console.log(data);
            if(data.acknowledged){
              document.getElementById("success").style.opacity = "1";
              setTimeout(() => {
                router.push('/login');
              }, 5000);
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
          <form id="signupform" className={styles.signupform} onSubmit={handleSubmit}>
                <label htmlFor="fname" id="namelabel" className={styles.label}>Username</label><br></br>
                <input type="text" id="fname" name="username" className={styles.nameinput}></input><br></br><br></br><br></br>
                <label htmlFor="fpass" id="passlabel" className={styles.label}>Password</label><br></br>
                <input type="password" id="fpass" name="password" className={styles.passinput} onFocus={focusIn} onBlur={focusOut}></input><br></br><br></br><br></br>
                <button type="submit" id="fsubmit" className={styles.submit}>SIGN UP</button>
            </form>
            <p1 id="success" className={styles.success}><b>Signup Success!</b><br></br>Redirecting to login page...</p1>
            <div id="leftarrow" className={styles.leftarrow}></div>
            <div id="passinfo" className={styles.passinfo}>
                <p1>
                    <b>8</b> - <b>20</b> characters<br></br>Minimum 1 <b>uppercase</b> letter<br></br>Minimum 1 <b>lowercase</b> letter<br></br>Minimum 1 <b>special</b> character<br></br>Minimum 1 <b>numerical</b> character
                </p1>
            </div>
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