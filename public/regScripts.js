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
            var cognome=$("#cognome").val();
            var sesso= $("input[class='sesso']:checked").val();
            var tel=$("#tel").val();
            var citta_interesse=$("#citta_interesse").val();
            var username=$("#username").val();  


            if(email && password && nome && cognome && sesso && tel && citta_interesse && username){

              firebase.auth().createUserWithEmailAndPassword(email, password).then(function(user) { 
                $.post("https://e-vent.tech/signIn",{
                  email : email, nome : nome, cognome : cognome, sesso : sesso, citta_interesse : citta_interesse, tel : tel, username : username
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