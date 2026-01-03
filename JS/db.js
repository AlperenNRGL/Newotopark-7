


async function savedataCloud() {
    // console.warn("Veri Yükleme İptal");
    // return;

    try {
        const res = await fetch(url + "/api/veri-ekle",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: localStorage.getItem("islemler-cloud"),
            }
        ).then(res => {
            localStorage.setItem("islemler-cloud", JSON.stringify([]))
        })
    }
    catch (err) {
        console.err(err);
    }
}