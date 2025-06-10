const kontaKsiegowe = [
    "Urządzenia techniczne i maszyny",
    "Umorzenie urządzeń technicznych i maszyn",
    "Środki transportu",
    "Umorzenie środków transportu",
    "Należności z tytułu dostaw i usług od pozostałych jednostek do 12 m-cy",
    "Środki pieniężne w kasie",
    "Środki pieniężne na r-kach bankowych",
    "Kapitał podstawowy",
    "Zysk (strata) netto",
    "Zobowiązania z tytułu dostaw i usług wobec pozostałych jednostek do 12 m-cy",
    "Kredyty bankowe krótkoterminowe",
    "Zobowiązania z tytułu wynagrodzeń",
    "Zobowiązania z tytułu publicznoprawnych"
];

const operacjeKsiegowe = {};
let globalnyNumerOperacji = 1;

function init() {
    const kontener = document.getElementById("kontener-kont");

    kontaKsiegowe.forEach(konto => {
        operacjeKsiegowe[konto] = [];

        const div = document.createElement("div");
        div.className = "konto";

        div.innerHTML = `
            <h3>${konto}</h3>
            <label>Data operacji:</label>
            <input type="date" id="data-${konto}" />
            <label>Kwota operacji:</label>
            <input type="number" id="kwota-${konto}" />
            <label>Typ:</label>
            <select id="typ-${konto}">
                <option value="debet">Debet</option>
                <option value="kredyt">Kredyt</option>
            </select>
            <button onclick="dodajOperacje('${konto}')">Dodaj operację</button>
            <div class="operacje" id="operacje-${konto}">
                <div class="operacje-col" id="debet-${konto}">
                    <h4>Debet</h4>
                    <div>Brak</div>
                </div>
                <div class="operacje-col" id="kredyt-${konto}">
                    <h4>Kredyt</h4>
                    <div>Brak</div>
                </div>
            </div>
        `;

        kontener.appendChild(div);
    });

    aktualizujStatystyki();
}

function dodajOperacje(konto) {
    const data = document.getElementById(`data-${konto}`).value;
    const kwota = parseFloat(document.getElementById(`kwota-${konto}`).value);
    const typ = document.getElementById(`typ-${konto}`).value;
    const numer = `Operacja: ${globalnyNumerOperacji++}`;

    if (!data || isNaN(kwota)) {
        alert("Wypełnij wszystkie pola poprawnie.");
        return;
    }

    operacjeKsiegowe[konto].push({ data, numer, kwota, typ });
    aktualizujWidokOperacji(konto);
    aktualizujStatystyki();
}

function usunOperacje(konto, index) {
    operacjeKsiegowe[konto].splice(index, 1);
    aktualizujWidokOperacji(konto);
    aktualizujStatystyki();
}

function aktualizujWidokOperacji(konto) {
    const debetDiv = document.getElementById(`debet-${konto}`);
    const kredytDiv = document.getElementById(`kredyt-${konto}`);

    const debety = operacjeKsiegowe[konto]
        .map((op, idx) => ({ ...op, idx }))
        .filter(op => op.typ === "debet");

    const kredyty = operacjeKsiegowe[konto]
        .map((op, idx) => ({ ...op, idx }))
        .filter(op => op.typ === "kredyt");

    debetDiv.innerHTML = `<h4>Debet</h4>` +
        (debety.length ? debety.map(op =>
            `<div>${op.data}, ${op.numer}, ${op.kwota.toFixed(2)} zł
             <button onclick="usunOperacje('${konto}', ${op.idx})" style="color:red; margin-left:5px;">X</button>
            </div>`
        ).join("") : "Brak");

    kredytDiv.innerHTML = `<h4>Kredyt</h4>` +
        (kredyty.length ? kredyty.map(op =>
            `<div>${op.data}, ${op.numer}, ${op.kwota.toFixed(2)} zł
             <button onclick="usunOperacje('${konto}', ${op.idx})" style="color:red; margin-left:5px;">X</button>
            </div>`
        ).join("") : "Brak");
}

