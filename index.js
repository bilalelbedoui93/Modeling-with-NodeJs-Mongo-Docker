require("dotenv").config();

const express = require("express");
const app = express();
const groups = require('./routes/groups')

const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");


const { env: { MONGO_URL, PORT } } = process;

(async () => {
    try {
        await mongoose.connect(MONGO_URL || "mongodb://localhost/immfly_project", {
            useUnifiedTopology: true,
            useNewUrlParser: true,
            useCreateIndex: true,
            useFindAndModify: false,
        });

        app.use(bodyParser.json());
        
        app.use(cors())

        app.use('/api', groups)

        console.log(`connected to database MongoDB! Port:${MONGO_URL}`);

        app.listen(PORT, () => console.log(`listening to the port ${PORT}...`))

    } catch (error) {
        console.log('Cannot connect to the db', error)
    }
})()