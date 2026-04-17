import { klijenti } from "./KlijentPodaci";


// 1/4 Read od CRUD
async function get(){
    return {success: true, data: [...klijenti]} // [...] stvara novi niz s istim podacima
}

async function getBySifra(sifra) {
    return {success: true, data: klijenti.find(k => k.sifra === parseInt(sifra))}
}

// 2/4 Create od CRUD
async function dodaj(klijent){
    if(klijenti.length===0){
        klijent.sifra=1
    }else{
        klijent.sifra = klijenti[klijenti.length - 1].sifra + 1
    }
    
    klijenti.push(klijent)
}

// 3/4 Update od CRUD
async function promjeni(sifra, klijent) {
    const index = nadiIndex(sifra)
    klijenti[index] = {...klijenti[index], ...klijent}
}

function nadiIndex(sifra){
    return klijenti.findIndex(k=>k.sifra === parseInt(sifra))
}

// 4/4 Delete od CRUD
async function obrisi(sifra) {
    const index = nadiIndex(sifra);
    if (index > -1) {
        klijenti.splice(index, 1);
    }
    return;
}


export default{
    get,
    dodaj,
    getBySifra,
    promjeni,
    obrisi
}