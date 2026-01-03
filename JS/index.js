checkLS();
showData();


function loaded() {
    document.getElementById("plaka").focus();
}


document.getElementById("plaka").addEventListener("keyup", (e) => {
    changeInput(e);
})


function checkLS() {
    if (localStorage.getItem("islemler-cloud") == null) {
        localStorage.setItem("islemler-cloud", JSON.stringify([]))
    }
    if (localStorage.getItem("otopark") == null) {
        localStorage.setItem("otopark", JSON.stringify([]))
    }
}


function changeInput(e) {
    var data = getData();
    const inputData = document.getElementById("plaka").value.toUpperCase()



    if (e.key == "Enter") {

        if (inputData == "") return;


        const itemCount = document.getElementById("number-list").getElementsByClassName("item").length;

        if (itemCount > 0) {
            if (document.getElementById("popbox").classList.contains("activated")) {
                document.getElementById("exit-car").click();
            } else {
                // document.getElementById("popbox").classList.add("activated");
                // resetButtons();
                // console.log("changeinput");
                // showpopBox();
                tıkla(inputData);
            }



        } else {
            if (document.getElementById("checkbox").classList.contains("activated")) {
                document.getElementById("new-car-ok").click();

            } else {
                document.getElementById("checkbox").classList.add("activated");
                document.querySelector(".checkbox-input").focus();
                resetButtons();
            }

        }




    } else if (e.key == "ArrowUp") {
        itemFocus("Up");
    }
    else if (e.key == "ArrowDown") {
        itemFocus("Down");
    } else if (e.key == "Escape") {
        closemodal();
    }
    else {
        document.getElementById("number-list").innerHTML = "";
        for (let i = data.length - 1; i >= 0; i--) {
            if (data[i].plaka.includes(inputData)) {
                document.getElementById("number-list").innerHTML +=
                    `<div class="item  ${data[i].tip}" onclick="tıkla('${data[i].plaka}')"><div class="plate">${data[i].plaka}</div><div class="date">${getDate(data[i].date)}</div></div>`
            }

        }
        itemFocus()
    }
}

function resetButtons() {
    var element = document.getElementById("checkbox").querySelectorAll("button")
    element.forEach(e => {
        e.classList.remove("focus");
    })
    element[0].classList.add("focus");



    element = document.getElementById("popbox").querySelector("#buttonbox").querySelectorAll("button")

    element.forEach(e => {
        e.classList.remove("focus");
    })
    element[0].classList.add("focus");

}



function getData() {
    return JSON.parse(localStorage.getItem("otopark"));
}


function saveData(data) {
    localStorage.setItem("otopark", JSON.stringify(data));
}

function tıkla(e) {
    console.log("tıkla");
    document.getElementById("plaka").value = e
    document.getElementById("popbox").classList.add("activated");
    showpopBox("tıkla")
    resetButtons();
    document.getElementById("pop-box-input").focus();


}

function closemodal() {
    document.getElementById("popbox").classList.remove("activated");
    document.getElementById("checkbox").classList.remove("activated");
    document.getElementById("plaka").value = ""
    showData();
    document.getElementById("plaka").focus();
}


function getDate(date) {
    newDate = new Date(date);

    minute = 0;
    if (newDate.getMinutes() < 10) {
        minute = 0 + String(newDate.getMinutes())
    } else {
        minute = String(newDate.getMinutes());
    }

    dateFormat = {
        year: newDate.getFullYear(),
        month: newDate.getMonth() + 1,
        day: newDate.getDate(),
        hour: newDate.getHours(),
        minute: newDate.getMinutes(),
    }
    if (new Date().getDate() == dateFormat.day) {

        return `${dateFormat.hour}:${minute}`
    }
    return `${dateFormat.hour}:${minute} &nbsp  ${dateFormat.day}/${dateFormat.month}/${dateFormat.year}`
}


function addNofication(data) {

    // islem cıkıs
    // islem giris
    // islem veresiye
    const rnd = Math.random();
    const element = document.getElementById("nofication");
    element.innerHTML += `
        <div class="${data.islem}" id="${rnd}">
                ${data.plaka}
            </div>
        `
    setTimeout(() => { document.getElementById(rnd).remove() }, 60000)

}


