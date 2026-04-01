import { usluge } from "./UslugePodaci";


async function get() {
    return {data: [...usluge]}
}


async function getBySifra(sifra) {
   return {data: usluge.find(s => s.sifra === parseInt(sifra))} 
}

async function dodaj(usluga){
    if(usluge.length>0){
        usluga.sifra = usluge[usluge.length - 1].sifra + 1
    }else{
        usluga.sifra = 1
    }
    
    usluge.push(usluga);
}

async function promjeni(sifra,usluga) {
    const index = nadiIndex(sifra)
    usluge[index] = {...usluge[index], ...usluga}
}

function nadiIndex(sifra){
    return usluge.findIndex(s => s.sifra === parseInt(sifra))
}

async function obrisi(sifra) {
    const index = nadiIndex(sifra)
    usluge.splice(index,1)
}

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