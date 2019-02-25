var user = require('./user');

class pr extends user{

  constructor(id_user, role){
    super(id_user, role);
  }

  getRole (){
    return this.role;
  }

  visualizzaDettagli(id, con , callback){

    var sql = "select evento.id_org_evento,evento.id_evento,evento.nome,evento.descrizione,evento.provincia,evento.citta,evento.via,evento.num_civico,evento.data,count(partecipazione.id_user_partecipazione) as part from evento left join partecipazione on evento.id_evento = partecipazione.id_evento_partecipazione group by evento.id_evento having evento.id_evento = ?";
    var values = [

      id
      
    ];

    con.query( sql, values, function (err, result, fields) {
      callback(result,err);
    });  
  }

  rispostaVisualizzaDettagli(result, res){

    if(result.length > 0){
      res.write("<table><tr><th>Nome evento </th><th>Luogo</th><th>Data</th><th>Partecipanti</th></tr>");
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
        res.write("<td>"+result[i].data.toString()+"</td>");
        res.write("<td>"+ result[i].part.toString() + " "+"</td>");  
        res.write("</tr>"); 
        res.write("</table>"); 
        res.write("<table>"); 
        res.write("<tr>");
        res.write("<button class = 'partecipa' class= 'cerca' value=" + result[i].id_evento + "> Partecipa </button>");
        res.write("<button id = 'richiedi'  class= 'cerca' value=" + result[i].id_evento + ">Richiedi un autista </button>");
        res.write("<button class = 'sponsorizza cerca' data-value1=" + result[i].id_evento + " data-value2=" + result[i].id_org_evento + ">Sponsorizza </button>");
        res.write("<button id = 'visualizzaSpons'  class= 'cerca' value=" + result[i].id_evento + ">Visualizza Sponsorizzazioni </button>");
        res.write("</tr>");
        res.write("</table>"); 
      }
    } else 
        res.write("La ricerca non ha prodotto risultati");

