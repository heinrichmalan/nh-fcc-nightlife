var mongoose = require('mongoose');

var EventSchema = mongoose.Schema({
   date: String,
   business: String,
   attendees: [String]
});

var Events = mongoose.model('Events', EventSchema);

module.exports = Events;