function itemFocus(style) {


    const element = document.getElementById("number-list").getElementsByClassName("item");
    const elementactivated = document.getElementById("number-list").getElementsByClassName("item-activated")[0];
    const elementCount = element.length;



    if (style == "Up") {
        if (elementactivated.previousSibling) {
            elementactivated.classList.remove("item-activated")
            elementactivated.previousSibling.classList.add("item-activated")
        }
    } else if (style == "Down") {
        if (elementactivated.nextSibling) {
            elementactivated.classList.remove("item-activated")
            elementactivated.nextSibling.classList.add("item-activated")
        }
    } else {
        if (elementCount > 0) {
            element[0].classList.add("item-activated");
        } else {
            document.getElementById("number-list").innerHTML = `<div class="findOut">Araç Bulunamadı</div></div>`
        }
    }

}



function showData() {
    document.getElementById("number-list").innerHTML = "";
    const data = getData();
    for (let i = data.length - 1; i > -1; i--) {
        document.getElementById("number-list").innerHTML +=
            `<div class="item ${data[i].tip}" onclick="tıkla('${data[i].plaka}')"><div class="plate">${data[i].plaka}</div><div class="date">${getDate(data[i].date)}</div></div>`
    }
    document.getElementById("liste_count").innerHTML = data.length;
    itemFocus();
}


function addCore(data) {

    //? Veri -> Bulut
    var oldData = JSON.parse(localStorage.getItem("islemler-cloud"));
    data["date"] = new Date();
    oldData.push(data);
    localStorage.setItem("islemler-cloud", JSON.stringify(oldData));


    if (oldData.length > 4) {
        savedataCloud();
    }

}




function dataDelete() {

    var data = JSON.parse(localStorage.getItem("islemler-arsiv"));

    for (let j = 0; j < data.length; j++) {
        for (let i = 0; i < data.length; i++) {
            if ((new Date() - data[i].date) > (31 * 24 * 60 * 60 * 1000)) {
                data.splice(i, 1);
                // console.warn(data[i]);
                break;
            }
        }
    }
    localStorage.setItem("islemler-arsiv", JSON.stringify(data));

}


function dataEsitle() {
    const islemlerdata = JSON.parse(localStorage.getItem("islemler"));
    var islemler_arsiv_data = JSON.parse(localStorage.getItem("islemler-arsiv"));

    for (let i = 0; i < islemlerdata.length; i++) {
        islemler_arsiv_data.push(islemlerdata[i]);
    }

    localStorage.setItem("islemler-arsiv", JSON.stringify(islemler_arsiv_data));
    localStorage.setItem("islemler", JSON.stringify([]));

    var data = JSON.parse(localStorage.getItem("data"));
    data[0]["count"] = new Date().getDate();
    localStorage.setItem("data", JSON.stringify(data));

}


function newCar(style) {
    oldData = getData();
    var newData = {
        plaka: document.getElementById("plaka").value.toUpperCase(),
        tip: style,
        date: Date.now(),
    }


    oldData.push(newData);
    saveData(oldData);

    newData["islem"] = "giris";
    addCore(newData);

    closemodal();
    showData();
    addNofication(newData)
    document.getElementById("plaka").value = "";
    return newData;
}


function newCarwithFis(style) {
    var data = newCar(style);
    fisyazdir(data.plaka);
}

