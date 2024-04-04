const router = require('express').Router()
const { CustomerLoans } = require("../worker/customerloansWorker.js")
const { Customer_data } = require("../worker/customerWorker.js")

router.get('/ingest-customer', Customer_data);
router.get('/ingest-loans', CustomerLoans);

module.exports = router