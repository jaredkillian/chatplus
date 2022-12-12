import clientPromise from "../../lib/mongodb";

export default async function handler(req, res) { 
  const client = await clientPromise;
  const db = client.db("ChatAppDB");
  switch (req.method) {
    case "POST":
      let username = req.body.username;
      let namecolor = req.body.color;
      if(req.body.pfp === ''){
        let myPost = await db.collection("users").updateOne({username: `${username}`}, {$set: {nameColor: namecolor}});
        res.json(myPost);
      } else{
        let pfp = req.body.pfp;
        let myPost = await db.collection("users").updateOne({username: `${username}`}, {$set: {profilePic: pfp}});
        res.json(myPost);
      }
      break;
  }
}