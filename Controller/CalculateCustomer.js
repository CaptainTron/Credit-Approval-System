const DBConfig = require("../db/mysql")
const Schema = DBConfig.Customer
const Customer_loans = DBConfig.Customer_loans
const loan = DBConfig.loans

async function calculateCreditScore(customer_id, monthly_income) {
    const historicalLoanData = await loan.findAll({ where: { customer_id } });
    // Initialize variables for credit score components
    let pastLoansPaidOnTime = 0;
    let numberOfLoansTaken = historicalLoanData.length; // Number of loans taken is the count of historical loans
    let loanActivityCurrentYear = 0;
    let loanApprovedVolume = 0;


    // Iterate over historical loan data to calculate credit score components
    // console.log(historicalLoanData[0].dataValues.EMIs_paid_on_Time)
    historicalLoanData.forEach(loan => {
        if (loan.dataValues.EMIs_paid_on_time <= loan.dataValues.tenure) {
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

const updatePaymentDetails = async (remainingAmount, loan_id, loan_completed, EMIs_paid_on_Time) => {

    try {
        await loan.update({ amount_paid: remainingAmount, loan_completed, EMIs_paid_on_Time: EMIs_paid_on_Time + 1 }, { where: { loan_id }, returning: true })
    } catch (err) {
        console.log("ERR", err.message)
    }
}


// This functions will calculate the EMI for given loan, interestRate, and tenure in months
function calculateEMI(loanAmount, interestRate, tenureMonths) {
    let monthlyInterestRate = interestRate / (12 * 100);
    let emi = (loanAmount * monthlyInterestRate * Math.pow(1 + monthlyInterestRate, tenureMonths)) / (Math.pow(1 + monthlyInterestRate, tenureMonths) - 1);
    emi = Math.round(emi * 100) / 100;
    return emi;
}


function calculateTimePeriod(months) {
    let currentDate = new Date();
    // Calculate start date
    let startDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate());
    // Calculate end date
    let endDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + months, currentDate.getDate());
    let formattedStartDate = startDate.getDate().toString().padStart(2, '0') + '-' + (startDate.getMonth() + 1).toString().padStart(2, '0') + '-' + startDate.getFullYear();
    let formattedEndDate = endDate.getDate().toString().padStart(2, '0') + '-' + (endDate.getMonth() + 1).toString().padStart(2, '0') + '-' + endDate.getFullYear();

    return { start_date: formattedStartDate, end_date: formattedEndDate };
}
module.exports = {
    calculateCreditScore,
    updatePaymentDetails,
    calculateEMI,
    calculateTimePeriod
}