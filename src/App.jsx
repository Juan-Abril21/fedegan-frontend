import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';

// Finca components
import FincasList from './pages/finca/FincasList';
import FincaForm from './pages/finca/FincaForm';
import FincaDetail from './pages/finca/FincaDetail';

// Animal components
import AnimalesList from './pages/animal/AnimalesList';
import AnimalForm from './pages/animal/AnimalForm';
import AnimalDetail from './pages/animal/AnimalDetail';

// Vacunador components
import VacunadoresList from './pages/vacunador/VacunadoresList';
import VacunadorForm from './pages/vacunador/VacunadoresForm';
import VacunadorDetail from './pages/vacunador/VacunadorDetail';

// Campaña components
import CampaniasList from './pages/campania/CampaniasList';
import CampaniaForm from './pages/campania/CampaniaForm';
import CampaniaDetail from './pages/campania/CampaniaDetail';

// Registro Vacunación components
import RegistrosList from './pages/registro/RegistrosList';
import RegistroForm from './pages/registro/RegistroForm';
import RegistroDetail from './pages/registro/RegistroDetail';

// Movimiento Animal components
import MovimientosList from './pages/movimiento/MovimientosList';
import MovimientoForm from './pages/movimiento/MovimientoForm';
import MovimientoDetail from './pages/movimiento/MovimientoDetail';

// Brote components
import BrotesList from './pages/brote/BrotesList';
import BroteForm from './pages/brote/BroteForm';
import BroteDetail from './pages/brote/BroteDetail';

import NavBar from './components/navbar.jsx';
import Footer from './components/Footer';
import './App.css';

function App() {
  return (
    <Router>
      <div className="app-container">
        <NavBar />
        <main className="content">
          <Routes>
            <Route path="/" element={<HomePage />} />
            
            {/* Fincas routes */}
            <Route path="/fincas" element={<FincasList />} />
            <Route path="/fincas/new" element={<FincaForm />} />
            <Route path="/fincas/edit/:id" element={<FincaForm />} />
            <Route path="/fincas/view/:id" element={<FincaDetail />} />
            
            {/* Animales routes */}
            <Route path="/animales" element={<AnimalesList />} />
            <Route path="/animales/new" element={<AnimalForm />} />
            <Route path="/animales/edit/:id" element={<AnimalForm />} />
            <Route path="/animales/view/:id" element={<AnimalDetail />} />
            
            {/* Vacunadores routes */}
            <Route path="/vacunadores" element={<VacunadoresList />} />
            <Route path="/vacunadores/new" element={<VacunadorForm />} />
            <Route path="/vacunadores/edit/:id" element={<VacunadorForm />} />
            <Route path="/vacunadores/view/:id" element={<VacunadorDetail />} />
            
            {/* Campañas routes */}
            <Route path="/campanias" element={<CampaniasList />} />
            <Route path="/campanias/new" element={<CampaniaForm />} />
            <Route path="/campanias/edit/:id" element={<CampaniaForm />} />
            <Route path="/campanias/view/:id" element={<CampaniaDetail />} />
            
            {/* Registros de Vacunación routes */}
            <Route path="/registros" element={<RegistrosList />} />
            <Route path="/registros/new" element={<RegistroForm />} />
            <Route path="/registros/edit/:id" element={<RegistroForm />} />
            <Route path="/registros/view/:id" element={<RegistroDetail />} />
            
            {/* Movimientos de Animales routes */}
            <Route path="/movimientos" element={<MovimientosList />} />
            <Route path="/movimientos/new" element={<MovimientoForm />} />
            <Route path="/movimientos/edit/:id" element={<MovimientoForm />} />
            <Route path="/movimientos/view/:id" element={<MovimientoDetail />} />
            
            {/* Brotes routes */}
            <Route path="/brotes" element={<BrotesList />} />
            <Route path="/brotes/new" element={<BroteForm />} />
            <Route path="/brotes/edit/:id" element={<BroteForm />} />
            <Route path="/brotes/view/:id" element={<BroteDetail />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;