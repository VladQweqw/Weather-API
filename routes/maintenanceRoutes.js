const { Router } = require('express')
const maintenanceController = require('../controller/maintenanceController')

const router = Router()

router.get('/:id/maintenance', maintenanceController.get_maintenance);
router.post('/:id/maintenance', maintenanceController.post_maintenance);

module.exports = router