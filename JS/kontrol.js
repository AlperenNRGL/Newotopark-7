
// Renk paleti (Polar grafikler için sabit kalabilir)
const chartColors = [
    "rgba(255, 144, 187,0.6)", "rgba(21, 94, 149,0.6)", "rgba(155, 208, 245,0.6)",
    "rgb(221, 235, 157,0.6)", "rgba(215, 108, 130,0.6)", "rgba(243, 198, 35,0.6)",
    "rgba(254, 79, 45,0.6)", "rgba(122, 226, 207,0.6)", "rgba(198, 142, 253,0.6)",
    "rgba(117, 78, 26,0.6)", "rgba(255, 167, 37,0.6)", "rgba(181, 168, 213,0.6)",
    "rgba(235, 90, 60,0.6)", "rgba(21, 94, 149,0.6)"
];

fetch(url + "/api/analiz")
    .then(res => res.json())
    .then(stats => {
        console.log(stats);
        // 1. Veriyi Hazırla (API'den gelen nesneleri diziye çeviriyoruz)
        const dailyArray = Object.values(stats.gunluk); // Tarihe göre sıralı gelir (API order() sayesinde)
        const labels = dailyArray.map(d => d.label);

        // --- CHART 1: Otopark İş Pusulası (Line Chart) ---
        new Chart(document.getElementById('myChart'), {
            type: 'line',
            data: {
                labels: labels,
                datasets: [
                    {
                        label: 'Çıkış',
                        data: dailyArray.map(d => d.cikis),
                        borderWidth: 3, tension: 0.1, borderColor: '#3A59D1'
                    },
                    {
                        label: 'Veresiye',
                        data: dailyArray.map(d => d.veresiye),
                        borderWidth: 3, tension: 0.2, borderColor: '#C5172E'
                    },
                    {
                        label: 'Çıkış + Veresiye',
                        data: dailyArray.map(d => d.toplam),
                        borderWidth: 3, tension: 0.2, borderColor: '#328E6E'
                    }
                ]
            },
            options: {
                responsive: true,
                scales: { y: { beginAtZero: true, display: false } },
                plugins: { title: { display: true, text: 'Otopark İş Pusulası' } }
            }
        });

        // --- CHART 2: Giriş Saat Ortalama (Polar Area) ---
        new Chart(document.getElementById('myChart2'), {
            type: 'polarArea',
            data: {
                labels: Object.keys(stats.saatlik.giris),
                datasets: [{
                    label: ' Giriş ',
                    data: Object.values(stats.saatlik.giris),
                    backgroundColor: chartColors
                }]
            },
            options: {
                responsive: true,
                plugins: { title: { display: true, text: 'Giriş Saat Ortalama' } }
            }
        });

        // --- CHART 3: Çıkış Saat Ortalama (Polar Area) ---
        new Chart(document.getElementById('myChart3'), {
            type: 'polarArea',
            data: {
                labels: Object.keys(stats.saatlik.cikis),
                datasets: [{
                    label: ' Çıkış ',
                    data: Object.values(stats.saatlik.cikis),
                    backgroundColor: chartColors
                }]
            },
            options: {
                responsive: true,
                plugins: { title: { display: true, text: 'Çıkış Saat Ortalama' } }
            }
        });
    })
    .catch(err => console.error("Grafikler yüklenemedi:", err));




function kontrol() {
    if (document.getElementById("password").value == "babaalperen") {
    }
}
document.getElementById("popbox").classList.remove("activated")