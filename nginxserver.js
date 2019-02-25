const express = require("express");
const bodyParser = require("body-parser");
const session = require("express-session");

var user = require('./user');
var autista = require('./autista');
var pr = require('./pr');
var organizzatore  = require('./organizzatore');
var tools = require('./tools');
const db = require("./db");
const app = express();

app.use(session({
  secret: "cookie_secret",
  resave: true,
  saveUninitialized: true
}));

//variabile per mantenere i dati di sessione
var user_module;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//percorso per gli elementi non accedibili dalla cartella public
var percorso = '/root/event/';

app.use(express.static('public'));

db.initDb("localhost", "root", "cantalf12", "event");

con = db.getDb();

//route default
app.all('/index', function(req,res){
    
   var sess = req.session;

   if(sess.id_user)
    res.redirect('/Home');
   else
    res.redirect('FormLogin.html');
});

//redirect alla home del sito
app.all('/Home', function(req, res){

    var sess = req.session;
    tools.distRole(sess.id_user, sess.role).then(function(result){
      if(result.getRole() == 4)
        res.redirect('FormHomeOrg.html')
      else 
        res.redirect('FormHome.html');
    }).catch(function(error){

      console.log( error);
      res.redirect('/offline.html');

    });
});

//script login come utente standard o organizzatore
app.post('/login', function(req, res){

  var sess = req.session;
  sess.role;//role serve a distinguere il tipo di utente (standard, autista, organizzatore)
  sess.id_user;

  //tentativo login come user (standard o autista)
  tools.loginUser(req.body.email, con, function(result, err){
    if(result.length > 0){
      sess.id_user = result[0].id_user.toString();
      sess.role = result[0].autista.toString();

      console.log("logged as " + sess.role);
      res.redirect('/Home');
    }
    else {
      //in caso di fallimento tento il login come organizzatore
      tools.loginOrg(req.body.email, con, function(result, err){
        if(result.length > 0){
          sess.id_user = result[0].id_org.toString();
          sess.role = 4;
          console.log("logged as " + 4);
          res.redirect('/Home');
        }
      });
    }
  });
});

//script logout
app.all('/logout',function(req,res){  

    req.session.destroy(function(err){  
        if(err)
          console.log(err);  
        else  
          res.redirect('FormLogin.html');  
    });  
});

//script per permettere ad uno user di diventare autista
app.post('/signInAut', function(req, res){

  var sess=req.session;

  var user_module = new user(sess.id_user, sess.role);

  user_module.signInAut(con, function(err){

    if(err)
      console.log("error");
    else{
      sess.role = 2;
      res.redirect("FormHome.html");
      console.log("success");
    }
  });
});

//script per permettere ad uno user di diventare autista
app.all('/signInPR', function(req, res){

  var sess=req.session;
  var user_module = new user(sess.id_user, sess.role);

  user_module.signInPR(con, function(err){

    if(err)
      console.log("error");
    else{
      sess.role = 3;
      res.redirect("FormHome.html");
      console.log("success");
    }
  });
});

//script per la registrazione come organizzatore
app.post('/signInOrg', function(req, res){

    tools.signInOrg(req.body.nome, req.body.email, req.body.tipo, req.body.citta, req.body.partiva, req.body.username, con, function(err){

    if (err){ 
      res.redirect('FormRegOrg.html');
      console.log("signin failed");
    }
    else {
      res.redirect('FormLogin.html');
      console.log("succesfully signed in");
    }
  });
});

//script per la registrazione come utente
app.post('/signIn', function(req, res){
 
    tools.signInUser(req.body.nome, req.body.cognome, req.body.email, req.body.sesso, req.body.citta_interesse, req.body.tel, req.body.username, con, function(err){

      if (err){ 
        throw err;
        console.log("signin failed");
      }
      else {
        console.log("succesfully signed in");
      }
    });

    res.end();
});

//script creazione eventi da parte dell'organizzatore
app.post('/creaEvento', function(req, res){

    var sess=req.session;
    var user_module = new organizzatore(sess.id_user, sess.role);

    user_module.creaEvento(req.body.nome, req.body.descrizione, req.body.regione, req.body.provincia, req.body.citta, req.body.via, req.body.n_civico, req.body.date , con, function(err){

        if(err){
          console.log("error");
        }
        else{
          res.redirect("MieiEventi.html");
          console.log("event succesfully added");
        }
    });
});

//script per visualizzare/filtrare gli eventi da parte dell'utente
app.post('/scriptEventi', function(req, res){
    var sess=req.session;

    tools.distRole(sess.id_user, sess.role).then(function(result_user){

      if(result_user)
        console.log(result_user);

      result_user.visualizzaEventi(req.body.nome , req.body.citta , req.body.provincia , req.body.regione , req.body.info, req.body.organizzatore, req.body.prezzo, req.body.numpartecipanti, con, function(result, err){

        if(err)
          console.log("error");
        else{
          result_user.rispostaVisualizzaEventi(result, res);
          console.log("succesgs");
        }
      });

      }).catch(function(error){

        console.log(error);
        res.redirect('/offline.html');
    });
});

