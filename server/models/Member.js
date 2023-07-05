const mongoose = require('mongoose');
const { Schema } = mongoose;

const MemberSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    gender: {
        type: String,
        enum: ['male', 'female'],
        required: true,
    },
    dob: {
        type: Date,
        // required: true,
        default: null,
    },
    dod: {
        type: Date,
        default: null,
    },
    image: {
        type: String,
        default: null,
    },
    parent: {
        type: Schema.Types.ObjectId,
        ref: 'NuclearFamily',
        default: null,
    },
    nuclearFamily: {
		type: Schema.Types.ObjectId,
		ref: 'NuclearFamily',
        required: true,
    },
    workspace: {
		type: Schema.Types.ObjectId,
		ref: 'Workspace',
        required: true,
    },
});

module.exports = mongoose.model('Member', MemberSchema);