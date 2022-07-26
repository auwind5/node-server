import mysql from 'mysql'

export const initDBConnection = () => {
  const connection = mysql.createConnection({
    host: "localhost",
    user: "imart",
    password: "imart",
    database: "demo"
  });
  connection.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");
  });
  return connection
}