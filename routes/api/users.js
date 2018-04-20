const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const bcrpyt = require('bcryptjs');

//Pull User Model
const User = require('../../models/User');

//GET api/users/test
//Access : Public
//Tests users route
router.get('/test', (req, res) => res.json({msg: 'Users Works'}));

//GET api/users/register
//Access : Register User
//Public
router.post('/register', (req, res) => {
  User.findOne({email: req.body.email}).then(user => {
    if (user) {
      return res.status(400).json({email: 'Email already exists'});
    } else {
      const avatar = gravatar.url(req.body.email, {
        s: '200',
        r: 'pg',
        d: 'mm',
      });
      const newUser = new User({
        name: req.body.name,
        email: res.body.email,
        avatar,
        password: req.body.password,
      });
      bcrpyt.genSalt(10, (err, salt) => {
        bcrpyt.hash(newUser.password, salt, (err, hash) => {
          if (err) throw err;
          newUser.password = hash;
          newUser
            .save()
            .then(user => res.json(user))
            .catch(err => console.log(err));
        });
      });
    }
  });
});

module.exports = router;
