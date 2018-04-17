const express = require('express');
const router = express.Router();

//GET api/posts/test
//Access : Public
//Tests posts route
router.get('/test', (req, res) => res.json({msg: 'Post Works'}));

module.exports = router;