var veresiyeToplam = 0;
function showpopBox(style) {

    document.getElementById("exit-car").disabled = true;
    setTimeout(() => {
        document.getElementById("exit-car").disabled = false;
    }, 1000)


    document.getElementById("price").addEventListener("keyup", (e) => {
        if (e.key == "Enter") {
            document.getElementById("pop-box-input").focus();
        }
    })

    document.getElementById("pop-box-input").focus();
    if (style != "tıkla") {
        const element = document.getElementById("number-list").getElementsByClassName("item-activated")[0];
        element.click();
    }
    const inputData = document.getElementById("plaka").value.toUpperCase()
    data = getData()
    thisCar = "";
    for (let i = 0; i < data.length; i++) {
        if (data[i].plaka == inputData) {
            thisCar = data[i];
            id = i;
            break;
        }
    }
    const old = Date.now() - thisCar.date;
    var day = Math.floor(old / (1000 * 60 * 60 * 24))
    var minute = Math.floor(old / (1000 * 60))
    var hour = Math.floor(old / (1000 * 60 * 60))
    document.getElementById("value").innerHTML = "";
    document.getElementById("value").innerHTML = `<h1>${thisCar.plaka}</h1>
                        
                        <h2>Giriş Saati : ${getDate(thisCar.date)}</h2>
                        <h2>Çıkış Saati : ${getDate(new Date())}</h2>
                        <h2>Geçen Süre : ${day} Gün ${hour % 24} Saat ${minute % 60} Dakika</h2>`

    document.getElementById("price").value = priceController(day, hour % 24, minute, thisCar.tip);

    // document.getElementById("price").style.color = "#64748b";
    document.getElementById("price").style.color = "#10b981";
    if (((minute % 60) < 6) && document.getElementById("price").value < 250) {
        document.getElementById("price").style.color = "red";
        // document.getElementById("price").value -= 30; //? Fiyat Düşürme
    }


    fetch(url + "/api/arac-cikis", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ "plaka": inputData })

    }).then(res => res.json())
        .then(res => {
            //? Veresiye
            veresiyeToplam = 0;
            for (let i = 0; i < res.veresiyeler.length; i++) {
                veresiyeToplam += parseInt(res.veresiyeler[i].price);
            }

            if (veresiyeToplam > 0) {
                document.getElementById("veresiye-list").innerHTML = "";
                document.getElementById("veresiye-list").style.display = "block";
                document.getElementById("veresiye-list").innerHTML += `
                <div class="total-info-box">
                    <p>Toplam Ücret: <span id="totalveresiye">${veresiyeToplam + parseInt(document.getElementById("price").value)}</span>₺</p>
                    <button class="total-exit-btn" id="total-exit-car" onclick="openSure()">Toplam Ücret Çıkış Yap</button>
                </div>`;

            } else {
                document.getElementById("veresiye-list").style.display = "none"
            }
            return res
        }).then(res => {



            //? Günlük Para Sınırı
            var total = 0;

            for (let i = 0; i < res.bugunIslemler.length; i++) {
                total += parseInt(res.bugunIslemler[i]["price"])
            }
            if (total > 0) {
                document.getElementById("value").innerHTML += `<h2 style="color: red;">Bügün Verilen Diğer Ücret Toplam : ${total}</h2>`;
            }

        })





}


function openSure() {
    document.getElementById("areyousure").classList.add("activated")
}

function closeSure() {
    document.getElementById("areyousure").classList.remove("activated")
}


document.getElementById("price").addEventListener("keyup", (e) => {
    const newPrice = parseInt(e.target.value);
    var totalVeresiye = document.getElementById("totalveresiye")

    if (!isNaN(newPrice) && !(totalVeresiye == null)) {
        totalVeresiye.innerHTML = veresiyeToplam + newPrice
    }
    //  else {
    //     totalVeresiye.innerHTML = veresiyeToplam
    // }
})



document.querySelector(".checkbox-input").addEventListener("keyup", (e) => {
    const element = document.getElementById("checkbox");
    if (e.key == "Enter") {
        element.querySelector(".focus").click();
    }
    else if (e.key == "ArrowRight" && element.querySelector(".focus").nextElementSibling) {
        var old = element.querySelector(".focus");
        element.querySelector(".focus").nextElementSibling.classList.add("focus")
        old.classList.remove("focus");
    }
    else if (e.key == "ArrowLeft" && element.querySelector(".focus").previousElementSibling) {
        var old = element.querySelector(".focus");
        element.querySelector(".focus").previousElementSibling.classList.add("focus")
        old.classList.remove("focus");
    } else if (e.key == "Escape") {
        closemodal();
    }
})


document.getElementById("pop-box-input").addEventListener("keyup", (e) => {


    const element = document.getElementById("popbox").querySelector("#buttonbox")

    if (e.key == "Enter") {
        element.querySelector(".focus").click();
    }
    else if (e.key == "ArrowUp") {
        document.getElementById("price").focus();
    }
    else if (e.key == "ArrowRight" && element.querySelector(".focus").nextElementSibling) {
        var old = element.querySelector(".focus");
        element.querySelector(".focus").nextElementSibling.classList.add("focus")
        old.classList.remove("focus");
    }
    else if (e.key == "ArrowLeft" && element.querySelector(".focus").previousElementSibling) {
        var old = element.querySelector(".focus");
        element.querySelector(".focus").previousElementSibling.classList.add("focus")
        old.classList.remove("focus");
    } else if (e.key == "Escape") {
        closemodal();
    }
})


function deleteCar() {
    const inputData = document.getElementById("plaka").value.toUpperCase()
    data = getData()
    var oldData;
    for (let i = 0; i < data.length; i++) {
        if (data[i].plaka == inputData) {
            oldData = data.splice(i, 1);
            break;
        }
    }

    oldData[0]["islem"] = "delete";
    addCore(oldData[0]);

    saveData(data);
    closemodal()
    showData();
    document.getElementById("plaka").value = ""
}

