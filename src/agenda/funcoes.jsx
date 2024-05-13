import React, { useState, useEffect } from 'react';


const formatDateUserFriendly = (date) => {
    const options = { weekday: 'long', year: 'numeric', month: 'numeric', day: 'numeric' };
    return date.toLocaleDateString('pt-BR', options);
}

const formatDate = (date) => {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

const mapBarberToColor = (barber) => {
    return barber === 'barbeiro1' ? '6' : barber === 'barbeiro2' ? '7' : barber === 'barbeiro3' ? '5' : '';
}

const getAvailableTimes = (date, style) => {
    const halfTimes = ['08:00-08:30', '08:30-09:00', '09:00-09:30', '09:30-10:00', '10:00-10:30', '10:30-11:00', '11:00-11:30', '11:30-12:00', '12:00-12:30', '12:30-13:00', '15:00-15:30', '15:30-16:00', '16:00-16:30', '16:30-17:00', '17:00-17:30', '17:30-18:00', '18:00-18:30', '18:30-19:00'];
    const oneTimes = ['08:00-09:00', '09:00-10:00', '10:00-11:00', '11:00-12:00', '12:00-13:00', '15:00-16:00', '16:00-17:00', '17:00-18:00', '18:00-19:00'];
    const twoTimes = ['08:00-10:00', '10:00-12:00', '14:00-16:00', '16:00-18:00', '18:00-20:00', '20:00-22:00'];
    return style === 'barba' ? oneTimes : style === 'normal' ? halfTimes : style === 'pintura' ? twoTimes : [];
}

const TimeButton = ({ selectedDate, style, areFieldsFilled, handleTimeButtonClick }) => {
    const [availableTimes, setAvailableTimes] = useState([]);

    useEffect(() => {
        if (areFieldsFilled()) {
            setAvailableTimes(getAvailableTimes(selectedDate, style));
        }
    }, [selectedDate, style]);

    return (
        <div id="time" className="time-container">
            {availableTimes.map(time => (
                <button key={time} data-time={time} onClick={() => handleTimeButtonClick(time)}>
                    {time}
                </button>
            ))}
        </div>
    );
}

/*  */

const TimeButtons = ({ times, selectedTime, setSelectedTime }) => {
    const handleTimeButtonClick = (time) => {
        setSelectedTime(time);
    }

    return (
        <div id="time">
            {times.map(time => (
                <button 
                    key={time} 
                    data-time={time} 
                    className={selectedTime === time ? 'selected' : ''} 
                    onClick={() => handleTimeButtonClick(time)}
                >
                    {time}
                </button>
            ))}
        </div>
    );
}

const DateButtons = ({ setSelectedDate }) => {
    const [dates, setDates] = useState([]);

    useEffect(() => {
        const newDates = [];
        for (let i = 1; i <= 14; i++) {
            const currentDate = new Date();
            currentDate.setDate(currentDate.getDate() + i);

            // Exclui sábados (6) e domingos (0)
            if (currentDate.getDay() !== 0 && currentDate.getDay() !== 6) {
                newDates.push(currentDate);
            }
        }
        setDates(newDates);
    }, []);

    const handleDateButtonClick = (date) => {
        setSelectedDate(date);
    }

    return (
        <div id="date">
            {dates.map(date => (
                <button 
                    key={date} 
                    data-date={date} 
                    onClick={() => handleDateButtonClick(date)}
                >
                    {formatDateUserFriendly(date)}
                </button>
            ))}
        </div>
    );
}

const formatDateToUTC = (date) => {
    const formattedDate = new Date(date);
    const offset = formattedDate.getTimezoneOffset(); // Obtém o offset em minutos
    formattedDate.setMinutes(formattedDate.getMinutes() + offset); // Ajusta para UTC+0
    return formattedDate.toISOString().slice(0, 19) + 'Z'; // Retorna a data no formato UTC+0
}

const CheckAvailability = ({ startTime, endTime, timeType, selectedBarber, updateOccupiedTimes }) => {
    const [loading, setLoading] = useState(false);

    const checkAvailabilityAndUpdateInterface = async () => {
        setLoading(true); // Exibe o loader

        try {
            const barberColorId = mapBarberToColor(selectedBarber);

            const response = await fetch('http://127.0.0.1:3000/check-availability', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    calendarId: 'f4392d051f66e3988107791ea88f04fe83f4641849fe2ffe8773c08e32bebaa6@group.calendar.google.com',
                    barberColorId: barberColorId,
                    start: startTime, // Já está em UTC+0
                    end: endTime, // Já está em UTC+0
                    timeType: timeType,
                }),
            });

            if (response.ok) {
                const occupiedTimes = await response.json();
                updateOccupiedTimes(occupiedTimes);
                console.log(occupiedTimes);
            } else {
                const error = await response.json();
                console.error(error);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false); // Oculta o loader
        }
    }

    return (
        <div>
            {loading ? 'Carregando...' : null}
            <button onClick={checkAvailabilityAndUpdateInterface}>
                Verificar disponibilidade
            </button>
        </div>
    );
}

