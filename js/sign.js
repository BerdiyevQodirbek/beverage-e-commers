// <<<<<<<<<<<<<<<<<<<<<<<<<<<<  F I R E B A S E >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

  // Your web app's Firebase configuration
  var firebaseConfig = {
    apiKey: "AIzaSyANa57oLK9jZTfDTm6CMmeZs-VquG3p2Rc",
    authDomain: "beveragefirebase.firebaseapp.com",
    databaseURL: "https://beveragefirebase.firebaseio.com",
    projectId: "beveragefirebase",
    storageBucket: "beveragefirebase.appspot.com",
    messagingSenderId: "715061288442",
    appId: "1:715061288442:web:d76b29e73347b0ee965843",
    measurementId: "G-SLMM54B26R"
  };
  // Initialize Firebase    
  
firebase.initializeApp(firebaseConfig);
var firestore = firebase.firestore();

//    Storage reference
var storage = firebase.storage();
var storageRef = storage.ref();


//   O F F L I N E   A C C E S S 
 
firebase.firestore().enablePersistence()
  .catch(function(err) {
      if (err.code == 'failed-precondition') {
          // Multiple tabs open, persistence can only be enabled
          // in one tab at a a time.
          // ...
      } else if (err.code == 'unimplemented') {
          // The current browser does not support all of the
          // features required to enable persistence
          // ...
      }
  });
  
// Sign Up


function signUp(el) {
    var signName = document.getElementById("signName");
    var signEmail = document.getElementById("signEmail");
    var signPassword = document.getElementById("signPassword");
    var signTel = document.getElementById("signTel");
    var reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
    if (signName.value == "") {
        el.innerText = "Entir your Name"
        signName.focus()
    } else if (reg.test(signEmail.value) == false) {
        el.innerText = "Invalid EMail";
        signEmail.focus()
        return false;
    } else if(signPassword.value == "") {
        el.innerText = "Entir your Pssword"
        signPassword.focus()
    } else if(signTel.value.length < 7) {
        el.innerText = "Entir your Tel"
        signTel.focus()
    } else {
        firestore.collection("users").doc(signEmail.value)
        .set({
            name: signName.value,
            email: signEmail.value,
            password: signPassword.value,
            tel: signTel.value
        })
        .then(() => {
            el.innerText= "Sign Up"
            document.getElementById("signInLink").click()
        })
        .catch((error) => {
            console.log(error);
        })
    }
}

// Sign In


function login(el) {
    var signMail = document.getElementsByName("signMail")[0]
    var psw = document.getElementById("loginPassword")
    if (signMail.value == "") {
        el.innerText = "Entir your Mail"
        signMail.focus()
    } else if(psw.value == "") {
        el.innerText = "Entir your Password"
        psw.focus()
    } else {
        el.innerText= "Login"
        firestore.collection("users").get().then( users => {
            users.forEach( user => {
                if (user == null) {
                    console.log("no file");
                } else {
                var data = user.data()
                if(data.email == signMail.value) {
                    localStorage.setItem("email", signMail.value)
                    if (data.password == psw.value) {
                        signMail.value = ""
                        psw.value = ""
                        document.getElementById("MainHTML").click()
                    } else {
                        el.innerText = "Wrong Password"
                    }
                } else {
                    document.getElementById("signUpLink").click()
                }
                }
                
            })
        })
        .catch((error) => {
            console.log(error);
        })
    }
}