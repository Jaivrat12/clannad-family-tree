import mongoose, { Schema } from 'mongoose';
import Family from './Family';
import NuclearFamily from './NuclearFamily';

const MemberSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    gender: {
        type: String,
        required: true,
    },
    dob: {
        type: Date,
        // required: true,
    },
    dod: {
        type: Date,
    },
    image: {
        type: String,
    },
    families: {
        type: {
            paternal: {
                type: Schema.Types.ObjectId,
                ref: Family,
            },
            maternal: {
                type: Schema.Types.ObjectId,
                ref: Family,
            },
        }
    },
    nuclearFamily: {
		type: Schema.Types.ObjectId,
		ref: NuclearFamily,
    },
});

export default mongoose.models.Member || mongoose.model('Member', MemberSchema);