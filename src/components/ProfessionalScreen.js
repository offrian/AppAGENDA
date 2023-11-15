import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './ProfessionalScreen.css';

const ProfessionalScreen = () => {
  const [appointments, setAppointments] = useState([]);
  const [editingAppointment, setEditingAppointment] = useState(null);
  const [newDate, setNewDate] = useState('');
  const [newTime, setNewTime] = useState('');
  const [deletedAppointments, setDeletedAppointments] = useState([]);
  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => {
    if (appointments.length === 0) {
      axios.get('http://localhost:3005/api/agendamentos-cliente')
        .then((response) => {
          console.log('Dados de agendamentos do cliente recebidos:', response.data);
          setAppointments(response.data);
        })
        .catch((error) => {
          console.error('Erro ao buscar agendamentos do cliente:', error);
        });
    }
  }, [appointments]);

  useEffect(() => {
    const storedDeletedAppointments = JSON.parse(localStorage.getItem('deletedAppointments')) || [];
    setDeletedAppointments(storedDeletedAppointments);
  }, []);

  const formatDate = (date) => {
    const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
    return new Date(date).toLocaleDateString('pt-BR', options);
  };

  const openWhatsApp = (phone, message) => {
    const cleanedPhone = phone.replace(/\D/g, '');
    window.open(`https://wa.me/+55${cleanedPhone}?text=${encodeURIComponent(message)}`, '_blank');
  };

  const handleConfirmAppointment = (appointment) => {
    const confirmationMessage = `Seu agendamento para o dia ${formatDate(appointment.selectedDate)} às ${appointment.selectedTime} foi confirmado. Obrigado!`;
    openWhatsApp(appointment.clientPhone, confirmationMessage);
  };

  const handleCancelAppointment = (appointment) => {
    const cancellationMessage = `Infelizmente, seu agendamento para o dia ${formatDate(appointment.selectedDate)} às ${appointment.selectedTime} foi cancelado. Entre em contato para mais informações.`;
    openWhatsApp(appointment.clientPhone, cancellationMessage);
  };

  const handleDeleteAppointment = async (id, confirmed, date, time, clientName) => {
    try {
      await axios.delete(`http://localhost:3005/api/agendamentos-cliente/${id}`);
      setAppointments((prevAppointments) =>
        prevAppointments.filter(
          (appointment) =>
            !(appointment.id === id && appointment.confirmed === confirmed && appointment.selectedDate === date && appointment.selectedTime === time)
        )
      );

      // Adiciona o agendamento excluído ao histórico
      const updatedDeletedAppointments = [
        ...deletedAppointments,
        { id, confirmed, selectedDate: date, selectedTime: time, clientName },
      ];
      setDeletedAppointments(updatedDeletedAppointments);

      // Atualiza o armazenamento local do histórico
      localStorage.setItem('deletedAppointments', JSON.stringify(updatedDeletedAppointments));
    } catch (error) {
      console.error('Erro ao excluir agendamento:', error);

      if (axios.isAxiosError(error) && error.response) {
        console.error('Detalhes da resposta:', error.response.data);
      }
    }
  };

  const handleEditAppointment = (appointment) => {
    setEditingAppointment(appointment);
    setNewDate(formatDate(appointment.selectedDate));
    setNewTime(appointment.selectedTime);
  };

  const handleSaveEdit = async () => {
    try {
      const updatedAppointment = {
        ...editingAppointment,
        selectedDate: new Date(newDate + 'T' + newTime + ':00').toISOString(),
        selectedTime: newTime,
      };

      await axios.put(`http://localhost:3005/api/agendamentos-cliente/${editingAppointment.id}`, updatedAppointment);

      setAppointments((prevAppointments) =>
        prevAppointments.map((prevAppointment) =>
          prevAppointment.id === updatedAppointment.id ? updatedAppointment : prevAppointment
        )
      );

      setEditingAppointment(null);
      setNewDate('');
      setNewTime('');
    } catch (error) {
      console.error('Erro ao salvar edição:', error);

      if (axios.isAxiosError(error) && error.response) {
        console.error('Detalhes da resposta:', error.response.data);
      }
    }
  };

  const handleCancelEdit = () => {
    setEditingAppointment(null);
    setNewDate('');
    setNewTime('');
  };

  // Função para exibir ou ocultar o histórico
  const toggleHistory = () => {
    setShowHistory(!showHistory);
  };

  return (
    <div className="professional-screen">
      <style>
        {`@import url('https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,500;1,300&display=swap');`}
      </style>
      <img className="logo" src="logo.png" alt="Logo" />
      <div>
        <h2>Agendamentos</h2>
        <button className="history-button" onClick={toggleHistory}>
          {showHistory ? 'Voltar' : 'Histórico'}
        </button>
        <table>
          <thead>
            <tr>
              <th>Data</th>
              <th>Horário</th>
              <th>Nome do Cliente</th>
              <th>Número de Celular</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {appointments.map((appointment) => (
              <tr key={appointment.id} className={appointment.confirmed ? 'confirmed' : 'cancelled'}>
                <td>{formatDate(appointment.selectedDate)}</td>
                <td>{appointment.selectedTime}</td>
                <td>{appointment.clientName}</td>
                <td>
                  <span
                    className="whatsapp-link"
                    onClick={() => openWhatsApp(appointment.clientPhone, `Olá, ${appointment.clientName}!`)}
                  >
                    {appointment.clientPhone}
                  </span>
                </td>
                <td>
                  {!appointment.confirmed && (
                    <>
                      <button className="confirm-button" onClick={() => handleConfirmAppointment(appointment)}>
                        Confirmar
                      </button>
                      <button className="cancel-button" onClick={() => handleCancelAppointment(appointment)}>
                        Cancelar
                      </button>
                    </>
                  )}
                  <button className="delete-button" onClick={() => handleDeleteAppointment(appointment.id, appointment.confirmed, appointment.selectedDate, appointment.selectedTime, appointment.clientName)}>
                    Excluir
                  </button>
                  {!appointment.confirmed && (
                    <button className="confirm-button" onClick={() => handleEditAppointment(appointment)}>
                      Editar
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {showHistory && (
          <div className="history-modal">
            <div className="modal-content">
              <h3>Histórico de Agendamentos</h3>
              <ul>
                {deletedAppointments.map((appointment) => (
                  <li key={appointment.id}>
                    <strong>Nome Cliente:</strong> {appointment.clientName}{' '}
                    <strong>Data:</strong> {formatDate(appointment.selectedDate)}{' '}
                    <strong>Horário:</strong> {appointment.selectedTime}
                  </li>
                ))}
              </ul>
              <button className="confirm-button" onClick={toggleHistory}>Voltar</button>
            </div>
          </div>
        )}
        {editingAppointment && (
          <div className="edit-appointment-modal">
            <div className="modal-content">
              <h3>Editar Agendamento</h3>
              <div>
                <label>Data:</label>
                <input
                  type="date"
                  value={newDate}
                  onChange={(e) => setNewDate(e.target.value)}
                />
              </div>
              <div>
                <label>Horário:</label>
                <input
                  type="time"
                  value={newTime}
                  onChange={(e) => setNewTime(e.target.value)}
                />
              </div>
              <div className="edit-buttons">
                <button onClick={handleSaveEdit}>Salvar</button>
                <button onClick={handleCancelEdit}>Cancelar</button>
              </div>
            </div>
          </div>
        )}
      </div>
      <div className="user-options">
        <Link to="/">
          <button>Voltar</button>
        </Link>
      </div>
    </div>
  );
};

export default ProfessionalScreen;
