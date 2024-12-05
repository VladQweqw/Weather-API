const { Router } = require('express')

const forecastController = require('../controller/forecastController')

const router = Router()

router.get('/', forecastController.get_weekly_forecast);
router.post('/', forecastController.post_forecast);
router.get('/by', forecastController.get_forecast_by);

module.exports = router