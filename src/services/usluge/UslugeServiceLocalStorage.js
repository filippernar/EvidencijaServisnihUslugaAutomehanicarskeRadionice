import { usluge } from "./UslugePodaci";

const STORAGE_KEY = 'usluge';

function dohvatiSveIzStorage() {
    const podaci = localStorage.getItem(STORAGE_KEY);
    return podaci ? JSON.parse(podaci) : [];
}

function spremiUStorage(podaci) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(podaci));
}

async function get() {
    const usluge = dohvatiSveIzStorage();
    return {success: true,  data: [...usluge] };
}

async function getBySifra(sifra) {
    const usluge = dohvatiSveIzStorage();
    const usluga = usluge.find(s => s.sifra === parseInt(sifra));
    return {success: true,  data: usluga };
}

async function dodaj(usluga){

    const usluge = dohvatiSveIzStorage();

    if (usluge.length === 0) {
        usluga.sifra = 1;
    } else {
        const maxSifra = Math.max(...usluge.map(s => s.sifra));
        usluga.sifra = maxSifra + 1;
    }
    
    usluge.push(usluga);

    spremiUStorage(usluge);
    return { data: usluga };

}

async function promjeni(sifra,usluga) {
    const usluge = dohvatiSveIzStorage();
    const index = usluge.findIndex(s => s.sifra === parseInt(sifra));
    
    if (index !== -1) {
        usluge[index] = { ...usluge[index], ...usluga};
        spremiUStorage(usluge);
    }
    return { data: usluge[index] };
}

async function obrisi(sifra) {
    let usluge = dohvatiSveIzStorage();
    usluge = usluge.filter(s => s.sifra !== parseInt(sifra));
    spremiUStorage(usluge);
    return { message: 'Obrisano' };
}

export default {
    get,
    dodaj,
    getBySifra,
    promjeni,
    obrisi
};