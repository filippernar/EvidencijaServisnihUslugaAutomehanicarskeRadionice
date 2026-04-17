import 'bootstrap/dist/css/bootstrap.min.css'
import './App.css'
import { Container } from 'react-bootstrap'
import Izbornik from './components/Izbornik'
import { Route, Routes } from 'react-router-dom'
import { RouteNames } from './constants'
import Home from './pages/Home'
import UslugePregled from './pages/usluge/UslugePregled'
import UslugaNova from './pages/usluge/UslugaNova'
import UslugaPromjena from './pages/usluge/UslugaPromjena'
import VoziloPregled from './pages/vozilo/VoziloPregled'
import VoziloNovo from './pages/vozilo/VoziloNovo'
import VoziloPromjena from './pages/vozilo/VoziloPromjena'
import NalogPregled from './pages/nalozi/NalogPregled'
import NalogNovi from './pages/nalozi/NalogNovi'
import NalogPromjena from './pages/nalozi/NalogPromjena'
import KlijentPregled from './pages/klijent/KlijentPregled'
import KlijentNovi from './pages/klijent/KlijentNovi'
import KlijentPromjena from './pages/klijent/KlijentPromjena'
function App() {


  return (
    <Container>
      <Izbornik />
      <Routes>
        <Route path={RouteNames.HOME} element={<Home />} />
        <Route path={RouteNames.USLUGE} element={<UslugePregled />} />
        <Route path={RouteNames.USLUGA_NOVA} element={<UslugaNova />} />
        <Route path={RouteNames.USLUGA_PROMJENA} element={<UslugaPromjena/>} />

        <Route path={RouteNames.VOZILA} element={<VoziloPregled />} />
        <Route path={RouteNames.VOZILA_NOVI} element={<VoziloNovo />} />
        <Route path={RouteNames.VOZILA_PROMJENA} element={<VoziloPromjena />} />

        <Route path={RouteNames.NALOZI} element={<NalogPregled />} />
        <Route path={RouteNames.NALOZI_NOVI} element={<NalogNovi />} />
        <Route path={RouteNames.NALOZI_PROMJENA} element={<NalogPromjena />} />

        <Route path={RouteNames.KLIJENT_PREGLED} element={<KlijentPregled />} />
        <Route path={RouteNames.KLIJENT_NOVI} element={<KlijentNovi />} />
        <Route path={RouteNames.KLIJENT_PROMJENA} element={<KlijentPromjena />} />

      </Routes> 
      <hr />
      ⚡️Powered by: EvidencijaServisnihUslugaAutomehanicarskeRadionice 🔧
    </Container>
  )
}

export default App
