import React from 'react';
import './agenda.css';



class MeuComponente extends React.Component {

  closeModal = () => {
    document.getElementById('successModal').style.display = 'none';
  }

  preventNonAlphabetic = (event) => {
    const keyCode = event.keyCode ? event.keyCode : event.which;
    // Aceita letras de A a Z (maiúsculas e minúsculas) e espaço (código 32)
    if ((keyCode < 65 || keyCode > 90) && (keyCode < 97 || keyCode > 122) && keyCode !== 32) {
        event.preventDefault();
    }
  }

  validatePhone = () => {
    var phoneInput = document.getElementById('phone');
    phoneInput.value = phoneInput.value.replace(/[^0-9]/g, '');
  }

  render() {
    return (
      <>
        <section className="agendamento">
          <div className="header">
              <img src="https://img.freepik.com/vetores-premium/modelo-de-logotipo-vintage-de-barbearia_441059-25.jpg" alt=""/>
          </div>
          <div className="formulario">

              <div className="opcoes">
                  <label htmlFor="name">Nome:</label>
                  <input type="text" id="name" maxLength="20" onKeyPress={this.preventNonAlphabetic} required/>
              </div>

              <div className="opcoes">
                  <label htmlFor="email">E-mail:</label>
                  <input type="email" id="email" maxLength="35" required/>
              </div>

              <div className="opcoes">
                  <label htmlFor="phone">Telefone:</label>
                  <input type="text" id="phone" maxLength="9" onInput={this.validatePhone} required/>
              </div>

              <div className="opcoes">
                  <label htmlFor="barber">Barbeiro:</label>
                  <select id="barber" required>
                      <option value="">Escolha o Barbeiro</option>
                      <option value="barbeiro1">Barbeiro 1</option>
                      <option value="barbeiro2">Barbeiro 2</option>
                      <option value="barbeiro3">Barbeiro 3</option>
                  </select>
              </div>

              <div className="opcoes">
                  <label htmlFor="style">Estilo de Corte:</label>
                  <select id="style" required>
                      <option value="">Escolha o Estilo de Corte</option>
                      <option value="normal">Corte Normal (30min)</option>
                      <option value="barba">Corte + Barba (1h)</option>
                      <option value="pintura">Pintura (2h)</option>
                  </select>
              </div>

              <div className="opcoes">
                  <label htmlFor="date">Dia:</label>
                  <div id="date" className="date-container"></div>
                  
              </div>

              <div className="opcoes">
                  <label htmlFor="time">Horário:</label>
                  <div id="time" className="time-container"></div>
                  
              </div>
                
              <div className="opcoes">
                  <button id="submit-button" className="btn"><span>Agendar</span></button>
                  <div className="loading" id="loading">
                      <div className="loader" id="loader"></div>
                  </div>
              </div>
              

              <div id="alert-message" className="alert" style={{display: 'none'}}></div>

              
              <div id="successModal" className="modal">
                  <div className="modal-content">
                      <div id="modalMessage" className="modal-message"></div>
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