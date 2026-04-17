export const IME_APLIKACIJE='AutoLog'

export const RouteNames = {
    HOME: '/',
    USLUGE: '/usluge', 
    USLUGA_NOVA: '/usluga/nova',
    USLUGA_PROMJENA: '/usluge/:sifra',

    VOZILA: '/vozila',
    VOZILA_NOVI: '/vozila/novi',
    VOZILA_PROMJENA: '/vozila/:sifra',

    NALOZI: '/nalozi',
    NALOZI_NOVI: '/nalozi/novi',
    NALOZI_PROMJENA: '/nalozi/:sifra',

    KLIJENT_PREGLED: '/klijenti',
    KLIJENT_NOVI: '/klijenti/novi',
    KLIJENT_PROMJENA: '/klijenti/:sifra',
}


// memorija, localStorage, firebase
export const DATA_SOURCE = 'localStorage';