    res.end();
  }

  sponsorizza(id_evento, con, callback) {

  var sql = "INSERT INTO sponsorizzazione (id_pr, id_evento) VALUES ?";

  var values = [

      [this.id_user, id_evento]
      
    ];

    con.query( sql, [values] , function (err, result, fields) {
        callback(err);
    });
  }

  cercaOrganizzatori(nome, citta, con, callback){

    var sql = "SELECT * FROM organizzatore WHERE organizzatore.nome LIKE ? AND organizzatore.citta LIKE ? ";

    var values = [

      '%' + nome + '%', '%' + citta + '%'
      
    ];

    con.query( sql, values, function (err, result, fields) {
      callback(result,err);
    });  
  }

  rispostaCercaOrganizzatori(result, res){

    if(result.length > 0){
      res.write("<table><tr><th>Nome evento </th><th>Città</th><th>Key</th><th></th></tr>");
      for(var i=0; i < result.length; i++){
        res.write("<tr>");
        res.write("<td>"+result[i].nome + "</td>");
        res.write("<td>"+result[i].citta + "</td>");
        res.write("<td><input type='text' class = 'codice' class= 'cerca' placeholder = 'codice' id = 'codice" + result[i].id_org +  "'></td>");
        res.write("<td><button class = 'convalida' class= 'cerca' value=" + result[i].id_org + " placeholder = 'codice'> Convalida </button></td>");
        res.write("</tr>");
      }
      res.write("</table>");
    } else 
        res.write("La ricerca non ha prodotto risultati");

    res.end();
  }

  convalidaChiave(key ,id_org, con, callback) {
    
    var sql = "SELECT * FROM chiavi_affiliazione WHERE chiavi_affiliazione.id_organizzatore = ? AND chiavi_affiliazione.codice = ?";

    var values = [

      id_org, key
      
    ];

    con.query( sql, values, function (err, result, fields) { 
      callback(result, err);
    }); 
  }

  //spostare in pr?
  eliminaChiave(key, id_org, con, callback) {
    
    var sql = "DELETE FROM chiavi_affiliazione WHERE chiavi_affiliazione.id_organizzatore = ? AND chiavi_affiliazione.codice = ?";

    var values = [

      id_org, key
      
    ];

    con.query( sql, values, function (err, result, fields) { 
      callback(err);
    }); 
  }

  //spostare in pr
  inserisciAffiliazione( id_org, con, callback) {
    
    var sql = "INSERT INTO affiliazione (affiliazione.id_organizzatore, affiliazione.id_pr) VALUES ?";

    var values = [

      [id_org, this.id_user]
      
    ];

    con.query( sql, [values], function (err, result, fields) { 
      callback(err);
    }); 
  }

  controllaAffiliazione(id_org, con, callback) {

  console.log("pr: "+ this.id_user + "org: " + id_org);

  var sql = "SELECT * FROM affiliazione WHERE id_pr = ? AND id_organizzatore = ?";

  var values = [

    this.id_user, id_org

  ]

    con.query( sql, values, function (err, result, fields) { 
      callback(result, err);
    });   
  }

  mieSponsorizzazioni(con, callback){

    var sql = "SELECT DISTINCT evento.nome,id_sponsorizzazione from sponsorizzazione inner join evento on sponsorizzazione.id_evento = evento.id_evento where sponsorizzazione.id_pr=?";

    var values = [

      this.id_user
      
    ];

    con.query(sql, values, function (err, result, fields) {
      callback(result,err);
    });  
  }

  rispostaMieSponsorizzazioni(result, res){
      
    if(result.length > 0){
      res.write("<table>");
      for(var i=0; i < result.length; i++){
        res.write("<tr>");
        res.write("<td>"+result[i].nome + "</td>");
        res.write("</tr>");
        res.write("<tr>");
        res.write("<td><input type='number' class= 'cerca' placeholder = 'sconto' id = 'sconto" + result[i].id_sponsorizzazione +  "'></td>");
        res.write("</tr>");
        res.write("<tr>");
        res.write("<td><input type='number' class= 'cerca' placeholder = 'num_prev' id = 'quantità" + result[i].id_sponsorizzazione +  "'></td>");
        res.write("</tr>");
        res.write("<tr>");
        res.write("<td><button class = 'prevendita' class= 'cerca' value=" + result[i].id_sponsorizzazione + ">Aggiungi Prevendita </button></td>");
        res.write("</tr>");
      }
      res.write("</table>");
    } else 
      res.write("Nessun evento sponsorizzato");

    res.end();
  }

  aggiungiPrevendita(id_sponsorizzazione,sconto,quantità,con,callback){

    var sql = "INSERT INTO prevendita (id_sponsorizzazione,sconto,quantità) VALUES ?";

    var values = [

      [id_sponsorizzazione,sconto,quantità]
      
    ];

    con.query( sql, [values], function (err, result, fields) { 
      callback(err);
    }); 
  }

   mieAffiliazioni(con, callback){

    var sql = "SELECT nome,tipo,citta FROM affiliazione inner join organizzatore on id_organizzatore=id_org where id_pr=?";

    var values = [

      this.id_user
      
    ];

    con.query(sql, values, function (err, result, fields) {
      callback(result,err);
    });  
  }

  rispostaMieAffiliazioni(result, res){
      
    if(result.length > 0){
      res.write("<table><tr><th>Nome</th><th>Tipo</th><th>Città</th><th></th></tr>");
      for(var i=0; i < result.length; i++){
        res.write("<tr>");
        res.write("<td>"+result[i].nome + "</td>");
        res.write("<td>"+result[i].tipo + "</td>");
        res.write("<td>"+result[i].citta + "</td>");
        res.write("</tr>");
      }
      res.write("</table>");
    } else 
      res.write("Nessuna affiliazione");

    res.end();
  }

}



module.exports = pr;