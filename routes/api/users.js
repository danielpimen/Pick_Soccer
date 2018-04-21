const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const keys = require('../../config/keys');

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
        email: req.body.email,
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

//Return Token
//Public

router.post('/login', (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  //Find User email
  User.findOne({email}).then(user => {
    //Check user
    if (!user) {
      return res.status(404).json({email: 'User email not found'});
    }
    //Check password
    bcrypt.compare(password, user.password).then(isMatch => {
      if (isMatch) {
        //User Match
        //What is included in JWT
        const payload = {id: user.id, name: user.name, avatar: user.avatar};

        //Token
        jwt.sign(payload, keys.secretOrKey, {expiresIn: 3600}, (err, token) => {
          res.json({
            success: true,
            token: 'Bearer ' + token,
          });
        });
      } else {
        return res.status(400).json({password: 'Password incorrect'});
      }
    });
  });
});

module.exports = router;
