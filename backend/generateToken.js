require('dotenv').config();
const jwt = require('jsonwebtoken');

const token = jwt.sign({ username: "test_user" }, process.env.JWT_SECRET, { expiresIn: "1h" });

console.log("Generated JWT Token:", token);
