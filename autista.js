var user = require('./user');

class autista extends user{

  constructor(id_user, role){
    super(id_user, role);
  }

  getRole (){
    return this.role;
  }

  mieiViaggi(con, callback){

    var sql = "select evento.nome,id_viaggio, andata, ritorno, id_autista, id_evento_viaggio, id_veicolo_viaggio,count(case when conferma=1 then 1 else null end) as posti_occupati from viaggio left join partecipazione_viaggio on id_viaggio = id_viaggio_part_viag inner join evento on id_evento_viaggio=id_evento where id_autista = ? group by id_viaggio";

    var values = [

      this.id_user
      
    ];

    con.query(sql, values, function (err, result, fields) {
      callback(result,err);
    });  
  }

  rispostaMieiViaggi(result, res){
      
    if(result.length > 0){
      res.write("<table><tr><th>Nome evento </th><th>Andata</th><th>Ritorno</th><th>Posti occupati</th></tr>");
      for(var i=0; i < result.length; i++){
        res.write("<tr>");
        res.write("<td>"+result[i].nome + "</td>");
        if(result[i].andata==1)
          res.write("<td>Si</td>");
        else
           res.write("<td>No</td>");
        if(result[i].ritorno==1)
          res.write("<td>Si</td>");
        else
           res.write("<td>No</td>");
        res.write("<td>"+result[i].posti_occupati.toString()+"</td>");
        res.write("</tr>");
       
      }
       res.write("</table>");
    } else 
      res.write("Nessun viaggio in programma");

    res.end();
  }

  mieRichieste(con , callback){

    var sql = "select evento.nome,partecipazione_viaggio.id_viaggio_part_viag,partecipazione_viaggio.id_user_part_viag, viaggio.andata,viaggio.ritorno from viaggio inner join partecipazione_viaggio on viaggio.id_viaggio=partecipazione_viaggio.id_viaggio_part_viag inner join evento on evento.id_evento = viaggio.id_evento_viaggio inner join user on user.id_user = id_user_part_viag where id_user_part_viag = ?  and partecipazione_viaggio.conferma=0 group by id_viaggio_part_viag";

    var values = [

      this.id_user
      
    ];

    con.query( sql, values, function (err, result, fields) {
      callback(result,err);
    });  
  }

  rispostaMieRichieste(result, res){

    if(result.length > 0){
      res.write("<table><tr><th>Nome evento </th><th>Andata</th><th>Ritorno</th><th></th></tr>");
      for(var i=0; i < result.length; i++){
        res.write("<tr>");
        res.write("<td>"+result[i].nome + "</td>");
        if(result[i].andata==1)
          res.write("<td>Si</td>");
        else
           res.write("<td>No</td>");
        if(result[i].ritorno==1)
          res.write("<td>Si</td>");
        else
           res.write("<td>No</td>");

        res.write("<td><button class = 'partecipa' class= 'cerca' data-value1=" + result[i].id_viaggio_part_viag + " data-value2 = "+ result[i].id_user_part_viag +"> Accetta </button></td>");
        res.write("</tr>");
      }
    } else 
      res.write("Nessuna richiesta");

    res.end();
  }

  confermaRichiesta(id_user, id_viaggio, con , callback){

    var sql = "update partecipazione_viaggio set conferma = 1 where id_user_part_viag = ? and id_viaggio_part_viag = ? ";

    var values = [

      id_user,id_viaggio
      
    ];

    con.query( sql, values, function (err, result, fields) {
      callback(err);
    });  
  }

  visualizzaDettagli(id, con , callback){

    var sql = "select evento.id_evento,evento.nome,evento.descrizione,evento.provincia,evento.citta,evento.via,evento.num_civico,evento.data,count(partecipazione.id_user_partecipazione) as part from evento left join partecipazione on evento.id_evento = partecipazione.id_evento_partecipazione group by evento.id_evento having evento.id_evento = ?";
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
        res.write("<button id = 'organizza' class= 'cerca' value=" + result[i].id_evento + ">Organizza </button>");
        res.write("<button id = 'visualizzaSpons'  class= 'cerca' value=" + result[i].id_evento + ">Visualizza Sponsorizzazioni </button>");
        res.write("</tr>");
        res.write("</table>");   
      }
      res.write("</table>");
    } else 
        res.write("La ricerca non ha prodotto risultati");

    res.end();
  }

  aggiungiVeicolo(marca, modello, posti, con, callback){

    var sql = "INSERT INTO veicolo (marca, modello, posti, id_user_veicolo) VALUES ?";

    var values = [

      [marca, modello, posti, this.id_user]
      
    ];

    con.query( sql, [values] , function (err, result, fields) {
      callback(err);
    });
  }

  mieiVeicoli(con, callback){

    var sql = "SELECT * FROM veicolo WHERE id_user_veicolo = ?";

    var values = [

      [this.id_user]
      
    ];

    con.query(sql, [values], function (err, result, fields) {
      callback(result, err);
    }); 
  }

  rispostaMieiVeicoli(result, res){

    if(result.length > 0){
      res.write("<table><tr><th>Marca </th><th>Modello</th><th>Posti</th><th></th></tr>");
      for(var i=0; i < result.length; i++){
        res.write("<tr>");
        res.write("<td>"+result[i].marca + "</td>");
        res.write("<td>"+result[i].modello + "</td>");
        res.write("<td>"+"Posti: "+result[i].posti.toString()+"</td>"); 
        res.write("<td><input type='radio' class = 'veicolo' class= 'cerca' name='veicolo' value = " + result[i].id_veicolo + " checked='checked'> </td> ");
        res.write("</tr>");
      }
      res.write("</table>");
    } else 
      res.write("Nessun veicolo registrato");

    res.end();
  }
  rispostaMieiVeicoli2(result, res){

    if(result.length > 0){
      res.write("<table><tr><th>Marca </th><th>Modello</th><th>Posti</th></tr>");
      for(var i=0; i < result.length; i++){
        res.write("<tr>");
        res.write("<td>"+result[i].marca + "</td>");
        res.write("<td>"+result[i].modello + "</td>");
        res.write("<td>"+"Posti: "+result[i].posti.toString()+"</td>"); 
        res.write("</tr>");
      }
      res.write("</table>");
    } else 
      res.write("Nessun veicolo registrato");

    res.end();
  }

  aggiungiViaggio(andata, ritorno, id_evento, id_veicolo, con, callback){

    var sql = "INSERT INTO viaggio (andata, ritorno, id_autista, id_evento_viaggio, id_veicolo_viaggio) VALUES ?";

    var values =  [

      [andata, ritorno, this.id_user, id_evento, id_veicolo]

    ];

    con.query(sql, [values] , function (err, result, fields) {
      callback(err);
    });
  }
}
module.exports = autista;