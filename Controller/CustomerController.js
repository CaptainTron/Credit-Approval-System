const DBConfig = require("../db/mysql")
const register = DBConfig.register
const loans = DBConfig.loans

const { calculateCreditScore,
    calculateMonthlyInstallment,
    updatePaymentDetails }
    = require("./CalculateCustomer")



// This Function Will Register Customer
const Register_newCustomer = async (req, res) => {
    try {
        const { monthly_income } = req.body
        let approved_limit = monthly_income * 36
        let Customer = await register.create({ ...req.body, approved_limit })
        res.status(201).json({ status: "Successful", Customer })
    } catch (err) {
        if (err.name === 'SequelizeUniqueConstraintError') {
            res.status(500).json({ message: "Phone Number Already taken!", status: err.name })
        }
    }
}

const check_eligibility = async (req, res) => {
    const { customer_id, loan_amount, interest_rate, tenure } = req.body;
    let customer = await register.findOne({ customer_id })
    let creditScore = 0;
    if (customer.approved_limit < loan_amount) {
        creditScore = 0;
    } else {
        creditScore = calculateCreditScore(customer_id, customer?.monthly_income ? customer.monthly_income : 0);
    }

    let approval = false;
    let corrected_interest_rate = interest_rate;
    let monthly_installment = 0;

    if (creditScore > 50) {
        approval = true;
    } else if (creditScore > 30) {
        if (interest_rate <= 12) {
            corrected_interest_rate = 12;
        }
        approval = true;
    } else if (creditScore > 10) {
        if (interest_rate <= 16) {
            corrected_interest_rate = 16;
        }
        approval = true;
    }

    // Send response
    res.status(200).json({
        status: {
            customer_id,
            approval,
            interest_rate,
            corrected_interest_rate,
            tenure,
            monthly_installment
        }
    })
}


const create_loan = async (req, res) => {
    try {
        const { customer_id, loan_amount, interest_rate, tenure } = req.body;
        let loanApproved = false
        let monthly_installment = 0;
        let loanDetails;
        let creditScore = 51
        let loan_approved = loan_amount


        // Check if elegible or not!!
        // let customer = await register.findOne({ customer_id })
        // if (customer.approved_limit < loan_approved) {
        //     creditScore = 0;
        // } else {
        //     creditScore = calculateCreditScore(customer_id, customer?.monthly_income ? customer.monthly_income : 0);
        // }

        if (creditScore > 50) {
            loanApproved = true;
            let remaining_amount = loan_amount, EMIs_paid_on_Time = 0
            message = 'Loan approved';
            monthly_installment = calculateMonthlyInstallment(loan_approved, interest_rate, tenure);
            loanDetails = await loans.create({
                customer_id,
                monthly_installment,
                tenure,
                interest_rate,
                loan_approved,
                EMIs_paid_on_Time,
            })
        } else {
            message = 'Loan not approved. Customer does not meet eligibility criteria.';
            loanDetails = "Not Approved!"
        }

        if (loanApproved) {
            res.status(201).json({
                status: {
                    ...loanDetails.dataValues,
                    loanApproved,
                    message
                }
            })
        } else {
            res.status(400).json({
                status: {
                    ...loanDetails.dataValues,
                    loanApproved,
                    message
                }
            })
        }
    } catch (err) {
        console.log(err.message)
        res.status(500).json({ status: 'Something Went Wrong' })

    }
}

// View Loans goes here...
const view_loan = async (req, res) => {
    try {
        const loan_id = req.params.loan_id;

        const loan = await loans.findOne({ where: { loan_id: loan_id } })
        if (loan === null) {
            res.status(200).json({ status: "No Loan Found!" })
            return;
        }
        let customer_id = loan.dataValues.customer_id
        const { first_name, last_name, age, phone_number } = await register.findOne({ customer_id });

        // Send response
        res.status(200).json({ status: { ...loan.dataValues, customerDetails: { first_name, last_name, age, phone_number, customer_id } } })
    } catch (err) {
        console.log(err.message)
        res.status(400).json({ status: 'Invalid Input' })
    }
}

// This will delete Note provided NID (Note ID) as a path parameter.
const make_payment = async (req, res) => {
    try {
        // Extract customer_id and loan_id from request parameters
        const { customer_id, loan_id } = req.params;

        // Extract payment amount from request body
        const paymentAmount = req.body.payment_amount;

        // Fetch loan details from the database based on loan_id (pseudo-code)
        let loanDetails = await loans.findOne({ where: { loan_id, customer_id } });
        loanDetails = loanDetails.dataValues
        if (loanDetails.loan_completed) {
            res.status(400).json({ status: "Completed", message: 'Loan amount completed' });
            return
        }
        // Calculate the total amount due for all remaining EMIs
        const totalDueAmount = loanDetails.loan_approved - loanDetails.amount_paid;

        // Check if the payment amount is less than or equal to the total due amount
        let isCompleted = false
        if (paymentAmount <= totalDueAmount) {
            // Calculate remaining amount after payment
            let remainingAmount = totalDueAmount - paymentAmount
            let amount_paid = loanDetails.amount_paid + paymentAmount
            if (loanDetails.loan_approved === amount_paid) { isCompleted = true }
            updatePaymentDetails(amount_paid, loan_id, isCompleted);
            // Send success response with remaining amount
            res.status(201).json({ success: true, remaining_amount: remainingAmount, isCompleted: isCompleted });
        }
        else {
            // Payment amount exceeds total due amount, send error response
            res.status(400).json({ success: false, error: 'Payment amount exceeds total due amount' });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

const view_statement = async (req, res) => {
    // Extract customer_id and loan_id from request parameters
    const customer_id = req.params.customer_id;
    const loan_id = req.params.loan_id;

    // Fetch loan details from the database based on customer_id and loan_id (pseudo-code)
    // let loan = await Customer_loans.findOne({ customer_id, loan_id });
    let loanDetails = await loans.findOne({ where: { customer_id, loan_id } });
    loanDetails = loanDetails.dataValues
    let amount_paid = loanDetails.amount_paid

    let loan_completed = loanDetails.loan_completed
    // Check if loan details exist
    if (loanDetails) {
        // Construct response body with loan details
        const responseBody = {
            customer_id: loanDetails.customer_id,
            loan_id: loanDetails.loan_id,
            principal: loanDetails.loan_amount,
            interest_rate: loanDetails.interest_rate,
            amount_paid: amount_paid,
            monthly_installment: loanDetails.monthly_installment,
            repayments_left: parseInt(loanDetails.tenure) - loanDetails.EMIs_paid_on_Time, // Calculate remaining EMIs
            loan_completed
        };
        // Send response with statement of the particular loan
        res.status(200).json(responseBody);
    } else {
        // Loan details not found, send error response
        res.status(404).json({ error: 'Loan details not found' });
    }
}



module.exports = {
    Register_newCustomer,
    check_eligibility,
    create_loan,
    view_loan,
    make_payment,
    view_statement
}