const jwt = require("jsonwebtoken");
const HttpError = require("../model/http-error");

module.exports = (req, res, next) => {
 if(req.method==='OPTIONS'){
  next();
 }
 try {
  const token = req.headers.authorization.split(' ')[1];
  if (!token) {
   return next(new Error('Authentication failed'));
  }
  const decodedToken = jwt.verify(token, '1QZn8sdRktVxsPGO');
  req.userData({userId: decodedToken.userId})
  next();
 } 
 catch (err) {
  return next(new HttpError('Authentication failed', 401));
 }
}