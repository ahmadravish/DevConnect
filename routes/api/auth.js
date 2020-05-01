//this route is for authenticating and login an existing user

const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { check, validationResult } = require('express-validator'); //for check

const config = require('config');
const jwtSecret = config.get('jwtSecret');

const User = require('../../models/User');
const auth = require('../../middleware/auth');

router.get('/', auth, async (req, res) => {
  //2nd para auth is middleware to verify jwt
  try {
    //get  all values except password from user model
    const user = await User.findById(req.user.id).select('-password');

    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

router.post(
  '/',
  [
    //check is inbuit express fun to check various values
    check('email', 'Please write an valid email').isEmail(),
    check('password', 'password shoud more than 6 characters').exists(),
  ],
  async (req, res) => {
    const errors = validationResult(req); //take errors from check

    if (!errors.isEmpty()) {
      //if there are errors in check
      return res.status(400).json({ errors: errors.array() }); //400->bad request
    }

    const { email, password } = req.body; //destructure from userschema or model

    try {
      //check if user doesn't exist
      let user = await User.findOne({ email });
      if (!user) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'Invalid credentials' }] }); //make errors same as check
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'Invalid credentials' }] });
      }

      //check jwt valid or not
      const payload = {
        user: {
          id: user.id,
        },
      };
      jwt.sign(payload, jwtSecret, { expiresIn: 360000 }, (err, token) => {
        //check token after every expire for security
        if (err) throw err;
        res.json({ token });
        res.json(req.body);
      });
    } catch (err) {
      console.log(err.message);
      res.status(500).send('server error');
    }
  }
);

module.exports = router;
