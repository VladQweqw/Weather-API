const db = require("../db");
const crypto = require('crypto');

const TABLE_NAME = "users"
const FAVORITES_TABLE = 'favoriteplaces'

async function get_user(req, res) {    
    const id = req.params.id || -1;
    if(id == -1) {
        return res.status(400).json({
            error: "Invalid user ID"
        })
    }

    const query = `
        SELECT username, email, id
        FROM ${TABLE_NAME}
        WHERE id=${id}
    `

    try {
        const [data] = await db.execute(query);
    
        return res.status(200).send({
            data
        });
    }catch(err) {
        return res.status(400).send({
            error: "An error occured"
        });
    }
}

async function get_favorites(req, res) {    
    const id = req.params.id || -1;
    if(id == -1) {
        return res.status(400).json({
            error: "Invalid user ID"
        })
    }

    const query = `
       SELECT l.location_id, l.city, l.latitude, l.longitude, l.altitude, l.region, l.image_url
        FROM ${FAVORITES_TABLE}
        INNER JOIN locations l ON l.location_id=favoriteplaces.location_id
        WHERE user_id=${id}
    `

    try {
        const [data] = await db.execute(query);
    
        return res.status(200).send({
            data
        });
    }catch(err) {
        return res.status(400).send({
            error: "An error occured"
        });
    }
}

async function post_favorite_place(req, res) {
    const body = req.body || [];

    const user_id = req.params.id || -1;
    if(user_id == -1) {
        return res.status(400).json({
            error: "Invalid user ID"
        })
    }

    if(!body.location_id) {
        return res.status(400).json({
            error: "Invalid location ID"
        })
    }

    
    const query = `
        INSERT INTO ${FAVORITES_TABLE} (user_id, location_id) 
        VALUES (${user_id}, ${body.location_id})
    `
    
    try {
        await db.execute(query)

        return res.status(201).json({
            message: "Favorite place saved"
        });
    }catch(err) {
        return res.status(400).json({
            message: "Favorite place not saved"
        });
    }
}

function hashPassword(password) {
    return crypto.createHash("sha256").update(password).digest('hex')
}

async function register(req, res) {
    const body = req.body || [];
    
    const errorArr = [];

    if(!body.username) {
        errorArr.push("Invalid username")
    }
    if(!body.email) {
        errorArr.push("Invalid email")
    }
    if(!body.password) {
        errorArr.push("Invalid password")
    }

    let hashed_password = hashPassword(body.password);
        
    if(errorArr.length) {
        return res.status(400).json({
            error: errorArr,
        })
    }

    const query = `
        INSERT INTO ${TABLE_NAME} (email, password, username) 
        VALUES ("${body.email}", "${hashed_password}", "${body.username}")
    `
        

    try {
        await db.execute(query)

        return res.status(201).json({
            message: "User created"
        });
    }catch(err) {
        return res.status(400).json({
            message: "User not created"
        });
    }
}

async function login(req, res) {
    const body = req.body || [];
    
    if(!body.email) {
        return res.status(400).json({
            error: "Invalid email",
        })
    }

    const query = `
        SELECT password, id
        FROM ${TABLE_NAME}
        WHERE email="${body.email}"
    `
    
    try {
        const [data] = await db.execute(query)
                
        if(data[0].password == hashPassword(body.password)) {
            return res.status(200).json({
                message: "User logged in",
                user_id: data[0].id
            });
        }else {
            return res.status(400).json({
                error: "Invalid credentials"
            });
        }
    
    }catch(err) {
        return res.status(400).json({
            message: "An error occured"
        });
    }
}

module.exports = {
    get_user,
    get_favorites,
    post_favorite_place,
    register,
    login
}