const mongoose = require('mongoose');
const { Schema } = mongoose;

const FamilySchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
	},
    root: {
		type: Schema.Types.ObjectId,
		ref: 'Member',
		default: null,
    },
});

module.exports = mongoose.model('Family', FamilySchema);