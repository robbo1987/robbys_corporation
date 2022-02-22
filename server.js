const db = require("./db");
const Employee = db.Employee;
const Category = db.Category;
const sequelize = db.sequelize;

const express = require("express");
const { urlencoded, response } = require("express");
const app = express();
const port = process.env.PORT || 3000;
const methodOverride = require("method-override");
app.use(express.urlencoded({ extended: false }));
app.use(methodOverride("remove"));

app.get("/", (req, res) => {
  res.redirect("/employees");
});

app.use('/employees', require('./employees.routes'))


app.get("/categories/:id", async (req, res, next) => {
  try {
    const categories = await Category.findByPk(req.params.id, {
      include: [Employee],
    });
    const html = categories.employees
      .map((employee) => {
        return `
      <div>
        ${employee.name}
        <form method= 'post' action= '/employees/${employee.id}?remove=delete'>
          <button> delete </button>
          </form>
      </div>
      `;
      })
      .join("");
    res.send(`
    <html>
    <head>
      <title> Robbys' Corporation </title>
    </head>
    <body>
      <h1> Robby's Corporation </h1>
      <h2> ${categories.name} </h2>
      <div> ${html} </div>
      <a href = '/employees'> BACK </a>
     
    </body>
</html>
    
    
    `);
  } catch (ex) {
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
