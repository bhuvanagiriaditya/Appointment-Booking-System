const express = require("express");
require("dotenv").config();

const { z } = require("zod");
const Appointments = require("./src/models/appointment_model.js");
const { connectMongoDb } = require('./db.js');

const appointmentRouter = require("./src/routes/appointment.js");
const service = require("./src/routes/services.js");

const app = express();
const port = process.env.PORT || 8000;
const mongo_url = process.env.MONGO_URL || process.env.mongo_url;
// Centralized Error Handler (MUST be defined AFTER all routes)
app.use((err, req, res, next) => {
   
    if (err instanceof z.ZodError) {
        return res.status(400).json({
            success: false,
            message: "Validation Error",
            errors: err.issues
        });
    }

    return res.status(err.status || 500).json({
        success: false,
        error: err.message || "Internal Server Error",
    });
});

// 1. Connect Database
connectMongoDb(mongo_url)
    .then(() => console.log("MongoDB connected"))
    .catch((e) => console.log("DB Connection Error:", e));

// 2. Parse JSON Body (Call once before routes)
app.use(express.json());

// 3. Mount Routes
app.use("/appointments", appointmentRouter);
app.use("/api", service);

// Pagination Endpoint
app.get("/pagination", async (req, res, next) => {
    try {
        const page = Math.max(1, Number(req.query.page) || 1);
        const limit = Math.max(1, Number(req.query.limit) || 10);
        const skip = (page - 1) * limit;

        const [appointments, totalAppointments] = await Promise.all([
            Appointments.find().sort({ createdAt: -1 }).skip(skip).limit(limit),
            Appointments.countDocuments()
        ]);

        const totalPages = Math.ceil(totalAppointments / limit);

        return res.status(200).json({
            success: true,
            page,
            limit,
            totalAppointments,
            totalPages,
            appointments,
        });
    } catch (error) {
        next(error); // Pass error down to centralized error handler
    }
});



// 5. Start Server
const startapp = () => {
    try {
        app.listen(port, () => {
            console.log(`App started at http://localhost:${port}`);
        });
    } catch (e) {
        console.log("Server Start Error:", e);
    }
};

startapp();