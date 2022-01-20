const validator = require('express-validator')

const HttpError = require('../model/http-error');
const getCoordsForAddress = require('../utils/location')
const Place = require('../model/places');
const Users = require('../model/users');
const mongoose = require('mongoose');

const getPlaceById = async (req, res, next)=>{
 const placeId = req.params.pid;
  let place;
 try {
  place = await Place.findById(placeId)
 }
 catch(err){
  const error = new HttpError('Something went wrong, could not find data', 500)
    return next(error)
 }
 if(!place){
  return next(
    new HttpError("No place found with that id ", 404)
  )
 }
 res.json({place: place});
}

const getPlaceByUserId =async (req, res, next)=>{
 const userId = req.params.uid;

 let place;
 try{
  place = await Place.find({creator: userId});
 }catch(err){
  const error = new HttpError('Something went wrong, could not find data', 500)
  return next(error)
 }
 if(!place || place.length===0){
  return next(
    new HttpError("No place found for that user id ", 404)
  )
 }
 res.json({place: place});
}

const createPlace=async (req, res, next)=>{
  const errors= validator.validationResult(req)
  if(!errors.isEmpty()){
    console.log(errors)
    return next(new HttpError("Invalid inputs", 422));
  }

  const {title, description, address, creator} = req.body;
  let coordinates
  try{
    coordinates = await getCoordsForAddress(address)
  }catch(error){
    return next(error);
  }
  
  const createPlace = new Place(
    {
      title: title,
      description: description,
      address:address,
      creator:creator,
      location: coordinates,
      imageUrl:'https://lh5.googleusercontent.com/p/AF1QipNS6BoZ-zyVhszXJHmIf_nDGob-xk8mkFfGUGF3=w408-h270-k-no'
    }
  )
  let user ;
  try{
    user = await Users.findById(creator)
  }
  catch(err){
    const error = new HttpError('Place creation failed, user does not exist', 500)
    return next(error)
  }
  if(!user){
    const error = new HttpError('User does not exist', 404)
    return next(error)
  }

  try{
    const session = await mongoose.startSession()
    session.startTransaction()
     await createPlace.save({session: session});
     user.places.push(createPlace)
     await user.save({session: session})
     await session.commitTransaction()
  }catch(err){
    const error = new HttpError('Place creation failed', 500)
    return next(error)
  }
  res.status(201).json({place:createPlace})
}

const updatePlaceById= async (req, res, next)=>{
  const errors= validator.validationResult(req)
  if(!errors.isEmpty()){
    console.log(errors)
    return next( new HttpError("Invalid inputs", 422));
  }

  const {title, description} = req.body;
  const placeId = req.params.pid;
  let updatedPlace
  try {
    updatedPlace = await Place.findById(placeId)
   }
   catch(err){
    const error = new HttpError('Something went wrong, could not find data', 500)
      return next(error)
   }

  updatedPlace.title=title
  updatedPlace.description=description

  try{
    await updatedPlace.save()
  }catch(err){
    const error = new HttpError('Something went wrong, could not update data', 500)
      return next(error)
  }
  res.status(200).json({place:updatedPlace});
}

const deletePlace= async (req, res, next)=>{
  const placeId = req.params.pid;
  let place;
 try{
  place = await Place.findById(placeId).populate('creator')
 }
 catch(err){
  const error = new HttpError('Something went wrong, could not get data at server' , 500)
    return next(error)
 }
 if(!place){
  const error = new HttpError('Place of the given user not found', 404)
  return next(error)
 }
 try{
  const session = await mongoose.startSession()
  session.startTransaction()
  await place.remove({session: session})
  place.creator.places.pull(place)
  await place.creator.save({session: session})
     await session.commitTransaction()
}catch(err){
  const error = new HttpError('Something went wrong, could not update data', 500)
    return next(error)
}
  res.status(200).json({message:"Place Deleted"})
}

exports.getPlaceById= getPlaceById;
exports.getPlaceByUserId = getPlaceByUserId;
exports.createPlace=createPlace;
exports.updatePlaceById=updatePlaceById;
exports.deletePlace=deletePlace;