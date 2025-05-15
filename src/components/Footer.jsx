import React from 'react';
import '../styles/Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-logo">
          <img src="/fedeganLogo.png" alt="FEDEGAN Logo" />
          <span>FEDEGAN</span>
        </div>
        <div className="footer-text">
          <p>Sistema de Gestión Ganadera © {new Date().getFullYear()}</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;