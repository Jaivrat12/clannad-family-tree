import mongoose, { Schema } from 'mongoose';

const NuclearFamilySchema = new mongoose.Schema({
	male: {
		type: Schema.Types.ObjectId,
		ref: 'Member',
	},
	female: {
		type: Schema.Types.ObjectId,
		ref: 'Member',
	},
	children: [{
		type: Schema.Types.ObjectId,
		ref: 'Member',
	}],
});

export default mongoose.models.NuclearFamily || mongoose.model('NuclearFamily', NuclearFamilySchema);