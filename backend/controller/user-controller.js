const { v4: uuidv4 } = require('uuid');
const validator = require('express-validator')

const HttpError = require('../model/http-error');

const DUMMY_USERS = [
 {
  id: 'u1',
  name: 'Max',
  email: 'test@gmail.com',
  password: 'tester'
 },
 {
  id: 'u2',
  name: 'Manny',
  email: 'test2@gmail.com',
  password: 'tester2'
 }
]

const getAllUsers = ((req, res, next) => {
 res.status(200).json({users: DUMMY_USERS});
})

const signup = ((req, res, next) => {
 const errors= validator.validationResult(req)
  if(!errors.isEmpty()){
    console.log(errors)
    throw new HttpError("Invalid inputs", 422);
  }
 const {name, email, password} = req.body;

 const hasUser=DUMMY_USERS.find(u=> u.email===email)
 if(hasUser){
  throw new HttpError("User already exists", 422);
 }

 const createUser = {
  id : uuidv4(),
  name:name,
  email: email,
  password: password
 }

 DUMMY_USERS.push(createUser);
 res.status(201).json({user: createUser});
})

const login = ((req, res, next) => {
 const {email, password} = req.body;
 const identifiedUser = DUMMY_USERS.find(u => u.email === email)
 if(!identifiedUser || identifiedUser.password !== password){
  throw new HttpError("User credentials are incorrect", 401);
 }
 res.status(200).json({message: "Logged in!"});
})

exports.getAllUsers = getAllUsers;
exports.login = login;
exports.signup = signup;