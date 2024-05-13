const express = require("express");
const router = express.Router();
const {
  createAppointmentController,
  checkAvailabilityController,
} = require("../controllers/appointment.controllers");

router.post("/check-availability", checkAvailabilityController);
router.post("/createAppointment", createAppointmentController);

module.exports = router;
