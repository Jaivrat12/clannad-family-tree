const { Router } = require('express');
const {
    getMember,
    getMemberFamilies,
    // createMember,
    updateMember,
    addSpouse,
    removeSpouse,
    addChild,
    removeChild,
} = require('../controllers/member');
const { checkOwnership } = require('../middlewares/auth');

const router = Router();

router.get('/:memberId', checkOwnership, getMember);
router.get('/:memberId/families', checkOwnership, getMemberFamilies);
// router.post('/', createMember);
router.put('/:memberId', checkOwnership, updateMember);

router.put('/:memberId/children/:childId', checkOwnership, addChild);
router.delete('/children/:childId', checkOwnership, removeChild);

router.put('/:memberId/spouse/:spouseId', checkOwnership, addSpouse);
router.delete('/:memberId/spouse/', checkOwnership, removeSpouse);

module.exports = router;