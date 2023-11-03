import React from 'react';
import { Link } from 'react-router-dom';

const MainScreen = () => {
  return (
    <div className="main-screen">
      <h1>Bem-vindo</h1>
      <div className="user-options">
        <div className="client-option">
          <h2>Cliente</h2>
          <p>Agende um horário com um profissional.</p>
          <Link to="/cliente">
            <button>Entrar como Cliente</button>
          </Link>
        </div>
        <div className="professional-option">
          <h2>Profissional</h2>
          <p>Gerencie seus agendamentos.</p>
          <Link to="/login">
            <button>Entrar como Profissional</button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default MainScreen;
