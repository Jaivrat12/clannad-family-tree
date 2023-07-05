const mongoose = require('mongoose');
const { Schema } = mongoose;

const WorkspaceSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
	},
    families: [{
		type: Schema.Types.ObjectId,
		ref: 'Family',
		required: true,
    }],
    owner: {
		type: Schema.Types.ObjectId,
		ref: 'User',
		required: true,
    },
	description: {
		type: String,
		default: null,
	},
	image: {
		type: String,
		default: null,
	},
});

module.exports = mongoose.model('Workspace', WorkspaceSchema);