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

const express = require("express");
const app = express();
const port = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.redirect("/employees");
});

app.get("/employees", async (req, res, next) => {
  try {
    const employees = await Employee.findAll({
      include: [Category, { model: Employee, as: "boss" }],
    });
    console.log(JSON.stringify(employees, null, 2));
    const html = employees
      .map((employee) => {
        const boss = employee.boss;
        let bossName = "";
        if (boss) {
          bossName = boss.name;
        }
        return `<div>
                        ${employee.name} - ${employee.bossId} -${employee.category.name} - ${bossName}
                        <a href = '/employees/${employee.id}'> employee page </a>
                    </div>
              `;
      })
      .join("");
    res.send(html);
  } catch (ex) {
    next(ex);
  }
});

app.get("/employees/:id", async (req, res, next) => {
  try {
    const employee = await Employee.findByPk(req.params.id, {
      include: [Category]
    })

      res.send(employee)
  } 
  catch (ex) {
    next(ex);
  }
});

const init = async () => {
  await sequelize.sync({ force: true });
  console.log("data seeded");
  app.listen(port, () => {
    console.log(`listening on port ${port}`);
  });
  const finance = await Category.create({ name: "Finance" });
  const accounting = await Category.create({ name: "Accounting" });
  const hr = await Category.create({ name: "HR" });
  const karen = await Employee.create({
    name: "karen",
    categoryId: finance.id,
  });
  const debra = await Employee.create({
    name: "debra",
    bossId: karen.id,
    categoryId: finance.id,
  });
  const robert = await Employee.create({ name: "robert", categoryId: hr.id });
  const jeff = await Employee.create({
    name: "jeff",
    bossId: robert.id,
    categoryId: hr.id,
  });
  const amy = await Employee.create({ name: "amy", categoryId: accounting.id });
  const elaine = await Employee.create({
    name: "elaine",
    bossId: amy.id,
    categoryId: accounting.id,
  });
};

init();
