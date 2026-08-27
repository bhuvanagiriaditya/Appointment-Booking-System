const services = require("../models/services_model");
const fs = require("fs").promises;
const path = require("path");

const addAllservices = async (req, res) => {
  try {
    const filePath = path.join(__dirname, "../../services.json");

    const data = await fs.readFile(filePath, "utf-8");
    const serviceData = JSON.parse(data);

    console.log(serviceData);

    await services.insertMany(serviceData);

    res.status(201).json({
      msg: "services added successfully",
    });
  } catch (e) {
    res.status(500).json({
      error: e.message,
    });
  }
};

module.exports = { addAllservices };
