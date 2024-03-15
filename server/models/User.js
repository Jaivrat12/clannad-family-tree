const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
	email: {
		type: String,
		required: true,
	},
	isGod: {
		type: Boolean,
		default: false,
		immutable: true,
	}
});

module.exports = mongoose.model('User', UserSchema);