
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
    return `${dateFormat.hour}:${minute}&nbsp&nbsp  ${dateFormat.day}/${dateFormat.month}/${dateFormat.year}`
}


function showData(data) {

    document.getElementById("veresiye-list").innerHTML = "";

    for (let i = 0; data.length > i; i++) {

        if (data[i].veri == undefined) { data[i].veri = "" }



        document.getElementById("veresiye-list").innerHTML +=
            ` <div class="item" id ='item-${data[i].id}'>
                <p  class="plaka" >${data[i].plaka}</p>
                <p class="date" >${getDate(data[i].date)}</p>
                <p class="price">${data[i].price} ₺</p>
                <textarea name="" id="veri-${data[i].id}" class="data" id="">${data[i].not}</textarea>
                <div class="button-group">
                    <button class="save" onclick="kaydet('${data[i].id}')">Kaydet</button>
                    <button class="pay" onclick="veresiyeode(${data[i].id}, '${data[i].plaka}', ${data[i].price}, 'veresiye-ode')">Öde</button>
                    <button class="delete" onclick="veresiyeode(${data[i].id}, '${data[i].plaka}', ${data[i].price}, 'veresiye-sil')">Sil</button>
                </div>
            </div>
            `
    }
}


function showDataByPlakaGrouped(data) {
    const listContainer = document.getElementById("veresiye-list");
    listContainer.innerHTML = "";

    if (!data || data.length === 0) return;

    // 1. Veriyi Plakalara Göre Grupla
    const groups = {};
    data.forEach((item, index) => {
        if (!groups[item.plaka]) {
            groups[item.plaka] = {
                items: [],
                lastDate: new Date(0) // Karşılaştırma için en eski tarih
            };
        }

        const currentItemDate = new Date(item.date);
        groups[item.plaka].items.push({ ...item, originalIndex: index });

        // Plakanın en son işlem tarihini güncelle (Sıralama için)
        if (currentItemDate > groups[item.plaka].lastDate) {
            groups[item.plaka].lastDate = currentItemDate;
        }
    });

    // 2. Plakaları (Grupları) Kendi Arasında Sırala (En son işlem gören en üste)
    const sortedPlakas = Object.keys(groups).sort((a, b) => {
        return groups[b].lastDate - groups[a].lastDate;
    });

    // 3. Sıralanmış plakaları ekrana bas
    sortedPlakas.forEach(plaka => {
        const group = groups[plaka];

        // Plaka içindeki kayıtları da kendi içinde sırala (En yeni en üste)
        group.items.sort((a, b) => new Date(b.date) - new Date(a.date));

        const total = group.items.reduce((sum, i) => sum + parseFloat(i.price || 0), 0);

        const groupElement = document.createElement("div");
        groupElement.className = "plaka-wrapper";
        groupElement.id = `group-${plaka}`
        groupElement.innerHTML = `
            
    <summary class="plaka-summary">
        <span class="plaka-name">${plaka}</span>
        <span class="plaka-meta">Toplam: <span class="total-price">${total}</span> TL</span>
        <div class="arrow">▼</div>
    </summary>
            <div class="plaka-details-content">
                ${group.items.map(item => `
                    <div class="item sub-item" id="item-${item.id}">
                        <p class="plaka">${item.plaka}</p>
                        <p class="date">${getDate(item.date)}</p>
                        <p class="price">${item.price} ₺</p>
                        <textarea id="veri-${item.id}" class="data">${item.not || ""}</textarea>
                        <div class="button-group">
                            <button class="save" onclick="kaydet('${item.id}')">Kaydet</button>
                            <button class="pay" onclick="veresiyeode(${item.id}, '${item.plaka}', ${item.price}, 'veresiye-ode')">Öde</button>
                            <button class="delete" onclick="veresiyeode(${item.id}, '${item.plaka}', ${item.price}, 'veresiye-sil')">Sil</button>
                        </div>
                    </div>
                `).join('')}
            </div>
            
        `;
        listContainer.appendChild(groupElement);
    });
}


function veriGetir() {
    fetch(url + "/api/veresiye")
        .then(res => res.json())
        .then(res => showDataByPlakaGrouped(res))
}
veriGetir();

// showDataByPlakaGrouped(JSON.parse(localStorage.getItem("veresiye")))

function focusinput() {
    document.getElementById("veresiye-input").focus();
}

function filterShowData() {

    const inputData = document.getElementById("veresiye-input").value.toUpperCase();

    var toplam = 0;

    fetch(url + "/api/veresiye?plaka=" + inputData)
        .then(res => res.json())
        .then(res => {
            showDataByPlakaGrouped(res)
            let toplam = 0;
            for (let i = 0; i < res.length; i++) { toplam += Number(res[i].price); }
            veresiyetopla(toplam);
        })

}


document.getElementById("veresiye-input").addEventListener("keyup", (e) => {

    if (document.getElementById("veresiye-input").value.length >= 3) {
        filterShowData();
    } else if (document.getElementById("veresiye-input").value == "") {
        veriGetir()
    }
}
)


function veresiyetopla(toplam) {
    document.getElementById("toplam").style.opacity = "1"
    document.getElementById("toplam").innerHTML = `${toplam} ₺`;
}



function veresiyeode(id, plaka, price, style) {

    var data2 = {
        "plaka": plaka,
        "date": Date.now(),
        "price": price,
        "islem": style,
    }

    fetch(url + "/api/veresiye/" + id, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json"
        },

    })
        .then(res => {
            var oldDataCloud = JSON.parse(localStorage.getItem("islemler-cloud"));
            oldDataCloud.push(data2);
            localStorage.setItem("islemler-cloud", JSON.stringify(oldDataCloud));

            if (res.ok) {
                // 2. DOM'dan o öğeyi bul ve sil
                const itemElement = document.getElementById(`item-${id}`);
                const groupElement = document.getElementById(`group-${plaka}`);

                if (itemElement && groupElement) {
                    itemElement.remove(); // Önce öğeyi sil

                    // 3. Grupta başka öğe kaldı mı kontrol et
                    const remainingItems = groupElement.querySelectorAll('.sub-item');

                    if (remainingItems.length === 0) {
                        // Hiç öğe kalmadıysa tüm grubu (dropdown) sil
                        groupElement.remove();
                    } else {
                        // Başka öğeler varsa Toplam Fiyatı güncelle
                        const totalSpan = groupElement.querySelector('.total-price');
                        let currentTotal = parseFloat(totalSpan.innerText);
                        let newTotal = currentTotal - price;
                        totalSpan.innerText = newTotal.toFixed(2); // Kuruşları korumak için
                    }
                }
            }


            // document.getElementById(`item-${id}`).remove();

        })



    // filterShowData();
}


function kaydet(i) {

    fetch(url + "/api/veresiye/" + i,
        {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ "not": document.getElementById(`veri-${i}`).value }),
        }
    );

    // var data = JSON.parse(localStorage.getItem("veresiye"))
    // data[parseInt(i)][`veri`] = document.getElementById(`veri-${i}`).value;
    // localStorage.setItem("veresiye", JSON.stringify(data));
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
