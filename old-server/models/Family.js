import mongoose, { Schema } from 'mongoose';

const FamilySchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
	},
    root: {
		type: Schema.Types.ObjectId,
		ref: 'Member',
		required: true,
    },
});

export default mongoose.models.Family || mongoose.model('Family', FamilySchema);