//this route is for register new user

const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { check, validationResult } = require('express-validator'); //for check

const User = require('../../models/User'); //get userschema or model

//get jwt secret token from config
const config = require('config');
const jwtSecret = config.get('jwtSecret');
router.post(
  '/',
  [
    //check is inbuit express fun to check various values
    check('name', 'Name is required').not().isEmpty(),
    check('email', 'Please write an valid email').isEmail(),
    check('password', 'password shoud more than 6 characters').isLength({
      min: 6,
    }),
  ],
  async (req, res) => {
    const errors = validationResult(req); //take errors from check

    if (!errors.isEmpty()) {
      //if there are errors in check
      return res.status(400).json({ errors: errors.array() }); //400->bad request
    }

    const { name, email, password } = req.body; //destructure from userschema or model

    try {
      //check if user already exist
      let user = await User.findOne({ email });
      if (user) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'User already exist' }] }); //make errors same as check
      }

      //get users gravatar
      const avatar = gravatar.url(email, {
        s: '200', //size
        r: 'pg',
        d: 'mm', //default
      });
      user = new User({ name, email, avatar, password }); //create instance to save in db use .save()

      //encrypt password
      //{note:whenever an func inbuilt or userdefine get a promise/value from func. use await}
      const salt = await bcrypt.genSalt(10); //random text to encrypt pass
      user.password = await bcrypt.hash(password, salt);

      await user.save(); //save evrything(email,pass,name..) in db

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
      });

      // res.send(req.body);
    } catch (err) {
      console.log(err.message);
      res.status(500).send('server error');
    }
  }
);

module.exports = router;
