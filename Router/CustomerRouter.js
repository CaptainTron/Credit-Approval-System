const router = require('express').Router()
const { Register_newCustomer,
    check_eligibility,
    create_loan,
    view_loan,
    make_payment,
    view_statement } = require('../Controller/CustomerController');

router.post('/register', Register_newCustomer);
router.post('/check-eligibility', check_eligibility);
router.post('/create-loan', create_loan); 
router.post('/make-payment/:customer_id/:loan_id', make_payment);
router.get('/view-loan/:loan_id', view_loan);
router.get('/view-statement/:customer_id/:loan_id', view_statement);

module.exports = router