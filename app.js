const fs = require("fs");
const express = require("express");
const app = express();
const PORT = 8000;

// middleware utk mread json dari req body ke kita
app.use(express.json());

// read file json
const customers = JSON.parse(fs.readFileSync(`${__dirname}/data/dummy.json`));

const defaultRouter = (req, res, next) => {
  res.send("apaaa ajaa");
};

// api to get data
const getCustomersData = (req, res, next) => {
  res.status(200).json({
    status: "succes",
    totaldata: customers.length,
    data: {
      customers,
    },
  });
};

// api to get by id
const getCustomersDataById = (req, res, next) => {
  const id = req.params.id;

  // menggunakan array metode untuk membantuk menentukan spesifik data
  const customer = customers.find((cust) => cust._id === id);

  res.status(200).json({
    status: "success",
    data: {
      customer,
    },
  });
};

// api to update data
const updateCustomers = (req, res) => {
  const id = req.params.id;

  // 1. do search data sesuai parameter id nya
  const customer = customers.find((cust) => cust._id === id);
  const customerIndex = customers.findIndex((cust) => cust._id === id);

  // 2. ada ga cust nya
  if (!customer) {
    return res.status(404).json({
      status: "fail",
      message: `Customer dengan ID: ${id} tidak ada`,
    });
  }

  // 3. jika ada, update data sesuai req body dr client/user
  // object assign = menggabungkan objek OR spread operator

  customers[customerIndex] = { ...customers[customerIndex], ...req.body };

  // 4. update document json
  fs.writeFile(
    `${__dirname}/data/dummy.json`,
    JSON.stringify(customers),
    (err) => {
      res.status(200).json({
        status: "success",
        message: "berhasil update data",
        data: {
          customer: customer[customerIndex],
          customer,
        },
      });
    }
  );
};

const deletedata = (req, res) => {
  const id = req.params.id;
  // if(id)
  // 1.melakukan pencarian data
  const customer = customers.find((cust) => cust._id === id);
  const customerIndex = customers.findIndex((cust) => cust._id === id);

  // 2. ada gak datanya
  if (!customer) {
    return res.status(404).JSON({
      status: "fail",
      message: `custommer dengan ID : ${id} gak ada`,
    });
  }

  // 3. kalau ada, berarti update datanya sesuai reques body dari user
  // object assign = menggabungkan object or spread operator

  // customers[customerIndex] = {...customers[customerIndex], ...req.body}
  customers.splice(customerIndex, 1);

  // 4. melakukan update di dokumennya
  fs.writeFile(
    `${__dirname}/data/dummy_data.json`,
    JSON.stringify(customers),
    (err) => {
      res.status(200).json({
        status: "succes",
        message: "data customer berhasil dihapus",
      });
    }
  );
};
const createCustomers = (req, res) => {
  const newCustomer = req.body;
  customers.push(req.body);
  fs.writeFile(
    `${__dirname}/data/dummy_data.json`,
    JSON.stringify(customers),
    (err) => {
      res.status(201).json({
        status: "success",
        data: {
          customers: newCustomer,
        },
      });
    }
  );

  res.send("oke udah");
};

// localhost:3000
app.get("/", defaultRouter);

app.route("/api/v1/customers").get(getCustomersData).post(createCustomers);

app
  .route("/api/v1/customers/:id")
  .get(getCustomersDataById)
  .patch(updateCustomers)
  .delete(deletedata);

app.listen(PORT, () => {
  console.log(`app is running on port : ${PORT}`);
});
