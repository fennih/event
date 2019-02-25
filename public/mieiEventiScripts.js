      $(document).ready(function(){

        $.ajax({  
          type: "POST",
          url: "https://e-vent.tech/mieiEventi",  
          dataType: "html",
          success: function(risposta) {  
            $("div#eventi").html(risposta); 
          },
          error: function(){
            alert("Chiamata fallita!");
          } 
        });


        $("#eventi").on("click", ".add", function(){

          var id=$(this).val();
          var desc=$("#desc" + id).val(); 
          var prez=$("#prez" + id).val();

          if(id && desc && prez){
          
            $.ajax({ 
              type: "POST",
              url: "https://e-vent.tech/aggiungiPrezzo",  
              data: "desc="+ desc + "&prez=" + prez + "&id=" + id ,
              dataType: "html",  
              success : function(risposta){

                $('#desc' + id).val('');
                $('#prez' + id).val('');

                alert("prezzo inserito");

              },
              error: function(){
                alert("Chiamata fallita!");
              } 
            });

          }else{
              alert("Riempire i campi");
            }
        });

        $("#eventi").on("click", ".evento", function(){

              var id = $(this).val();
              var div = $("#add"+ id);
              div.show();              
        });  

      });

      $("#submit").click(function(){

          $.ajax({ 
            type: "POST",
            url: "https://e-vent.tech/generaChiave",  
            dataType: "html",  
            success : function(risposta){
              $("div#chiave").html(risposta); 
            },
            error: function(){
              alert("Chiamata fallita!");
            } 
          });

      });