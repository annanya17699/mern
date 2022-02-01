const jwt = require("jsonwebtoken");
const HttpError = require("../model/http-error");

module.exports = (req, res, next) => {
 if(req.method==='OPTIONS'){
  next();
 }
 try {
  const token = req.headers.authorization.split(' ')[1];
  //console.log('token', token);
  if (!token) {
   throw new Error('Authentication failed');
  }
  const decodedToken = jwt.verify(token,  process.env.SECRET_KEY);
  //console.log('decoded', decodedToken)
  req.userData={userId: decodedToken.userId}
  next();
 } 
 catch (err) {
  return next(new HttpError('Authentication failed', 401));
 }
}