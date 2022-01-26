const validator = require('express-validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const HttpError = require('../model/http-error');
const Users = require('../model/users')

const getAllUsers = async (req, res, next) => {
  let users
  try{
    users = await Users.find({}, '-password');
  }catch(err){
    const error = new HttpError('Something went wrong, could not find data', 500)
    return next(error) 
  }
  if(!users){
    const error = new HttpError('Failed to fetch users', 500)
    return next(error)
  }
  res.json({users: users})
}

const signup = async(req, res, next) => {
  const errors = validator.validationResult(req)
  if (!errors.isEmpty()) {
    console.log(errors)
    return next(new HttpError("Invalid inputs", 422));
  }
  const { name, email, password} = req.body;
  let existingUser;
  try {
    existingUser = await Users.findOne({ email: email })
  } catch (err) {
    const error = new HttpError('Something went wrong, could not find data', 500)
    return next(error)
  }

  if (existingUser) {
    const error = new HttpError('User Already Exists!', 422)
    return next(error)
  }
  let hashPassword;
  try{
    hashPassword = await bcrypt.hash(password, 12)
  }catch(e){
    const error = new HttpError('Something went wrong, could not find data', 500)
    return next(error)
  }
  

  const createUser = new Users({
    name: name,
    email: email,
    password: hashPassword,
    image: req.file.path,
    places: []

  })
  try {
    await createUser.save();
  } catch (err) {
    const error = new HttpError('SignUp failed', 500)
    return next(error)
  }
  let token ;
  try{
  token = jwt.sign({userId: createUser.id, email: createUser.email}, '1QZn8sdRktVxsPGO', {expiresIn: '1h'} ) // secret or private key -> 1QZn8sdRktVxsPGO
  }catch(err){
    const error = new HttpError('SignUp failed', 500)
    return next(error)
  }
  res.status(201).json({ userId: createUser.id, email: createUser.email, token: token });
}

const login = async (req, res, next) => {
  const { email, password } = req.body;
  let existingUser;
  try {
    existingUser = await Users.findOne({ email: email })
  } catch (err) {
    const error = new HttpError('Login Failed, try again later', 500)
    return next(error)
  }
  if(!existingUser){
    const error = new HttpError('Login Failed, invalis credentials!', 401)
    return next(error)
  }

  let isValidPassword=false;
  try{
    isValidPassword = await bcrypt.compare(password, existingUser.password);
  }
  catch(err){
    const error = new HttpError('Login Failed, something went wrong!', 500)
    return next(error)
  } 
  if(!isValidPassword){
    const error = new HttpError('Login Failed, invalis credentials!', 401)
    return next(error)
  }
  let token ;
  try{
  token = jwt.sign({userId: existingUser.id, email: existingUser.email}, '1QZn8sdRktVxsPGO', {expiresIn: '1h'} ) // secret or private key -> 1QZn8sdRktVxsPGO
  }catch(err){
    const error = new HttpError('SignUp failed', 500)
    return next(error)
  }
  res.json({message: 'login', user: existingUser.id , email : existingUser.email, token: token})
  
}

exports.getAllUsers = getAllUsers;
exports.login = login;
exports.signup = signup;