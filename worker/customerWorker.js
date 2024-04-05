// workers/customerWorker.js
const cust = require("../db/mysql");
const Customer = cust.register

// Function to ingest customer data from Excel file
const Customer_data = async (req, res) => {
  try {
    let data = req.body
    await Customer.bulkCreate(data);
    res.status(201).json({ status: "customer_data Successfully Pushed :)" })
  } catch (error) {
    console.error('Error ingesting loan_data:', error);
    res.status(400).json({ message: "Can not ingest again, duplicate key Found!", status: "duplicate key found in data!!" })
  }
};

module.exports = { Customer_data };
