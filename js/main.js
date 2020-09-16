var r = localStorage.getItem("email");

function expand() {
    var listGroup = document.getElementById("listGroup")
    var mainGroup = document.getElementById('mainGroup')
    var filterable = document.getElementsByClassName("filterable")
    for (let i = 0; i < filterable.length; i++) {
        filterable[i].classList.remove("col-xl-2");
    }
    if(window.getComputedStyle(listGroup).display === "none"){
        mainGroup.classList.add('flex1')    
        for (let i = 0; i < filterable.length; i++) {
            filterable[i].classList.add("col-xl-2");
        }
        // console.log("add"); 
    }
}

var addBtn = document.getElementById("addList");
var listBar = document.getElementById("listBar");
var addForm = document.getElementById("addListForm")
var li = listBar.getElementsByTagName("a")
var inputList = document.getElementById("newList")


function addList () {
    addBtn.style.display = "none"    
    addForm.style.display = "block"
    inputList.focus()
}

addForm.addEventListener("submit", (e) => {
    e.preventDefault()
    inputList.value = "";
})

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

//   A U T H

auth.onAuthStateChanged((user) =>{
    if(user && user.email == r){        
        // console.log('You are in "NIGGA"' + user.email);
    }else{
        location.href = location.href.replace('index','sign');
    }
});

//     A D D   N E W   C A R D   T O   P A G E
firestore.collection(r).get().then(snapshot => {
    snapshot.forEach(item => {
        var data = item.data();//{name: 'Fanta', price:6700}
        var card = `
            <div class="col-6 col-lg-3 col-md-4 col-sm-6 mb-4 filterable">
                <div class="card">
                <img src="${data.imgUrl}" class="card-img-top" alt="...">
                <div class="card-body">
                    <h4 class="card-title">${data.name}</h4>
                    <p class="card-text h6">${data.qty} ta ${data.size} L</p>
                    <p class="card-text price">${data.price} sum</p>
                    <div class="display-flex">
                    <button type="button" onclick="remuve(this)" data-img="${data.imgUrl}" data-id="${item.id}" class="btn btn-outline-danger my-1 remuve"><i class="ti-trash"></i></button>
                    <button type="button" onclick="editModal(this)" data-img="${data.imgUrl}" data-id="${item.id}" class="btn btn-outline-warning my-1 edit" data-toggle="modal" data-target="#ModalToEdit"><i class="ti-pencil-alt"></i></button>
                    <button type="button" onclick="add(this)" data-img="${data.imgUrl}" data-id="${item.id}" class="btn btn-outline-primary add"><i class="ti-shopping-cart"></i></button>
                    </div>
                </div>
                </div>
            </div>
        `;
        document.querySelector('#mainGroup >.row').innerHTML += card;
       
    })
})
.catch(err=> console.log(err))
  
//   A D D   N E W   L I S T   T O   P A G E

firestore.collection(r + ".user").get().then(snapshot => {
    if (snapshot.size > 0) {
        snapshot.forEach(list => {
            var listData = list.data();
            var newList = `<div class="d-flex justify-content-between">
            <a onclick="calc(this)" class="list-group-item list-group-item-action d-flex"><span>${listData.beverageType}</span></a> <button onclick="remove(this)" data-id="${listData.beverageType}" class="text-danger"><i class="ti-trash"></i></button>
            </div>`
            listBar.innerHTML += newList;
    
        }) 
    } else {
        document.getElementById("sideShower").click()
    }
    
})
.catch(err=> console.log(err))

//    A D D   D A T A   T O   F I R E B A S E

function addToFirebase() {
    textToSave = inputList.value;
    var varn = document.getElementById("Warn");
   
    
    if(textToSave.includes(".")){
        varn.style.display = "block"
        
    } else {
        varn.style.display = "none"
        var setDoc = firestore.collection(r + ".user").doc(`${textToSave}`);

        setDoc.set({
            beverageType: textToSave
        }).then( () => {

                // create new linck
                listBar.innerHTML = listBar.innerHTML + `<div class="d-flex justify-content-between">
                <a onclick="calc(this)" class="list-group-item list-group-item-action d-flex"><span>${textToSave}</span></a> <button onclick="remove(this)" data-id="${textToSave}" class="text-danger"><i class="ti-trash"></i></button>
                </div>`

        }).catch((error) => {
            console.log("Error:", error);
            
        })
    }
}

// Log Out

function logOUT() {
    var c = confirm("Do you really want to LOG OUT?");
    if (c) {
        auth.signOut().then(()=>{
            console.log('user signed out');
            location.href = location.href.replace('index','sign');
        }).catch(()=>{
            console.log('error');
        })
    
    } 
}
