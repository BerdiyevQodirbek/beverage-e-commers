
//  Save data to firebase sales

function sell() {
    var hours = document.getElementById("orderTime").innerText
    var d = new Date();
    var date = d.getDate();
    var month = d.getMonth() + 1;
    var year = d.getFullYear();
    var dateStr = date + "." + month + "." + year + "-" + hours     ;
    var saleRef = firestore.collection("Sales").doc("users").collection('items').doc(dateStr)
    firestore.collection("admins").doc("user")
    .get().then(snap => {
        var expD = snap.data()
        if(expD.items.length > 0) {
            saleRef.set(expD).then(() => {
                firestore.collection("admins").doc("user").update({
                        items: []
                    }).then(() => {
                        document.querySelector("#orderList ul").innerHTML = ''
                        document.getElementById('totalPrice').innerText = ''
                        document.getElementById('totalOrders').innerText = ''
                    }).catch((error) => {
                        console.log(error);
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
    var historyRef = firestore.collection("Sales").doc("users").collection('items')
    historyRef.get().then(data => {
        data.forEach(doc => {
            var item = doc.data().items
            for (let i = 0; i < item.length; i++) {
                document.getElementById('tbody').innerHTML +=
                `<tr>
                    <td>${item[i].name}</td>
                    <td class="price">${item[i].price}</td>
                    <td>${item[i].qty}</td>
                    <td>${item[i].time}</td>
                </tr>`
            }
        })
    })

}

// reload the total calc

function reload(el) {
    firestore.collection('admins').doc('user')
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
    el.style.background = "#cdd8dd"
    el.style.color = "black"
}
function clearInner() {
    document.getElementById('tbody').innerHTML = ''
}