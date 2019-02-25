$(document).ready(function(){

          $.ajax({  
              type: "POST",
              url: "https://e-vent.tech/mieSponsorizzazioni",  
              dataType: "html",
              success: function(risposta) {  
                  $("div#sponsorizzazioni").html(risposta); 
              },
              error: function(){
                alert("Chiamata fallita!");
              } 
          });
         
          $.ajax({  
              type: "POST",
              url: "https://e-vent.tech/mieAffiliazioni",  
              dataType: "html",
              success: function(risposta) {  
                  $("div#affiliazioni").html(risposta); 
              },
              error: function(){
                alert("Chiamata fallita!");
              } 
          });


        $("#submit").click(function(){

          var nome=$("#nome").val();
          var citta=$("#citta").val();

          $.ajax({  
            type: "POST",
            url: "https://e-vent.tech/cercaOrganizzatori",  
            data: "nome="+ nome + "&citta=" + citta, 
            dataType: "html",
            success: function(risposta) {
              $("div#organizzatori").html(risposta); 
            },
            error: function(){
              alert("Chiamata fallita!");
            } 
          });
        });

        $("#organizzatori").on("click", ".convalida", function(){

          var id_org=$(this).val();
          var codice=$("#codice" + id_org).val();

          $.ajax({  
            type: "POST",
            url: "https://e-vent.tech/convalidaChiave",  
            data: "id_org="+ id_org + "&codice=" + codice, 
            dataType: "html",
            success: function(risposta) {
              if(risposta === "0")
                alert("Chiave non valida");
              else
                alert("Affiliazione completata");
            },
            error: function(){
              alert("Chiamata fallita!");
            } 
          });
        });

        $("#sponsorizzazioni").on("click", ".prevendita", function(){

          var id_sponsorizzazione = $(this).val();
          var sconto=$("#sconto" + id_sponsorizzazione).val();
          var quantità=$("#quantità" + id_sponsorizzazione).val();

          alert(sconto);

          if(sconto && quantità){
            

            $.ajax({  
              type: "POST",
              url: "https://e-vent.tech/aggiungiPrevendita",  
              data: "id_sponsorizzazione="+ id_sponsorizzazione + "&sconto=" + sconto +"&quantità=" + quantità,
              dataType: "html",
              success: function(risposta) {
                alert("Prevendita aggiunta");
              },
              error: function(){
                alert("Chiamata fallita!");
              } 
            });
          }else{

            alert("Inserire i campi");
          }
        });

      });