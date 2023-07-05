const { Router } = require('express');
const {
    getWorkspaces,
    createFamily,
    createWorkspace,
    removeFamily,
    getMembersByWorkspaceId,
    createMember,
    updateWorkspace,
    deleteWorkspace,
} = require('../controllers/workspace');
const { updateFamily } = require('../controllers/family');
const { checkOwnership } = require('../middlewares/auth');

const router = Router();

router.get('/', getWorkspaces);
router.post('/', createWorkspace);
router.put('/:workspaceId', updateWorkspace);
router.delete('/:workspaceId', deleteWorkspace);

router.post('/:workspaceId/family', checkOwnership, createFamily);
router.put('/family/:familyId', checkOwnership, updateFamily);
router.post('/:workspaceId/family/:familyId', checkOwnership, removeFamily);

router.get('/:workspaceId/members', checkOwnership, getMembersByWorkspaceId);
router.post('/:workspaceId/members', checkOwnership, createMember);

module.exports = router;