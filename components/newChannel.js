import styles from '../styles/Enter.module.css'
import { defaultPFP } from '../lib/profile'
import currentUser from '../lib/profile';
import { SHA256 } from 'crypto-js';
import { useRouter } from 'next/router';

export default function NewChannel(){

    const apikey = process.env.API_KEY;
    const apisecret = process.env.API_SECRET;
    const router = useRouter();

    let currenticon = defaultPFP();
    const currentusername = currentUser(state => state.username);

    const updatePFP = (file) =>{
        const reader = new FileReader();
        reader.onloadend = () =>{
            let filedata = reader.result;
            currenticon = filedata;
            document.getElementById("currenticon").setAttribute("src", currenticon);
        }
        if(file instanceof Blob){
            reader.readAsDataURL(file);
        }
    }

    const createChannel = async (event) =>{
        event.preventDefault();
        let title = event.target.title.value;
        let description = event.target.description.value;
        let users = `${currentusername}, ${event.target.users.value}`;
        let file = event.target.icon.files[0];
        const id = Math.floor(Math.random() * 9999999999);
        if(title !== "" && description !== "" && users !== ""){
            const reader = new FileReader();
            let filedata;
            const formData = new FormData();
            reader.onloadend = async () =>{
                filedata = reader.result;
                formData.append("file", filedata);
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
                let userarray = users.replace(" ", "").split(",");
                let obj = {
                    title: title,
                    description: description,
                    icon: icon,
                    members: userarray,
                    admin: currentusername,
                    roomID: id
                }
                const newChan = await fetch("https://chatplus-cv.vercel.app//api/channels", {
                    method: "POST",
                    body: JSON.stringify(obj),
                    headers: {
                        "Content-Type": 
                        "application/json"
                    }
                });
                const data = await newChan.json();
                console.log(data);
                let obj2 = {
                    id: id
                }
                const messages = await fetch("https://chatplus-cv.vercel.app//api/messages", {
                    method: "POST",
                    body: JSON.stringify(obj2),
                    headers: {
                        "Content-Type": 
                        "application/json"
                    }
                });
                const mes = await messages.json();
                router.push("/channel");
            }
            if(file instanceof Blob){
                reader.readAsDataURL(file);
            }
        } else{
            document.getElementById("errormsg").style.opacity = '1';
        }
    }

    return(
        <div className={styles.newchannelcontainer}>
            <div className={styles.hoverdiv}>
                <label htmlFor="icon">
                    <img className={styles.chanicon} src={currenticon} id="currenticon" width={100 + 'vw'} height={100 + 'vw'}></img>
                    <p1 className={styles.hovertext}>Change<br></br>Image</p1>
                </label>
                <input type="file" id="icon" name="icon" form='newchannelform' className={styles.iconinput} accept="image/png, image/jpeg" onChange={(e) =>{updatePFP(e.target.files[0])}}></input>
            </div>
            <form id="newchannelform" className={styles.channelform} onSubmit={createChannel}>
                <label htmlFor="fname" id="namelabel" className={styles.label}>Title</label><br></br>
                <input type="text" id="fname" name="title" className={styles.nameinput}></input><br></br><br></br><br></br>
                <label htmlFor="fdesc" id="passlabel" className={styles.label}>Description</label><br></br>
                <input type="text" id="fdesc" name="description" className={styles.nameinput}></input><br></br><br></br><br></br>
                <label htmlFor="fusers" id="userslabel" className={styles.label}>Members</label><br></br>
                <textarea form="newchannelform" type="text" id="fusers" name="users" className={styles.usersinput} placeholder="Type the username of members seperated by a comma(,)" rows={3}></textarea><br></br><br></br><br></br>
                <button type="submit" id="fsubmit" className={styles.submit}>CREATE</button><br></br><br></br>
                <p1 className={styles.errormsg} id="errormsg">All fields must be filled</p1>
            </form>
        </div>
    )

}
