const fs = require('fs')
const path = require('path')
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require('mongoose');

const placesRoutes = require('./routes/places-routes');
const userRoutes = require('./routes/user-routes');
const HttpError = require('./model/http-error');
const app = express();

app.use(bodyParser.json());


app.use((req, res, next)=>{
 res.setHeader('Access-Control-Allow-Origin', '*');
 res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
 res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE');
 next();
})
app.use('/uploads/images', express.static(path.join('uploads','images')));
app.use('/api/places/',placesRoutes);
app.use('/api/users/',userRoutes);

app.use((req, res, next)=>{
 const error = new HttpError('Could not find this route!', 404);
 return next(error);
})

app.use((error, req, res, next)=>{
 if(req.file){
  fs.unlink(req.file.path, err=>{
   console.log(err);
  })
 }
 if(res.headerSent){
  return next(error);
 }
 res.status(error.code || 500).json({message:error.message|| 'An unknown error occured'});
});
mongoose.connect('mongodb+srv://admin_annanya:password1admin@cluster0.naacr.mongodb.net/places?retryWrites=true&w=majority')
.then(()=>{
 console.log("connected to db");
 app.listen(5000);
})
.catch(err=> console.log(err));
