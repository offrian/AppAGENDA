import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './ProfessionalScreen.css';

const ProfessionalScreen = () => {
  const [appointments, setAppointments] = useState([]);

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

  const handleDeleteAppointment = async (id, confirmed, date, time) => {
    try {
      await axios.delete(`http://localhost:3005/api/agendamentos-cliente/${id}`);
      setAppointments(prevAppointments => 
        prevAppointments.filter(appointment => 
          !(appointment.id === id &&
            appointment.confirmed === confirmed &&
            appointment.selectedDate === date &&
            appointment.selectedTime === time)
        )
      );
    } catch (error) {
      console.error('Erro ao excluir agendamento:', error);
  
      if (axios.isAxiosError(error) && error.response) {
        console.error('Detalhes da resposta:', error.response.data);
      }
    }
  };

  return (
    <div className="professional-screen">
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,500;1,300&display=swap');
      </style>
      <img className="logo" src="logo.png"></img>
      <div>
        <h2>Agendamentos</h2>
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
                    <button className="confirm-button" onClick={() => handleConfirmAppointment(appointment)}>Confirmar</button>
                  )}
                  {!appointment.confirmed && (
                    <button className="cancel-button" onClick={() => handleCancelAppointment(appointment)}>Cancelar</button>
                  )}
                  <button className="delete-button" onClick={() => handleDeleteAppointment(appointment.id, appointment.confirmed, appointment.selectedDate, appointment.selectedTime)}>Excluir</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
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
