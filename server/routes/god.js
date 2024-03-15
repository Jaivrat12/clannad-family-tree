const { Router } = require('express');
const {
    getUsers,
    getWorkspaces,
} = require('../controllers/god');
const { isGod } = require('../middlewares/auth');

const godRoutes = Router();
godRoutes.use(isGod);
godRoutes.get('/users', getUsers);
godRoutes.get('/workspaces/:userId', getWorkspaces);

module.exports = godRoutes;