        $(document).ready(function(){

            $("#crea").click(function(){

              var nome=$("#nome").val();
              var descrizione=$("#descrizione").val();
              var regione=$("#regione").val();
              var provincia=$("#provincia").val();
              var citta=$("#citta").val();
              var via=$("#via").val();
              var n_civico=$("#n_civico").val();
              var date=$("#date").val();

              if(nome && descrizione && regione && provincia && citta && via && n_civico && date){
              
                $.ajax({  
                    type: "POST",
                    url: "https://e-vent.tech/creaEvento",  
                    data: "nome="+ nome + "&descrizione=" + descrizione + "&provincia=" + provincia + "&regione=" + regione + "&citta=" + citta + "&via=" + via + "&n_civico=" + n_civico + "&date=" + date,
                    dataType: "html",
                    success: function(risposta) {  
                        alert("Evento creato");
                    },
                    error: function(){
                      alert("Chiamata fallita!");
                    } 
                });  

            }else{

              alert("Riempire i campi");
            }
            });
        });