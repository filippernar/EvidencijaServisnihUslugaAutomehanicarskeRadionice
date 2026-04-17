import KlijentServiceLocalStorage from "./KlijentServiceLocalStorage";
import KlijentServiceMemorija from "./KlijentServiceMemorija";
import { DATA_SOURCE } from "../../constants";

let Servis = null;

// 1. Odabir servisa
switch (DATA_SOURCE) {
    case 'memorija':
        Servis = KlijentServiceMemorija;
        break;
    case 'localStorage':
        Servis = KlijentServiceLocalStorage;
        break;
    default:
        Servis = null;
}

// 2. Definiranje defaultnog (praznog) ponašanja ako Servis nije pronađen
const PrazanServis = {
    get: async () => ({ success: false, data: []}),
    getBySifra: async (sifra) => ({ success: false, data: {} }),
    dodaj: async (klijent) => { console.error("Servis nije učitan"); },
    promjeni: async (sifra, klijent) => { console.error("Servis nije učitan"); },
    obrisi: async (sifra) => { console.error("Servis nije učitan"); }
};

// 3. Jedan jedini export na kraju
// Ako Servis postoji, koristi njega, inače koristi PrazanServis
const AktivniServis = Servis || PrazanServis;

export default {
    get: () => AktivniServis.get(),
    getBySifra: (sifra) => AktivniServis.getBySifra(sifra),
    dodaj: (klijent) => AktivniServis.dodaj(klijent),
    promjeni: (sifra, klijent) => AktivniServis.promjeni(sifra, klijent),
    obrisi: (sifra) => AktivniServis.obrisi(sifra)
};