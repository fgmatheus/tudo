/* import React, { useRef, useState } from 'react'; */
import React from 'react';
import './agenda.css';

class MeuComponente extends React.Component {
  nameInput = React.createRef();
  emailInput = React.createRef();
  phoneInput = React.createRef();
  barberSelect = React.createRef();
  styleSelect = React.createRef();
  dateButton = React.createRef();
  timeButtons = React.createRef();
  loadingRef = React.createRef();
  submitButton = React.createRef();
  successModal = React.createRef();
  alertMessage = React.createRef();

  state = {
    availableTimes: [],
    selectedDate: null,
    selectedTime: null,
    selectedDateButton: null,
    alert: { type: '', message: '' }, // Adicione este estado
  };
  
  

  closeModal = () => {
    this.successModal.current.style.display = 'none';

    // Limpe todas as informações selecionadas e escritas
    this.setState({
      availableTimes: [],
      selectedDate: null,
      selectedTime: null,
      selectedDateButton: null,
      alert: { type: '', message: '' },
    });

    // Limpe os campos de entrada
    this.nameInput.current.value = '';
    this.emailInput.current.value = '';
    this.phoneInput.current.value = '';
    this.barberSelect.current.value = '';
    this.styleSelect.current.value = '';
    this.dateButton.current.value = '';
  }

  preventNonAlphabetic = (event) => {
    const keyCode = event.keyCode ? event.keyCode : event.which;
    if ((keyCode < 65 || keyCode > 90) && (keyCode < 97 || keyCode > 122) && keyCode !== 32) {
        event.preventDefault();
    }
  }

  validatePhone = () => {
    this.phoneInput.current.value = this.phoneInput.current.value.replace(/[^0-9]/g, '');
  }

  formatDateUserFriendly = (date) => {
    const options = { weekday: 'long', year: 'numeric', month: 'numeric', day: 'numeric' };
    return date.toLocaleDateString('pt-BR', options);
  }

  formatDate = (date) => {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  }

  mapBarberToColor = (barber) => {
    return barber === 'barbeiro1' ? '6' : barber === 'barbeiro2' ? '7' : barber === 'barbeiro3' ? '5' : '';
  }

  getAvailableTimes = (date, style) => {
    const halfTimes = ['08:00-08:30', '08:30-09:00', '09:00-09:30', '09:30-10:00', '10:00-10:30', '10:30-11:00', '11:00-11:30', '11:30-12:00', '12:00-12:30', '12:30-13:00', '15:00-15:30', '15:30-16:00', '16:00-16:30', '16:30-17:00', '17:00-17:30', '17:30-18:00', '18:00-18:30', '18:30-19:00'];
    const oneTimes = ['08:00-09:00', '09:00-10:00', '10:00-11:00', '11:00-12:00', '12:00-13:00', '15:00-16:00', '16:00-17:00', '17:00-18:00', '18:00-19:00'];
    const twoTimes = ['08:00-10:00', '10:00-12:00', '14:00-16:00', '16:00-18:00', '18:00-20:00', '20:00-22:00'];
  
    const times = style === 'barba' ? oneTimes : style === 'normal' ? halfTimes : style === 'pintura' ? twoTimes : [];
  return times;
  }
  

  areFieldsFilled = () => {
    const name = this.nameInput.current.value;
    const email = this.emailInput.current.value;
    const phone = this.phoneInput.current.value;
    const selectedBarber = this.barberSelect.current.value;
    const selectedStyle = this.styleSelect.current.value;

    return name && email && phone && selectedBarber && selectedStyle;
  }

  updateTimeButtons = (selectedDate) => {
    if (!this.areFieldsFilled()) {
      this.setState({ availableTimes: [] }); // Limpa os botões de horário
      return;
    }
  
    const availableTimes = this.getAvailableTimes(selectedDate, this.styleSelect.current.value);
  this.setState({ availableTimes });

  }

