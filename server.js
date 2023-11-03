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

app.post('/api/agendamentos-cliente', (req, res) => {
  const novoAgendamentoCliente = { ...req.body, id: uuidv4() }; // Adiciona um ID único ao novo agendamento
  clientAppointments.push(novoAgendamentoCliente);

  console.log('Agendamentos do cliente atualizados:', clientAppointments);

  res.status(200).json({ message: 'Agendamento do cliente recebido com sucesso!' });
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
