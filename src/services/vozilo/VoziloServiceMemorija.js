import { vozila } from "./VoziloPodaci";


// 1/4 Read od CRUD
async function get(){
    return {success: true, data: [...vozila]} // [...] stvara novi niz s istim podacima
}

async function getBySifra(sifra) {
    return {success: true, data: vozila.find(v => v.sifra === parseInt(sifra))}
}

// 2/4 Create od CRUD
async function dodaj(vozilo){
    if(vozila.length===0){
        vozilo.sifra=1
    }else{
        vozilo.sifra = vozila[vozila.length - 1].sifra + 1
    }
    
    vozila.push(vozilo)
}

// 3/4 Update od CRUD
async function promjeni(sifra,vozilo) {
    const index = nadiIndex(sifra)
    vozila[index] = {...vozila[index], ...vozilo}
}

function nadiIndex(sifra){
    return vozila.findIndex(v=>v.sifra === parseInt(sifra))
}

// 4/4 Delete od CRUD
async function obrisi(sifra) {
    const index = nadiIndex(sifra);
    if (index > -1) {
        vozila.splice(index, 1);
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