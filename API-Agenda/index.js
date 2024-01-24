const express = require('express');
const { google } = require('googleapis');
const cors = require('cors');

const calendar = google.calendar('v3');
const { OAuth2Client } = require('google-auth-library');

const client = new OAuth2Client();

async function getAccessToken() {
  try {
    const tokenResponse = await client.getAccessToken({
      scopes: [
        'https://www.googleapis.com/auth/calendar',
        'https://www.googleapis.com/auth/calendar.readonly',
      ],
    });
    return tokenResponse.token;
  } catch (error) {
    console.error('Erro ao obter token:', error);
    throw error;
  }
}

async function initializeAuthClient() {
  try {
    // Implemente conforme necessário
  } catch (error) {
    console.error('Erro ao inicializar o cliente de autenticação:', error);
  }
}

initializeAuthClient();

// Autenticação
const auth = new google.auth.GoogleAuth({
  keyFile: 'ace-wording-411722-329433a764c0.json',
  scopes: ['https://www.googleapis.com/auth/calendar'],
});

let authClient;

async function initializeAuthClient2() {
  try {
    authClient = await auth.getClient();
  } catch (error) {
    console.error('Erro ao obter o cliente de autenticação:', error);
  }
}

initializeAuthClient2();

async function checkAvailability(calendarId, barberColorId, dateTimeStart, dateTimeEnd) {
  const res = await calendar.events.list({
    auth: authClient,
    calendarId: calendarId,
    timeMin: new Date(dateTimeStart).toISOString(),
    timeMax: new Date(dateTimeEnd).toISOString(),
    singleEvents: true,
    orderBy: 'startTime',
  });

  const events = res.data.items.filter(event => event.colorId === barberColorId);
  return events.length === 0;
}

async function isDuringLunchOrDayOff(calendarId, barberColorId, dateTimeStart, dateTimeEnd) {
  const isAvailable = await checkAvailability(calendarId, barberColorId, dateTimeStart, dateTimeEnd);
  return !isAvailable;
}

async function isDuplicateAppointment(calendarId, barberColorId, dateTimeStart, dateTimeEnd) {
  const res = await calendar.events.list({
    auth: authClient,
    calendarId: calendarId,
    timeMin: new Date(dateTimeStart).toISOString(),
    timeMax: new Date(dateTimeEnd).toISOString(),
    singleEvents: true,
    orderBy: 'startTime',
  });

  const duplicateEvent = res.data.items.find(event => {
    return (
      event.colorId === barberColorId &&
      new Date(event.start.dateTime).getTime() === new Date(dateTimeStart).getTime() &&
      new Date(event.end.dateTime).getTime() === new Date(dateTimeEnd).getTime()
    );
  });

  return !!duplicateEvent;
}

async function createAppointment(calendarId, barberColorId, dateTimeStart, dateTimeEnd) {
  if (await isDuplicateAppointment(calendarId, barberColorId, dateTimeStart, dateTimeEnd)) {
    throw new Error('Duplicate appointment');
  }

  const event = {
    summary: 'Appointment',
    colorId: barberColorId,
    start: {
      dateTime: new Date(dateTimeStart).toISOString(),
    },
    end: {
      dateTime: new Date(dateTimeEnd).toISOString(),
    },
  };

  try {
    const res = await calendar.events.insert({
      auth: authClient,
      calendarId: calendarId,
      resource: event,
    });

    console.log('Event created: %s', res.data.htmlLink);
    return res.data;
  } catch (error) {
    console.error('Error creating event:', error.message);
    throw error;
  }
}

const app = express();

app.use(cors());
app.use(express.json());

app.post('/createAppointment', async (req, res) => {
  const { calendarId, barberColorId, dateTimeStart, dateTimeEnd } = req.body;

  if (
    await checkAvailability(calendarId, barberColorId, dateTimeStart, dateTimeEnd) &&
    !await isDuringLunchOrDayOff(calendarId, barberColorId, dateTimeStart, dateTimeEnd)
  ) {
    try {
      await createAppointment(calendarId, barberColorId, dateTimeStart, dateTimeEnd);
      res.status(200).send('Appointment created.');
    } catch (error) {
      res.status(400).send('Duplicate appointment.');
    }
  } else {
    res.status(400).send('The barber is not available at this time.');
  }
});

app.listen(3000, () => console.log('Server started on port 3000'));
