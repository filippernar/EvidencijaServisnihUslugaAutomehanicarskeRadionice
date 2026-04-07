import VoziloServiceLocalStorage from "./VoziloServiceLocalStorage";
import VoziloServiceMemorija from "./VoziloServiceMemorija";
import { DATA_SOURCE } from "../../constants";

let Servis = null;

// 1. Odabir servisa ovisno o izvoru podataka
switch (DATA_SOURCE) {
    case 'memorija':
        Servis = VoziloServiceMemorija;
        break;
    case 'localStorage':
        Servis = VoziloServiceLocalStorage;
        break;
    default:
        Servis = null;
}

// 2. Definiranje defaultnog (praznog) ponašanja ako Servis nije pronađen
const PrazanServis = {
    get: async () => ({ success: false, data: []}),
    getBySifra: async (sifra) => ({ success: false, data: {} }),
    dodaj: async (vozilo) => { console.error("Vozilo servis nije učitan"); },
    promjeni: async (sifra, vozilo) => { console.error("Vozilo servis nije učitan"); },
    obrisi: async (sifra) => { console.error("Vozilo servis nije učitan"); }
};

// 3. Jedan jedini export na kraju
// Ako Servis postoji, koristi njega, inače koristi PrazanServis
const AktivniServis = Servis || PrazanServis;

export default {
    get: () => AktivniServis.get(),
    getBySifra: (sifra) => AktivniServis.getBySifra(sifra),
    dodaj: (vozilo) => AktivniServis.dodaj(vozilo),
    promjeni: (sifra, vozilo) => AktivniServis.promjeni(sifra, vozilo),
    obrisi: (sifra) => AktivniServis.obrisi(sifra)
};