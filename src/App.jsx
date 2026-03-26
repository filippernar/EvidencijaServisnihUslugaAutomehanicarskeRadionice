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

function App() {


  return (
    <Container>
      <Izbornik />
      <Routes>
        <Route path={RouteNames.HOME} element={<Home />} />
        <Route path={RouteNames.USLUGE} element={<UslugePregled />} />
        <Route path={RouteNames.USLUGA_NOVA} element={<UslugaNova />} />
        <Route path={RouteNames.USLUGA_PROMJENA} element={<UslugaPromjena/>} />
      </Routes> 
      <hr />
      
    </Container>
  )
}

export default App
