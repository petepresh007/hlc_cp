const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

// Swagger definition
const swaggerDefinition = {
  openapi: "3.0.0", // Use OpenAPI 3.0.0 format
  info: {
    title: "Cooperative API Documentation",
    version: "1.0.0",
    description: "This is the API documentation for the cooperative website",
  },
  servers: [
    {
      url: "http://localhost:5000", // Change this to your server's base URL
    },
  ],
};

// Options for swagger-jsdoc
const options = {
  swaggerDefinition,
  apis: ["./routes/*.js"], // Path to your API route files
  //  apis: ['./app']
};

// Initialize swagger-jsdoc
const swaggerSpec = swaggerJsdoc(options);

module.exports = { swaggerUi, swaggerSpec };
