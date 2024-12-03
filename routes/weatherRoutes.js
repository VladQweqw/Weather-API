const { Router } = require('express')
const weatherReadsController = require('../controller/weatherController')

const router = Router()

router.get('/:id/weather', weatherReadsController.get_weatherReads);
router.post('/:id/weather', weatherReadsController.post_weatherReads);

module.exports = router