function totalexitcar(style) {
    const inputData = document.getElementById("plaka").value.toUpperCase()
    fetch(url + "/api/veresiye/plaka", {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ plaka: inputData })
    }).then(res => {
        document.getElementById("areyousure").classList.remove("activated")
    })


    exitcar("totalcıkıs");
}

function fisyazdir(plaka) {
    var inputData = ""
    if (plaka) {
        inputData = plaka
    } else {
        inputData = document.getElementById("plaka").value.toUpperCase()
    }

    data = getData()
    thisCar = "";
    for (let i = 0; i < data.length; i++) {
        if (data[i].plaka == inputData) {
            thisCar = data[i];
            id = i;
            break;
        }
    }



    localStorage.setItem("fis", JSON.stringify(thisCar));
    closemodal();
    window.open("HTML/fis.html", '_blank');
}



function exitcar(islem) {

    const inputData = document.getElementById("plaka").value.toUpperCase()
    data = getData()
    var oldData;
    for (let i = 0; i < data.length; i++) {
        if (data[i].plaka == inputData) {
            oldData = data.splice(i, 1);
            break;
        }
    }



    if (islem == "veresiye") {
    } else if (islem == "totalcıkıs") {
        oldData[0]["islem"] = "totalcıkıs";
        oldData[0]["giris"] = oldData[0]["date"];
        oldData[0]["price"] = document.getElementById("totalveresiye").innerHTML;
        addCore(oldData[0]);
    }
    else {
        oldData[0]["islem"] = "cıkıs";
        oldData[0]["giris"] = oldData[0]["date"];
        oldData[0]["price"] = document.getElementById("price").value;
        addCore(oldData[0]);
        addNofication(oldData[0]);
    }

    saveData(data);
    closemodal()
    showData()

    document.getElementById("plaka").value = ""
}


function veresiyecar() {
    const inputData = document.getElementById("plaka").value.toUpperCase()

    var data = {
        "plaka": inputData,
        "date": Date.now(),
        "price": document.getElementById("price").value
    }
    document.querySelector(".veresiye").disabled = true;

    fetch(url + "/api/veresiye", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    }).then(res => {
        data["islem"] = "veresiye";
        addCore(data);
        exitcar("veresiye");
        addNofication(data);
    })

}


var taksitarife = {};
var kayonettarife = {};



(() => {
    fetch(url + "/api/tarife/taksi")
        .then(res => res.json())
        .then(res => {
            for (item of res) {
                taksitarife[item["saat"]] = Number(item["ucret"])
            }
            localStorage.setItem("taksitarife", JSON.stringify(taksitarife));
        })
        .catch(err => {
            taksitarife = JSON.parse(localStorage.getItem("taksitarife"))
        })

    fetch(url + "/api/tarife/kamyonet")
        .then(res => res.json())
        .then(res => {
            for (item of res) {
                kayonettarife[item["saat"]] = Number(item["ucret"])
            }
            localStorage.setItem("kayonettarife", JSON.stringify(kayonettarife));
        })
        .catch(err => {
            kayonettarife = JSON.parse(localStorage.getItem("kamyonettarife"))
        })

})();



function priceController(day, hour, minute, type) {
    var price = 0;
    if (type == "taksi") {
        if (day > 0) {
            price = day * 200;
        }
        switch (hour) {
            case 0: price += taksitarife["1"]; break;
            case 1: price += taksitarife["2"]; break;
            case 2: price += taksitarife["3"]; break;
            case 3: price += taksitarife["4"]; break;
            case 4: price += taksitarife["5"]; break;
            default: price += taksitarife["6"]; break;
        }



    } else {
        if (day > 0) {
            price = day * 280;
        }
        switch (hour) {
            case 0: price += kayonettarife["1"]; break;
            case 1: price += kayonettarife["2"]; break;
            case 2: price += kayonettarife["3"]; break;
            case 3: price += kayonettarife["4"]; break;
            case 4: price += kayonettarife["5"]; break;
            default: price += kayonettarife["6"]; break;
        }
    }

    return price;
}




function toggleTheme() {
    document.body.classList.toggle('light-mode');
    const isLight = document.body.classList.contains('light-mode');
    localStorage.setItem('veresiye-theme', isLight ? 'light' : 'dark');
}

// Sayfa yüklendiğinde temayı hatırla
window.addEventListener('DOMContentLoaded', () => {
    if (localStorage.getItem('veresiye-theme') === 'light') {
        document.body.classList.add('light-mode');
    }
});