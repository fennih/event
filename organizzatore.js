class organizzatore {

  constructor(id_user, role){
    console.log("svbj" + id_user);
    this.id_user = id_user;
    this.role = role;
  }

  refreshCookies(id_user, role){
    this.id_user = id_user;
    this.role = role;
  }

  getRole (){
    return this.role;
  }

  aggiungiPrezzo(descrizione, prezzo, id, con, callback){

    var sql = "INSERT INTO prezzo (prezzo.descrizione, prezzo.prezzo, prezzo.id_evento_prezzo) VALUES ?";

    var values = [

      [descrizione, prezzo, id]
      
    ];

       con.query( sql, [values] , function (err, result, fields) {
           callback(err);
       });

  }

  creaEvento(nome, descrizione, regione, provincia, citta, via, n_civico, date , con, callback) {

  var sql = "INSERT INTO evento (evento.nome, evento.descrizione, evento.regione, evento.provincia, evento.citta, evento.via, evento.num_civico, evento.data, evento.id_org_evento) VALUES ?;";

  var values = [

      [nome, descrizione, regione, provincia, citta, via, n_civico, date ,this.id_user]
      
    ];

       con.query( sql, [values] , function (err, result, fields) {
           callback(err);
       });

  }

  mieiEventi(con, callback) {

  var sql = "SELECT * FROM evento WHERE evento.id_org_evento = ?";

    con.query(sql, [this.id_user], function (err, result, fields) { 
      callback(result, err);
    });   
  }

  rispostaMieiEventi(result, res){

    if(result.length > 0){
      res.write("<table><tr><th>Nome evento </th><th>Luogo</th><th>Data</th></tr>");
      for(var i=0; i < result.length; i++){
        res.write("<tr>");
        res.write("<td>");
        res.write(result[i].nome + " ");
        res.write(result[i].descrizione + " ");
        res.write("</td>");
        res.write("<td>");
        res.write(result[i].provincia + " "); 
        res.write(result[i].citta + " "); 
        res.write(result[i].via + " "); 
        res.write(result[i].num_civico.toString() + " ");
        res.write("</td>");
        //res.write("partecipanti: "+ result[i].part.toString() + " ");
        res.write("<td>"+result[i].data.toString()+"</td>");
        res.write("</tr>");
        res.write("<tr>");
        res.write("<td>");
        res.write("<div id = add" + result[i].id_evento + ">");
        res.write("<label for='descrizione'> Descrizione </label> <p> <input type= 'text' placeholder = 'descrizione' id = 'desc" + result[i].id_evento + "'  ></p>");
        res.write("<label for='prezzo'> Prezzo </label> <p> <input type= 'number' id = 'prez" + result[i].id_evento + "' min = '0'></p>");
        res.write("<p><button value=" + result[i].id_evento + " class = 'add' id = 'but" + result[i].id_evento + "'>Conferma </button></p>");
        res.write("</div>");
        res.write("</td>");
        res.write("</tr>");
      }
      res.write("</table>");
    } else 
        res.write("Nessun evento in programma");

    res.end();
  }

  generaChiave(callback) {
    var key = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (var i = 0; i < 16; i++)
      key += possible.charAt(Math.floor(Math.random() * possible.length));

    callback(key);
  }

  inserisciChiave(con, key , callback) {

    console.log(this.id_user);
    
    var sql = "INSERT INTO chiavi_affiliazione (codice, id_organizzatore) VALUES ? ";

    var values = [

      [key, this.id_user]
      
    ];

    con.query( sql, [values], function (err, result, fields) { 
      callback(err);
    }); 
  }
}

module.exports = organizzatore;