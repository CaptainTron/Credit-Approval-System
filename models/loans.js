module.exports = (sequelize, DataTypes) => {
    const loans = sequelize.define('loans', {
        loan_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            unique: true
        },
        customer_id: {
            type: DataTypes.FLOAT,
            allowNull: false,
        },
        EMIs_paid_on_Time: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        loan_approved: {
            type: DataTypes.FLOAT,
            allowNull: false,
        },
        interest_rate: {
            type: DataTypes.FLOAT,
            allowNull: false,
        },
        tenure: {
            type: DataTypes.FLOAT,
            allowNull: false,
        },
        monthly_installment: {
            type: DataTypes.FLOAT,
            allowNull: false,
        },
        amount_paid: {
            type: DataTypes.FLOAT,
            allowNull: false,
            defaultValue: 0,
        },
        loan_completed: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },
        start_date: {
            type: DataTypes.FLOAT,
            allowNull: true,
        },
        end_date: {
            type: DataTypes.FLOAT,
            allowNull: true,
        },
    });
    return loans;
}