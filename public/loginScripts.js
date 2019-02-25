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

        firebase.auth().signInWithEmailAndPassword(email, password).then(function(user) {
          $.post("https://e-vent.tech/login",{
            email : email
          }).done(function(data){
            var url = "https://e-vent.tech/Home";
            $(location).attr("href", url);
          });
        }).catch(function(error) {
          var errorCode = error.code;
          var errorMessage = error.message;
          if(error){
            alert(errorMessage);
          } 
        });
      });
    });