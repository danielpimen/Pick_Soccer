const express = require('express');
const router = express.Router();

//GET api/users/test
//Access : Public
//Tests users route
router.get('/test', (req, res) => res.json({msg: 'Users Works'}));

module.exports = router;
