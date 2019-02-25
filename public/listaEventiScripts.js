      $(document).ready(function(){

          $("#but").click(function(){

              var nome=$("#nome").val();
              var citta=$("#citta").val();
              var provincia=$("#provincia").val();
              var regione=$("#regione").val();
              var info=$("#info").val();
              var prezzo=$("#prezzo").val();
              var data=$("#data").val();
              var numpartecipanti=$("#numpartecipanti").val();
              var organizzatore=$("#organizzatore").val();

              if(!prezzo)
                prezzo = 1000;
             
              $.ajax({  
              type: "POST",
              url: "https://e-vent.tech/scriptEventi",  
              data: "nome="+ nome + "&citta=" + citta + "&provincia=" + provincia + "&regione=" + regione + "&info=" + info + "&prezzo=" + prezzo + "&data=" + data + "&numpartecipanti=" + numpartecipanti + "&organizzatore=" + organizzatore,
              dataType: "html",
              success: function(risposta) {
                  $("div#eventi").html(risposta); 
              },
              error: function(){
                alert("Chiamata fallita!");
              } 
            });  
          });
        

          $("#eventi").on("click", ".dettagli", function(){

              id=$(this).val();
             
              $.ajax({  
              type: "POST",
              url: "https://e-vent.tech/visualEvento",  
              data: "&id="+ id,
              dataType: "html",
              success: function(risposta) {  
                  $("div#evento").html(risposta); 
              },
              error: function(){
                alert("Chiamata fallita!");
              } 
            });

            $("div#viaggio").hide();
            $("div#richiesta_viaggi").html("");
            $("div#sponsorizzazioni").html("");
          });   

         $("#evento").on("click", ".partecipa", function(){

            id=$(this).val();
           
            $.ajax({  
            type: "POST",
            url: "https://e-vent.tech/partecipa",  
            data: "&id="+ id,
            dataType: "html",
            success: function(risposta) {  
              alert("Partecipazione aggiornata");
            },
            error: function(){
              alert("Chiamata fallita!");
            } 
          });  
        });  

        $("#evento").on("click", ".sponsorizza", function(){

             id_evento=$(this).attr("data-value1");
             id_org=$(this).attr("data-value2");
           
            $.ajax({  
              type: "POST",
              url: "https://e-vent.tech/sponsorizza",  
              data: "id_org="+ id_org + "&id_evento="+ id_evento,
              dataType: "html",
              success: function(risposta) { 
                if(risposta == "0")
                  alert("Non sei affiliato a questo organizzatore");
                else
                  alert("Sponsorizzazione aggiornata");
              },
              error: function(){
                alert("Chiamata fallita!");
              } 
          });  
        }); 

        $("#evento").on("click", "#organizza", function(){

            $.ajax({  
              type: "POST",
              url: "https://e-vent.tech/mieiVeicoli",  
              dataType: "html",
              success: function(risposta) {  
                  $("div#veicoli").html(risposta); 
              },
              error: function(){
                alert("Chiamata fallita!");
              } 
          });

          $("div#viaggio").show();
            
        }); 

        $("#viaggio").on("click", ".conferma_viaggio", function(){

          var andata, ritorno;
          var evento=$("#organizza").val();
          var veicolo= $("input[class='veicolo']:checked").val();

          if($("#andata").is(':checked'))
            andata = 1;
          else
            andata = 0;
          
          if($("#ritorno").is(':checked'))
            ritorno = 1;
          else
            ritorno = 0;

            $.ajax({  
              type: "POST",
              url: "https://e-vent.tech/aggiungiViaggio",  
              data: "andata="+ andata + "&ritorno=" + ritorno + "&evento=" + evento + "&veicolo=" + veicolo, 
              dataType: "html",
              success: function(risposta) {  
                alert("Viaggio creato");
              },
              error: function(){
                alert("Chiamata fallita!");
              } 
          });
        }); 

        $("#evento").on("click", "#richiedi", function(){

              var evento=$("#richiedi").val();
              
              $.ajax({  
              type: "POST",
              url: "https://e-vent.tech/mostraViaggi",  
              data: "evento="+ evento,
              dataType: "html",
              success: function(risposta) {  
                  $("div#richiesta_viaggi").html(risposta); 
              },
              error: function(){
                alert("Chiamata fallita!");
              } 
            });  
          });

          $("#richiesta_viaggi").on("click", "#invia_richiesta", function(){

                var viaggio=$("#invia_richiesta").val();
                $.ajax({  
                type: "POST",
                url: "https://e-vent.tech/richiediAutista",  
                data: "&viaggio="+ viaggio,
                dataType: "html",
                success: function(risposta) {  
                  alert("Richiesta effettuata");
                },
                error: function(){
                  alert("Chiamata fallita!");
                } 
              });  
            });

            $("#evento").on("click", "#visualizzaSpons", function(){

                var evento=$("#visualizzaSpons").val();

                $.ajax({  
                  type: "POST",
                  url: "https://e-vent.tech/visualizzaSpons",  
                  data: "&evento="+ evento,
                  dataType: "html",
                  success: function(risposta) {  
                     $("div#sponsorizzazioni").html(risposta); 
                  },
                  error: function(){
                    alert("Chiamata fallita!");
                  } 
                });  
            });
      });