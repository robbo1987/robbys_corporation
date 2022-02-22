
const db = require("./db");
const Employee = db.Employee;
const Category = db.Category;
const app = require('express').Router()

module.exports = app



app.delete("/:id", async (req, res, next) => {
    try {
      const employee = await Employee.findByPk(req.params.id);
      await employee.destroy();
      res.redirect(`/categories/${employee.categoryId}`);
    } catch (ex) {
      next(ex);
    }
  });
  
  app.post("/", async (req, res, next) => {
    try {
      const employee = await Employee.create(req.body);
      res.redirect(`/categories/${employee.categoryId}`);
    } catch (ex) {
      next(ex);
    }
  });
  app.get("/", async (req, res, next) => {
    try {
      const employees = await Employee.findAll({
        include: [Category, { model: Employee, as: "boss" }],
      });
  
      const categories = await Category.findAll();
      const options = categories
        .map((category) => {
          return `
        <option value='${category.id}'>
        ${category.name}
        </option>
        `;
        })
        .join("");
      const html = employees
        .map((employee) => {
          const boss = employee.boss;
          let bossName = "NO BOSS";
          if (boss) {
            bossName = boss.name;
          }
          return `<div>
                          Employee Name: ${employee.name} -- Employee Department: ${employee.category.name} -- Name of Boss: ${bossName}
                          <a href = '/employees/${employee.id}'> employee page </a>
                          <a href = 'categories/${employee.categoryId}'> category page </a>
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
            <form Method = "POST">
            <input name='name' placeholder = "employee name">
            <select name="categoryId">
            ${options}
            </select>
            <button> CREATE NEW EMPLOYEE</button>
            </form>
            <div> ${html} </div>
           
          </body>
      </html>
      
      `);
    } catch (ex) {
      next(ex);
    }
  });
  
  app.get("/:id", async (req, res, next) => {
    try {
      const employees = await Employee.findByPk(req.params.id, {
        include: [Category],
      });
  
      const html = `${employees.name} - ${employees.category.name}
        <a href = '/employees'> << back >> </a>
       
      `;
  
      res.send(html);
    } catch (ex) {
      next(ex);
    }
  });