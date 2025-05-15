import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaHome, FaBars } from 'react-icons/fa';
import '../styles/Navbar.css';

const NavBar = () => {
  const location = useLocation();
  const [menuOpen, setMenuOpen] = React.useState(false);

  const isActive = (path) => {
    return location.pathname.startsWith(path);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          <img src="/fedeganLogo.png" alt="FEDEGAN Logo" />
          <span>FEDEGAN</span>
        </Link>

        <button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)}>
          <FaBars />
        </button>

        <ul className={`navbar-menu ${menuOpen ? 'active' : ''}`}>
          <li className={isActive('/') && location.pathname === '/' ? 'active' : ''}>
            <Link to="/">
              <FaHome /> Inicio
            </Link>
          </li>
          <li className={isActive('/vacunadores') ? 'active' : ''}>
            <Link to="/vacunadores">Vacunadores</Link>
          </li>
          <li className={isActive('/fincas') ? 'active' : ''}>
            <Link to="/fincas">Fincas</Link>
          </li>
          <li className={isActive('/animales') ? 'active' : ''}>
            <Link to="/animales">Animales</Link>
          </li>
          <li className={isActive('/campanias') ? 'active' : ''}>
            <Link to="/campanias">Campañas</Link>
          </li>
          <li className={isActive('/registros') ? 'active' : ''}>
            <Link to="/registros">Registros</Link>
          </li>
          <li className={isActive('/movimientos') ? 'active' : ''}>
            <Link to="/movimientos">Movimientos</Link>
          </li>
          <li className={isActive('/brotes') ? 'active' : ''}>
            <Link to="/brotes">Brotes</Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default NavBar;