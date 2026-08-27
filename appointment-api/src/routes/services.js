const express = require("express");
const { addAllservices } = require("../controllers/servicesAppointment");

const router = express.Router();

router.post("/services", addAllservices);

module.exports = router;
