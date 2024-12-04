const db = require("../db");

const TABLE_NAME = "locations"

async function get_locations(req, res) {
    const query = `
    SELECT *
    FROM ${TABLE_NAME}
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

module.exports = {
    get_locations
}