//script query home (query da modificare)
app.post('/scriptHome', function(req, res){

  var sess=req.session;
  tools.distRole(sess.id_user, sess.role).then(function(result_user){

    result_user.eventiHome(con, function(result, err){

      if(err)
        console.log("error");
      else{
        result_user.rispostaEventiHome(result, res);
        console.log("success");
      }
    });
  }).catch(function(error){

      console.log( error);
      res.redirect('/offline.html');

    });
}); 

//script per la visualizzazione dettagli del singolo evento da parte dell'utente
app.post('/visualEvento', function(req, res){

    var sess=req.session;
    tools.distRole(sess.id_user, sess.role).then(function(result_user){

      result_user.visualizzaDettagli(req.body.id, con, function(result, err){

        if(err)
          console.log("error");
        else{
          result_user.rispostaVisualizzaDettagli(result, res);
          console.log("success");
        }

      });
    }).catch(function(error){

        console.log( error);
        res.redirect('/offline.html');

      });
});

//script per la visualizzazione degli eventi creati dall'organizzatore loggato
app.post('/mieiEventi', function(req, res){

  var sess=req.session;
  var user_module = new organizzatore(sess.id_user, sess.role);

  user_module.mieiEventi(con, function(result, err){

    if(err)
      console.log("error");
    else{
      user_module.rispostaMieiEventi(result, res);
      console.log("success");
    }

  });  
});

//script per permettere all'organizzatore loggato di aggiungere prezzi ad un suo evento
app.post('/aggiungiPrezzo', function(req, res){

    var sess=req.session;
    var user_module = new organizzatore(sess.id_user, sess.role);
    
    user_module.aggiungiPrezzo(req.body.desc, req.body.prez, req.body.id, con, function(err){

      if(err)
        console.log("error");
      else
        console.log("success");

    });
    res.end();
});

//script per permettere all'utente di partecipare ad un evento
app.post('/partecipa', function(req, res){

    var sess=req.session;
    tools.distRole(sess.id_user, sess.role).then(function(result_user){

      result_user.partecipa(req.body.id, con, function(err){

        if(err)
          console.log("error");
        else
          console.log("success");
      });
      
    }).catch(function(error){

      console.log( error);
      res.redirect('/offline.html');

    });
    res.end();
});

//script per permettere all'utente di partecipare ad un evento
app.post('/sponsorizza', function(req, res){

    var sess=req.session;
    var user_module = new pr(sess.id_user, sess.role);

    user_module.controllaAffiliazione(req.body.id_org, con, function(result, err){

      if(err){
        console.log("error");
      } 
      else {
        if(result.length == 1){

          user_module.sponsorizza(req.body.id_evento, con, function(err){

            if(err){
              console.log("error");
            }
            else
              console.log("success");
          });
        }
        else {
          console.log("non affiliato");
          res.write("0");
        }
      }
    });
    res.end();
});

app.post('/MieiViaggi', function(req, res){

  var sess=req.session;
  var user_module = new autista(sess.id_user, sess.role);

  user_module.mieiViaggi(con, function(result, err){

      if(err)
        console.log("error");
      else{
        console.log("success");
        user_module.rispostaMieiViaggi(result, res);
      }
  });
});

app.post('/richiesteViaggi', function(req, res){

  var sess=req.session;
  var user_module = new autista(sess.id_user, sess.role);

  user_module.mieRichieste(con, function(result, err){

      if(err)
        console.log("error");
      else{                
        console.log("success");
        user_module.rispostaMieRichieste(result, res);
      }
  });
});

app.post('/mieiVeicoli2', function(req, res){

  var sess=req.session;
  var user_module = new autista(sess.id_user, sess.role);

  user_module.mieiVeicoli(con, function(result, err){

    if(err)
      console.log("error");
    else{
      console.log("success");
      user_module.rispostaMieiVeicoli2(result, res);
    }
  });
});

app.post('/mieiVeicoli', function(req, res){

  var sess=req.session;
  var user_module = new autista(sess.id_user, sess.role);

  user_module.mieiVeicoli(con, function(result, err){

    if(err)
      console.log("error");
    else{
      console.log("success");
      user_module.rispostaMieiVeicoli(result, res);
    }
  });
});

app.post('/aggiungiViaggio', function(req, res){

  var sess=req.session;
  var user_module = new autista(sess.id_user, sess.role);

  user_module.aggiungiViaggio(req.body.andata, req.body.ritorno,req.body.evento, req.body.veicolo, con, function(err){

    if(err)
      console.log("error");
    else
      console.log("success");

    res.end();
  });
});

app.post('/aggiungiVeicolo', function(req, res){

  var sess=req.session;
  var user_module = new autista(sess.id_user, sess.role);

  user_module.aggiungiVeicolo(req.body.marca, req.body.modello, req.body.posti, con, function(err){

    if(err)
      console.log("error");
    else
      console.log("success");

  });
  res.end();
});

app.post('/mostraViaggi', function(req, res){

  var sess=req.session;
  tools.distRole(sess.id_user, sess.role).then(function(user_module){

    user_module.mostraViaggi(req.body.evento, con, function(result, err){

      if(err){
        console.log("error");
      }
      else{
        user_module.rispostaMostraViaggi(result, res);
        console.log("success");
      }
    });
  }).catch(function(error){

      console.log( error);
      res.redirect('/offline.html');

    });
});


