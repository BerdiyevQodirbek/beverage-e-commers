
//  A D D   C A R D   D A T A   T O   O R D E R   L I S T 


function add(el) {
    var hours = document.getElementById("orderTime").innerText
    var d = new Date();
    var date = d.getDate();
    var month = d.getMonth() + 1;
    var year = d.getFullYear();
    var dateStr = date + "." + month + "." + year + "-" + hours 
    var {id, img} = el.dataset;
    var ref = firestore.collection('admins').doc('user');
    ref.get().then(data => {
        const items = data.data().items;
        const isItemExist = items.find(item => item.id === id);
        firestore.collection('Beverage').doc(id)
        .get().then(mainData => {
            var mainD = mainData.data()
            if(isItemExist) {
                items.map(item => {
                    if(item.id === id && item.qty < mainD.qty) {
                        console.log(mainD.qty);
                        item.qty++;
                        return item;
                    } 
                    return item;
                });
            } else {
                var newQty = mainD.qty - 1;
                console.log(newQty);
                firestore.collection('Beverage').doc(id).update({
                    qty: newQty
                })
                .catch((error) => {
                    console.log(error);
                })
                items.push({id, name: mainD.name, qty: 1, price: mainD.price, time: dateStr})
            }
            ref.set({items});
            var totaldoc = document.getElementById("totalPrice")
            totaldoc.innerText = ""
            document.querySelector("#orderList ul").innerHTML = ""
            for (let i = 0; i < items.length; i++) {
                document.querySelector("#orderList ul").innerHTML += `<li class="list-group-item d-flex">
                <div class="info">
                <h5>${items[i].name}</h5>
                <p class="price">${items[i].price} sum</p>
                </div>
                <div class="d-flex justify-content-center align-items-center">
                <button onclick="manageQty(this)" data-id="${items[i].id}" class="plusBtn lightBtn">+</button>
                <input type="number" class="cardQty mx-3" value="${items[i].qty}">
                <button  onclick="manageQty(this)" data-id="${items[i].id}" class="minusBtn lightBtn">-</button>
                </div>
                </li>` 
                const total = items[i].qty * items[i].price;
                totaldoc.innerText = +total + +totaldoc.innerText    
                document.getElementById("totalOrders").innerText = `${items.length}`
            }
            document.getElementById("listShower").style.textShadow = '0px 0px 3px black'
        })
        
    }).catch((error) => {
        console.log(error);
    })
}


// Plus  and Minus buttons 

function manageQty(el) {
    var relod = document.getElementById('reload')
    var parentd = el.closest("div");
    var {id} = el.dataset
    var qty = parentd.getElementsByClassName("cardQty")[0]
    var ref = firestore.collection('admins').doc('user');
    ref.get().then(data => {
        var items = data.data().items;
        var mainRef = firestore.collection("Beverage").doc(id)
        mainRef.get().then(mainData => {
            var mainD = mainData.data()
            if (el.innerText == "-") {
                if (qty.value > 1) {
                    var updatedValue = items.map(item => {
                        if(item.id == id){
                            qty.stepDown(1)
                            item.qty--;
                            document.getElementById("totalPrice").innerText -=  item.price
                            var newQty = mainD.qty +1;
                            mainRef.update({
                                qty: newQty
                            })
                            .catch((error) => {
                                console.log(error);
                            })
                            console.log(mainD.qty);
                            return item
                        }
                        return item;
                    });
                    ref.set({items: updatedValue});
    
                } else {
                    el.closest("li").remove()
                    console.log(mainD.qty);
                    var filtered = items.filter((item) => {
                        return item.id != id
                    })
                    document.getElementById("totalOrders").innerText -=  1
                    ref.set({items: filtered})
                }
                
            } else {
                var updatedValue = items.map(item => {
                    if(item.id == id && item.qty < mainD.qty){
                        qty.stepUp(1)
                        item.qty++;
                        var total = document.getElementById("totalPrice")
                        total.innerText = +item.price + +total.innerText
                        console.log(mainD.qty);
                        return item
                    }
                    return item;
                });
                firestore.collection('admins').doc('user').set({items: updatedValue});
                console.log();
                
            }
        })
        
    })
    .catch((error) => {
        console.log(error);
    })

}

// Time clock for fun


function time() {
    var orderTime = document.getElementById('orderTime');
    var d = new Date();
    var s = d.getSeconds();
    var m = d.getMinutes();
    var h = d.getHours();
    orderTime.textContent = h + ":" + m + ":" + s;
}

setInterval(time, 1000);