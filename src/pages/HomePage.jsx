import React from 'react';
import { Link } from 'react-router-dom';
import { FaUser, FaHome, FaPaw, FaSyringe, FaClipboardCheck, FaTruck, FaExclamationTriangle } from 'react-icons/fa';
import '../styles/HomePage.css';

const HomePage = () => {
  const modules = [
    { name: 'Vacunadores', icon: <FaUser size={32} />, path: '/vacunadores', color: '#4CAF50' },
    { name: 'Fincas', icon: <FaHome size={32} />, path: '/fincas', color: '#2196F3' },
    { name: 'Animales', icon: <FaPaw size={32} />, path: '/animales', color: '#FF9800' },
    { name: 'Campañas de Vacunación', icon: <FaSyringe size={32} />, path: '/campanias', color: '#9C27B0' },
    { name: 'Registros de Vacunación', icon: <FaClipboardCheck size={32} />, path: '/registros', color: '#E91E63' },
    { name: 'Movimientos de Animales', icon: <FaTruck size={32} />, path: '/movimientos', color: '#795548' },
    { name: 'Brotes Sanitarios', icon: <FaExclamationTriangle size={32} />, path: '/brotes', color: '#F44336' },
  ];

  return (
    <div className="home-container">
      <header className="home-header">
        <h1>FEDEGAN - Sistema de Gestión Ganadera</h1>
        <p>Seleccione un módulo para comenzar</p>
      </header>
      
      <div className="modules-grid">
        {modules.map((module, index) => (
          <Link to={module.path} key={index} className="module-card" style={{ backgroundColor: module.color }}>
            <div className="module-icon">{module.icon}</div>
            <h2>{module.name}</h2>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default HomePage;