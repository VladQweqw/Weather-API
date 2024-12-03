const db = require("../db");

const TABLE_NAME = "forecast"

async function get_weekly_forecast(req, res) {
    const query = `
    SELECT DISTINCT forecast_id, forecast_date, condition_state, l.city, l.longitude, l.altitude, l.region, weather.rain_value, weather.temp_value
    FROM ${TABLE_NAME}
    INNER JOIN locations l ON l.location_id = forecast.location_id
    INNER JOIN weatherreads weather  ON weather.weather_id = forecast.weather_id
    LIMIT 6
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
    let query = `
    SELECT DISTINCT forecast_id, forecast_date, condition_state, l.city, l.longitude, l.altitude, l.region, weather.rain_value, weather.temp_value
    FROM ${TABLE_NAME}
    INNER JOIN locations l ON l.location_id = forecast.location_id
    INNER JOIN weatherreads weather  ON weather.weather_id = forecast.weather_id
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

module.exports = {
    get_weekly_forecast,
    get_forecast_by,
}