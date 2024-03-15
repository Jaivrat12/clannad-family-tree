const { Router } = require('express');
const workspaceRoutes = require('./workspaces');
const familyRoutes = require('./families');
const memberRoutes = require('./members');
const godRoutes = require('./god');

const router = Router();

router.use('/workspaces', workspaceRoutes);
router.use('/families', familyRoutes);
router.use('/members', memberRoutes);
router.use('/god', godRoutes);

module.exports = router;