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
var auth = firebase.auth()

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

var signUpForm = document.getElementById("signUpForm")
signUpForm.addEventListener('submit', (e) => {
    e.preventDefault();
    let email = document.getElementById("signEmail").value
    let password = document.getElementById("signPassword").value;
    auth.createUserWithEmailAndPassword(email, password)
    .then(() => {
        document.getElementsByClassName("emailHelp")[1].innerHTML = `We'll never share your email with anyone else` 
        document.getElementsByClassName("emailHelp")[1].classList.remove("message")
        document.getElementById("signInLink").click()
    })
    .catch((error)=>{
        document.getElementsByClassName("emailHelp")[1].innerHTML = `${error.message}` 
        document.getElementsByClassName("emailHelp")[1].classList.add("message")
        console.log(error.message);
    })
})

// Sign In

var loginForm = document.getElementById("loginForm")
loginForm.addEventListener('submit', (e) => {
    e.preventDefault();

    let email = document.getElementById("signMail").value
    let password = document.getElementById("loginPassword").value;

        auth.signInWithEmailAndPassword(email, password)
        .then(() => {
            document.getElementsByClassName("emailHelp")[0].innerHTML = `We'll never share your email with anyone else`  
            document.getElementsByClassName("emailHelp")[0].classList.remove("message")
            localStorage.setItem("email", email)
            location.href = location.pathname+ 'index.html'
        })
        .catch((error)=>{
            document.getElementsByClassName("emailHelp")[0].innerHTML = `${error.message}` 
            document.getElementsByClassName("emailHelp")[0].classList.add("message")
            console.log(error.message);
        })
})
