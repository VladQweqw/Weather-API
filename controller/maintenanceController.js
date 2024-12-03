const db = require("../db");

const TABLE_NAME = "maintenance"

async function get_maintenance(req, res) {    
    const id = req.params.id || -1;
    if(id == -1) {
        return res.status(400).json({
            error: "Invalid sensor ID"
        })
    }

    const query = `
        SELECT *
        FROM ${TABLE_NAME}
        INNER JOIN sensors ON sensors.sensor_id=${TABLE_NAME}.sensor_id
        WHERE ${TABLE_NAME}.sensor_id = ${id}
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

async function post_maintenance(req, res) {
    const body = req.body || [];
    const errorArr = [];

    const id = req.params.id || -1;
    if(id == -1) {
        return res.status(400).json({
            error: "Invalid sensor ID"
        })
    }

    if(!body.date) {
        errorArr.push("Invalid date")
    }
    if(!body.description) {
        errorArr.push("Invalid description")
    }
    if(!body.performed_by) {
        errorArr.push(`Invalid worker name`)
    }
    
    if(errorArr.length) {
        return res.status(400).json({
            error: errorArr,
        })
    }
    console.log(req.body);
    
    const query = `
        INSERT INTO ${TABLE_NAME} (sensor_id, date, description, performed_by) 
        VALUES (${id}, "${body.date}", "${body.description}","${body.performed_by}")
    `

    try {
        await db.execute(query)

        return res.status(201).json({
            message: "Maintenance log succesfully added"
        });
    }catch(err) {
        return res.status(400).json({
            message: "Maintenance log not added"
        });
    }
}


module.exports = {
    get_maintenance,
    post_maintenance
}