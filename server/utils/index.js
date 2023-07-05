const mongoose = require('mongoose');
const NuclearFamily = require('../models/NuclearFamily');

const getDescendants = async (root) => {

    if (!root) {
        return {
            members: {},
            nuclearFamilies: {},
            parents: {},
        };
    }

    const filter = { _id: new mongoose.Types.ObjectId(root) };
    const graphLookupQuery = {
        from: "nuclearfamilies",
        startWith: "$_id",
        connectFromField: "children",
        connectToField: "_id",
        as: "nuclearFamilies",
    };

    const result = await NuclearFamily.aggregate([
        { $match: filter },
        { $graphLookup: graphLookupQuery },
    ]);

    const nfs = result[0].nuclearFamilies;
    await NuclearFamily.populate(nfs, { path: 'male female' });

    const nuclearFamilies = {};
    const members = {};
    const parents = {};
    nfs.forEach((nf) => {

        const { _id, male, female, children } = nf;

        if (male) {
            members[male._id] = male;
        }
        if (female) {
            members[female._id] = female;
        }

        // depopulate fields in nuclearFamily
        nf.male = male ? male._id : null;
        nf.female = female ? female._id : null;
        nuclearFamilies[_id] = nf;
    });

    return {
        members,
        nuclearFamilies,
        parents,
    };
};

module.exports = {
    getDescendants,
};