import { PrefixStorage } from "../../constants";

// Pomoćna funkcija za dohvaćanje podataka iz local storage-a
function dohvatiSveIzStorage() {
    const podaci = localStorage.getItem(PrefixStorage.VOZILO);
    return podaci ? JSON.parse(podaci) : [];
}

// Pomoćna funkcija za spremanje podataka
function spremiUStorage(podaci) {
    localStorage.setItem(PrefixStorage.VOZILO, JSON.stringify(podaci));
}

// 1/4 Read - dohvati sve
async function get() {
    const vozila = dohvatiSveIzStorage();
    return {success: true,  data: [...vozila] };
}

// Dohvati jedan po šifri
async function getBySifra(sifra) {
    const vozila = dohvatiSveIzStorage();
    const vozilo = vozila.find(v => v.sifra === parseInt(sifra));
    return {success: true,  data: vozilo };
}

// 2/4 Create - dodaj novi
async function dodaj(vozilo) {
    const vozila = dohvatiSveIzStorage();
    
    if (vozila.length === 0) {
        vozilo.sifra = 1;
    } else {
        // Pronalaženje najveće šifre da izbjegnemo duplikate
        const maxSifra = Math.max(...vozila.map(v => v.sifra));
        vozilo.sifra = maxSifra + 1;
    }
    
    vozila.push(vozilo);
    spremiUStorage(vozila);
    return { data: vozilo };
}

// 3/4 Update - promjeni postojeći
async function promjeni(sifra, vozilo) {
    const vozila = dohvatiSveIzStorage();
    const index = vozila.findIndex(v => v.sifra === parseInt(sifra));
    
    if (index !== -1) {
        vozila[index] = { ...vozila[index], ...vozilo};
        spremiUStorage(vozila);
    }
    return { data: vozila[index] };
}

// 4/4 Delete - obriši
async function obrisi(sifra) {
    let vozila = dohvatiSveIzStorage();
    vozila = vozila.filter(v => v.sifra !== parseInt(sifra));
    spremiUStorage(vozila);
    return { message: 'Obrisano' };
}

export default {
    get,
    dodaj,
    getBySifra,
    promjeni,
    obrisi
};