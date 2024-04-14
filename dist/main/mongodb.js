var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
// ./mongod --dbpath /data/db --port 27018
import { MongoClient } from "mongodb";
// Replace the uri string with your connection string.
const uri = "mongodb://root:123456@127.0.0.1:27017/";
const client = new MongoClient(uri);
function run() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const database = client.db('aquadb');
            const movies = database.collection('leads');
            // Query for a movie that has the title 'Back to the Future'
            const query = {};
            const movie = yield movies.findOne(query);
            console.log(movie);
        }
        finally {
            // Ensures that the client will close when you finish/error
            yield client.close();
        }
    });
}
run().catch(console.dir);
//# sourceMappingURL=mongodb.js.map