module.exports = (sequelize, DataTypes) => {
  const loans = sequelize.define('customerloans', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    loan_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    customer_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    loan_approved: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    monthly_installment: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    tenure: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    interest_rate: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    EMIs_paid_on_Time: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    start_date: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    end_date: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
  });
  return loans;
}