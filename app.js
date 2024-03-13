const fs = require("fs");
const express = require("express");
const app = express();
const PORT = 8000;

// middleware utk mread json dari req body ke kita
app.use(express.json());

// read file json
const customers = JSON.parse(
  fs.readFileSync(`${__dirname}/data/dummy.json`, "utf-8")
);

app.get("/", (req, res, next) => {
  res.send("apaaa ajaa");
});

app.get("/api/v1/customers", (req, res, next) => {
  res.status(200).json({
    status: "success",
    data: {
      customers,
    },
  });
});

app.post("/api/v1/customers", (req, res) => {
  const newCustomer = req.body;

  customers.push(req.body);
  fs.writeFile(
    `${__dirname}/data/dummy.json`,
    JSON.stringify(customers),
    (err) => {
      res.status(201).json({
        status: "succes",
        data: {
          customer: newCustomer,
        },
      });
    }
  );
});

app.listen(PORT, () => {
  console.log(`app is running on port : ${PORT}`);
});
