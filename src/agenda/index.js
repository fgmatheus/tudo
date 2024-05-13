function preventNonAlphabetic(event) {
    const keyCode = event.keyCode ? event.keyCode : event.which;
    // Aceita letras de A a Z (maiúsculas e minúsculas) e espaço (código 32)
    if ((keyCode < 65 || keyCode > 90) && (keyCode < 97 || keyCode > 122) && keyCode !== 32) {
        event.preventDefault();
    }
}

function validatePhone() {
    var phoneInput = document.getElementById('phone');
    phoneInput.value = phoneInput.value.replace(/[^0-9]/g, '');
}

function formatDateUserFriendly(date) {
    const options = { weekday: 'long', year: 'numeric', month: 'numeric', day: 'numeric' };
    return date.toLocaleDateString('pt-BR', options);
}

function formatDate(date) {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

function mapBarberToColor(barber) {
    return barber === 'barbeiro1' ? '6' : barber === 'barbeiro2' ? '7' : barber === 'barbeiro3' ? '5' : '';
}

function getAvailableTimes(date, style) {
    const halfTimes = ['08:00-08:30', '08:30-09:00', '09:00-09:30', '09:30-10:00', '10:00-10:30', '10:30-11:00', '11:00-11:30', '11:30-12:00', '12:00-12:30', '12:30-13:00', '15:00-15:30', '15:30-16:00', '16:00-16:30', '16:30-17:00', '17:00-17:30', '17:30-18:00', '18:00-18:30', '18:30-19:00'];
    const oneTimes = ['08:00-09:00', '09:00-10:00', '10:00-11:00', '11:00-12:00', '12:00-13:00', '15:00-16:00', '16:00-17:00', '17:00-18:00', '18:00-19:00'];
    const twoTimes = ['08:00-10:00', '10:00-12:00', '14:00-16:00', '16:00-18:00', '18:00-20:00', '20:00-22:00'];
    return style === 'barba' ? oneTimes : style === 'normal' ? halfTimes : style === 'pintura' ? twoTimes : [];

}

function updateTimeButtons(selectedDate) {
    const timeContainer = document.getElementById('time');
    const availableTimes = getAvailableTimes(selectedDate, document.getElementById('style').value);
    
    // Verifica se todos os campos obrigatórios estão preenchidos
    if (!areFieldsFilled()) {
        timeContainer.innerHTML = ''; // Limpa os botões de horário
        return;
    }

    timeContainer.innerHTML = ''; // Limpa os botões de horário

    // Adiciona um botão para cada horário disponível
    availableTimes.forEach(time => {
        const button = document.createElement('button');
        button.textContent = time;
        button.setAttribute('data-time', time);
        button.onclick = handleTimeButtonClick;
        timeContainer.appendChild(button);
    });
}

// Adicione uma função para verificar se os campos obrigatórios estão preenchidos
function areFieldsFilled() {
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    const selectedBarber = document.getElementById('barber').value;
    const selectedStyle = document.getElementById('style').value;

    return name && email && phone && selectedBarber && selectedStyle;
}

// Modifique a função que lida com o clique nos botões de data
document.getElementById('date').onclick = function(event) {
    if (event.target.tagName === 'BUTTON') {
        // Verifica se todos os campos obrigatórios estão preenchidos
        if (!areFieldsFilled()) {
            displayAlert('danger', 'Por favor, preencha todos os campos obrigatórios.');
            return;
        }

        const selectedDate = new Date(event.target.getAttribute('data-date'));
        const startTime = selectedDate.toISOString();
        const endTime = new Date(selectedDate.getTime() + 24 * 60 * 60 * 1000).toISOString(); // Adiciona um dia
        const selectedStyle = document.getElementById('style').value;
        let timeType;
        
        if(selectedStyle === 'barba') {
            timeType = 'oneTimes';
        } else if(selectedStyle === 'normal') {
            timeType = 'halfTimes';
        } else if(selectedStyle === 'pintura') {
            timeType = 'twoTimes';
        }

        checkAvailabilityAndUpdateInterface(startTime, endTime, timeType);
    }
};

/*  */

function handleTimeButtonClick(event) {
    const selectedTime = event.target.getAttribute('data-time');
    const timeButtons = document.querySelectorAll('#time button');
    timeButtons.forEach(button => button.classList.remove('selected'));
    event.target.classList.add('selected');
}
/*  */
const dateContainer = document.getElementById('date');

for (let i = 1; i <= 14; i++) {
    const currentDate = new Date();
    currentDate.setDate(currentDate.getDate() + i);

    // Exclui sábados (6) e domingos (0)
    if (currentDate.getDay() !== 0 && currentDate.getDay() !== 6) {
        const button = document.createElement('button');
        button.textContent = formatDateUserFriendly(currentDate);
        button.setAttribute('data-date', formatDate(currentDate));

        // Adiciona o evento onClick diretamente no botão
        button.onclick = function() {
            const buttons = dateContainer.getElementsByTagName('button');
            for (const otherButton of buttons) {
                otherButton.classList.remove('selected');
            }
            this.classList.add('selected');

            const selectedDate = new Date(this.getAttribute('data-date'));
            updateTimeButtons(selectedDate);
        };

        dateContainer.appendChild(button);
    }
}
/*  */
function formatDateToUTC(date) {
    const formattedDate = new Date(date);
    const offset = formattedDate.getTimezoneOffset(); // Obtém o offset em minutos
    formattedDate.setMinutes(formattedDate.getMinutes() + offset); // Ajusta para UTC+0
    return formattedDate.toISOString().slice(0, 19) + 'Z'; // Retorna a data no formato UTC+0
}
/* -------- */
async function checkAvailabilityAndUpdateInterface(startTime, endTime, timeType) {
    const loader = document.getElementById('loading');
    loader.style.display = 'block'; // Exibe o loader

    try {
        const selectedBarber = document.getElementById('barber').value;
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
        loader.style.display = 'none'; // Oculta o loader
    }
}



function showLoading() {
    document.getElementById('loading').style.display = 'block';
}

function hideLoading() {
    document.getElementById('loading').style.display = 'none';
}

        /* MARCAÇÃO EM UTC+0 */
document.getElementById('submit-button').onclick = async function() {
    showLoading(); // Exibe o loader ao clicar no botão

    const calendarId = 'f4392d051f66e3988107791ea88f04fe83f4641849fe2ffe8773c08e32bebaa6@group.calendar.google.com';
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    const selectedBarber = document.getElementById('barber').value;
/*     const selectedDate = new Date(formatDateToUTC(document.querySelector('#date button.selected').getAttribute('data-date'))); */
const selectedDate = new Date(document.querySelector('#date button.selected').getAttribute('data-date'));
    const selectedStyle = document.getElementById('style').value;
    const selectedTime = document.querySelector('#time button.selected');
    if (!name || !email || !phone || !selectedBarber || !selectedStyle || !selectedTime) {
        displayAlert('danger', 'Por favor, preencha todos os campos obrigatórios.');
        hideLoading(); // Oculta o loader em caso de campos não preenchidos
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
        hideLoading(); // Oculta o loader após a resposta do servidor
    }
};
/*  */


document.getElementById('barber').onchange = function() {
    const dateButtons = document.querySelectorAll('#date button');
    const timeButtons = document.querySelectorAll('#time button');
    dateButtons.forEach(button => button.classList.remove('selected'));
    timeButtons.forEach(button => button.classList.remove('selected'));
    document.getElementById('style').value = '';
};

document.getElementById('style').onchange = function() {
    const dateButtons = document.querySelectorAll('#date button');
    const timeButtons = document.querySelectorAll('#time button');
    dateButtons.forEach(button => button.classList.remove('selected'));
    timeButtons.forEach(button => button.classList.remove('selected'));
};


function updateOccupiedTimes(occupiedTimes) {
    const timeButtons = document.querySelectorAll('#time button');
    const selectedBarberColor = mapBarberToColor(document.getElementById('barber').value);

    timeButtons.forEach(button => {
        const time = button.getAttribute('data-time');
        if (occupiedTimes[time] === false || occupiedTimes[time] == selectedBarberColor || selectedBarberColor === '1') {
            button.classList.add('occupied');
        } else {
            button.classList.remove('occupied');
        }
    });
}

function openModal(message) {
    const modalMessage = document.getElementById('modalMessage');
    const lines = message.split('\n');
    modalMessage.innerHTML = `<h2>${lines[0]}</h2>`;
    for (let i = 1; i < lines.length; i++) {
        const indexOfColon = lines[i].indexOf(':');
        if (indexOfColon !== -1) {
            const label = lines[i].substring(0, indexOfColon + 1);
            let value = lines[i].substring(indexOfColon + 1).trim();

            // Adiciona espaçamento antes de "Nome:", "Telefone:", etc.
            if (label === "Nome:" || label === "Telefone:" || label === "E-mail:") {
                value = `<span style="margin-right: 5px;">${value}</span>`;
            }

            modalMessage.innerHTML += `<p><strong>${label}</strong> ${value}</p>`;
        } else {
            modalMessage.innerHTML += `<p>${lines[i]}</p>`;
        }
    }
    document.getElementById('successModal').style.display = 'block';
}

function closeModal() {
    document.getElementById('successModal').style.display = 'none';
}

function displayAlert(type, message) {
    const alertDiv = document.getElementById('alert-message');
    alertDiv.textContent = message;
    alertDiv.className = `alert alert-${type}`;
    alertDiv.style.display = 'block';
    setTimeout(() => {
        alertDiv.style.display = 'none';
    }, 5000);
}