const mysql = require("mysql");

//dati per connessione db
let db;

function initDb(host, user, password, database){

  if(!db){

    db = mysql.createConnection({
    host: host,
    user: user,
    password: password,
    database: database
  });

    db.connect(function(err) {
    if (err) 
      throw err;
    else
      console.log("connected to database");
    
    });

  } else 
      console.log("already connected to a database!");
};

function getDb(){

  if(!db)
    console.log("not connected to any database yet!");
    
    return db;
};

module.exports = {
 
 initDb,
 getDb

};