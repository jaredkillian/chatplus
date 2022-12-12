import clientPromise from "../../lib/mongodb";

export default async function handler(req, res) {
  const client = await clientPromise;
  const db = client.db("ChatAppDB");
  let id = parseInt(req.body.id);
  if(req.method === "POST"){
    if(req.body.type === "delete"){
      let myPost = await db.collection("channels").deleteOne({roomID: id});
      res.json(myPost);
    } else{
      let name = req.body.name;
      let image = req.body.image;
      let members;
      if(req.body.members === undefined){
        members = new Array();
      } else{
        members = req.body.members
      }
      let myPost = await db.collection("channels").updateOne({roomID: id}, {$set: {title: `${name}`, icon: `${image}`}});
      for(let i = 0; i < members.length; i++){
        myPost = await db.collection("channels").updateOne({roomID: id}, {$push: {members: members[i]}});
      }
      res.json(myPost);
    }
  }
}