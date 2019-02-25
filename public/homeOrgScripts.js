       $(document).ready(function() {   

          $("#eventiOrg").click(function(){
            $("#eventiOrgPag").load("/MieiEventi.html"); 
          });

          $("#creaEventiOrg").click(function(){
            $("#creaEventiOrgPag").load("/CreaEvento.html"); 
          });
      });