//used 24 student queries solved to scaffold the answer 
import express from 'express';
import { QueryResult } from 'pg';
import { pool, connectToDb } from './connection.js';

await connectToDb();

const PORT = process.env.PORT || 5432;
const app = express();

// Express middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const deletedRow = 2;

pool.query(
  // Change the table name to match your company_db schema
  `DELETE FROM company_db WHERE id = 50000`,
  [deletedRow],
  (err, result) => {
    if (err) {
      console.log(err);
    } else {
      console.log(`${result.rowCount} row(s) deleted!`);
    }
  }
);

pool.query(
//HERE YOU ARE USING QUERIES FROM DEPARTMENT, ROLES, AND EMPLOYEES CHANGE THE CODE TO MATCH THE CORRECT FUNCTION 
  `DELETE FROM favorite_books WHERE id = 1`,
  [deletedRow],
  (err: Error, result: QueryResult) => {
  if (err) {
    console.log(err);
  } else {
    console.log(`${result.rowCount} row(s) deleted!`);
  }
});

// Query database
pool.query('SELECT * FROM company_db, (err: Error, result: QueryResult) => {
  if (err) {
    console.log(err);
  } else if (result) {
    console.log(result.rows);
  }
);
}

// Default response for any other request (Not Found)
app.use((_req, res) => {
  res.status(404).end();
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
