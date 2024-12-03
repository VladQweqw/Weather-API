const { Router } = require('express')

const sensorController = require('../controller/sensorsController')
const maintenanceRouter = require('./maintenanceRoutes')
const weatherRouter = require('./weatherRoutes')

const router = Router()

router.get('/', sensorController.get_sensors);
router.get('/:id', sensorController.get_individual_sensor);

router.post('/', sensorController.post_sensor);

router.put('/:id', sensorController.put_sensor);
router.delete('/:id', sensorController.put_sensor);

router.use("/", maintenanceRouter)
router.use("/", weatherRouter)

module.exports = router