// Import necessary modules
const express = require("express");
const morgan = require("morgan");
const path = require("path");
const jwt = require("jsonwebtoken");
const cors = require("cors");

// Create Express app
const app = express();

// Logging middleware
app.use(morgan("dev"));

// CORS middleware
app.use(cors());

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static file-serving middleware
app.use(express.static(path.join(__dirname, "..", "client/dist")));

// Middleware to check for JWT token and attach user ID to request
app.use((req, res, next) => {
  const auth = req.headers.authorization;
  const token = auth?.startsWith("Bearer ") ? auth.slice(7) : null;

  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET, { expiresIn: "2h" }); // Assuming you have JWT_SECRET defined in your environment variables
  } catch {
    req.user = null;
  }

  next();
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).send(err.message || "Internal server error.");
});

// Define backend routes
app.use("/auth", require("./api/auth"));
app.use("/cartitem", require("./api/cartitem"))
app.use("/comment", require("./api/comment"));
app.use("/posts", require("./api/posts"));
app.use("/product", require("./api/product"));
app.use("/shoppingcart", require("./api/shoppingcart"));
app.use("/tags", require("./api/tags"));

// Default to 404 if no other route matched
app.use((req, res) => {
    res.status(404).send("Not found.");
});

// Export Express app
module.exports = app;

