const mongoose = require('mongoose');
const { Schema } = mongoose;

const NuclearFamilySchema = new mongoose.Schema({
	male: {
		type: Schema.Types.ObjectId,
		ref: 'Member',
        default: null,
	},
	female: {
		type: Schema.Types.ObjectId,
		ref: 'Member',
        default: null,
	},
	children: [{
		type: Schema.Types.ObjectId,
		ref: 'NuclearFamily',
		default: [],
	}],
});

module.exports = mongoose.model('NuclearFamily', NuclearFamilySchema);