const { Router } = require('express')

const locationController = require('../controller/locationController')

const router = Router()
router.get('/', locationController.get_locations);


module.exports = router