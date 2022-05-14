require('dotenv').config();
const mongoose = require("mongoose");
const app = require("./app/app.js");

mongoose.connect(process.env.MONGO_DB_URL, {useNewUrlParser: true, useUnifiedTopology: true})
.then (() => {
    
    console.log("Connected to the Database");
    
    app.listen(process.env.EXPRESS_PORT, function() {
        console.log('Server running on port ', process.env.EXPRESS_PORT);
    });
    
})
.catch(()=>{
    console.error("ERROR: db connection error");
});

