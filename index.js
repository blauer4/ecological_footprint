require('dotenv').config();
const mongoose = require("mongoose");
const app = require("./app/app.js");

var express = require("express"),
    bodyParser = require("body-parser"),
    swaggerJsdoc = require("swagger-jsdoc"),
    swaggerUI = require("swagger-ui-express");

mongoose.connect(process.env.MONGO_DB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {

        const options = {
            definition: {
                openapi: "3.0.0",
                info: {
                    title: "LogRocket Express API with Swagger",
                    version: "0.1.0",
                    description:
                        "This is a simple CRUD API application made with Express and documented with Swagger",
                    license: {
                        name: "MIT",
                        url: "https://spdx.org/licenses/MIT.html",
                    },
                    contact: {
                        name: "LogRocket",
                        url: "https://logrocket.com",
                        email: "info@email.com",
                    },
                },
                servers: [
                    {
                        url: "http://localhost:3000",
                    },
                ],
            },
            apis: ["./app/models/*.js"],
        };

        const specs = swaggerJsdoc(options);
        app.use(
            "/api-docs",
            swaggerUI.serve,
            swaggerUI.setup(specs)
        );

        console.log("Connected to the Database");

        app.listen(process.env.EXPRESS_PORT, function () {
            console.log('Server running on port ', process.env.EXPRESS_PORT);
        });

    })
    .catch(() => {
        console.error("ERROR: db connection error");
    });

