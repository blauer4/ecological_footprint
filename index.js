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
                    title: "Ecological footprint API with Swagger",
                    version: "0.1.0",
                    description:
                        "An API for the ecological footprint application",
                },
                servers: [
                    {
                        url: "http://127.0.0.1:3000",
                    },
                ],
            },
            apis: ["./app/models/*.js","./app/*.js"],
        };

        const specs = swaggerJsdoc(options);
        app.use(
            "/api-docs",
            swaggerUI.serve,
            swaggerUI.setup(specs)
        );

        console.log("Connected to the Database");

        app.listen(process.env.PORT || process.env.EXPRESS_PORT, function () {
            console.log('Server running on port ', process.env.PORT || process.env.EXPRESS_PORT);
        });

    })
    .catch(() => {
        console.error("ERROR: db connection error");
    });

