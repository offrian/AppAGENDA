const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');

const app = express();
const port = 3005;

app.use(cors());
app.use(bodyParser.json());

const clientAppointments = [];
const professionalAppointments = [];
const users = []; // Array para armazenar dados dos usuários

app.post('/api/cadastrar-usuario', (req, res) => {
  const { username, password, role } = req.body;

  // Verifica se o nome de usuário já existe
  if (users.some(user => user.username === username)) {
    return res.status(400).json({ error: 'Nome de usuário já cadastrado.' });
  }

  const newUser = { id: uuidv4(), username, password, role };

  // Adiciona o novo usuário ao array de usuários
  users.push(newUser);

  console.log('Novo usuário cadastrado:', newUser);
  res.status(200).json({ message: 'Usuário cadastrado com sucesso!' });
});

app.post('/api/login', (req, res) => {
  const { username, password } = req.body;

  // Procura o usuário com o nome de usuário e senha correspondentes
  const user = users.find(u => u.username === username && u.password === password);

  if (user) {
    console.log('Login bem-sucedido:', user);
    res.status(200).json({ message: 'Login bem-sucedido!', user });
  } else {
    res.status(401).json({ error: 'Nome de usuário ou senha incorretos.' });
  }
});

app.post('/api/agendamentos-cliente', (req, res) => {
  const novoAgendamentoCliente = { ...req.body, id: uuidv4() };
  clientAppointments.push(novoAgendamentoCliente);

  console.log('Agendamentos do cliente atualizados:', clientAppointments);

  res.status(200).json({ message: 'Agendamento do cliente recebido com sucesso!' });
});

app.post('/api/agendamentos-profissional', (req, res) => {
  const novoAgendamentoProfissional = { ...req.body, id: uuidv4() };
  professionalAppointments.push(novoAgendamentoProfissional);

  console.log('Agendamentos do profissional atualizados:', professionalAppointments);

  res.status(200).json({ message: 'Agendamento do profissional recebido com sucesso!' });
});

app.get('/api/agendamentos-profissional', (req, res) => {
  const { date } = req.query;
  const filteredAppointments = professionalAppointments.filter(appointment => appointment.date === date);

  console.log('Enviando agendamentos profissionais:', filteredAppointments);
  res.json(filteredAppointments);
});

app.get('/api/agendamentos-cliente', (req, res) => {
  console.log('Enviando agendamentos do cliente:', clientAppointments);
  res.json(clientAppointments);
});

app.delete('/api/agendamentos-cliente/:id', (req, res) => {
  const { id } = req.params;

  const index = clientAppointments.findIndex(appointment => appointment.id === id);

  if (index !== -1) {
    const deletedAppointment = clientAppointments.splice(index, 1)[0];
    console.log('Agendamento do cliente excluído:', deletedAppointment);
    res.status(200).json({ message: 'Agendamento do cliente excluído com sucesso!' });
  } else {
    res.status(404).json({ error: 'Agendamento do cliente não encontrado.' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

app.put('/api/agendamentos-cliente/:id', (req, res) => {
  const { id } = req.params;
  const updatedAppointment = req.body;

  const index = clientAppointments.findIndex(appointment => appointment.id === id);

  if (index !== -1) {
    clientAppointments[index] = { ...updatedAppointment, id };
    console.log('Agendamento do cliente atualizado:', clientAppointments[index]);
    res.status(200).json({ message: 'Agendamento do cliente atualizado com sucesso!' });
  } else {
    res.status(404).json({ error: 'Agendamento do cliente não encontrado.' });
  }
});