app.post('/richiediAutista', function(req, res){

    var sess=req.session;
    tools.distRole(sess.id_user, sess.role).then(function(result){

      result.richiediAutista(req.body.viaggio , con, function(err){
   
        if(err){
          console.log("error");
        }
        else
          console.log("success");

      });
    }).catch(function(error){

        console.log( error);
        res.redirect('/offline.html');

      }); 
  res.end();
});

app.post('/confermaRichiesta', function(req, res){

    var sess=req.session;
    var user_module = new autista(sess.id_user, sess.role);

    user_module.confermaRichiesta(req.body.id_user, req.body.id_viaggio , con, function(err){

    if(err){
      console.log("error");
    }
    else
      console.log("success");

  });
  res.end();
});

app.all('/autisti', function(req, res){

  var sess=req.session;
  tools.distRole(sess.id_user, sess.role).then(function(result){

    if(result.getRole() == 2)
      res.redirect("MieiViaggi.html");
    else
      res.redirect("FormRegAut.html");
    
  }).catch(function(error){

      console.log( error);
      res.redirect('/offline.html');

  });
});

app.all('/PR', function(req, res){

  var sess=req.session;
  tools.distRole(sess.id_user, sess.role).then(function(result){

    if(result.getRole() == 3)
      res.redirect("Pr.html");
    else
      res.redirect("FormRegPR.html");
    
  }).catch(function(){

    console.log( error);
    res.redirect('/offline.html');

  });
});

app.post('/cercaOrganizzatori', function(req, res){

  var sess=req.session;
  var user_module = new pr(sess.id_user, sess.role);

  user_module.cercaOrganizzatori(req.body.nome, req.body.citta, con, function(result, err){

    if(err){
      console.log("error");
    }
    else{
      user_module.rispostaCercaOrganizzatori(result, res);
      console.log("success");
    }
  });
});

app.post('/convalidaChiave', function(req, res){

  var sess=req.session;
  var user_module = new pr(sess.id_user, sess.role);

  user_module.convalidaChiave(req.body.codice, req.body.id_org, con, function(result, err){

    if(err){
      console.log("error");
    }
    else{
      if(result.length === 1){
        user_module.eliminaChiave(req.body.codice ,req.body.id_org, con, function(err){
          if(err){
            console.log("error");
          }
          else{
            user_module.inserisciAffiliazione(req.body.id_org, con, function(err){
              if(err){
                console.log("error");
              }
            });
          }
        });
      } else {
        res.write("0");
        console.log("chiave non valida");
      }
    }
  });
  res.end();
});

app.post('/generaChiave', function(req, res){

  var sess=req.session;
  var user_module = new organizzatore(sess.id_user, sess.role);

  user_module.generaChiave(function(key){

    res.write(key);
    res.end();

    user_module.inserisciChiave(con, key, function(err){

    if(err){
      console.log("error");
    }
    else
      console.log("succes");

    });
  });
});

app.post('/mieSponsorizzazioni', function(req, res){

  var sess=req.session;
  var user_module = new pr(sess.id_user, sess.role);

  user_module.mieSponsorizzazioni(con, function(result, err){

      if(err)
        console.log("error");
      else{
        console.log("success");
        user_module.rispostaMieSponsorizzazioni(result, res);
      }
  });
});

app.post('/aggiungiPrevendita', function(req, res){

  var sess=req.session;
  var user_module = new pr(sess.id_user, sess.role);

  user_module.aggiungiPrevendita(req.body.id_sponsorizzazione, req.body.sconto, req.body.quantità, con, function(err){

    if(err){
      console.log("error");
    }
    else
      console.log("success");

  });
  res.end();
});

app.post('/visualizzaSpons', function(req, res){

  var sess=req.session;
  tools.distRole(sess.id_user, sess.role).then(function(result_user){

      result_user.visualizzaSpons(req.body.evento, con, function(result, err){

        if(err){
          console.log("error");
        }
        else{
          result_user.rispostaVisualizzaSpons(result, res);
          console.log("success");
        }
      });
  }).catch(function(error){

        console.log( error);
        res.redirect('/offline.html');

  });
});

app.post('/mieAffiliazioni', function(req, res){

  var sess=req.session;
  var user_module = new pr(sess.id_user, sess.role);

  user_module.mieAffiliazioni(con, function(result, err){

      if(err)
        console.log("error");
      else{
        console.log("success");
        user_module.rispostaMieAffiliazioni(result, res);
      }
  });
});

//redirect service worker installer
app.all('/swinstaller', function(req, res){

  res.sendFile(percorso + 'swinstaller.js');

});

//redirect service worker installer
app.all('/manifest', function(req, res){

  res.sendFile(percorso + 'manifest.json');

});

//redirect service worker
app.all('/sw', function(req, res){

	res.sendFile(percorso + 'sw.js');

});

//server start
app.listen(8080, '10.16.0.5', function(){

	console.log("server running");

});


