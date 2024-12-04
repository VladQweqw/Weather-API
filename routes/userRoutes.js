const { Router } = require('express')
const userController = require('../controller/userController')

const router = Router()

router.get('/:id', userController.get_user);
router.get('/:id/favorites', userController.get_favorites);
router.post('/:id/favorites', userController.post_favorite_place);

router.post('/register', userController.register);
router.post('/login', userController.login);

module.exports = router