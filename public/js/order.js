//  chek orders

(() => {
    firestore.collection('admins').doc(r).get().then(orders => {
        if (orders.data() != undefined) {
            var order = orders.data().items
            if(order.length > 0){
                document.getElementById("listShower").style = 'text-shadow: 0px 0px 1px black; color: #6696ff !important'    
                reload()
            } else {
                document.getElementById("listShower").click()
            }
        } else {
            document.getElementById("listShower").click()
        }
        
    })
})()


//  A D D   C A R D   D A T A   T O   O R D E R   L I S T 


function add(el) {
    var hours = document.getElementById("orderTime").innerText
    var d = new Date();
    var date = d.getDate();
    var month = d.getMonth() + 1;
    var year = d.getFullYear();
    var dateStr = date + "." + month + "." + year + "-" + hours 
    var {id, img} = el.dataset;
    var ref = firestore.collection('admins').doc(r);
    ref.get().then(data => {
        if (data.data() != undefined) {
            const items = data.data().items;
            const isItemExist = items.find(item => item.id === id);
            firestore.collection(r).doc(id)
            .get().then(mainData => {
                var mainD = mainData.data()
                if (mainD.qty == 0) {
                    el.closest(".card").style = "background: #fcb1b169; border: 1px solid red"
                } else {
                    if(isItemExist) {
                        items.map(item => {
                            if(item.id === id && item.qty < mainD.qty) {
                                item.qty++;
                                return item;
                            } 
                            return item;
                        });
                    } else {
                        items.push({id, name: mainD.name, qty: 1, price: mainD.price, time: dateStr})
                    }
                    ref.set({items});
                    var totaldoc = document.getElementById("totalPrice")
                    totaldoc.innerText = ""
                    document.querySelector("#orderList ul").innerHTML = ""
                    for (let i = 0; i < items.length; i++) {
                        var end = performance.now()
                        document.querySelector("#orderList ul").innerHTML += `<li class="list-group-item d-flex">
                        <div class="info">
                        <h5>${items[i].name}</h5>
                        <p class="price">${items[i].price} sum</p>
                        </div>
                        <div class="d-flex justify-content-center align-items-center">
                        <button  onclick="manageQty(this)" data-id="${items[i].id}" class="minusBtn lightBtn">-</button>
                        <input type="number" class="cardQty mx-3" readonly="readonly" value="${items[i].qty}" disabled>
                        <button onclick="manageQty(this)" data-id="${items[i].id}" class="plusBtn lightBtn">+</button>
                        </div>
                        </li>` 
                        const total = items[i].qty * items[i].price;
                        totaldoc.innerText = +total + +totaldoc.innerText    
                        document.getElementById("totalOrders").innerText = `${items.length}`
                    }
                    document.getElementById("listShower").style = 'text-shadow: 0px 0px 1px black; color: #6696ff !important'    
                }
                
            }).catch((err) => {
                console.log(err);
            })
            
        } else {
            firestore.collection("admins").doc(r).set({
                items: []
            }).then(() => {
                console.log("tyr again");
            }).catch((err) => {
                console.log(err);
            })
        }
        
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
    var ref = firestore.collection('admins').doc(r);
    ref.get().then(data => {
        var items = data.data().items;
        var mainRef = firestore.collection(r).doc(id)
        mainRef.get().then(mainData => {
            var mainD = mainData.data()
            // minus
            if (el.innerText == "-") {
                if (qty.value > 1) {
                    var updatedValue = items.map(item => {
                        if(item.id == id && item.qty > 0){
                            qty.stepDown(1)
                            item.qty--;
                            document.getElementById("totalPrice").innerText -=  item.price
                            return item
                        }
                        return item;
                    });
                    ref.set({items: updatedValue});
                // remove list
                } else {
                    el.closest("li").remove()
                    var updatedValue = items.map(item => {
                        if(item.id == id){
                            document.getElementById("totalPrice").innerText -=  item.price
                            return item
                        }
                        return item;
                    });
                    var filtered = items.filter((item) => {
                        return item.id != id
                    })
                    document.getElementById("totalOrders").innerText -=  1
                    document.getElementById("listShower").style = 'text-shadow: none; color: #007bff!important'    
                    ref.set({items: filtered})
                }
            // pilus    
            } else {
                var updatedValue = items.map(item => {
                    if(item.id == id && item.qty < mainD.qty){
                        qty.stepUp(1)
                        item.qty++;
                        var total = document.getElementById("totalPrice")
                        total.innerText = +item.price + +total.innerText
                        return item
                    }
                    return item;
                })
                firestore.collection('admins').doc(r).set({items: updatedValue});
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