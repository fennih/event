var user = require('./user');
var autista = require('./autista');
var pr = require('./pr');
var organizzatore  = require('./organizzatore');

function distRole(id_user, role){

  var user_module;

  if(role == 1){
    console.log("std");
    user_module = new user(id_user, role);
  }
  if(role == 2){
    console.log("aut");
    user_module = new autista(id_user, role);
  }
  if(role == 3){
    console.log("pr");
    user_module = new pr(id_user, role);
  }
  if(role == 4){
    console.log("org");
    user_module = new organizzatore(id_user, role);
  }

  return new Promise(function(resolve, reject) {

    if (user_module) {
      resolve(user_module);
    }
    else {
      reject("Missing session cookies!");
    }
  });

};

function loginUser(email, con, callback){

	var sql = 'SELECT * FROM user  WHERE email = ?'; 

	var values = [

	  email

	];

    	con.query(sql, values, function (err, result, fields) {
    		if(!err)
       	  callback(result, err);
    });
};

function loginOrg(email, con, callback){

	//tentativo login come organizzatore
	var sql = 'SELECT * FROM organizzatore  WHERE email = ?'; 

    	var values = [

    		email

  		];

    	con.query(sql, values, function (err, result, fields) {
    		if(!err)
       	  callback(result, err);
    });
};

function signInUser(nome, cognome, email, sex, citta, tel, user, pass, con, callback){

var sql = "INSERT INTO user (user.nome, user.cognome, user.email, user.sesso, user.citta_interesse, user.tel, user.username, user.password) VALUES ? ";

var values = [

  [ nome, cognome, email, sex, citta, tel, user, pass] 

];

    	con.query(sql, [values], function (err, result, fields) {
       	callback(err);
    });  

};

function signInOrg(nome, email, tipo, citta, partiva, user, pass, con, callback){

var sql = "INSERT INTO organizzatore (organizzatore.nome, organizzatore.tipo, organizzatore.citta, organizzatore.partita_iva, organizzatore.username, organizzatore.password, organizzatore.email) VALUES ? ";

var values = [

  [ nome, tipo, citta, partiva, user, pass, email] 

];

    	con.query(sql, [values], function (err, result, fields) {
       	callback(err);
    });
};

module.exports = {

	signInOrg,
	signInUser,
	loginOrg,
	loginUser,
  distRole

};