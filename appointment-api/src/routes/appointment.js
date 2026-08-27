const express = require("express");
const router = express.Router();
const Appointments=require('../models/appointment_model');

const {
    createAppointment,
    deleteAppointment,
    updateAppointments,
    displayAll_appointments,
    sortAndfilter,
} = require("../controllers/appointmentcontroller");

// CREATE
router.post("/addAppointment", createAppointment);

// READ
router.get("/getAppointments/:_id", displayAll_appointments);

// UPDATE
router.put("/updateAppointment/:id", updateAppointments);
//sorting READ
router.get("/",sortAndfilter);

// DELETE
router.delete("/deleteAppointment/:id", deleteAppointment);

module.exports = router;