            /*  */

handleDateButtonClick = async (event) => {
    if (!this.areFieldsFilled()) {
        this.displayAlert('danger', 'Por favor, preencha todos os campos obrigatórios.');
        return;
    }

    const selectedDateValue = event.target.getAttribute('data-date');
    
    const selectedDate = new Date(selectedDateValue + 'T00:00'); // Adicione 'T00:00' para definir a hora como meia-noite
    this.setState({ 
        selectedDate,
        selectedDateButton: selectedDateValue
    });
    this.setState({ selectedDate }, () => {
      this.updateTimeButtons(this.state.selectedDate);
    });
    // Chame checkAvailabilityAndUpdateInterface diretamente aqui
    const startTime = this.formatDateToUTC(selectedDate);
    const endTime = this.formatDateToUTC(new Date(selectedDate.getTime() + 24 * 60 * 60 * 1000)); // Adiciona um dia
    const timeType = this.styleSelect.current.value === 'barba' ? 'oneTimes' : this.styleSelect.current.value === 'normal' ? 'halfTimes' : this.styleSelect.current.value === 'pintura' ? 'twoTimes' : '';

    this.setState({ availableTimes: [], selectedTime: null });
    
    await this.checkAvailabilityAndUpdateInterface(startTime, endTime, timeType);
    }
              
        /*  */

  handleTimeButtonClick = (event) => {
  const selectedTime = event.target.getAttribute('data-time');
  this.setState({ selectedTime });
  const timeButtons = document.querySelectorAll('#time button');
  timeButtons.forEach(button => button.classList.remove('selected'));
  event.target.classList.add('selected');
}


  formatDateToUTC = (date) => {
    const formattedDate = new Date(date);
    const offset = formattedDate.getTimezoneOffset(); // Obtém o offset em minutos
    formattedDate.setMinutes(formattedDate.getMinutes() + offset); // Ajusta para UTC+0
    return formattedDate.toISOString().slice(0, 19) + 'Z'; // Retorna a data no formato UTC+0
  }

  checkAvailabilityAndUpdateInterface = async (startTime, endTime, timeType) => {
    this.showLoading();
  
    const selectedBarber = this.barberSelect.current.value;
    const barberColorId = this.mapBarberToColor(selectedBarber);
  
    try {
      const response = await fetch(process.env.REACT_APP_CHECK, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': 'http://127.0.0.1:4000/',
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE',
        },
        body: JSON.stringify({
          calendarId: process.env.REACT_APP_CALENDAR_ID,
          barberColorId: barberColorId,
          start: startTime, // Já está em UTC+0
          end: endTime, // Já está em UTC+0
          timeType: timeType,
        }),
      });
  
