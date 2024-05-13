import React, { useState } from 'react';

function ContactForm() {
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [service, setService] = useState('');
    const [message, setMessage] = useState('');
    const [alertMessage, setAlertMessage] = useState('');
    const [alertType, setAlertType] = useState('');
    const [showAlert, setShowAlert] = useState(false);

    const sendEmail = (e) => {
        e.preventDefault();
        /* const bodyMessage = `Full Name: ${fullName}<br> Email:${email}<br> Phone Number:${service}<br> Message:${message}`; */

        if (!fullName || !email || !service || !message) {
            displayAlert('danger', 'Por favor, preencha todos os campos obrigatórios.');
            return;
        }

        // Aqui é onde você adicionaria o código para enviar o e-mail usando emailjs-com
        // Você pode descomentar o código abaixo e preencher com suas informações quando estiver pronto para adicionar emailjs-com

        /*
        Email.send({
            Host : "smtp.elasticemail.com",
            Username : "username",
            Password : "password",
            To : 'them@website.com',
            From : "you@isp.com",
            Subject : subject.value,
            Body : bodyMessage
        }).then(
            displayAlert('success', 'E-mail enviado com sucesso!')
        );
        */
    }

    const displayAlert = (type, message) => {
        setAlertType(type);
        setAlertMessage(message);
        setShowAlert(true);
        setTimeout(() => {
            setShowAlert(false);
        }, 2500);
    }

    return (
        <section className="contato" id="contato">
            <h2>Para mais Informações <strong>Entre em Contato</strong></h2>
            {showAlert && <div id="alert-theuz-message" className={`alert-theuz alert-theuz-${alertType}`}>{alertMessage}</div>}
            <div className="formulario-theuz">
                <form>
                    <input type="text" id="name" placeholder="Nome" required value={fullName} onChange={(e) => setFullName(e.target.value)} />
                    <input type="email" id="email" placeholder="Email" required value={email} onChange={(e) => setEmail(e.target.value)} />
                    <select id="service" required value={service} onChange={(e) => setService(e.target.value)}>
                        <option value="">Choose a product</option>
                        <option value="#">Web Page</option>
                        <option value="#">Land Page</option>
                        <option value="#">Reserva de Horário</option>
                    </select>
                    <input type="text" name="obs" id="message" placeholder="Observação" value={message} onChange={(e) => setMessage(e.target.value)} />
                </form>
                    <button type="submit" onClick={sendEmail}>Enviar</button>
            </div>
        </section>
    );
}

export default ContactForm;
