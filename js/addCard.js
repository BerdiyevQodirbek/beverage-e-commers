

var firestore = firebase.firestore();

//    Storage reference
var storage = firebase.storage();
var storageRef = storage.ref();


function addCard(el) {
  var newName =document.getElementById("newName").value;
  var newPrice =document.getElementById("newPrice").value;
  var newImgFile =document.getElementById("newImgFile").files[0];
  var newSize = document.getElementById("typeOfSize").value;
  var quantity = document.getElementById("newQuanty").value;
  var modalWarn = document.getElementById("modalWarning")
  var updatedAt = newName + Date.now();
  modalWarn.innerText = ""
  
  if (newName == "") {
    modalWarn.innerText = 'Entir the "name!"'
  } else if(newPrice == "") {
    modalWarn.innerText = 'Enter the "price"'
  } else if(quantity == "" || quantity == "0") {
    modalWarn.innerText = 'Enter the "quantity"'
  }else if(newImgFile == undefined) {
    el.innerHTML = `
    <div class="spinner-border text-primary" role="status">
      <span class="sr-only">Loading...</span>
    </div>`
        var setDoc = firestore.collection(r).doc(updatedAt)
        const imgUrl= "https://cdn.pixabay.com/photo/2019/02/09/10/14/tin-can-3984776_1280.jpg";
        setDoc.set({
          name: newName,
          price: newPrice,
          size: newSize,
          imgUrl,
          dataDocName: updatedAt,
          qty: quantity
        }).then(() => {
          const card = `
              <div class="col-6 col-xl-2 col-lg-3 col-md-4 col-sm-6 mb-4 filterable">
                  <div class="card">
                  <img src="${imgUrl}" class="card-img-top" alt="...">
                  <div class="card-body">
                      <h4 class="card-title">${newName}</h4>
                      <p class="card-text h6">${quantity} ta ${newSize} L</p>
                      <p class="card-text price">${newPrice} sum</p>
                      <div class="display-flex">
                      <button type="button" onclick="remuve(this)" data-img="${imgUrl}" data-id="${updatedAt}" class="btn btn-outline-danger my-1 remuve"><i class="ti-trash"></i></button>
                      <button type="button" onclick="editModal(this)" data-img="${imgUrl}" data-id="${updatedAt}" class="btn btn-outline-warning my-1 edit" data-toggle="modal" data-target="#ModalToEdit"><i class="ti-pencil-alt"></i></button>
                      <button type="button" onclick="add(this)" data-img="${imgUrl}" data-id="${updatedAt}" class="btn btn-outline-primary add">Add to cart</button>
                      </div>
                  </div>
                  </div>
              </div>
          `;
          document.querySelector('#mainGroup >.row').innerHTML += card;
          document.getElementById("newName").value = "";
          document.getElementById("newPrice").value = "";
          document.getElementById("newImgFile").value = "";
          document.getElementById("newQuanty").value = "";
          el.innerHTML = "Add"
          document.getElementById('modal-close').click();//hide modal
        })
        .catch((error) => {
          console.log(error);
        })
   
  }else {
    el.innerHTML = `
    <div class="spinner-border text-primary" role="status">
      <span class="sr-only">Loading...</span>
    </div>`
    storageRef.child(updatedAt).put(newImgFile).then(() => {
      storageRef.child(updatedAt).getDownloadURL().then((imgUrl) => {
        var setDoc = firestore.collection(r).doc(updatedAt)
  
        setDoc.set({
          name: newName,
          price: newPrice,
          size: newSize,
          imgUrl,
          dataDocName: updatedAt,
          qty: quantity
        }).then(() => {
         
          const card = `
              <div class="col-6 col-xl-2 col-lg-3 col-md-4 col-sm-6 mb-4 filterable">
                  <div class="card">
                  <img src="${imgUrl}" class="card-img-top" alt="...">
                  <div class="card-body">
                      <h4 class="card-title">${newName}</h4>
                      <p class="card-text h6">${quantity} ta ${newSize} L</p>
                      <p class="card-text price">${newPrice} sum</p>
                      <div class="display-flex">
                      <button type="button" onclick="remuve(this)" data-img="${imgUrl}" data-id="${updatedAt}" class="btn btn-outline-danger my-1 remuve"><i class="ti-trash"></i></button>
                      <button type="button" onclick="editModal(this)" data-img="${imgUrl}" data-id="${updatedAt}" class="btn btn-outline-warning my-1 edit" data-toggle="modal" data-target="#ModalToEdit"><i class="ti-pencil-alt"></i></button>
                      <button type="button" onclick="add(this)" data-img="${imgUrl}" data-id="${updatedAt}" class="btn btn-outline-primary add">Add to cart</button>
                      </div>
                  </div>
                  </div>
              </div>
          `;
          document.querySelector('#mainGroup >.row').innerHTML += card;
          document.getElementById("newName").value = "";
          document.getElementById("newPrice").value = "";
          document.getElementById("newImgFile").value = "";
          document.getElementById("newQuanty").value = "";
          el.innerText = "Add"
          document.getElementById('modal-close').click();//hide modal
        })
        .catch((error) => {
          console.log(error);
        })
      })
  
    })
    .catch((error) => {
      console.log(error);
    })
  }
 
}