const express = require('express');
const jwt = require("jsonwebtoken")
const garbageActivity = require('./models/garbageActivity.js');
const productActivity = require('./models/productActivity.js');
const transportActivity = require('./models/transportActivity.js');

const router = express.Router();

router.get('',async (req,res)=>{
    let garbage = await garbageActivity.find({});
    let product = await productActivity.find({});
    let transport = await transportActivity.find({});
    // TODO: Select only authenticated
    let resp = [];
    for(item of product){
        resp.push({
            self: "/api/v1/activities/products/" + item.id,
            type: "product",
            date: item.date,
            userId: item.userId
        });
    }

    for(item of garbage){
        resp.push({
            self: "/api/v1/activities/garbage/" + item.id,
            type: "garbage",
            date: item.date,
            userId: item.userId
        });
    }

    for(item of transport){
        resp.push({
            self: "/api/v1/activities/transport/" + item.id,
            type: "transport",
            date: item.date,
            userId: item.userId
        });
    }
    res.status(200).json(resp);
});

router.get('/total_impact',async (req,res)=>{
    let token = req.cookies['token'];
    let garbage, product, transport;
    let search = {};
    if (token) {
        jwt.verify(token, process.env.SUPER_SECRET, function(err, decoded){
            if (err) {  // if the token is invalid redirect to the login page
                res.redirect("/login.html");
            }else {
                req.loggedUser = decoded;
                console.log("decoded:", decoded);
                search = {userId: decoded.id};
            }
        });
    } 
    garbage = await garbageActivity.find(search);
    product = await productActivity.find(search);
    transport = await transportActivity.find(search);
    // TODO: Select only authenticated
    let total_impact = 0;
    let resp;
    for(item of product){
        total_impact += item.impact;
    }

    for(item of garbage){
        total_impact += item.impact;
    }

    for(item of transport){
        total_impact += item.impact;
    }
    resp = {"total_impact" : total_impact};
    console.log(resp, garbage, product, transport);
    res.status(200).json(resp);
});

module.exports = router;