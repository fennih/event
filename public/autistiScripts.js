      $(document).ready(function(){

              $.ajax({  
                type: "POST",
                url: "https://e-vent.tech/mieiViaggi",  
                dataType: "html",
                success: function(risposta) {  
                    $("div#viaggi").html(risposta); 
                },
                error: function(){
                  alert("Chiamata fallita!");
                } 
              });

          $.ajax({  
              type: "POST",
              url: "https://e-vent.tech/mieiVeicoli2",  
              dataType: "html",
              success: function(risposta) {  
                  $("div#veicoli").html(risposta); 
              },
              error: function(){
                alert("Chiamata fallita!");
              } 
          });

          $.ajax({  
              type: "POST",
              url: "https://e-vent.tech/richiesteViaggi",  
              dataType: "html",
              success: function(risposta) {  
                  $("div#richieste").html(risposta); 
              },
              error: function(){
                alert("Chiamata fallita!");
              } 
          });

      $("#but").click(function(){

              var marca, modello, posti;

                marca=$("#marca").val();
                modello=$("#modello").val();
                posti=$("#n_posti").val();

                if(marca && modello && posti){

                $.ajax({  
                  type: "POST",
                  url: "https://e-vent.tech/aggiungiVeicolo",  
                  data: "marca="+ marca + "&modello=" + modello + "&posti=" + posti, 
                  dataType: "html",
                  success: function(risposta) {
                    alert("Veicolo aggiunto");  
                  },
                  error: function(){
                    alert("Chiamata fallita!");
                  } 
                });
            }else{

              alert("Riempire i campi");
            }
        });

        $("#richieste").on("click", ".partecipa", function(){

              var id_user,id_viaggio;

              id_user=$(this).attr("data-value2");
              id_viaggio=$(this).attr("data-value1");

              $.ajax({  
              type: "POST",
              url: "https://e-vent.tech/confermaRichiesta",  
              data: "id_user="+ id_user + "&id_viaggio=" + id_viaggio, 
              dataType: "html",
              success: function(risposta) {  
                alert("Richiesta accettata");
              },
              error: function(){
                alert("Chiamata fallita!");
              } 
          });

        });
    });