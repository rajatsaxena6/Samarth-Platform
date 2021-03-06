var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var schema = new Schema({
    'candidateid': { type: String, required: true },
    'section': { type: String, required: true },
    'fieldname': { type: String, required: true },
    'instancename': { type: String, required: true },
    'response': { type: String },
    'status': { type: String,required: true ,default:'pending', enum: ['pending', 'answered', 'closed'] }
});

//composite unique key
schema.index({ 
	candidateid: 1, 
	section: 1, 
	fieldname: 1, 
	instancename: 1 }, 
	{ unique: true }
);

module.exports = mongoose.model('qboxquestions', schema, 'qboxquestions');
