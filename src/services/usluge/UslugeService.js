import { usluge } from "./UslugePodaci";


async function get() {
    return {data: usluge}
}


async function dodaj(usluga){
    if(usluge.length>0){
        usluga.sifra = usluge[usluge.length - 1].sifra + 1
    }else{
        usluga.sifra = 1
    }
    
    usluge.push(usluga);
}


export default{
    get,
    dodaj
}