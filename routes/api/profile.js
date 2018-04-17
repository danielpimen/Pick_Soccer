const express = require('express');
const router = express.Router();

//GET api/profile/test
//Access : Public
//Tests profile route
router.get('/test', (req, res) => res.json({msg: 'Profile Works'}));

module.exports = router;
