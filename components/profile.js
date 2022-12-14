import { SHA256 } from "crypto-js";
import React, { useEffect, useState } from "react";
import currentUser from "../lib/profile";
import styles from "../styles/Profile.module.css"

export default function Profile(){

    const apikey = process.env.NEXT_PUBLIC_API_KEY;
    const apisecret = process.env.NEXT_PUBLIC_API_SECRET;

    const currentusername = currentUser(state => state.username);
    const currentpfp = currentUser(state => state.profilePic);
    const currentcolor = currentUser(state => state.nameColor);
    const setColor = currentUser(state => state.setNameColor);
    const setPFP = currentUser(state => state.setPFP);
    let isChecked;

    async function updateColor(val){
        const obj = {
            username: `${currentusername}`,
            color: val,
            pfp: ''
        };
        const res = await fetch("https://chatplus.vercel.app/api/updater", {
            method: "POST",
            body: JSON.stringify(obj),
            headers: 
            {
            "Content-Type": 
            "application/json",
            },
        });
    }

    const updatePFP = async (file) => {
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
            const data = await upload.json();
            let profile = data.url;
            const obj = {
                username: `${currentusername}`,
                color: `${currentcolor}`,
                pfp: `${profile}`
            };
            const res = await fetch("https://chatplus.vercel.app/api/updater", {
                method: "POST",
                body: JSON.stringify(obj),
                headers: 
                {
                "Content-Type": 
                "application/json",
                },
            });
            setPFP(data.url);
        };
        if(file instanceof Blob){
            reader.readAsDataURL(file);
        }
    }

    switch(currentcolor){
        case 1:
            isChecked = '1';
            break;
        case 2:
            isChecked = '2';
            break;
        case 3:
            isChecked = '3';
            break;
        case 4:
            isChecked = '4';
            break;
        case 5:
            isChecked = '5'
            break;
    }

    useEffect(() =>{
        var button1 = document.getElementById("1");
        var button2 = document.getElementById("2");
        var button3 = document.getElementById("3");
        var button4 = document.getElementById("4");
        var button5 = document.getElementById("5");
        if(isChecked === '1'){
            button1.checked = "true";
        } else if(isChecked === '2'){
            button2.checked = "true";
        } else if(isChecked === '3'){
            button3.checked = "true";
        } else if(isChecked === '4'){
            button4.checked = "true";
        } else if(isChecked === '5'){
            button5.checked = "true";
        }
    }, [])


    return(
        <div className={styles.profilecontainer} id="profilecontainer">
            <div className={styles.hoverdiv}>
                <label htmlFor="avatar">
                    <img className={styles.pfp} src={currentpfp} width={100 + 'vw'} height={100 + 'vw'}></img>
                    <p1 className={styles.hovertext}>Change<br></br>Image</p1>
                </label>
                <input type="file" id="avatar" className={styles.avatar} accept="image/png, image/jpeg" onChange={(e) =>{updatePFP(e.target.files[0])}}></input>
            </div>
            <p1 id="username" className={styles.username}>{currentusername}</p1>
            <p1 className={styles.namecolor}>Name color:</p1>
            <form className={styles.form}>
                <input type="radio" name="namecolor" id="1" className={styles.namecolor1} onChange={() =>{updateColor(1); setColor(1)}}></input>
                <input type="radio" name="namecolor" id="2" className={styles.namecolor2} onChange={() =>{updateColor(2); setColor(2)}}></input>
                <input type="radio" name="namecolor" id="3" className={styles.namecolor3} onChange={() =>{updateColor(3); setColor(3)}}></input>
                <input type="radio" name="namecolor" id="4" className={styles.namecolor4} onChange={() =>{updateColor(4); setColor(4)}}></input>
                <input type="radio" name="namecolor" id="5" className={styles.namecolor5} onChange={() =>{updateColor(5); setColor(5)}}></input>
            </form>
        </div>
    )

}

export const hideProfile = (val) =>{
    if(val){
        document.getElementById('profilecontainer').style.opacity = `0`;
    } else{
        document.getElementById('profilecontainer').style.opacity = `1`;
    }
}
