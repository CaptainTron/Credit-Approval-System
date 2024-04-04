// workers/customerWorker.js
const cust = require("../db/mysql");
const Customer = cust.Customer

// Function to ingest customer data from Excel file
const Customer_data = async (req, res) => {
  try {
    const customerss = require('../data/customer_data.json')
    await Customer.bulkCreate(customerss);
    res.status(201).json({ status: "customer_data Successfully Pushed :)" })
  } catch (error) {
    console.error('Error ingesting customer data:', error.message);
    res.status(500).json({ message: "Something Went Wrong..." })
  }
};

module.exports = { Customer_data };
 