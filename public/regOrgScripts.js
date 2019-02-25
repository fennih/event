      $(document).ready(function(){ 

          var config = {
            apiKey: "AIzaSyD1W6e5OMDRB8z1Sr2YSdRYaA992meSYGA",
            authDomain: "unicam-event.firebaseapp.com",
            databaseURL: "https://unicam-event.firebaseio.com",
            storageBucket: "unicam-event.appspot.com",
          };

          firebase.initializeApp(config);

          $("#submit").click(function(){

            var email=$("#email").val();
            var password=$("#password").val();    
            var nome=$("#nome").val();
            var tipo=$("#tipo").val();
            var citta=$("#citta").val();
            var partiva=$("#partiva").val();
            var username=$("#username").val();   


            if(nome && tipo && citta && partiva && email && password && username){

              firebase.auth().createUserWithEmailAndPassword(email, password).then(function(user) { 
                    $.post("https://e-vent.tech/signInOrg",{
                      email : email, nome : nome, citta : citta, tipo : tipo, username : username, partiva : partiva
                    }).done(function(data){
                      var url = "https://e-vent.tech/FormLogin.html";
                      $(location).attr("href", url);
                    }); 
              }).catch(function(error) {
                var errorCode = error.code;
                var errorMessage = error.message;
                if(error){
                  alert(errorMessage);
                } 
              });

            }else{

              alert("Riempire i campi");
            }
          });
        });


      