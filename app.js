require("express-async-errors");
require("dotenv").config();
const express = require("express");
const app = express();
const PORT = process.env.PORT || 4000;
const cookieParser = require("cookie-parser");
const cors = require("cors");
const { connectDB, closeDB } = require("./utils/db");
const { NotFoundPage } = require("./utils/notFoundPage");
const errorHandler = require("./middleware/errorhandler");
const path = require("path");
const { swaggerUi, swaggerSpec } = require('./swaggerConfig');

// Route for Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use(express.json());
app.use(cookieParser());
app.use("/upload", express.static(path.join(__dirname, "upload")));
app.use("/", express.static(path.join(__dirname, "public")));
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use("/api/user", require("./routes/user"));
app.use('/api/finance', require("./routes/finance"));

app.get("/welcome", (req, res) => {
  res.status(200).json({ msg: "Welcome to the cooperative" });
});

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Get all users
 *     description: Retrieve a list of all registered users.
 *     responses:
 *       200:
 *         description: A list of users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     example: 1
 *                   name:
 *                     type: string
 *                     example: John Doe
 */
app.get('/users', (req, res) => {
  res.json([{ id: 1, name: 'John Doe' }]);
});


let server;

// Start the application
async function start() {
  try {
    await connectDB();
    server = app.listen(PORT, () =>
      console.log(`App listening on port: ${PORT}`)
    );
  } catch (error) {
    console.error("Failed to start the server:", error);
  }
}

app.use(NotFoundPage);
app.use(errorHandler);

// Handle graceful shutdown
async function shutdown() {
  console.log("\nGracefully shutting down...");
  try {
    if (server) {
      server.close(() => console.log("HTTP server closed"));
    }
    await closeDB();
    console.log("Database connection closed");
    process.exit(0); // Exit the process successfully
  } catch (error) {
    console.error("Error during shutdown:", error);
    process.exit(1); // Exit the process with an error
  }
}

// Handle termination signals
process.on("SIGINT", shutdown); // Ctrl+C
process.on("SIGTERM", shutdown); // Docker or Kubernetes stop command

start();
