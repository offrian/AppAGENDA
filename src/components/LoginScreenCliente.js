import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import './LoginScreen.css';

const LoginScreen = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginSuccess, setLoginSuccess] = useState(false);
  const [showSignupModal, setShowSignupModal] = useState(false);
  const [signupData, setSignupData] = useState({
    name: '',
    username: '',
    password: '',
    phone: '',
  });

  const history = useHistory();

  const showNotification = (message, type) => {
    toast[type](message, {
      position: 'top-center',
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
  };

  const handleLogin = async () => {
    try {
      const response = await axios.post('http://localhost:3005/api/login', {
        username,
        password,
      });

      if (response.data.message === 'Login bem-sucedido!') {
        setLoginSuccess(true);
        showNotification('Login bem-sucedido!', 'success');
      } else {
        setLoginSuccess(false);
        showNotification('Nome de usuário ou senha incorretos', 'error');
      }
    } catch (error) {
      console.error('Erro ao realizar login:', error);
      showNotification('Erro ao realizar login', 'error');
    }
  };

  const handleSignup = async () => {
    try {
      const response = await axios.post('http://localhost:3005/api/cadastrar-usuario', {
        name: signupData.name,
        username: signupData.username,
        password: signupData.password,
        phone: signupData.phone,
      });

      if (response.data.message === 'Usuário cadastrado com sucesso!') {
        showNotification('Cadastro realizado com sucesso!', 'success');
        setShowSignupModal(false);
      } else {
        showNotification('Erro ao cadastrar. Tente novamente.', 'error');
      }
    } catch (error) {
      console.error('Erro ao cadastrar:', error);
      showNotification('Erro ao cadastrar. Tente novamente.', 'error');
    }
  };

  const handleGoBack = () => {
    history.push('/');
  };

  const handleInputChange = (field, value) => {
    setSignupData({
      ...signupData,
      [field]: value,
    });
  };

  if (loginSuccess) {
    history.push('/cliente');
  }

  return (
    <div className="login-container">
      <div className="login-box">
        <img className="logo2" src="logo.png" alt="Logo"></img>
        <div>
          <label>Nome de Usuário:</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div>
          <label>Senha:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div>
          <button onClick={handleLogin}>Entrar</button>
        </div>
        <div className="button-container">
          <button onClick={() => setShowSignupModal(true)}>Cadastrar-se</button>
          <button onClick={handleGoBack}>Voltar</button>
        </div>
      </div>

      {showSignupModal && (
        <div className="signup-modal">
          <div className="signup-modal-content">
            <h2>Cadastro</h2>
            <div>
              <label>Nome:</label>
              <input
                type="text"
                value={signupData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
              />
            </div>
            <div>
              <label>Nome de Usuário:</label>
              <input
                type="text"
                value={signupData.username}
                onChange={(e) => handleInputChange('username', e.target.value)}
              />
            </div>
            <div>
              <label>Senha:</label>
              <input
                type="password"
                value={signupData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
              />
            </div>
            <div>
              <label>Número de Celular:</label>
              <input
                type="text"
                value={signupData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
              />
            </div>
            <div>
              <button onClick={handleSignup}>Cadastrar</button>
              <button onClick={() => setShowSignupModal(false)}>Cancelar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LoginScreen;
