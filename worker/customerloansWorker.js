// workers/customerloansWorker.js
const cust = require("../db/mysql");
const loans = cust.loans

// Function to ingest customer Loans data from Excel file
const CustomerLoans = async (req, res) => {
  try {
    // const loan_data = require('../data/loan_data.json')
    let loan_data = req.body
    // Insert customers Loans into the database
    await loans.bulkCreate(loan_data);
    res.status(201).json({ status: "loan_data Successfully Injected!" })
  } catch (error) {
    console.error('Error ingesting loan_data:', error);
    res.status(400).json({ message: "Can not ingest again, duplicate key Found!", status: "duplicate key found in data!!" })
  }
};

module.exports = { CustomerLoans };
