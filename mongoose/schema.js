const mongoose = require('mongoose');

  const Schema = mongoose.Schema;
  const user = new Schema({
	clerkID: Number,
	reservations: Array,
	difficulty: Number,
  });
  const trail = new Schema({
    trailID: Number,
    name: String,
    difficulty: Number,
    location: String,
  });
  const reservation = new Schema({
    reservationID: Number,
    trailID: Number,
    attendding: Array,
    limit: Number,

  });
  const volunteer = new Schema({
    volunteerID: Number,
    name: String,
    age: Number,
  });
  
  // export all the schemas
    module.exports = {
        user: mongoose.model('User', user),
        trail: mongoose.model('trail', trail),
        reservation: mongoose.model('reservation', reservation),
        volunteer: mongoose.model('volunteer', volunteer),
    };