import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import MainScreen from './components/MainScreen';
import LoginScreen from './components/LoginScreen';
import ClientScreen from './components/ClientScreen';
import ProfessionalScreen from './components/ProfessionalScreen';
import './styles.css';

const App = () => {
  return (
    <Router>
      {/* Cada rota tem seu próprio ToastContainer */}
      <Switch>
        <Route path="/cliente" component={ClientScreen} />
        <Route path="/profissional" component={ProfessionalScreen} />
        <Route path="/login" component={LoginScreen} />
        <Route path="/" component={MainScreen} />
      </Switch>

      {/* ToastContainer global para notificações */}
      <ToastContainer />
    </Router>
  );
};

export default App;
