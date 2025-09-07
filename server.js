const express = require('express');
const dotenv  = require('dotenv');
const cookieParser = require("cookie-parser");
const { connectToMongoDB } = require('./connect');

dotenv.config();
const app = express();

// Middleware
app.use(express.json());
app.use(cookieParser());

const PORT = 8000;

// DB Connection
connectToMongoDB('mongodb://localhost:27017/travelx')
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error("DB connection error:", err));

// Routes
app.use("/api/auth", require("./Routes/auth"));

app.listen(PORT, () => {
  console.log(`Server is Started on ${PORT}`);
});
