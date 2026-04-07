const STORAGE_KEY = 'nalozi';

// Pomoćna funkcija za dohvaćanje podataka iz local storage-a
function dohvatiSveIzStorage() {
    const podaci = localStorage.getItem(STORAGE_KEY);
    return podaci ? JSON.parse(podaci) : [];
}

// Pomoćna funkcija za spremanje podataka
function spremiUStorage(podaci) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(podaci));
}

// 1/4 Read - dohvati sve
async function get() {
    const nalozi = dohvatiSveIzStorage();
    return { success: true, data: [...nalozi] };
}

// Dohvati jedan po šifri
async function getBySifra(sifra) {
    const nalozi = dohvatiSveIzStorage();
    const nalog = nalozi.find(n => n.sifra === parseInt(sifra));
    return { success: true, data: nalog };
}

// 2/4 Create - dodaj novi
async function dodaj(nalog) {
    const nalozi = dohvatiSveIzStorage();
    
    if (nalozi.length === 0) {
        nalog.sifra = 1;
    } else {
        // Pronalaženje najveće šifre da izbjegnemo duplikate
        const maxSifra = Math.max(...nalozi.map(n => n.sifra));
        nalog.sifra = maxSifra + 1;
    }
    
    nalozi.push(nalog);
    spremiUStorage(nalozi);
    return { data: nalog };
}

// 3/4 Update - promjeni postojeći
async function promjeni(sifra, nalog) {
    const nalozi = dohvatiSveIzStorage();
    const index = nalozi.findIndex(n => n.sifra === parseInt(sifra));
    
    if (index !== -1) {
        nalozi[index] = { ...nalozi[index], ...nalog, sifra: parseInt(sifra) };
        spremiUStorage(nalozi);
    }
    return { data: nalozi[index] };
}

// 4/4 Delete - obriši
async function obrisi(sifra) {
    let nalozi = dohvatiSveIzStorage();
    nalozi = nalozi.filter(n => n.sifra !== parseInt(sifra));
    spremiUStorage(nalozi);
    return { message: 'Obrisano' };
}

export default {
    get,
    dodaj,
    getBySifra,
    promjeni,
    obrisi
};