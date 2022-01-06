const { v4: uuidv4 } = require('uuid');
const HttpError = require('../model/http-error');

let DUMMY_PLACES = [
 {
   id: 'p1',
   title: 'Empire State Building',
   description: 'One of the most famous sky scrapers in the world!',
   imageUrl:
     'https://upload.wikimedia.org/wikipedia/commons/thumb/d/df/NYC_Empire_State_Building.jpg/640px-NYC_Empire_State_Building.jpg',
   address: '20 W 34th St, New York, NY 10001',
   location: {
     lat: 40.7484405,
     lng: -73.9878584
   },
   creator: 'u1'
 },
 {
   id: 'p2',
   title: 'Eiffel Tower',
   description: "Gustave Eiffel's iconic, wrought-iron 1889 tower, with steps and elevators to observation decks.",
   imageUrl:
     'https://lh5.googleusercontent.com/p/AF1QipNyvVnVBBdBpGG0OvSNRuEsiZDnKdCgRKukWRd-=w408-h468-k-no',
   address: 'Champ de Mars, 5 Av. Anatole France, 75007 Paris, France',
   location: {
     lat: 48.8583701,
     lng: 2.2922926
   },
   creator: 'u2'
 },
 {
   id: 'p3',
   title: 'India Gate',
   description: 'Imposing Arc de Triomphe-style gate commemorating the Indian soliders killed in the First World War.',
   imageUrl:
     'https://lh5.googleusercontent.com/p/AF1QipNS6BoZ-zyVhszXJHmIf_nDGob-xk8mkFfGUGF3=w408-h270-k-no',
   address: 'Rajpath, India Gate, New Delhi, Delhi 110001',
   location: {
     lat: 28.6129,
     lng: 77.2295
   },
   creator: 'u1'
 }
];

const getPlaceById = (req, res, next)=>{
 const placeId = req.params.pid;

 const place = DUMMY_PLACES.find(p =>{
  return p.id===placeId;
 })
 if(!place){
  return next(
    new HttpError("No place found with that id ", 404)
  )
 }
 res.json({place: place});
}

const getPlaceByUserId =(req, res, next)=>{
 const userId = req.params.uid;

 const place = DUMMY_PLACES.filter(p =>{
  return p.creator===userId;
 })
 if(!place || place.length===0){
  return next(
    new HttpError("No place found for that user id ", 404)
  )
 }
 res.json({place: place});
}

const createPlace=(req, res, next)=>{
  const {title, description, coordinates, address, creator} = req.body;
  const createPlace = {
    id: uuidv4(),
    title: title,
    description: description,
    address:address,
    creator:creator,
    location: coordinates
  }

  DUMMY_PLACES.push(createPlace)

  res.status(201).json({place:createPlace})
}

const updatePlaceById=(req, res, next)=>{
  const {title, description} = req.body;
  const placeId = req.params.pid;
  const updatePlace = {...DUMMY_PLACES.find(p =>p.id===placeId)}
  const index = DUMMY_PLACES.findIndex(p =>p.id===placeId)
  updatePlace.title=title
  updatePlace.description=description

  DUMMY_PLACES[index] = updatePlace;
  res.status(200).json({place:updatePlace})
}

const deletePlace=(req, res, next)=>{
  const placeId = req.params.pid;
  DUMMY_PLACES=DUMMY_PLACES.filter(p =>p.id!==placeId);
  res.status(200).json({message:"Place Deleted"})
}

exports.getPlaceById= getPlaceById;
exports.getPlaceByUserId = getPlaceByUserId;
exports.createPlace=createPlace;
exports.updatePlaceById=updatePlaceById;
exports.deletePlace=deletePlace;