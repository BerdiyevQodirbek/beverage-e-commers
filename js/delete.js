
// ----------> Delete card


function remuve(el) {
    var r = confirm("Do you want to delete this card?")
    if (r == true) {
        var el;
        var {id, img} = el.dataset;
        var parent = el.closest(".filterable")
        parent.remove()
        console.log(img)
        if(img.includes('https://firebasestorage.googleapis.com/v0/b/beveragefirebase.appspot.com')) {
            var deleteRef = storage.refFromURL(img)
            deleteRef.delete().then(() => {
                console.log(id + " img deleted");
                firestore.collection('Beverage').doc(id).delete().then(() => {
                    console.log('Data deleted');
                })
                .catch((error) =>{
                    console.log(error);
                })
            })
            .catch((error) => {
                console.log(error);
            })
        }  else {
            console.log('Without Image');
            firestore.collection('Beverage').doc(id).delete().then(() => {
                console.log('Data deleted');
            })
            .catch((error) =>{
                console.log(error);
            })
        }
    } else {
        console.log("Be Carefull Man!");
    }
    
    
}

// ----------> Delete list

function remove(el) {
        var r = confirm("Do you want to delete this list?");
        if (r == true) {
            var id = el.dataset.id
            var parentD = el.closest("div")
            firestore.collection('BeverageCommon').doc(id).delete().then(() => {
            console.log('Data deleted');
            })
            .catch((error) =>{
                console.log(error);
            })
        
            parentD.remove(); 
        } else {
            console.log("carefull");
        }
       
}



//  ----------> E D I T   Modal



function editModal(el) {
    var {id, img} = el.dataset;
    var updateBtn = document.getElementById("updateBtn")
    
    firestore.collection('Beverage').get().then((snapshot) => {
        snapshot.forEach(item => {
            var doc = item.data()
            if(item.id == id){
                
                document.getElementById("updatedName").value = doc.name;
                document.getElementById("updatedPrice").value = doc.price;
                document.getElementById("updatedSize").value = doc.size;
                document.getElementById("updatedQuanty").value = doc.qty;

                updateBtn.dataset.id = id;
                updateBtn.dataset.img = img;
            }
        })
    })
    .catch((error) => {
        console.log(error);
    })
}


// Edit data

function edit(el) {
    var el;
    var {id, img} = el.dataset;
    var newName = document.getElementById("updatedName").value
    var newPrice = document.getElementById("updatedPrice").value
    var newSize = document.getElementById("updatedSize").value
    var newImgFile = document.getElementById("updatedImgFile").files[0];
    var newQty = document.getElementById("updatedQuanty").value
    var modalWarn = document.getElementById("EditWarning")
    if (newName == "") {
        modalWarn.innerText = 'Entir the "Name!"'
    } else if(newPrice == ""){
        modalWarn.innerText = 'Entir the "Price!"'
    } else if(newQty == ""){
        modalWarn.innerText = 'Entir the "Quantity!"'
    } else if (newImgFile == undefined) {
        var editingData = firestore.collection('Beverage').doc(id)
        editingData.update({
            name: newName,
            price: newPrice,
            imgUrl: img,
            dataDocName: id,
            qty: newQty,
            size: newSize
        }).then(() => {
            document.getElementById("editModal-close").click();
            var updateVal = document.querySelector(`button[data-id="${id}"]`).closest(".card");
            updateVal.getElementsByClassName("card-title")[0].innerText = `${newName}`;
            updateVal.getElementsByClassName("h6")[0].innerText = `${newQty} ta ` + `${newSize} L`;
            updateVal.getElementsByClassName("card-text")[1].innerText = `${newPrice} sum`;
            updateVal.getElementsByTagName('img')[0].src = `${img}`;
            document.getElementById("updatedImgFile").value = "";
            
        }).catch((error) => {
            console.log(error);
        })
        
    } else {
        if (img.includes('https://firebasestorage.googleapis.com/v0/b/beveragefirebase.appspot.com')) {
            console.log(img);
            var deleteRef = storage.refFromURL(img)
            deleteRef.delete().then(() => {
                console.log(id + " img deleted");
                storageRef.child(id).put(newImgFile).then(() => {
                    storageRef.child(id).getDownloadURL().then((imgUrl) => {
                        var editingData = firestore.collection('Beverage').doc(id)
                        editingData.update({
                            name: newName,
                            price: newPrice,
                            imgUrl,
                            dataDocName: id,
                            qty: newQty,
                            size: newSize
                        }).then(() => {
                            document.getElementById("editModal-close").click();
                            var updateVal = document.querySelector(`button[data-id="${id}"]`).closest(".card");
                            updateVal.getElementsByClassName("card-title")[0].innerText = `${newName}`
                            updateVal.getElementsByClassName("h6")[0].innerText = `${newQty} ta ` + `${newSize} L`
                            updateVal.getElementsByClassName("card-text")[1].innerText = `${newPrice} sum`
                            updateVal.getElementsByTagName('img')[0].src = `${imgUrl}`
                            document.getElementById("updatedImgFile").value = "";
                        })
                        .catch((error) => {
                            console.log(error);
                        })
                    })
                })
                .catch((error) => {
                    console.log(error);
                })
                
            })
            .catch((error) => {
                console.log(error);
            })
        } else {
            storageRef.child(id).put(newImgFile).then(() => {
                storageRef.child(id).getDownloadURL().then((imgUrl) => {
                    var editingData = firestore.collection('Beverage').doc(id)
                    editingData.update({
                        name: newName,
                        price: newPrice,
                        imgUrl,
                        dataDocName: id,
                        qty: newQty,
                        size: newSize
                    }).then(() => {
                        document.getElementById("editModal-close").click();
                        var updateVal = document.querySelector(`button[data-id="${id}"]`).closest(".card");
                        updateVal.getElementsByClassName("card-title")[0].innerText = `${newName}`
                        updateVal.getElementsByClassName("h6")[0].innerText = `${newQty} ta ` + `${newSize} L`
                        updateVal.getElementsByClassName("card-text")[1].innerText = `${newPrice} sum`
                        updateVal.getElementsByTagName('img')[0].src = `${imgUrl}`
                        document.getElementById("updatedImgFile").value = "";
                        
                    })
                    .catch((error) => {
                        console.log(error);
                    })
              })
              .catch((error) => {
                console.log(error);
              })
            })
                         
        }
       
       
        
    }

        
    

}