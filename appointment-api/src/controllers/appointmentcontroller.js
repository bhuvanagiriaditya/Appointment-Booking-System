const appointments = require("../models/appointment_model");
const SeRvices = require("../models/services_model");
//book appointment
const createAppointment = async (req, res) => {
    try {
        const { customer_name, customer_email, services, time_slot, appointment_date } = req.body;
        let [time,modifier]=time_slot.toLowerCase().split(" ");
        let [hours,minutes]=time.split(":").map(Number);
        if(modifier=="pm" && hours!==12) hours+=12;
        if(modifier=="am"  && hours===12) hours=0;
        const date=new Date();
        date.setHours(hours,minutes,0,0);
         if(hours>=20 || hours<=10 ){
            return res.status(409).json({
                message:"slot booking starts at 10:00 AM and ends at 8:00 pm"
            })
        }

        

        
        const Services = await SeRvices.find({services});
        if (!Services) {
            return res.status(404).json(
                {
                    message: "service not found"
                }
            );
        }

        const existingAppointment = await appointments.findOne({
           
            services, time_slot, appointment_date,
            status: "booked",

        })
        if (existingAppointment) {
            return res.status(409).json({
                message: "slot is already booked",
            })
        }
        
       
        const createAppointment =await appointments.create({
            customer_name,
            customer_email,
            time_slot,
            status: "booked",
            services,
            appointment_date,



        })
        return res.status(201).json({
            message: "appointment booked",
            
        })

    }
    catch (e) {
        res.json({
            err: e.message,
        })
    }



}
// get all apointments
const displayAll_appointments = async (req, res) => {
    try {
        const { _id } = req.params;

        const appointment = await appointments.findById(_id).sort({createdAt:-1});

        if (!appointment) {
            return res.status(404).json({
                message: "Appointment not found"
            });
        }

        return res.status(200).json({
            msg: appointment
        });

    } catch (e) {
        return res.status(500).json({
            message: "Server error",
            error: e.message
        });
    }
};
//sort and filter
const sortAndfilter=async (req,res)=>{
    try{
        const {status,day,month,year}=req.query;
        
        const filter={};
        if(status ){
            
            filter.status=status;
        }
        if(day&&month&&year){
               filter.appointment_date=`${day}-${month}-${year}`;
        }
        console.log(filter)
        const appointment=await appointments.find(filter).sort({createdAt:-1})
        return  res.json({
            appointment
        })

    }
    catch(e){
        res.json({
            err:e.message,
        })

    }
}
//update appointmets
const updateAppointments = async (req, res) => {
    try {
        const { id } = req.params;
        const { services, time_slot, appointment_date } = req.body;

        // Check if another appointment already has this slot
        const existingAppointment = await appointments.findOne({
            _id: { $ne: id },
            services,
            time_slot,
            appointment_date,
            status: "booked"
        });

        if (existingAppointment) {
            return res.status(409).json({
                message: "Slot is already booked"
            });
        }

        // Update the appointment
        const update = await appointments.findByIdAndUpdate(
            id,
            {
                services,
                time_slot,
                appointment_date
            },
            {
                new: true,
                runValidators: true
            }
        );

        if (!update) {
            return res.status(404).json({
                msg: "Appointment not found"
            });
        }

        return res.status(200).json({
            msg: update
        });

    } catch (e) {
        return res.status(500).json({
            err: e.message
        });
    }
};

//delete appointment 
const deleteAppointment = async (req, res) => {
    try {
        const { id } = req.params;

        const deletedAppointment = await appointments.findByIdAndDelete(id);

        if (!deletedAppointment) {
            return res.status(404).json({
                message: "Appointment not found"
            });
        }

        return res.status(200).json({
            message: "Appointment deleted successfully"
        });

    } catch (e) {
        return res.status(500).json({
            message: "Server error",
            error: e.message
        });
    }
};
module.exports = {
    createAppointment,
    deleteAppointment,
    updateAppointments,
    displayAll_appointments,
    sortAndfilter,
}