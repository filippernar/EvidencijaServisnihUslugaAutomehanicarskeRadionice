import { PrefixStorage } from "../../constants";


// Pomoćna funkcija za dohvaćanje podataka iz local storage-a
function dohvatiSveIzStorage() {
    const podaci = localStorage.getItem(PrefixStorage.KLIJENTI);
    return podaci ? JSON.parse(podaci) : [];
}

// Pomoćna funkcija za spremanje podataka
function spremiUStorage(podaci) {
    localStorage.setItem(PrefixStorage.KLIJENTI, JSON.stringify(podaci));
}

// 1/4 Read - dohvati sve
async function get() {
    const klijenti = dohvatiSveIzStorage();
    return { success: true, data: [...klijenti] };
}

// Dohvati jedan po šifri
async function getBySifra(sifra) {
    const klijenti = dohvatiSveIzStorage();
    const klijent = klijenti.find(k => k.sifra === parseInt(sifra));
    return { success: true, data: klijent };
}

// 2/4 Create - dodaj novi
async function dodaj(klijent) {
    const klijenti = dohvatiSveIzStorage();
    
    if (klijenti.length === 0) {
        klijent.sifra = 1;
    } else {
        // Pronalaženje najveće šifre da izbjegnemo duplikate
        const maxSifra = Math.max(...klijenti.map(k => k.sifra));
        klijent.sifra = maxSifra + 1;
    }
    
    klijenti.push(klijent);
    spremiUStorage(klijenti);
    return { data: klijent };
}

// 3/4 Update - promjeni postojeći
async function promjeni(sifra, klijent) {
    const klijenti = dohvatiSveIzStorage();
    const index = klijenti.findIndex(k => k.sifra === parseInt(sifra));
    
    if (index !== -1) {
        klijenti[index] = { ...klijenti[index], ...klijent, sifra: parseInt(sifra) };
        spremiUStorage(klijenti);
    }
    return { data: klijenti[index] };
}

// 4/4 Delete - obriši
async function obrisi(sifra) {
    let klijenti = dohvatiSveIzStorage();
    klijenti = klijenti.filter(k => k.sifra !== parseInt(sifra));
    spremiUStorage(klijenti);
    return { message: 'Obrisano' };
}

export default {
    get,
    dodaj,
    getBySifra,
    promjeni,
    obrisi
};