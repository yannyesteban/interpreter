// ./mongod --dbpath /data/db --port 27018
import {MongoClient} from "mongodb"
// Replace the uri string with your connection string.
const uri = "mongodb://root:123456@127.0.0.1:27017/";
const client = new MongoClient(uri);
async function run() {
  try {
    const database = client.db('aquadb');
    const movies = database.collection('leads');
    // Query for a movie that has the title 'Back to the Future'
    const query = {  };
    const movie = await movies.findOne(query);
    console.log(movie);
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
run().catch(console.dir);