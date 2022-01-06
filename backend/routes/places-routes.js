const express = require("express");

const router = express.Router();

const DUMMY_PLACES = [
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

router.get('/:pid', (req, res, next)=>{
 const placeId = req.params.pid;

 const place = DUMMY_PLACES.find(p =>{
  return p.id===placeId;
 })
 if(!place){
  return res.status(404).json({message:"No data found"})
 }
 res.json({place: place});
})

router.get('/user/:uid', (req, res, next)=>{
 const userId = req.params.uid;

 const place = DUMMY_PLACES.find(p =>{
  return p.creator===userId;
 })
 if(!place){
  return res.status(404).json({message:"No data found"})
 }
 res.json({place: place});
})

module.exports = router;