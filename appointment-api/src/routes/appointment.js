const express = require("express");
const router = express.Router();

const {
    createAppointment,
    getAppointmentById,
    sortAndFilterAppointments,
    updateAppointment,
    deleteAppointment
} = require("../controllers/appointmentcontroller");

const { validateSchema } = require("../../validators/validatesAppointment");

// Generic Zod-checking middleware. Passes the ZodError to next() so
// your centralized error handler's `err instanceof z.ZodError` branch
// in index.js catches it and returns a 400 with `err.issues`.
const validate = (schema) => (req, res, next) => {
    const result = schema.safeParse(req.body);
    if (!req.body.age) {
        return next("age is required");
    }
    if (!result.success) return next(result.error);
    req.body = result.data;
    next();
};

// CREATE
router.post("/addAppointment", validate(validateSchema), createAppointment);

// READ
// NOTE: was ":_id" — the controller reads req.params.id, so this was
// always undefined. Fixed to ":id" to match.
router.get("/getAppointments/:id", getAppointmentById);

// UPDATE
router.put("/updateAppointment/:id", validate(validateSchema.partial()), updateAppointment);

// sorting READ
router.get("/", sortAndFilterAppointments);

// DELETE
router.delete("/deleteAppointment/:id", deleteAppointment);

module.exports = router;