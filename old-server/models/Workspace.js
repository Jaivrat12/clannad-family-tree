import mongoose, { Schema } from 'mongoose';

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
	description: String,
	image: String,
});

export default mongoose.models.Workspace || mongoose.model('Workspace', WorkspaceSchema);