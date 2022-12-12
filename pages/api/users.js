import clientPromise from "../../lib/mongodb";

export default async function handler(req, res) {
  const client = await clientPromise;
  const db = client.db("ChatAppDB");
  switch (req.method) {
    case "POST":
      let bodyObject = req.body;
      let myPost = await db.collection("users").insertOne(bodyObject);
      res.json(myPost);
      break;
    case "GET":
      const allPosts = await db.collection("users").find({}).toArray();
      res.json({ status: 200, data: allPosts });
      break;
  }
}