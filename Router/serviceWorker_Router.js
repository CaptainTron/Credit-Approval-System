const router = require('express').Router()
const { CustomerLoans } = require("../worker/customerloansWorker.js")
const { Customer_data } = require("../worker/customerWorker.js")

router.post('/ingest-customer', Customer_data);
router.post('/ingest-loans', CustomerLoans);

module.exports = router