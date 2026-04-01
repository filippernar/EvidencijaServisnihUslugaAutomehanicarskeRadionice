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


export default{
    get,
    dodaj,
    getBySifra,
    promjeni,
    obrisi
}