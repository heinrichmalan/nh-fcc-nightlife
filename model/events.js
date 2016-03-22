var mongoose = require('mongoose');

var EventSchema = mongoose.Schema({
   date: String,
   businesses: [{name: String, attendees: []}]
});