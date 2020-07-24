function expand() {
    var listGroup = document.getElementById("listGroup")
    var mainGroup = document.getElementById('mainGroup')

    if(window.getComputedStyle(listGroup).display === "none"){
        mainGroup.classList.add('flex1')    
        
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
  

//     A D D   N E W   C A R D   T O   P A G E


firestore.collection('Beverage').get().then(snapshot => {
    
    snapshot.forEach(item => {
        const data = item.data();//{name: 'Fanta', price:6700}
        const card = `
            <div class="col-6 col-xl-2 col-lg-3 col-md-4 col-sm-6 mb-4 filterable">
                <div class="card">
                <img src="${data.imgUrl}" class="card-img-top" alt="...">
                <div class="card-body">
                    <h5 class="card-title">${data.name}</h5>
                    <p class="card-text h6">${data.qty} ta ${data.size} L</p>
                    <p class="card-text">${data.price} sum</p>
                    <div class="display-flex">
                    <button type="button" onclick="remuve(this)" data-img="${data.imgUrl}" data-id="${item.id}" class="btn btn-outline-danger my-1 remuve"><i class="ti-trash"></i></button>
                    <button onclick="editModal(this)" type="button" data-img="${data.imgUrl}" data-id="${item.id}" class="btn btn-outline-warning my-1 edit" data-toggle="modal" data-target="#ModalToEdit"><i class="ti-pencil-alt"></i></button>
                    <button type="button" class="btn btn-outline-primary">Buy</button>
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

firestore.collection("BeverageCommon").get().then(snapshot => {
    snapshot.forEach(list => {
        const listData = list.data();
        const newList = `<div class="d-flex justify-content-between">
        <a onclick="calc(this)" class="list-group-item list-group-item-action d-flex"><span>${listData.beverageType}</span></a> <button onclick="remove(this)" data-id="${listData.beverageType}" class="text-danger"><i class="ti-trash"></i></button>
        </div>`
        listBar.innerHTML += newList;

    })
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
        var setDoc = firestore.collection("BeverageCommon").doc(`${textToSave}`);

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

// add new card to Tab-pane


