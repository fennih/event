 class user {

  constructor(id_user, role) {
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

  partecipa (id_evento, con, callback) {

    var sql = "INSERT INTO partecipazione (id_user_partecipazione, id_evento_partecipazione) VALUES ?";

    var values = [

        [this.id_user, id_evento]
        
      ];

      con.query( sql, [values] , function (err, result, fields) {
          callback(err);
      });
  }

  visualizzaEventi (nome , citta , provincia , regione , info, organizzatore, prezzo, numpartecipanti, con, callback) {
    
    var sql="SELECT evento.id_evento, evento.nome, evento.descrizione, regione, provincia, evento.citta, via, num_civico, data, COUNT(partecipazione.id_user_partecipazione) as part, MIN(prezzo) as prezzo FROM evento INNER JOIN organizzatore ON organizzatore.id_org = evento.id_org_evento INNER JOIN prezzo ON prezzo.id_evento_prezzo = evento.id_evento LEFT JOIN partecipazione ON partecipazione.id_evento_partecipazione = evento.id_evento LEFT JOIN user ON user.id_user = partecipazione.id_user_partecipazione WHERE evento.nome LIKE ? AND evento.citta LIKE ? AND provincia LIKE ? AND evento.regione LIKE ? AND evento.descrizione LIKE ? AND organizzatore.nome LIKE ? GROUP BY evento.id_evento HAVING prezzo <= ? AND part >= ?";

    var values = [

      '%' + nome + '%', '%' + citta + '%', '%' + provincia +  '%', '%' + regione + '%', '%' + info + '%', '%' + organizzatore + '%', prezzo, numpartecipanti

    ];

    con.query(sql, values , function (err, result, fields) {
      callback(result, err);
    });
  }

  rispostaVisualizzaEventi (result, res){

    if(result.length > 0){
      res.write(" <table><tr><th>Nome evento </th><th>Città </th><th></th></tr>");
      for(var i=0; i < result.length; i++){
        res.write("<tr>")
        res.write("<td>" + result[i].nome + " " + "</td>");
        res.write("<td>" + result[i].citta + " " + "</td>"); 
        res.write("<td> <button class = 'dettagli' value=" + result[i].id_evento + ">Visualizza </button> </td>");
        res.write("</tr>");
      }
      res.write("</table>");
    } else 
      res.write("La ricerca non ha prodotto risultati");

    res.end();
  }

  visualizzaDettagli (id, con, callback){

    var sql = "select evento.id_evento,evento.nome,evento.descrizione,evento.provincia,evento.citta,evento.via,evento.num_civico,evento.data,count(partecipazione.id_user_partecipazione) as part from evento left join partecipazione on evento.id_evento = partecipazione.id_evento_partecipazione group by evento.id_evento having evento.id_evento = ?";
    var values = [

      id
      
    ];
    con.query( sql, values, function (err, result, fields) {
      callback(result, err);
    });      
  }

  rispostaVisualizzaDettagli (result, res){

    if(result.length > 0){
      res.write(" <table><tr><th>Nome evento </th><th>Luogo </th><th>Data</th><th>Partecipanti</th></tr>");
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
        res.write("<td>"+result[i].part.toString() + " "+"</td>");  
        res.write("</tr>");
        res.write("<table>"); 
        res.write("<tr>");
        res.write("<button class = 'partecipa' class= 'cerca' value=" + result[i].id_evento + "> Partecipa </button>");
        res.write("<button id = 'richiedi'  class= 'cerca' value=" + result[i].id_evento + ">Richiedi un autista </button>");
        res.write("<button id = 'visualizzaSpons'  class= 'cerca' value=" + result[i].id_evento + ">Visualizza Sponsorizzazioni </button>");
        res.write("</tr>");
        res.write("</table>"); 
      }
      res.write("</table>");
      
    } else 
      res.write("La ricerca non ha prodotto risultati");

    res.end();
  }

  eventiHome (con, callback){

  var sql ="SELECT * FROM evento WHERE evento.citta = (SELECT user.citta_interesse FROM user WHERE user.id_user = ?)";

  var values = [

    this.id_user

  ];

  con.query(sql, values, function (err, result, fields) {
      callback(result, err);
    });
  }

  rispostaEventiHome (result, res){

    if(result.length > 0){
      res.write(" <table><tr><th>Nome evento </th><th>Luogo </th><th>Data</th>Partecipanti</tr>");
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
        res.write("</tr>");
      }
      res.write("</table>");
    } else 
      res.write("Nessun evento nella tua città");

    res.end();

  }

  signInAut (con, callback){

    var sql ="UPDATE user SET autista = '2' WHERE id_user = ? ";

    var values = [

      this.id_user

    ];

    con.query( sql, [values] , function (err, result, fields) {
      callback(err);
    });
  }

  signInPR (con, callback){

    var sql ="UPDATE user SET autista = '3' WHERE id_user = ? ";

    var values = [

      this.id_user

    ];

    con.query( sql, [values] , function (err, result, fields) {
      callback(err);
    });
  }

  mostraViaggi (id_evento, con, callback){

    var sql = "select id_viaggio,id_autista,user.nome,cognome,marca,modello,user.tel,evento.nome,viaggio.andata,viaggio.ritorno,veicolo.posti-count(case when conferma=1 then 1 else null end) as posti_disponibili from viaggio inner join user on id_autista = id_user left join partecipazione_viaggio on viaggio.id_viaggio=partecipazione_viaggio.id_viaggio_part_viag inner join evento on evento.id_evento = viaggio.id_evento_viaggio INNER JOIN veicolo on id_veicolo_viaggio = id_veicolo where id_evento = ? group by id_viaggio having posti_disponibili>0";

    var values = [

      id_evento
      
    ];

    con.query(sql, values, function (err, result, fields) {
      callback(result, err);
    }); 
  }

  rispostaMostraViaggi (result, res){   

    if(result.length > 0){
      for(var i=0; i < result.length; i++){
        res.write(result[i].nome + " ");
        res.write(result[i].cognome + " ");
        res.write(result[i].tel.toString() + " ");
        res.write(result[i].andata.toString() + " ");
        res.write(result[i].ritorno.toString() + " ");
        res.write(result[i].marca);
        res.write(result[i].modello + " ");
        res.write("posti disponibili: " + result[i].posti_disponibili.toString());
        res.write("<button id='invia_richiesta'  class= 'cerca' value = " + result[i].id_viaggio +"> Richiedi </button>");   //non trova id_viaggio
      }
    } else 
        res.write("Nessun viaggio per questo evento");

    res.end();
  }

  richiediAutista (viaggio, con, callback){

    var sql ="INSERT INTO partecipazione_viaggio (id_user_part_viag,id_viaggio_part_viag) VALUES ?";

    var values = [

      [this.id_user,viaggio]

    ];

    con.query( sql, [values] , function (err, result, fields) {
      callback(err);
    });
  }

  visualizzaSpons(id_evento, con, callback){

    var sql = "select id_pr,nome,cognome,tel,sconto,quantità from sponsorizzazione left join prevendita on prevendita.id_sponsorizzazione = sponsorizzazione.id_sponsorizzazione inner join user on id_pr=id_user where id_evento=?";

    var values = [

      id_evento
      
    ];

    con.query(sql, values, function (err, result, fields) {
      callback(result, err);
    }); 
  }

  rispostaVisualizzaSpons(result, res){   

    if(result.length > 0){
      for(var i=0; i < result.length; i++){
        res.write(result[i].nome + " ");
        res.write(result[i].cognome + " ");
        if(result[i].sconto != null && result[i].quantità != null){
          res.write("sconto : "+result[i].sconto.toString() + " ");
          res.write("num_prevendite: "+result[i].quantità.toString() + " ");
        }
        res.write("telefono: "+result[i].tel.toString() + " <br>");
      }
    } else 
        res.write("Nessuna sponsorizzazione");

    res.end();
  }

};



module.exports = user;