function generujBilans() {
    const dataBilansu = document.getElementById("data-bilansu").value;
    const bilansDiv = document.getElementById("bilans");

    if (!dataBilansu) {
        alert("Wybierz datę bilansu.");
        return;
    }

    const aktywaKonta = [
        "Urządzenia techniczne i maszyny",
        "Umorzenie urządzeń technicznych i maszyn",
        "Środki transportu",
        "Umorzenie środków transportu",
        "Należności z tytułu dostaw i usług od pozostałych jednostek do 12 m-cy",
        "Środki pieniężne w kasie",
        "Środki pieniężne na r-kach bankowych"
    ];

    const pasywaKonta = [
        "Kapitał podstawowy",
        "Zysk (strata) netto",
        "Zobowiązania z tytułu dostaw i usług wobec pozostałych jednostek do 12 m-cy",
        "Kredyty bankowe krótkoterminowe",
        "Zobowiązania z tytułu wynagrodzeń",
        "Zobowiązania z tytułu publicznoprawnych"
    ];

    function obliczSaldo(konto, czyAktywo) {
        return operacjeKsiegowe[konto]
            .filter(op => op.data <= dataBilansu)
            .reduce((saldo, op) => {
                if (czyAktywo) {
                    return op.typ === "debet" ? saldo + op.kwota : saldo - op.kwota;
                } else {
                    return op.typ === "kredyt" ? saldo + op.kwota : saldo - op.kwota;
                }
            }, 0);
    }

    let aktywaHTML = "<ul>";
    let sumaAktywa = 0;

    aktywaKonta.forEach(konto => {
        const saldo = obliczSaldo(konto, true);
        aktywaHTML += `<li><strong>${konto}</strong>: ${saldo.toFixed(2)} zł</li>`;
        sumaAktywa += saldo;
    });
    aktywaHTML += `<li><strong>SUMA AKTYWÓW:</strong> ${sumaAktywa.toFixed(2)} zł</li>`;
    aktywaHTML += "</ul>";

    let pasywaHTML = "<ul>";
    let sumaPasywa = 0;

    pasywaKonta.forEach(konto => {
        const saldo = obliczSaldo(konto, false);
        pasywaHTML += `<li><strong>${konto}</strong>: ${saldo.toFixed(2)} zł</li>`;
        sumaPasywa += saldo;
    });
    pasywaHTML += `<li><strong>SUMA PASYWÓW:</strong> ${sumaPasywa.toFixed(2)} zł</li>`;
    pasywaHTML += "</ul>";

    bilansDiv.innerHTML = `
        <h3>Bilans na dzień: ${dataBilansu}</h3>
        <div style="display: flex; gap: 40px;">
            <div><h4>AKTYWA</h4>${aktywaHTML}</div>
            <div><h4>PASYWA</h4>${pasywaHTML}</div>
        </div>
    `;

    const eksportBtn = document.createElement("button");
    eksportBtn.textContent = "Eksportuj bilans do CSV";
    eksportBtn.onclick = eksportujBilansDoCSV;

    bilansDiv.appendChild(eksportBtn);
}

function aktualizujStatystyki() {
    let lacznaLiczba = 0;
    let liczbaDebet = 0;
    let liczbaKredyt = 0;

    for (let konto in operacjeKsiegowe) {
        for (let op of operacjeKsiegowe[konto]) {
            lacznaLiczba++;
            if (op.typ === "debet") liczbaDebet++;
            if (op.typ === "kredyt") liczbaKredyt++;
        }
    }

    document.getElementById("statystyki").innerHTML = `
        <p><strong>Łączna liczba operacji:</strong> ${lacznaLiczba}</p>
        <p><strong>Debetowych:</strong> ${liczbaDebet}</p>
        <p><strong>Kredytowych:</strong> ${liczbaKredyt}</p>
    `;
}

function eksportujBilansDoCSV() {
    const dataBilansu = document.getElementById("data-bilansu").value;
    if (!dataBilansu) {
        alert("Najpierw wygeneruj bilans wybierając datę.");
        return;
    }

    const aktywaKonta = [
        "Urządzenia techniczne i maszyny",
        "Umorzenie urządzeń technicznych i maszyn",
        "Środki transportu",
        "Umorzenie środków transportu",
        "Należności z tytułu dostaw i usług od pozostałych jednostek do 12 m-cy",
        "Środki pieniężne w kasie",
        "Środki pieniężne na r-kach bankowych"
    ];

    const pasywaKonta = [
        "Kapitał podstawowy",
        "Zysk (strata) netto",
        "Zobowiązania z tytułu dostaw i usług wobec pozostałych jednostek do 12 m-cy",
        "Kredyty bankowe krótkoterminowe",
        "Zobowiązania z tytułu wynagrodzeń",
        "Zobowiązania z tytułu publicznoprawnych"
    ];

    function obliczSaldo(konto, czyAktywo) {
        return operacjeKsiegowe[konto]
            .filter(op => op.data <= dataBilansu)
            .reduce((saldo, op) => {
                if (czyAktywo) {
                    return op.typ === "debet" ? saldo + op.kwota : saldo - op.kwota;
                } else {
                    return op.typ === "kredyt" ? saldo + op.kwota : saldo - op.kwota;
                }
            }, 0);
    }

    let csvContent = `Bilans na dzień:;${dataBilansu}\n\n`;
    csvContent += "AKTYWA;\n";
    let sumaAktywa = 0;
    aktywaKonta.forEach(konto => {
        const saldo = obliczSaldo(konto, true);
        csvContent += `"${konto}";${saldo.toFixed(2)} zł\n`;
        sumaAktywa += saldo;
    });
    csvContent += `"SUMA AKTYWÓW";${sumaAktywa.toFixed(2)} zł\n\n`;

    csvContent += "PASYWA;\n";
    let sumaPasywa = 0;
    pasywaKonta.forEach(konto => {
        const saldo = obliczSaldo(konto, false);
        csvContent += `"${konto}";${saldo.toFixed(2)} zł\n`;
        sumaPasywa += saldo;
    });
    csvContent += `"SUMA PASYWÓW";${sumaPasywa.toFixed(2)} zł\n`;

    // Dodanie BOM na początek pliku, aby Excel rozpoznał UTF-8 z polskimi znakami
    const BOM = "\uFEFF";

    const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `bilans_${dataBilansu}.csv`;
    link.style.display = "none";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}



window.onload = init;
