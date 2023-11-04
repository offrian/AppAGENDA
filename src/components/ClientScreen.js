import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ClientScreen = () => {
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedProfessional, setSelectedProfessional] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [additionalInfo, setAdditionalInfo] = useState('');
  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [appointments, setAppointments] = useState([]);
  const [availableTimes, setAvailableTimes] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:3005/api/agendamentos-cliente')
      .then((response) => {
        console.log('Dados de agendamentos do cliente recebidos:', response.data);
        setAppointments(response.data);
      })
      .catch((error) => {
        console.error('Erro ao buscar agendamentos do cliente:', error);
      });
  }, [appointments]);

  useEffect(() => {
    updateAvailableTimes(selectedDate);
  }, [selectedDate]);

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

  const formatDateForDisplay = (date) => {
    const formattedDate = new Date(date);
    const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
    return formattedDate.toLocaleDateString('pt-BR', options);
  };

  const isDateAvailable = (date) => {
    const appointmentsForDate = appointments.filter(appointment => {
      const appointmentDate = new Date(appointment.selectedDate);

      return (
        appointmentDate.getFullYear() === date.getFullYear() &&
        appointmentDate.getMonth() === date.getMonth() &&
        appointmentDate.getDate() === date.getDate()
      );
    });

    return appointmentsForDate.length === 0;
  };

  const isTimeSlotAvailable = (date, time) => {
    const conflictingAppointment = appointments.find(appointment => {
      const appointmentDate = new Date(appointment.selectedDate);
      return (
        appointmentDate.getTime() === date.getTime() &&
        appointment.selectedTime === time
      );
    });

    if (conflictingAppointment) {
      showNotification('Horário não disponível. Por favor, escolha outro horário.', 'error');
      return false;
    }

    return true;
  };

  const handleAppointmentSubmit = () => {
    const selectedDateTime = new Date(selectedDate + 'T' + selectedTime + ':00');

    if (!isTimeSlotAvailable(selectedDateTime, selectedTime)) {
      return;
    }

    const novoAgendamento = {
      id: new Date().toISOString(),
      selectedDate: selectedDateTime,
      selectedProfessional,
      selectedTime,
      additionalInfo,
      clientName,
      clientPhone,
    };

    axios.post('http://localhost:3005/api/agendamentos-cliente', novoAgendamento)
      .then((response) => {
        showNotification('Agendamento feito com sucesso!', 'success');
        setSelectedDate('');
        setSelectedProfessional('');
        setSelectedTime('');
        setAdditionalInfo('');
        setClientName('');
        setClientPhone('');
      })
      .catch((error) => {
        console.error('Erro ao criar agendamento:', error);
        showNotification('Erro ao fazer o agendamento', 'error');
      });
  };

  const updateAvailableTimes = (date) => {
    const takenTimes = appointments
      .filter(appointment => formatDateForDisplay(appointment.selectedDate) === formatDateForDisplay(date))
      .map(appointment => appointment.selectedTime);

    const allTimes = generateAllTimes();

    const available = allTimes.filter(time => !takenTimes.includes(time));

    setAvailableTimes(available);
  };

  const generateAllTimes = () => {
    const startMorning = 8 * 60;
    const endMorning = 12 * 60;
    const startAfternoon = 13 * 60;
    const endAfternoon = 18 * 60;
    const interval = 30;

    const times = [];

    for (let i = startMorning; i < endMorning; i += interval) {
      times.push(minutesToTime(i));
    }

    for (let i = startAfternoon; i < endAfternoon; i += interval) {
      times.push(minutesToTime(i));
    }

    return times;
  };

  const minutesToTime = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;

    return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
  };

  const formatPhoneNumber = (input) => {
    const cleaned = ('' + input).replace(/\D/g, '');
    const match = cleaned.match(/^(\d{2})(\d{5})(\d{4})$/);
    if (match) {
      return `(${match[1]}) ${match[2]}-${match[3]}`;
    }
    return cleaned;
  };

  const handlePhoneChange = (e) => {
    const formattedPhone = formatPhoneNumber(e.target.value);
    setClientPhone(formattedPhone);
  };

  return (
    <div className="client-screen">
      <img className="logo" src="logo.png"></img>
      <div className="client-form-container">
        <h2>Agendar um horário:</h2>
        &nbsp;
        <div>
          <label>Nome do Cliente:</label>
          <input
            className="date-time-input"
            type="text"
            value={clientName}
            onChange={(e) => setClientName(e.target.value)}
          />
        </div>
        &nbsp;
        <div>
          <label>Número de Celular:</label>
          <input
            className="date-time-input"
            type="text"
            value={clientPhone}
            onChange={handlePhoneChange}
          />
        </div>
        &nbsp;
        <div>
          <label>Data:</label>
          <input
            className="date-time-input"
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
          />
        </div>
        &nbsp;
        <div>
          <label>Horário:</label>
          <select
            className="date-time-input"
            value={selectedTime}
            onChange={(e) => setSelectedTime(e.target.value)}
          >
            <option value="">Selecione um horário</option>
            {availableTimes.map(time => (
              <option key={time} value={time}>{time}</option>
            ))}
          </select>
        </div>
        <div className="user-options">
          <button onClick={handleAppointmentSubmit}>Agendar</button>
        </div>
      </div>
      <div className="user-options">
        <Link to="/">
          <button>Voltar</button>
        </Link>
      </div>
    </div>
  );
};

export default ClientScreen;
