const validator = require('express-validator')

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

  const createUser = new Users({
    name: name,
    email: email,
    password: password,
    image: 'https://images.pexels.com/photos/839011/pexels-photo-839011.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260',
    places: []

  })
  try {
    await createUser.save();
  } catch (err) {
    const error = new HttpError('SignUp failed', 500)
    return next(error)
  }
  res.status(201).json({ user: createUser });
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
  if(!existingUser || existingUser.password!==password){
    const error = new HttpError('Login Failed, invalis credentials!', 401)
    return next(error)
  }
  res.json({message: 'login', user: existingUser})
}

exports.getAllUsers = getAllUsers;
exports.login = login;
exports.signup = signup;