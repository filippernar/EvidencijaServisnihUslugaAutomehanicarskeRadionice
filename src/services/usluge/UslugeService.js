import UslugeServiceLocalStorage from "./UslugeServiceLocalStorage";
import UslugeServiceMemorija from "./UslugeServiceMemorija";
import { DATA_SOURCE } from "../../constants";

let Servis = null;


switch (DATA_SOURCE) {
    case 'memorija':
        Servis = UslugeServiceMemorija;
        break;
    case 'localStorage':
        Servis = UslugeServiceLocalStorage;
        break;
    default:
        Servis = null;
}





const PrazanServis = {
    get: async () => ({ success: false, data: []}),
    getBySifra: async (sifra) => ({ success: false, data: {} }),
    dodaj: async (smjer) => { console.error("Servis nije učitan"); },
    promjeni: async (sifra, smjer) => { console.error("Servis nije učitan"); },
    obrisi: async (sifra) => { console.error("Servis nije učitan"); }
};

// 3. Jedan jedini export na kraju
// Ako Servis postoji, koristi njega, inače koristi PrazanServis
const AktivniServis = Servis || PrazanServis;

export default {
    get: () => AktivniServis.get(),
    getBySifra: (sifra) => AktivniServis.getBySifra(sifra),
    dodaj: (smjer) => AktivniServis.dodaj(smjer),
    promjeni: (sifra, usluga) => AktivniServis.promjeni(sifra, usluga),
    obrisi: (sifra) => AktivniServis.obrisi(sifra)
};