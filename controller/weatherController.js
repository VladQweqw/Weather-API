const db = require("../db");
const TABLE_NAME = "weatherreads"

async function get_weatherReads(req, res) {    
    const sensor_id = req.params.id || -1;
    if(sensor_id == -1) {
        return res.status(400).json({
            error: "Invalid sensor ID"
        })
    }
    
    function dynamicQueryWhere() {
        let query = `WHERE sensor_id="${sensor_id}" AND `
        for(let [key, val] of Object.entries(req.query)) {            
            query += `${key}="${val}" AND `
        }

        return query.slice(0, -4);
    }
        
    const query = `SELECT * 
    FROM ${TABLE_NAME}
    ${dynamicQueryWhere()}
    `;
        
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

async function post_weatherReads(req, res) {
    const body = req.body || [];
    const errorArr = [];    

    if(req.params.id < 1 || isNaN(req.params.id)) {
        errorArr.push("Invalid sensor ID")
    }
    if(body.location_id < 1 || isNaN(body.location_id)) {
        errorArr.push("Invalid location ID")
    }
    if(!body.date) {
        errorArr.push("Invalid date")
    }
    if(!body.value) {
        errorArr.push("Invalid reading value")
    }
    if(!body.sensor_type ) {
        errorArr.push(`Invalid reading type`)
    }
    
    if(errorArr.length) {
        return res.status(400).json({
            error: errorArr,
        })
    }

    const query = `
        INSERT INTO ${TABLE_NAME} (sensor_id, date, value, sensor_type, location_id) 
        VALUES (${req.params.id}, "${body.date}", ${body.value}, "${body.sensor_type}", ${body.location_id})
    `    
    try {
        await db.execute(query)

        return res.status(201).json({
            message: "Weather entry added succesfully!"
        });
    }catch(err) {
        return res.status(400).json({
            message: "Weather entry not added"
        });
    }
}

module.exports = {
    get_weatherReads,
    post_weatherReads
}