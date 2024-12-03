const db = require("../db");

const TABLE_NAME = "forecast"

async function get_weekly_forecast(req, res) {
    const query = `SELECT DISTINCT forecast_id, forecast_date, 
       weather.value AS rain_value, weather.sensor_id AS rain_sensor_id, weather.sensor_type AS rain_sensor_type, 
       weather2.value AS temp_value, weather2.sensor_id AS temp_sensor_id, weather2.sensor_type AS temp_sensor_type
        FROM ${TABLE_NAME}
        INNER JOIN locations l ON l.location_id = forecast.location_id
        INNER JOIN weatherreads weather ON weather.sensor_id = forecast.rain_id
        INNER JOIN weatherreads weather2 ON weather2.sensor_id = forecast.temp_id
        LIMIT 6;
    `

    try {
        const [data] = await db.execute(query);
    
        return res.status(200).send({
            data,
            total_length: data.length
        });
    }catch(err) {
        return res.status(400).send({
            error: "An error occured"
        });
    }
}

async function get_forecast_by(req, res) {    
    let query = `SELECT DISTINCT forecast_id, forecast_date, 
       weather.value AS rain_value, weather.sensor_id AS rain_sensor_id, weather.sensor_type AS rain_sensor_type, 
       weather2.value AS temp_value, weather2.sensor_id AS temp_sensor_id, weather2.sensor_type AS temp_sensor_type
        FROM ${TABLE_NAME}
        INNER JOIN locations l ON l.location_id = forecast.location_id
        INNER JOIN weatherreads weather ON weather.sensor_id = forecast.rain_id
        INNER JOIN weatherreads weather2 ON weather2.sensor_id = forecast.temp_id
      
    `

    if(req.query.location_id && req.query.date) {
        query += `WHERE l.location_id="${req.query.location_id}" AND DATE(forecast_date)="${req.query.date}"`

    }else {
        if(req.query.location_id) {
            query += `WHERE l.location_id="${req.query.location_id}"`
        }
    
        if(req.query.date) {
            query += `WHERE DATE(forecast_date)="${req.query.date}"`
        }
    }

    console.log(query);
    
    try {
        const [data] = await db.execute(query);
    
        return res.status(200).send({
            data,
            total_length: data.length
        });
    }catch(err) {
        return res.status(400).send({
            error: "An error occured"
        });
    }
}

async function post_forecast(req, res) {
    const body = req.body || [];
    const errorArr = [];

    if(body.location_id < 1 || isNaN(body.location_id)) {
        errorArr.push("Invalid location ID")
    }
    if(!body.forecast_date) {
        errorArr.push("Invalid date")
    }
    if(!body.weather_id) {
        errorArr.push("Invalid weather ID")
    }
    if(!body.condition_state ) {
        errorArr.push(`Invalid condition `)
    }
    
    if(errorArr.length) {
        return res.status(400).json({
            error: errorArr,
        })
    }

    const query = `
        INSERT INTO ${TABLE_NAME} (location_id, forecast_date, weather_id, condition_state) 
        VALUES ("${body.location_id}", "${body.forecast_date}", "${body.weather_id}", "${body.condition_state}")
    `

    try {
        await db.execute(query)

        return res.status(201).json({
            message: "Forecast entry added succesfully!"
        });
    }catch(err) {
        return res.status(400).json({
            message: "Forecast entry not added"
        });
    }
}

module.exports = {
    get_weekly_forecast,
    get_forecast_by,
    post_forecast,
}