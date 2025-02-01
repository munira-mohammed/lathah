const express = require('express');
const router = express.Router();
const { isLoggedIn } = require('../middleware/checkAuth');
const dashboardController = require('../controllers/dashboardController');


router.get('/dashboard/UserRecipesPage', isLoggedIn, dashboardController.dashboard);
router.get('/dashboard/recipe/:id', isLoggedIn, dashboardController.dashboardViewRecipe);
router.get('/dashboard/recipe-update/:id', isLoggedIn, dashboardController.dashboardUpdateRecipe);
router.put('/dashboard/recipe-update/:id', isLoggedIn, dashboardController.dashboardUpdateRecipeSubmit);
router.delete('/dashboard/recipe-delete/:id', isLoggedIn, dashboardController.dashboardDeleteRecipe);
router.get('/dashboard/AddRecipePage', isLoggedIn, dashboardController.dashboardAddRecipe);
router.post('/dashboard/AddRecipeSubmit', isLoggedIn, dashboardController.dashboardAddRecipeSubmit);
router.get('/dashboard/SearchPage', isLoggedIn, dashboardController.dashboardSearch);
router.post('/dashboard/search', isLoggedIn, dashboardController.dashboardSearchSubmit);


module.exports = router;