const SubmitButton = ({ name, email, phone, selectedBarber, selectedDate, selectedStyle, selectedTime, displayAlert, openModal }) => {
    const [loading, setLoading] = useState(false);

    const handleSubmit = async () => {
        setLoading(true); // Exibe o loader ao clicar no botão

        const calendarId = 'f4392d051f66e3988107791ea88f04fe83f4641849fe2ffe8773c08e32bebaa6@group.calendar.google.com';
        if (!name || !email || !phone || !selectedBarber || !selectedStyle || !selectedTime) {
            displayAlert('danger', 'Por favor, preencha todos os campos obrigatórios.');
            setLoading(false); // Oculta o loader em caso de campos não preenchidos
            return;
        }
        const selectedTimeValue = selectedTime.getAttribute('data-time');
        const [entry, exit] = selectedTimeValue.split('-');
        const entryDate = new Date(selectedDate);
        entryDate.setUTCHours(Number(entry.split(':')[0]), Number(entry.split(':')[1]), 0, 0, 0);
        const exitDate = new Date(selectedDate);
        exitDate.setUTCHours(Number(exit.split(':')[0]), Number(exit.split(':')[1]), 0, 0, 0);
        const dateTimeStart = entryDate.toISOString();
        const dateTimeEnd = exitDate.toISOString();

        try {
            const response = await fetch('http://127.0.0.1:3000/createAppointment', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    clientName: name,
                    clientEmail: email,
                    clientPhone: phone,
                    calendarId,
                    barberColorId: mapBarberToColor(selectedBarber),
                    dateTimeStart: dateTimeStart, // Já está em UTC+0
                    dateTimeEnd: dateTimeEnd, // Já está em UTC+0
                }),
            });

            if (response.ok) {
                const styleLabel = selectedStyle === 'normal' ? 'Corte Normal (30min)' : selectedStyle === 'barba' ? 'Corte + Barba (1h)' : selectedStyle === 'pintura' ? 'pintura (2h)' : '';
                const formattedDate = formatDateUserFriendly(new Date(exitDate.getTime()));
                const successMessage = `Compromisso criado com sucesso!\n\nNome: ${name}\nE-mail: ${email}\nTelefone: ${phone}\nBarbeiro: ${selectedBarber}\nEstilo: ${styleLabel}\nData: ${formattedDate}\nHorário: ${selectedTimeValue}`;
                openModal(successMessage);
            } else {
                displayAlert('danger', 'O barbeiro não está disponível neste horário.');
            }
        } catch (error) {
            console.error('Erro ao enviar a solicitação:', error);
            displayAlert('danger', 'Erro ao enviar a solicitação.');
        } finally {
            setLoading(false); // Oculta o loader após a resposta do servidor
        }
    }

    return (
        <button id="submit-button" onClick={handleSubmit}>
            {loading ? 'Carregando...' : 'Enviar'}
        </button>
    );
}


export { formatDateUserFriendly, formatDate, mapBarberToColor, TimeButton, TimeButtons, DateButtons, formatDateToUTC, CheckAvailability, SubmitButton };
