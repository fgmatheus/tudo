require("dotenv").config();
// ---- Inicializado conexaoes -----
const express = require("express");
const app = express();
const path = require("path");
const cors = require("cors");

const appointmentRoutes = require("./routes/appointment.routes");

app.use(cors());
app.use(express.json());
app.use("/", appointmentRoutes);

module.exports = app;
