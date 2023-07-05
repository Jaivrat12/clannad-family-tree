const { Router } = require('express');
const { getFamilyById, /* updateFamily, */ addRoot, removeRoot } = require('../controllers/family');
const { checkOwnership } = require('../middlewares/auth');

const router = Router();

router.get('/:familyId', checkOwnership, getFamilyById);
// router.put('/:familyId', checkOwnership, updateFamily);
router.put('/:familyId/root/:memberId', checkOwnership, addRoot);
router.delete('/:familyId/root', checkOwnership, removeRoot);

module.exports = router;