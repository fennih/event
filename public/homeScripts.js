$(document).ready(function() {   

          $("#esploraEventi").click(function(){
            $("#listaEventi").load("/ListaEventi.html"); 
          });

          $("#autista").click(function(){
            $("#sezioneAutista").load("/autisti"); 
          });

          $("#PR").click(function(){
            $("#sezionePR").load("/PR"); 
          });

        $.ajax({  
          type: "POST",
          url: "https://e-vent.tech/scriptHome",  
          success: function(risposta) {  
            $("div#eventiHome").html(risposta); 
          },
          error: function(){
            console.log("Chiamata fallita");
          } 
        }); 
      });