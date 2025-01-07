require("dotenv").config();
const express = require("express");
const cors = require("cors");
const router = require("./routes/router");
require("./db/db");

const app = express();
app.use(cors());
// app.use(cors({
//   origin: 'http://localhost:4200',
//   methods: ['GET', 'POST', 'PUT', 'DELETE'],
//   credentials: true,
// }));
app.use(express.json());
app.use(router);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("server running...");
});
