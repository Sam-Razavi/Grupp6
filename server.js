const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const app = express();

app.use(express.json());
dotenv.config();

mongoose
    .connect(`mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.xwkradj.mongodb.net/test`, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => {
        console.log('Successfully connected to MongoDB');
        app.listen(PORT, () => {
            console.log(`Server is listening on port ${PORT}`);
        });
    })
    .catch((err) => {
        console.log('Could not connect to MongoDB. Error...', err);
        process.exit();
    });

app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.send('The server is running!');
});

let PORT = 3000;
