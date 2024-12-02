const mongoose = require('mongoose');
const express = require('express')
const body_parser = require('body-parser')
const cors = require('cors')
const dbURI = "mongodb+srv://vladpoienariu:admin123@lists.5vhezvm.mongodb.net/forecast?retryWrites=true&w=majority&appName=lists";

const app = express()
const PORT = 3003
const domain = 'localhost'

mongoose.connect(dbURI)
.then((result) => {
    app.listen(PORT)

    console.log(`Succesfully connected to DB`);
    console.log(`Server started at http://${domain}:${PORT}`);
})
.catch((err) => {
    console.log(`Error while connecting to DB: ${err}`);
})

const allowedOrigins = [
    'http://localhost:5173', 
    'http://192.168.1.68:5173',
    domain + ":5173",
];

const corsOptions = {
    origin: allowedOrigins,
    credentials: true, 
    optionsSuccessStatus: 200, 
    methods: 'GET, POST, OPTIONS, PUT, PATCH, DELETE', 
    allowedHeaders: ['Content-Type', 'Authorization'], 
};


app.use(cors(corsOptions))
app.options('*', cors(corsOptions));
app.get('*', cors(corsOptions))
app.post('*', cors(corsOptions))

app.use(express.json())
app.use(body_parser.json())

app.use("/", recipeRouter);
