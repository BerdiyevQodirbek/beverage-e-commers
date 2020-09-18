
//  Save data to firebase sales

function sell() {
    var hours = document.getElementById("orderTime").innerText
    var d = new Date();
    var date = d.getDate();
    var month = d.getMonth() + 1;
    var year = d.getFullYear();
    var dateStr = date + "." + month + "." + year + "-" + hours;
    var saleRef = firestore.collection(r + ".sales").doc("users").collection('items').doc(dateStr)
    var totalPr = document.getElementById('totalPrice').innerText;
    firestore.collection("admins").doc(r)
    .get().then(snap => {
        var expD = snap.data()
        if(expD.items.length > 0) {
            saleRef.set(expD).then(() => {
                expD.items.forEach( card => {
                    firestore.collection(r).get().then( cards => {
                        cards.forEach( bever => {
                            if (bever.id == card.id) {
                                var newQty = bever.data().qty - card.qty;
                                firestore.collection(r).doc(bever.id).update({
                                    qty: newQty
                                }).then(() => {
                                    firestore.collection("admins").doc(r).update({
                                        items: []
                                    }).then(() => {
                                        saleRef.update({
                                            total: totalPr
                                        })
                                        document.querySelector("#orderList ul").innerHTML = ''
                                        document.getElementById('totalPrice').innerText = ''
                                        document.getElementById('totalOrders').innerText = ''
                                    }).catch((error) => {
                                        console.log(error);
                                    })
                                }).catch((err) => {
                                    console.log(err);
                                })
                            }
                        })
                    })
                })
                
            })
            .catch((error) => {
                console.log(error);
            })
        } else {
            console.log("no file");
        }
        
        
        
       
    })
    .catch((error) =>{
        console.log(error);
    });
}

// Show history from firebase sales 
function historY() {
    var historyClearB = document.getElementById('clearHistory');
    historyClearB.dataset.id = '';
    historyClearB.dataset.id = 'All';
    clearInner();
    var historyRef = firestore.collection(r + ".sales").doc("users").collection('items')
    historyRef.get().then(data => {
        var totalSum = 0;
        document.getElementById("Sum").innerHTML = ""
        data.forEach(doc => {
            var item = doc.data().items
            totalSum = totalSum + +doc.data().total; 
            var t = totalSum.toLocaleString()
            document.getElementById("Sum").innerHTML = t;
            for (let i = 0; i < item.length; i++) {
                document.getElementById('tbody').insertAdjacentHTML("afterbegin",
                `<tr>
                    <td>${item[i].name}</td>
                    <td class="price">${item[i].price}</td>
                    <td>${item[i].qty}</td>
                    <td>${item[i].time}</td>
                </tr>`)
            }
        })
    })
    .catch((error) => {
        console.log(error);
    })
    
}

// A day ago sales

function dayAgo() {
    var d = new Date();
    var date = d.getDate() - 1;
    var month = d.getMonth() + 1;
    var year = d.getFullYear();
    var dateStr = date + "." + month + "." + year;
    var historyClearB = document.getElementById('clearHistory');
    historyClearB.dataset.id = '';
    historyClearB.dataset.id = dateStr;
    var saleRef = firestore.collection(r + ".sales").doc("users").collection('items')
    saleRef.get().then(items => {
        document.getElementById("Sum").innerHTML = ""
        var totalSum = 0;
        clearInner();
        items.forEach(item => {
            if (item.id.includes(dateStr)) {
                totalSum = totalSum + +item.data().total; 
                var t = totalSum.toLocaleString()
                document.getElementById("Sum").innerHTML = t;
                var doc = item.data().items;
                for (let i = 0; i < doc.length; i++) {
                    document.getElementById('tbody').insertAdjacentHTML("afterbegin",
                    `<tr>
                    <td>${doc[i].name}</td>
                    <td class="price">${doc[i].price}</td>
                    <td>${doc[i].qty}</td>
                    <td>${doc[i].time}</td>
                    </tr>`)
                }
            } 
        })
    })
    
}

