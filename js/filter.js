// Order Collapse

function orderCollapse() {
    var orderSection = document.querySelector(".orderSection")

    orderSection.classList.toggle("orderCollapse")
    
    
}
// ^^^^^^^^^^^   S E A R C H   F I L T E R   ^^^^^^^^^^^^


function SearchByFilter(val) {
    var filter, cards, i, current, cardClass;
    filter = val.value.toUpperCase();
    cards = document.getElementsByClassName("filterable")

    for (i = 0; i < cards.length; i++) {
        current = cards[i];
        cardName = current.getElementsByClassName("card-title")[0]
        cardClass = cardName.innerText.toUpperCase()
        if (cardClass.indexOf(filter) > -1) {
            current.style.display = "";
        } else {
            current.style.display = "none"
        }
        
    }
}


//  ^^^^^^^^^^^ C A L C U L A T E   F I L T E R ^^^^^^^^^^^^

function calc(el) {
    var name = el.innerText.toUpperCase();
    document.querySelector('#mainGroup >.row').innerHTML = ``;
    firestore.collection(r).get().then(Snapshot => {
        Snapshot.forEach(item => {
            var fireData = item.data()
            if (fireData.name.toUpperCase().includes(name)) {
                const card = `
                    <div class="col-6 col-lg-3 col-md-4 col-sm-6 mb-4 filterable">
                        <div class="card">
                        <img src="${fireData.imgUrl}" class="card-img-top" alt="...">
                        <div class="card-body">
                            <h4 class="card-title">${fireData.name}</h4>
                            <p class="card-text h6">${fireData.qty} ta ${fireData.size} L</p>
                            <p class="card-text price">${fireData.price} sum</p>
                            <div class="display-flex">
                            <button type="button" onclick="remuve(this)" data-img="${fireData.imgUrl}" data-id="${fireData.id}" class="btn btn-outline-danger my-1 remuve"><i class="ti-trash"></i></button>
                            <button type="button" onclick="editModal(this)" data-img="${fireData.imgUrl}" data-id="${item.id}" class="btn btn-outline-warning my-1 edit" data-toggle="modal" data-target="#ModalToEdit"><i class="ti-pencil-alt"></i></button>
                            <button type="button" onclick="add(this)" data-img="${fireData.imgUrl}" data-id="${item.id}" class="btn btn-outline-primary add"><i class="ti-shopping-cart"></i></button>
                            </div>
                        </div>
                        </div>
                    </div>
                `;
                document.querySelector('#mainGroup >.row').innerHTML += card;
            } else {
                // var noData = document.querySelector('#mainGroup >.row');
                // noData.innerHTML = `<img src="https://i.pinimg.com/originals/c9/22/68/c92268d92cf2dbf96e3195683d9e14fb.png" class="noDataImg">`;
            }
        })
    })
    .catch((error) => {
        console.log(error);
    })
    
}




//    C A L C U L A T E    A L L
function All(el) {
        document.querySelector("#mainGroup > div").innerHTML = ``

        firestore.collection(r).get().then(snapshot => {
    
            snapshot.forEach(item => {
                const data= item.data();//{name: 'Fanta', price:6700}
                const card = `
                    <div class="col-6 col-lg-3 col-md-4 col-sm-6 mb-4 filterable">
                        <div class="card">
                        <img src="${data.imgUrl}" class="card-img-top" alt="...">
                        <div class="card-body">
                            <h4 class="card-title">${data.name}</h4>
                            <p class="card-text h6">${data.qty} ta ${data.size} L</p>
                            <p class="card-text price">${data.price} sum</p>
                            <div class="display-flex">
                            <button type="button" onclick="remuve(this)" data-img="${data.imgUrl}" data-id="${item.id}" class="btn btn-outline-danger my-1 remuve"><i class="ti-trash"></i></button>
                            <button type="button"  onclick="editModal(this)" data-img="${data.imgUrl}" data-id="${item.id}" class="btn btn-outline-warning my-1 edit" data-toggle="modal" data-target="#ModalToEdit"><i class="ti-pencil-alt"></i></button>
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
} 