const { json } = require("zod");
const Appointment = require("../models/appointment_model");
const Service = require("../models/services_model");

// Wraps an async route handler so rejected promises are passed to
// Express's centralized error handler instead of hanging the request.
const asyncHandler = (fn) => (req, res, next) =>
    Promise.resolve(fn(req, res, next)).catch(next);

// Shared operating-hours check (10:00 AM - 8:00 PM), used by both
// create and update so the rule can't be bypassed via update.
const validateOperatingHours = (time_slot) => {
    const [time, modifier] = time_slot.toLowerCase().split(" ");
    let [hours] = time.split(":").map(Number);

    if (modifier === "pm" && hours !== 12) hours += 12;
    if (modifier === "am" && hours === 12) hours = 0;

    if (Number.isNaN(hours) || hours < 10 || hours >= 20) {
        const err = new Error("Slot booking is only available between 10:00 AM and 8:00 PM.");
        err.status = 400;
        throw err;
    }
};

// Create a new appointment
const createAppointment = asyncHandler(async (req, res) => {
    const { customer_name, customer_email, services, time_slot, appointment_date,age } = req.body;

    // 1. Verify operating hours
    validateOperatingHours(time_slot);
    
    

    // 2. Validate service exists
    const existingService = await Service.findOne({ service_name:services });
        console.log(existingService);
    if (!existingService) {
        return res.status(404).json({
            success: false,
            message: "Service not found."
        });
    }

    // 3. Prevent double booking
    const slotBooked = await Appointment.findOne({
        services,
        time_slot,
        appointment_date,
        status: "booked"
    });

    if (slotBooked) {
        return res.status(409).json({
            success: false,
            message: "This time slot is already booked for the selected service."
        });
    }

    // 4. Create appointment
    const appointment = await Appointment.create({
        customer_name,
        customer_email,
        time_slot,
        services,
        age,
        appointment_date,
        status: "booked"
    });

    return res.status(201).json({
        success: true,
        message: "Appointment booked successfully",
        appointment
    });
});

// Fetch single appointment by ID
const getAppointmentById = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const appointment = await Appointment.findById(id);

    if (!appointment) {
        return res.status(404).json({
            success: false,
            message: "Appointment not found"
        });
    }

    return res.status(200).json({
        success: true,
        appointment
    });
});

// Sort and filter appointments
const sortAndFilterAppointments = asyncHandler(async (req, res) => {
    const { status, day, month, year } = req.query;
    const filter = {};

    if (status) {
        filter.status = status;
    }

    if (day && month && year) {
        const formattedDay = String(day).padStart(2, "0");
        const formattedMonth = String(month).padStart(2, "0");
        filter.appointment_date = `${formattedDay}-${formattedMonth}-${year}`;
    }

    const appointments = await Appointment.find(filter).sort({ createdAt: -1 });

    return res.status(200).json({
        success: true,
        count: appointments.length,
        appointments
    });
});

// Update appointment
const updateAppointment = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { services, time_slot, appointment_date } = req.body;

    // Only touch fields that were actually provided, so a partial
    // update can't accidentally wipe out other fields.
    const updateFields = {};
    if (services !== undefined) updateFields.services = services;
    if (time_slot !== undefined) updateFields.time_slot = time_slot;
    if (appointment_date !== undefined) updateFields.appointment_date = appointment_date;

    // Re-run the operating-hours check if the time slot is changing.
    if (time_slot !== undefined) {
        validateOperatingHours(time_slot);
    }

    // Fetch the current appointment so the conflict check can fall
    // back to existing values for any field that wasn't provided.
    const current = await Appointment.findById(id);
    if (!current) {
        return res.status(404).json({
            success: false,
            message: "Appointment not found."
        });
    }

    const conflictingSlot = await Appointment.findOne({
        _id: { $ne: id },
        services: services ?? current.services,
        time_slot: time_slot ?? current.time_slot,
        appointment_date: appointment_date ?? current.appointment_date,
        status: "booked"
    });

    if (conflictingSlot) {
        return res.status(409).json({
            success: false,
            message: "Target time slot is already booked."
        });
    }

    const updatedAppointment = await Appointment.findByIdAndUpdate(
        id,
        updateFields,
        { new: true, runValidators: true }
    );

    return res.status(200).json({
        success: true,
        message: "Appointment updated successfully",
        appointment: updatedAppointment
    });
});

// Delete appointment
const deleteAppointment = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const deletedAppointment = await Appointment.findByIdAndDelete(id);

    if (!deletedAppointment) {
        return res.status(404).json({
            success: false,
            message: "Appointment not found."
        });
    }

    return res.status(200).json({
        success: true,
        message: "Appointment deleted successfully"
    });
});

module.exports = {
    createAppointment,
    getAppointmentById,
    sortAndFilterAppointments,
    updateAppointment,
    deleteAppointment
};