// Today sales

function today() {
    document.getElementById("Sum").innerHTML = ''
    var d = new Date();
    var date = d.getDate();
    var month = d.getMonth() + 1;
    var year = d.getFullYear();
    var dateStr = date + "." + month + "." + year;
    var historyClearB = document.getElementById('clearHistory');
    historyClearB.dataset.id = '';
    historyClearB.dataset.id = dateStr;
    var saleRef = firestore.collection(r + ".sales").doc("users").collection('items')
    saleRef.get().then(items => {
        clearInner();
        var totalSum = 0;
        items.forEach(item => {
            if(item.id == undefined) {
                document.getElementById('tbody').innerHTML =
                `<tr>
                <td><i class="ti-face-sad" style="font-size: 20px;margin-top: 10px"></td>
                <td class="price"><i class="ti-face-sad" style="font-size: 20px;margin-top: 10px"></td>
                <td><i class="ti-face-sad" style="font-size: 20px;margin-top: 10px"></td>
                <td><i class="ti-face-sad" style="font-size: 20px;margin-top: 10px"></td>
                </tr>`
            } else if (item.id.includes(dateStr)) {
                totalSum = totalSum + +item.data().total; 
                var t = totalSum.toLocaleString()
                document.getElementById("Sum").innerHTML = t;
                var doc = item.data().items;
                for (let i = 0; i < doc.length; i++) {
                    document.getElementById('tbody').innerHTML += 
                    `<tr>
                    <td>${doc[i].name}</td>
                    <td class="price">${doc[i].price}</td>
                    <td>${doc[i].qty}</td>
                    <td>${doc[i].time}</td>
                    </tr>`
                }
            } 
        })
    })
}

// reload the total calc

function reload(el) {
    var ref = firestore.collection('admins').doc(r);
    ref.get().then(data => {
        const items = data.data().items;
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
            <button  onclick="manageQty(this)" data-id="${items[i].id}" class="minusBtn lightBtn">-</button>
            <input type="number" class="cardQty mx-3" value="${items[i].qty}">
            <button onclick="manageQty(this)" data-id="${items[i].id}" class="plusBtn lightBtn">+</button>
                    </div>
                    </li>` 
                    const total = items[i].qty * items[i].price;
                    totaldoc.innerText = +total + +totaldoc.innerText    
                    document.getElementById("totalOrders").innerText = `${items.length}`
                }
        }).catch((error) => {
        console.log(error);
    })
    firestore.collection('admins').doc(r)
    .get().then(data => {
        var items = data.data().items
        var totaldoc = document.getElementById('totalPrice')
        totaldoc.innerText =""
        for (let i = 0; i < items.length; i++) {
            const item = items[i];
            const total = item.qty * item.price;
            totaldoc.innerText = +total + +totaldoc.innerText  
        }
    })
    .catch((error) => {
        console.log(error);
    })
}

function clearInner() {
    document.getElementById('tbody').innerHTML = ''
}

//  Clear history 
function clearHistory(el) {
    var dataId = el.dataset.id;
    conf = confirm("Do you want to clear the history about " + dataId + "?")
    if (conf) {
        var historyRef = firestore.collection(r + ".sales").doc("users").collection('items')
        historyRef.get().then(data => {
            data.forEach(doc => {
                if (doc.id.includes(dataId)) {
                    historyRef.doc(doc.id).delete().then(() => {
                        clearInner();
                        document.getElementById("Sum").innerText = "";
                    })
                    .catch((error) => {
                        console.log(error);
                    })
                } else if(dataId == "All") {
                    historyRef.doc(doc.id).delete().then(() => {
                        clearInner();
                        document.getElementById("Sum").innerText = "";
                    })
                    .catch((error) => {
                        console.log(error);
                    })

                }
            })
        })
        .catch((error) => {
            console.log(error);
        })
    } else {
        // console.log("Be carefull");
    }
}