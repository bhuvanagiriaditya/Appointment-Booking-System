const express = require("express");
const server = express();
const Appointments = require("./src/models/appointment_model.js");


require("dotenv").config();
const { connectMongoDb } = require('./db.js');

const port = process.env.port || 8000;
const mongo_url = process.env.mongo_url;
connectMongoDb(mongo_url).then(
    console.log("mongodB connected")
).catch(e => console.log(e))


// Middleware to read JSON request body
server.use(express.json());

// Import appointment routes
const appointmentRouter = require("./src/routes/appointment.js");
const service = require("./src/routes/services.js");
server.use(express.json());

// Mount appointment routes
server.use("/appointments", appointmentRouter);
server.use("/api", service);
//pagination
server.get("/pagination", async (req, res) => {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip=(page-1)*limit;
    const appointments = await Appointments.find().sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);
        
    const totalUsers = await Appointments.countDocuments();
    const totalPages = Math.ceil(totalUsers / limit);


    res.json({
        page,
        limit,
        totalUsers,
        totalPages,
        appointments,

    });

})

const startServer = async () => {
    try {
        server.listen(port, () => {
            console.log(`Server started at http://localhost:${port}`);
        });
    } catch (e) {
        console.log(e);
    }
};

startServer();
