const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const keys = require('../../config/keys');
const passport = require('passport');

const validateLoginInput = require('../../validation/login');
const validateRegisterInput = require('../../validation/register');
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
  const {errors, isValid} = validateRegisterInput(req.body);
  //Check validation
  if (!isValid) {
    return res.status(400).json(errors);
  }
  User.findOne({email: req.body.email}).then(user => {
    if (user) {
      errors.email = 'Email already in use';
      return res.status(400).json(errors);
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
      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
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
  const {errors, isValid} = validateLoginInput(req.body);
  //Check validation
  if (!isValid) {
    return res.status(400).json(errors);
  }

  const email = req.body.email;
  const password = req.body.password;

  //Find User email
  User.findOne({email}).then(user => {
    //Check user
    if (!user) {
      errors.email = 'User Not Found';
      return res.status(404).json(errors);
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
        errors.password = 'Wrong Password';
        return res.status(400).json(errors);
      }
    });
  });
});

//GET api/users/current
//Private
router.get(
  '/current',
  passport.authenticate('jwt', {session: false}),
  (req, res) => {
    res.json({
      id: req.user.id,
      name: req.user.name,
      email: req.user.email,
    });
  }
);

module.exports = router;