      if (response.ok) {
        const occupiedTimes = await response.json();
        console.log(occupiedTimes);
    
        for (let time in occupiedTimes) {
          
          if (occupiedTimes[time] === false) {
            
            const timeButton = document.querySelector(`button[data-time="${time}"]`);
            
            if (timeButton) {
              timeButton.classList.add('occupied');
            }
          }
        }
        /* for (let time in occupiedTimes) {
          
          if (occupiedTimes[time] === true) {
          }
          else if (occupiedTimes[time] === false) {
          
            const timeButton = document.querySelector(`button[data-time="${time}"]`);

            if (timeButton) {
              timeButton.classList.add('occupied');
            }
          }
        } */
        
         }  else {
        const error = await response.json();
        console.error(error);
      }
    } catch (error) {
      console.error(error);
    } finally {
      this.hideLoading();
    }
  }
  


  showLoading = () => {
    this.loadingRef.current.style.display = 'block';
  }

  hideLoading = () => {
    this.loadingRef.current.style.display = 'none';
  }

  openModal = (message) => {
    const lines = message.split('\n');
    let modalMessage = `<h2>${lines[0]}</h2>`;
    for (let i = 1; i < lines.length; i++) {
      const indexOfColon = lines[i].indexOf(':');
      if (indexOfColon !== -1) {
        const label = lines[i].substring(0, indexOfColon + 1);
        let value = lines[i].substring(indexOfColon + 1).trim();
  
        // Adiciona espaçamento antes de "Nome:", "Telefone:", etc.
        if (label === "Nome:" || label === "Telefone:" || label === "E-mail:") {
          value = `<span style="margin-right: 5px;">${value}</span>`;
        }
  
        modalMessage += `<p><strong>${label}</strong> ${value}</p>`;
      } else {
        modalMessage += `<p>${lines[i]}</p>`;
      }
    }
    const modalMessageElement = document.getElementById('modalMessage');
  if (modalMessageElement) {
    modalMessageElement.innerHTML = modalMessage;
  }

  this.successModal.current.style.display = 'block';
  }
  

        /*  */

  handleSubmitButtonClick = async () => {
    this.showLoading(); // Exibe o loader ao clicar no botão

    const calendarId = process.env.REACT_APP_CALENDAR_ID;
    const name = this.nameInput.current.value;
    const email = this.emailInput.current.value;
    const phone = this.phoneInput.current.value;
    const selectedBarber = this.barberSelect.current.value;
    const selectedDate = new Date(this.state.selectedDate);
    const selectedStyle = this.styleSelect.current.value;
    const selectedTime = this.state.selectedTime;

    if (!name || !email || !phone || !selectedBarber || !selectedStyle || !selectedTime) {
        this.displayAlert('danger', 'Por favor, preencha todos os campos obrigatórios.');
        this.hideLoading(); // Oculta o loader em caso de campos não preenchidos
        return;
    }

    const selectedTimeValue = selectedTime;
    const [entry, exit] = selectedTimeValue.split('-');
    const entryDate = new Date(selectedDate);
    entryDate.setUTCHours(Number(entry.split(':')[0]), Number(entry.split(':')[1]), 0, 0, 0);
    const exitDate = new Date(selectedDate);
    exitDate.setUTCHours(Number(exit.split(':')[0]), Number(exit.split(':')[1]), 0, 0, 0);
    const dateTimeStart = entryDate.toISOString();
    const dateTimeEnd = exitDate.toISOString();

    try {
        const response = await fetch(process.env.REACT_APP_CREATE, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': 'http://127.0.0.1:4000/',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE',
            },
            body: JSON.stringify({
                clientName: name,
                clientEmail: email,
                clientPhone: phone,
                calendarId,
                barberColorId: this.mapBarberToColor(selectedBarber),
                dateTimeStart: dateTimeStart, // Já está em UTC+0
                dateTimeEnd: dateTimeEnd, // Já está em UTC+0
            }),
        });

        if (response.ok) {
            const styleLabel = selectedStyle === 'normal' ? 'Corte Normal (30min)' : selectedStyle === 'barba' ? 'Corte + Barba (1h)' : selectedStyle === 'pintura' ? 'pintura (2h)' : '';
            const formattedDate = this.formatDateUserFriendly(new Date(exitDate.getTime()));
            const successMessage = `Compromisso criado com sucesso!\n\nNome: ${name}\nE-mail: ${email}\nTelefone: ${phone}\nBarbeiro: ${selectedBarber}\nEstilo: ${styleLabel}\nData: ${formattedDate}\nHorário: ${selectedTimeValue}`;
            this.openModal(successMessage);
        } else {
            this.displayAlert('danger', 'O barbeiro não está disponível neste horário.');
        }
    } catch (error) {
        console.error('Erro ao enviar a solicitação:', error);
        this.displayAlert('danger', 'Erro ao enviar a solicitação.');
    } finally {
        this.hideLoading(); // Oculta o loader após a resposta do servidor
    }
  }

  displayAlert = (type, message) => {
    this.setState({ alert: { type, message } });
  
    // Oculta o alerta após 5 segundos
    setTimeout(() => {
      this.setState({ alert: { type: '', message: '' } });
    }, 5000);
  }
  

  handleBarberChange = () => {
    const dateButtons = document.querySelectorAll('#date button');
    const timeButtons = document.querySelectorAll('#time button');
    dateButtons.forEach(button => button.classList.remove('selected'));
    timeButtons.forEach(button => button.classList.remove('selected'));
    this.styleSelect.current.value = '';
  
    if (this.state.selectedDate) {
      this.checkAvailabilityAndUpdateInterface(this.state.selectedDate);
    }
    this.setState({ selectedDateButton: null, availableTimes: [], selectedTime: null });
  }

  handleDateSelection = (event) => {
    this.setState({ selectedDate: event.target.value }, () => {
      this.updateTimeButtons(this.state.selectedDate);
    });
  }
  
  
  handleStyleChange = () => {
    const dateButtons = document.querySelectorAll('#date button');
    const timeButtons = document.querySelectorAll('#time button');
    dateButtons.forEach(button => button.classList.remove('selected'));
    timeButtons.forEach(button => button.classList.remove('selected'));
  
    if (this.state.selectedDate) {
      this.checkAvailabilityAndUpdateInterface(this.state.selectedDate);
    }
    this.setState({ selectedDateButton: null, availableTimes: [], selectedTime: null });
  }
  

  updateOccupiedTimes = (occupiedTimes) => {
    const timeButtons = this.timeButtons.current.querySelectorAll('button');
    
    timeButtons.forEach(button => {
      const time = button.getAttribute('data-time');
      if (occupiedTimes[time] === true) {
        button.classList.add('occupied');
      } else {
        button.classList.remove('occupied');
      }
    }); 
  }  

  render() {

    const { type, message } = this.state.alert;

    // Gera as datas para os próximos 14 dias
    const dates = Array.from({ length: 14 }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() + i + 1);
        return date;
      }).filter(date => date.getDay() !== 0 && date.getDay() !== 6);

    return (
      <>
        <section className="agendamento">
          <div className="header">
              <img src="https://img.freepik.com/vetores-premium/modelo-de-logotipo-vintage-de-barbearia_441059-25.jpg" alt=""/>
          </div>
          <div className="formulario">

              <div className="opcoes">
                  <label htmlFor="name">Nome:</label>
                  <input type="text" id="name" ref={this.nameInput} maxLength="20" onKeyPress={this.preventNonAlphabetic} required/>
              </div>

              <div className="opcoes">
                  <label htmlFor="email">E-mail:</label>
                  <input type="email" id="email" ref={this.emailInput} maxLength="35" required/>
              </div>

              <div className="opcoes">
                  <label htmlFor="phone">Telefone:</label>
                  <input type="text" id="phone" ref={this.phoneInput} maxLength="9" onInput={this.validatePhone} required/>
              </div>

              <div className="opcoes">
                  <label htmlFor="barber">Barbeiro:</label>
                  <select id="barber" ref={this.barberSelect} onChange={this.handleBarberChange} required>
                      <option value="">Escolha o Barbeiro</option>
                      <option value="barbeiro1">Barbeiro 1</option>
                      <option value="barbeiro2">Barbeiro 2</option>
                      <option value="barbeiro3">Barbeiro 3</option>
                  </select>
              </div>

              <div className="opcoes">
                  <label htmlFor="style">Estilo de Corte:</label>
                  <select id="style" ref={this.styleSelect} onChange={this.handleStyleChange} required>
                      <option value="">Escolha o Estilo de Corte</option>
                      <option value="normal">Corte Normal (30min)</option>
                      <option value="barba">Corte + Barba (1h)</option>
                      <option value="pintura">Pintura (2h)</option>
                  </select>
              </div>

              <div className="opcoes">
                  <label htmlFor="date">Dia:</label>
                  <div id="date" className="date-container" ref={this.dateButton}>
                    {dates.map(date => (
                      <button 
                        key={date} 
                        data-date={this.formatDate(date)} 
                        onClick={this.handleDateButtonClick}
                        className={this.state.selectedDateButton === this.formatDate(date) ? 'selected' : ''}
                      >
                        {this.formatDateUserFriendly(date)}
                      </button>
                    ))}
                  </div>
              </div>

              <div className="opcoes">
                  <label htmlFor="time">Horário:</label>
                  <div id="time" className="time-container" ref={this.timeButtons}>
  {this.state.availableTimes.map(time => (
    <button key={time} data-time={time} onClick={this.handleTimeButtonClick}>
      {time}
    </button>
  ))}
</div>

              </div>
                
              <div className="opcoes">
                  <button id="submit-button" className="btn" ref={this.submitButton} onClick={this.handleSubmitButtonClick}><span>Agendar</span></button>
                  <div className="loading" id="loading" ref={this.loadingRef}>
                      <div className="loader" id="loader"></div>
                  </div>
              </div>
              

              {message && (
                <div id="alert-message" className={`alert alert-${type}`} ref={this.alertMessage}>
                  {message}
                </div>
              )}
              

              
              <div id="successModal" className="modal" ref={this.successModal}>
      <div className="modal-content">
        <div id="modalMessage" className="modal-message">
          {this.state.modalMessage}
        </div>
        <button onClick={this.closeModal}>OK</button>
      </div>
    </div>
          </div>
        </section>
      </>
    );
  }
}

export default MeuComponente;
