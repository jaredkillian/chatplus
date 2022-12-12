import create from 'zustand';
import {persist} from 'zustand/middleware';

const currentUser = create(persist(set =>({
    username: "",
    profilePic: "",
    nameColor: 0,
    setUsername: (name) => set(state => ({
        username: name
    })),
    setPFP: (pfp) => set(state =>({
        profilePic: pfp
    })),
    setNameColor: (color) => set(state =>({
        nameColor: color
    }))
})))

export async function pfpAsDataURI(file){
    let reader = new FileReader();
    let result = reader.readAsDataURL(file);
    return result;
}

export function defaultPFP(){
    return "https://cdn.glitch.global/e15a2c7a-9b1c-4ca0-8bfb-2388168381af/360_F_349497933_Ly4im8BDmHLaLzgyKg2f2yZOvJjBtlw5.jpg?v=1669150840544";
};

export default currentUser;