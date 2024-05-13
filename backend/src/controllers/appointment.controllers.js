// const express = require('express');
const { google } = require("googleapis");
// const cors = require('cors');

const calendar = google.calendar("v3");
const { OAuth2Client } = require("google-auth-library");

const client = new OAuth2Client();

async function getAccessToken() {
  try {
    const tokenResponse = await client.getAccessToken({
      scopes: [
        "https://www.googleapis.com/auth/calendar",
        "https://www.googleapis.com/auth/calendar.readonly",
      ],
    });
    return tokenResponse.token;
  } catch (error) {
    console.error("Erro ao obter token:", error);
    throw error;
  }
}

async function initializeAuthClient() {
  try {
    // Implemente conforme necessário
  } catch (error) {
    console.error("Erro ao inicializar o cliente de autenticação:", error);
  }
}

initializeAuthClient();

// Autenticação
const auth = new google.auth.GoogleAuth({
  keyFile: "teste.json",
  scopes: ["https://www.googleapis.com/auth/calendar"],
});

let authClient;

async function initializeAuthClient2() {
  try {
    authClient = await auth.getClient();
  } catch (error) {
    console.error("Erro ao obter o cliente de autenticação:", error);
  }
}

initializeAuthClient2();

async function checkAvailability(
  calendarId,
  barberColorId,
  dateTimeStart,
  dateTimeEnd
) {
  try {
    if (!dateTimeStart || !dateTimeEnd) {
      console.error(
        "dateTimeStart ou dateTimeEnd é inválido:",
        dateTimeStart,
        dateTimeEnd
      );
      throw new Error("dateTimeStart ou dateTimeEnd é inválido");
    }

    const res = await calendar.events.list({
      auth: authClient,
      calendarId: calendarId,
      timeMin: new Date(dateTimeStart).toISOString(),
      timeMax: new Date(dateTimeEnd).toISOString(),
      singleEvents: true,
      orderBy: "startTime",
    });

    const events = res.data.items.filter((event) => {
      return (
        (event.colorId === barberColorId ||
          (event.colorId === "1" && barberColorId !== "1")) &&
        new Date(event.start.dateTime).getTime() <
          new Date(dateTimeEnd).getTime() &&
        new Date(event.end.dateTime).getTime() >
          new Date(dateTimeStart).getTime()
      );
    });
    return events.length === 0;
  } catch (error) {
    console.error("Erro ao verificar disponibilidade:", error);
    throw error;
  }
}

async function isDuringLunchOrDayOff(
  calendarId,
  barberColorId,
  dateTimeStart,
  dateTimeEnd
) {
  const isAvailable = await checkAvailability(
    calendarId,
    barberColorId,
    dateTimeStart,
    dateTimeEnd
  );
  return !isAvailable;
}

async function isDuplicateAppointment(
  calendarId,
  barberColorId,
  dateTimeStart,
  dateTimeEnd
) {
  try {
    if (!dateTimeStart || !dateTimeEnd) {
      console.error(
        "dateTimeStart ou dateTimeEnd é inválido:",
        dateTimeStart,
        dateTimeEnd
      );
      throw new Error("dateTimeStart ou dateTimeEnd é inválido");
    }

    const res = await calendar.events.list({
      auth: authClient,
      calendarId: calendarId,
      timeMin: new Date(dateTimeStart).toISOString(),
      timeMax: new Date(dateTimeEnd).toISOString(),
      singleEvents: true,
      orderBy: "startTime",
    });

    const duplicateEvent = res.data.items.find((event) => {
      return (
        (event.colorId === barberColorId ||
          (event.colorId === "1" && barberColorId !== "1")) &&
        new Date(event.start.dateTime).getTime() ===
          new Date(dateTimeStart).getTime() &&
        new Date(event.end.dateTime).getTime() ===
          new Date(dateTimeEnd).getTime()
      );
    });

    return !!duplicateEvent;
  } catch (error) {
    console.error("Erro ao verificar duplicidade de compromisso:", error);
    throw error;
  }
}

async function createAppointment(
  clientName,
  clientPhone,
  calendarId,
  barberColorId,
  dateTimeStart,
  dateTimeEnd
) {
  try {
    if (
      await isDuringLunchOrDayOff(
        calendarId,
        barberColorId,
        dateTimeStart,
        dateTimeEnd
      )
    ) {
      throw new Error("The barber is not available at this time.");
    }

    if (
      await isDuplicateAppointment(
        calendarId,
        barberColorId,
        dateTimeStart,
        dateTimeEnd
      )
    ) {
      throw new Error("Duplicate appointment");
    }

    const event = {
      summary: `${clientName} - ${clientPhone}`,
      colorId: barberColorId,
      start: {
        dateTime: new Date(dateTimeStart).toISOString(),
      },
      end: {
        dateTime: new Date(dateTimeEnd).toISOString(),
      },
    };

    const res = await calendar.events.insert({
      auth: authClient,
      calendarId: calendarId,
      resource: event,
    });

    console.log("Event created: %s", res.data.htmlLink);
    return res.data;
  } catch (error) {
    console.error("Error creating appointment:", error);
    throw error;
  }
}

