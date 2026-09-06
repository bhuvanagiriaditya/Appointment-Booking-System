const { z } = require("zod");


//schema validation for appointment
const validateSchema=z.object({
    customer_name:z.string().min(3,"name is required"),
    customer_email:z.string().email(),
    time_slot:z.string(),
    services:z.string(),
    // Expects "DD-MM-YYYY" to match the format used elsewhere
    // (sortAndFilterAppointments builds filter.appointment_date the same way).
    appointment_date:z.string().regex(
        /^\d{2}-\d{2}-\d{4}$/,
        "appointment_date must be in DD-MM-YYYY format"
    ),
   age: z.number().min(1, "age is required"),

})



module.exports={validateSchema};