import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './LoginScreen.css';

const LoginScreen = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginSuccess, setLoginSuccess] = useState(false);

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

  const handleLogin = () => {
    if (username === 'admin' && password === 'admin') {
      setLoginSuccess(true);
      showNotification('Login bem-sucedido!', 'success');
    } else {
      setLoginSuccess(false);
      showNotification('Nome de usuário ou senha incorretos', 'error');
    }
  };

  const handleGoBack = () => {
    history.push('/');
  };

  if (loginSuccess) {
    history.push('/profissional');
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
          <button onClick={handleGoBack}>Voltar</button>
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;
