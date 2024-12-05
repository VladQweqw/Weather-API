const db = require("../db");

const TABLE_NAME = "forecast"

async function get_weekly_forecast(req, res) {
    const query = `
    SELECT DISTINCT forecast_date, rain_value, temp_value, l.city, l.region, l.latitude, l.longitude 
    FROM forecast
    INNER JOIN locations l ON l.location_id = forecast.location_id
    WHERE forecast.location_id = 1
    ORDER BY forecast.forecast_date DESC
    LIMIT 6;
    `

    try {
        const [data] = await db.execute(query);


           const newData = data.map(item => {
            console.log(item);
            
            const date = new Date(item.forecast_date);
            const currentDate = new Date();
            const daysDiff = Math.floor((currentDate.getTime() - date.getTime()) / (3600 * 24 * 1000));
            
            if(daysDiff == 0)  {
                item.formated_date = "Today";
            }else if(daysDiff == 1) {
                item.formated_date = "Yesterday"
            }else {
                item.formated_date = `${daysDiff} days ago`;
                
            }

            return item;
           })
            

        return res.status(200).json({
            data: newData,
            total_length: newData.length,
            location: `${newData[0].city}, ${newData[0].region}` || null
        });
    }catch(err) {
        return res.status(400).send({
            error: "An error occured"
        });
    }
}

async function get_forecast_by(req, res) {    
    let query = `
    SELECT DISTINCT forecast_date, rain_value, temp_value, l.city, l.region, l.latitude, l.longitude 
    FROM forecast
    INNER JOIN locations l ON l.location_id = forecast.location_id
    WHERE forecast.location_id = ${req.query.location_id || "f.location_id"}
    ORDER BY forecast.forecast_date DESC
    LIMIT 6;
    `

   
    
    try {
        const [data] = await db.execute(query);
    
        const newData = data.map(item => {
            console.log(item);
            
            const date = new Date(item.forecast_date);
            const currentDate = new Date();
            const daysDiff = Math.floor((currentDate.getTime() - date.getTime()) / (3600 * 24 * 1000));
            
            if(daysDiff == 0)  {
                item.formated_date = "Today";
            }else if(daysDiff == 1) {
                item.formated_date = "Yesterday"
            }else {
                item.formated_date = `${daysDiff} days ago`;
                
            }

            return item;
           })
            

        return res.status(200).json({
            data: newData,
            total_length: newData.length,
            location: `${newData[0].city}, ${newData[0].region}` || null
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
    if(!body.rain_value) {
        errorArr.push("Invalid rain value")
    }
    if(!body.temp_value) {
        errorArr.push("Invalid temp value")
    } 
    
    if(errorArr.length) {
        return res.status(400).json({
            error: errorArr,
        })
    }

    const query = `
        INSERT INTO ${TABLE_NAME} (location_id, forecast_date, rain_value, temp_value) 
        VALUES ("${body.location_id}", "${body.forecast_date}", "${body.rain_value}", "${body.temp_value}")
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