const db = require("../db");

const TABLE_NAME = "sensors"
const SENSOR_STATUS = ["OFFLINE", "ONLINE", "MAINTENANCE"];

async function get_sensors(req, res) {
    const query = `
    SELECT sensor_id, sensor_type, model_number, status, city, latitude, longitude, altitude, region
    FROM ${TABLE_NAME}
    INNER JOIN locations ON locations.location_id=sensors.location_id
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

async function get_individual_sensor(req, res) {    
    let id = req.params.id || -1;
    if(id == -1) {
        return res.status(400).json({
            error: "Invalid ID"
        })
    }

    const query = `
    SELECT *
    FROM ${TABLE_NAME}
    WHERE ${TABLE_NAME}.sensor_id = ${id}
    `

    try {
        const [data] = await db.execute(query);
    
        return res.status(200).send({
            data,
        });
    }catch(err) {
        return res.status(400).send({
            error: "An error occured"
        });
    }
}

async function post_sensor(req, res) {
    const body = req.body || [];
    const errorArr = [];

    if(body.location_id < 1 || isNaN(body.location_id)) {
        errorArr.push("Invalid location ID")
    }
    if(!body.sensor_type) {
        errorArr.push("Invalid sensor Type")
    }
    if(!body.model_number) {
        errorArr.push("Invalid model number")
    }
    if(!SENSOR_STATUS.includes(body.status)) {
        errorArr.push(`Invalid sensor Status, available: ${SENSOR_STATUS.map(e => e)}`)
    }
    
    if(errorArr.length) {
        return res.status(400).json({
            error: errorArr,
        })
    }

    const query = `
        INSERT INTO ${TABLE_NAME} (location_id, sensor_type, model_number, status) 
        VALUES (${body.location_id}, ${body.sensor_type}, ${body.model_number}, ${body.status})
    `

    try {
        await db.execute(query)

        return res.status(201).json({
            message: "Sensor succesfully added"
        });
    }catch(err) {
        return res.status(400).json({
            message: "Sensor not added"
        });
    }
}

async function put_sensor(req, res) {
    const body = req.body || [];
    const errorArr = [];

    const id = req.params.id || -1;
    if(id == -1) {
        return res.status(400).json({
            error: "Invalid ID"
        })
    }
    
    if(body.location_id < 1 || isNaN(body.location_id)) {
        errorArr.push("Invalid location ID")
    }
    if(!body.sensor_type) {
        errorArr.push("Invalid sensor Type")
    }
    if(!body.model_number) {
        errorArr.push("Invalid model number")
    }    
    if(!SENSOR_STATUS.includes(body.status)) {
        errorArr.push(`Invalid sensor Status, available: ${SENSOR_STATUS.map(e => e)}`)
    }
    
    if(errorArr.length) {
        return res.status(400).json({
            error: errorArr,
        })
    }
    
    const query = `
        UPDATE ${TABLE_NAME}
        SET location_id=${body.location_id}, sensor_type="${body.sensor_type}", model_number="${body.model_number}", status="${body.status}"
        WHERE ${TABLE_NAME}.sensor_id = ${id}
    `    

    try {
        await db.execute(query)

        return res.status(201).json({
            message: "Sensor succesfully edited"
        });
    }catch(err) {
        return res.status(400).json({
            message: "Sensor not edited"
        });
    }
}

async function delete_sensor(req, res) {
    const id = req.params.id || -1;
    if(id == -1) {
        return res.status(400).json({
            error: "Invalid ID"
        })
    }

    const query = `
        DELETE FROM ${TABLE_NAME} 
        WHERE ${TABLE_NAME}.sensor_id = ${id}
    `    

    try {
        await db.execute(query)

        return res.status(201).json({
            message: "Sensor succesfully deleted"
        });
    }catch(err) {
        return res.status(400).json({
            message: "Sensor not deleted"
        });
    }
    
}

module.exports = {
    get_sensors,
    get_individual_sensor,
    post_sensor,
    put_sensor,
    delete_sensor
}