# Appointment Booking System — API

A REST API for booking, managing, and tracking appointments across a set of medical services, built with Node.js, Express, and MongoDB.

## Features

- Book an appointment for a service, date, and time slot
- Prevents double-booking the same service/date/time slot
- Enforces booking hours (10:00 AM – 8:00 PM)
- Fetch, update, and cancel/delete appointments
- Filter/sort appointments by status or date
- Paginated appointment listing
- Seed the database with a predefined list of services from `services.json`

## Tech Stack

- **Node.js** / **Express 5**
- **MongoDB** with **Mongoose**
- **dotenv** for environment configuration
- **nodemon** for local development

## Project Structure

```
appointment-api/
├── index.js                     # App entry point, server bootstrap, pagination route
├── db.js                        # MongoDB connection helper
├── services.json                # Seed data for services
├── package.json
└── src/
    ├── controllers/
    │   ├── appointmentcontroller.js   # Create, read, update, delete, sort/filter appointments
    │   └── servicesAppointment.js     # Seed services into the database
    ├── models/
    │   ├── appointment_model.js       # Appointment schema
    │   └── services_model.js          # Service schema
    └── routes/
        ├── appointment.js             # /appointments routes
        └── services.js                # /api routes
```

## Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- A MongoDB instance (local or Atlas)

### Installation

```bash
git clone https://github.com/bhuvanagiriaditya/Appointment-Booking-System.git
cd Appointment-Booking-System/appointment-api
npm install
```

### Environment Variables

Create a `.env` file in the `appointment-api` directory:

```env
mongo_url=<your MongoDB connection string>
port=8000
```

### Run the Server

```bash
npm start
```

The server starts at `http://localhost:8000` (or the port set in `.env`).

## API Reference

### Services

| Method | Endpoint        | Description                                  |
|--------|-----------------|-----------------------------------------------|
| POST   | `/api/services`  | Seed the database with services from `services.json` |

### Appointments

| Method | Endpoint                              | Description                                      |
|--------|----------------------------------------|---------------------------------------------------|
| POST   | `/appointments/addAppointment`         | Book a new appointment                            |
| GET    | `/appointments/getAppointments/:_id`   | Get a single appointment by ID                    |
| GET    | `/appointments/`                       | Filter/sort appointments (`status`, `day`, `month`, `year` query params) |
| PUT    | `/appointments/updateAppointment/:id`  | Update an existing appointment                    |
| DELETE | `/appointments/deleteAppointment/:id`  | Delete an appointment                             |

### Pagination

| Method | Endpoint      | Description                                              |
|--------|---------------|------------------------------------------------------------|
| GET    | `/pagination` | List appointments with `page` and `limit` query params    |

### Example: Book an Appointment

```http
POST /appointments/addAppointment
Content-Type: application/json

{
  "customer_name": "John Doe",
  "customer_email": "john@example.com",
  "services": "Dental Care",
  "appointment_date": "27-08-2026",
  "time_slot": "11:00 AM"
}
```

## Appointment Rules

- Bookings are only accepted between **10:00 AM and 8:00 PM**.
- A service cannot be double-booked for the same date and time slot while its status is `booked`.

## License

ISC