// Leitura da variável de ambiente ALLOWED_SITES e separação em uma lista
// const allowedSites = process.env.ALLOWED_SITES.split(",");

// const corsOptions = {
//   origin: function (origin, callback) {
//     // Verifica se a origem da solicitação está na lista de sites permitidos
//     if (!origin || allowedSites.indexOf(origin) !== -1) {
//       callback(null, true);
//     } else {
//       callback(new Error("Acesso não permitido pela política CORS"));
//     }
//   },
// };

// app.use(cors(corsOptions));
// app.use(express.json());

// Lista de horários de meia em meia hora (06:00 - 23:00)
const normalTimes = [
  "06:00-06:30",
  "06:30-07:00",
  "07:00-07:30",
  "07:30-08:00",
  "08:00-08:30",
  "08:30-09:00",
  "09:00-09:30",
  "09:30-10:00",
  "10:00-10:30",
  "10:30-11:00",
  "11:00-11:30",
  "11:30-12:00",
  "12:00-12:30",
  "12:30-13:00",
  "15:00-15:30",
  "15:30-16:00",
  "16:00-16:30",
  "16:30-17:00",
  "17:00-17:30",
  "17:30-18:00",
  "18:00-18:30",
  "18:30-19:00",
  "19:00-19:30",
  "19:30-20:00",
  "20:00-20:30",
  "20:30-21:00",
  "21:00-21:30",
  "21:30-22:00",
  "22:00-22:30",
  "22:30-23:00",
];

const extendedTimes = [
  "06:00-07:00",
  "07:00-08:00",
  "08:00-09:00",
  "09:00-10:00",
  "10:00-11:00",
  "11:00-12:00",
  "12:00-13:00",
  "15:00-16:00",
  "16:00-17:00",
  "17:00-18:00",
  "18:00-19:00",
  "19:00-20:00",
  "20:00-21:00",
  "21:00-22:00",
  "22:00-23:00",
];

const checkAvailabilityController = async (req, res) => {
  const { calendarId, barberColorId, start, end, timeType } = req.body;
  let timesToCheck = [];

  if (timeType === "normalTimes") {
    timesToCheck = normalTimes;
  } else if (timeType === "extendedTimes") {
    timesToCheck = extendedTimes;
  } else {
    return res.status(400).json({ error: "Tipo de horário inválido" });
  }

  try {
    const response = await calendar.events.list({
      auth: authClient,
      calendarId: calendarId,
      timeMin: start,
      timeMax: end,
      singleEvents: true,
      orderBy: "startTime",
    });

    const events = response.data.items;
    const availability = {};

    timesToCheck.forEach((time) => {
      const startTime = new Date(
        `${start.split("T")[0]}T${time.split("-")[0]}:00`
      );
      const endTime = new Date(
        `${start.split("T")[0]}T${time.split("-")[1]}:00`
      );

      const isAvailable = !events.some((event) => {
        const eventStart = new Date(event.start.dateTime);
        const eventEnd = new Date(event.end.dateTime);

        // Verifica se o evento ocorre dentro do intervalo de tempo definido pelos horários startTime e endTime
        const isEventDuringTimeSlot =
          (eventStart <= startTime && eventEnd >= endTime) ||
          (eventStart >= startTime && eventStart < endTime) ||
          (eventEnd > startTime && eventEnd <= endTime);

        // Verifica se o colorId do evento é igual ao barberColorId ou se é '1' (disponível para qualquer barbeiro)
        const isSameColorOrAvailableForAnyBarber =
          event.colorId === barberColorId || event.colorId === "1";

        return isEventDuringTimeSlot && isSameColorOrAvailableForAnyBarber;
      });

      availability[time] = isAvailable;
    });

    res.json(availability);
  } catch (error) {
    console.error("Erro ao verificar disponibilidade:", error);
    res
      .status(500)
      .json({ error: "Ocorreu um erro ao verificar a disponibilidade." });
  }
};

const createAppointmentController = async (req, res) => {
  const {
    clientName,
    clientPhone,
    calendarId,
    barberColorId,
    dateTimeStart,
    dateTimeEnd,
  } = req.body;

  if (
    (await checkAvailability(
      calendarId,
      barberColorId,
      dateTimeStart,
      dateTimeEnd
    )) &&
    !(await isDuringLunchOrDayOff(
      calendarId,
      barberColorId,
      dateTimeStart,
      dateTimeEnd
    ))
  ) {
    try {
      await createAppointment(
        clientName,
        clientPhone,
        calendarId,
        barberColorId,
        dateTimeStart,
        dateTimeEnd
      );
      res.status(200).send("Appointment created.");
    } catch (error) {
      res.status(400).send("Duplicate appointment.");
    }
  } else {
    res.status(400).send("The barber is not available at this time.");
  }
};

module.exports = {
  createAppointmentController,
  checkAvailabilityController,
};
