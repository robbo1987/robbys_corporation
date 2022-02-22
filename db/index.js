const Sequelize = require("sequelize");
const sequelize = new Sequelize(
  process.env.DATABASE_URL || "postgres://localhost/robbys_corporation"
);

const Category = sequelize.define("category", {
  name: {
    type: Sequelize.DataTypes.ENUM("Finance", "Accounting", "HR"),
    unique: true,
    allowNull: false,
  },
});

const Employee = sequelize.define("employee", {
  name: {
    type: Sequelize.DataTypes.STRING,
    unique: true,
    allowNull: false,
  },
});

Employee.belongsTo(Category);
Category.hasMany(Employee);
Employee.belongsTo(Employee, { as: "boss" });

module.exports = {
    Category,
    Employee,
    sequelize
}