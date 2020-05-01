const jwt = require('jsonwebtoken');

const config = require('config');
const jwtSecret = config.get('jwtSecret');

module.exports = function (req, res, next) {
  //get token from header
  const token = req.header('x-auth-token');

  //check if no token
  if (!token) {
    return res.status(401).json({ msg: 'No token,authorization denied' });
  }

  //verify token
  try {
    const decoded = jwt.verify(token, jwtSecret); //decode using secretkey
    req.user = decoded.user; //as it is middleware contains the user values
    next();
  } catch (err) {
    res.status(401).json({ msg: 'token is not valid' });
  }
};
//this middleware is used in auth route
