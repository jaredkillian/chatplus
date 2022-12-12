import clientPromise from "../../lib/mongodb";

export default async function handler(req, res) {
  const client = await clientPromise;
  const db = client.db("ChatAppDB");
  switch (req.method) {
    case "POST":
      let id = req.body.id;
      if(req.body.sender !== undefined){
        let sender = req.body.sender;
        let message = req.body.message;
        let icon = req.body.icon;
        let color = req.body.color;
        let myPost = await db.collection("messages").updateOne({roomID: `${id}`}, {$push: {messages: {sender: sender, message: message, time: new Date(), icon: icon, color: color}}});
        res.json(myPost);
      } else{
        let myPost = await db.collection("messages").insertOne({roomID: `${id}`, messages: new Array()});
        res.json(myPost);
      }
      break;
    case "GET":
      const allPosts = await db.collection("messages").find({}).toArray();
      res.json({ status: 200, data: allPosts });
      break;
  }
}