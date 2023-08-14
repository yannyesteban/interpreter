

import * as sqlite3 from "sqlite3";

let db = new sqlite3.Database('./test.db', (err) => {
    if (err) {
      return console.error(err.message);
    }
    console.log('Connected to the in-memory SQlite database.');
  });