const { Router } = require('express');
const workspaceRoutes = require('./workspaces');
const familyRoutes = require('./families');
const memberRoutes = require('./members');

const router = Router();

router.use('/workspaces', workspaceRoutes);
router.use('/families', familyRoutes);
router.use('/members', memberRoutes);

module.exports = router;