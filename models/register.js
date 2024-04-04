module.exports = (sequelize, DataTypes) => {
    const register = sequelize.define('register', {
        customer_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            unique: true,
        },
        first_name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        last_name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        phone_number: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        }, 
        monthly_income: {
            type: DataTypes.FLOAT,
            allowNull: false,
        },
        age: {
            type: DataTypes.FLOAT,
            allowNull: false,
        },
        approved_limit: {
            type: DataTypes.FLOAT,
            allowNull: false,
        },
    });
    return register;
}