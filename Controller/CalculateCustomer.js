const DBConfig = require("../db/mysql")
const Schema = DBConfig.Customer
const Customer_loans = DBConfig.Customer_loans
const loan = DBConfig.loans

async function calculateCreditScore(customer_id, monthly_income) {
    const historicalLoanData = await loan.findAll({ customer_id });
    // Initialize variables for credit score components
    let pastLoansPaidOnTime = 0;
    let numberOfLoansTaken = historicalLoanData.length; // Number of loans taken is the count of historical loans
    let loanActivityCurrentYear = 0;
    let loanApprovedVolume = 0;


    // Iterate over historical loan data to calculate credit score components
    // console.log(historicalLoanData[0].dataValues.EMIs_paid_on_Time)
    historicalLoanData.forEach(loan => {
        if (loan.dataValues.EMIs_paid_on_time === loan.dataValues.tenure) {
            pastLoansPaidOnTime++;
        }
        const currentDate = new Date();
        const loanStartDate = new Date(loan.start_date);
        if (loanStartDate.getFullYear() === currentDate.getFullYear()) {
            loanActivityCurrentYear++;
        }

        loanApprovedVolume += loan.loan_amount;
    });

    // Calculate credit score
    let creditScore = 0;
    creditScore += (pastLoansPaidOnTime / numberOfLoansTaken) * 100;
    // console.log(numberOfLoansTaken)

    creditScore += (loanActivityCurrentYear / 5) * 100;

    // Assuming monthly salary is available, adjust this calculation accordingly
    const maxLoanVolumePercentage = 0.5; // Assuming 50% of monthly salary
    const loanVolumePercentage = loanApprovedVolume / (monthly_income * maxLoanVolumePercentage) * 100;
    creditScore += loanVolumePercentage;

    // Ensure credit score is not fractional
    creditScore = Math.round(creditScore);
    if (!creditScore) creditScore = 0;
    return creditScore;
}

const calculateMonthlyInstallment = (loan_amount, interest_rate, tenure) => {
    // Convert annual interest rate to monthly interest rate
    const monthly_interest_rate = (interest_rate / 12) / 100;

    // Convert tenure from years to months
    const n = tenure * 12;

    // Calculate monthly installment using mortgage formula
    //  calculateCreditScore(customer_id, monthly_income)
    const monthly_installment = loan_amount * monthly_interest_rate * Math.pow(1 + monthly_interest_rate, n) / (Math.pow(1 + monthly_interest_rate, n) - 1);

    // Round to two decimal places
    return parseFloat(monthly_installment.toFixed(2));
}

const updatePaymentDetails = async (remainingAmount, loan_id, loan_completed) => {

    try {
        await loan.update({ amount_paid: remainingAmount, loan_completed }, { where: { loan_id }, returning: true })
    } catch (err) {
        console.log("ERR", err.message)
    }
}

module.exports = {
    calculateCreditScore,
    calculateMonthlyInstallment,
    updatePaymentDetails,
}