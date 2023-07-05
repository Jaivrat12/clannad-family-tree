const { Router } = require('express');
const {
    createNuclearFamily,
    updateNuclearFamily,
} = require('../controllers/nuclearFamily');

// ! NOT NEEDED
const router = Router();
// router.post('/', createNuclearFamily);
// router.put('/:id', updateNuclearFamily);

module.exports = router;