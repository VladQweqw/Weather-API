const express = require('express')
const body_parser = require('body-parser')
const cors = require('cors')

const sensorRouter = require("./routes/sensorsRoutes")
const forecastRouter = require("./routes/forecastRoutes")

const app = express()

const PORT = 3003;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    
})

const allowedOrigins = [
    'http://localhost:5173', 
    'http://192.168.1.68:5173',
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

app.use("/sensors/", sensorRouter);
app.use("/forecast/", forecastRouter);
