const Family = require('../models/Family');
const Member = require('../models/Member');
const { getDescendants } = require('../utils');

// ! NOT USED
const getFamilies = async (req, res) => {

    try {
        const families = await Family.find({});
        res.status(200).json({ success: true, data: families });
    } catch (error) {
        res.status(400).json({ success: false });
    }
};

const getFamilyById = async (req, res) => {

    const { familyId } = req.params;
    const familyDetails = await Family.findById(familyId).populate('root');
    if (!familyDetails) {
        res.status(404).json({ success: false, error: 'Family not found!' });
        return;
    }

    const {
        members,
        nuclearFamilies,
        parents,
    } = await getDescendants(familyDetails.root?.nuclearFamily);

    const familyData = {
        _id: familyDetails._id,
        root: familyDetails.root,
        members,
        nuclearFamilies,
        parents,
    };
    res.status(200).json({ success: true, data: familyData });
    return;

    // check if member belongs to this family
    // const belongsTo = (member) =>
    //     member.family.toString() === id;

    // try {
    //     const familyDetails = await Family.findById(id)
    //         // .populate('root');

    //     const members = await Member.find({ family: id })
    //         .populate({
    //             path: 'nuclearFamily',
    //             populate: {
    //                 path: 'male female',
    //             },
    //         });

    //     const nuclearFamilies = {};
    //     const familyMembers = {};
    //     const parents = {};
    //     members.forEach((member) => {

    //         familyMembers[member._id] = member;

    //         const nuclearFamily = member.nuclearFamily;
    //         if (nuclearFamily) {

    //             const { _id, male, female, children } = nuclearFamily;

    //             // assign the parent for each child
    //             const parent = male && belongsTo(male) ? male : female;
    //             children.forEach((child) => {
    //                 parents[child] = parent._id;
    //             });

    //             // add member's spouse to familyMembers[]
    //             const spouseGender = member.gender === 'male' ? 'female' : 'male';
    //             const spouse = nuclearFamily[spouseGender];
    //             if (spouse) {
    //                 familyMembers[spouse._id] = spouse;
    //             }

    //             // depopulate fields in nuclearFamily
    //             nuclearFamily.male = male ? male._id : null;
    //             nuclearFamily.female = female ? female._id : null;
    //             nuclearFamilies[_id] = nuclearFamily;

    //             member.nuclearFamily = nuclearFamily._id;
    //         }
    //     });

    //     const familyData = {
    //         _id: familyDetails._id,
    //         root: familyDetails.root,
    //         members: familyMembers,
    //         nuclearFamilies,
    //         parents,
    //     };
    //     res.status(200).json({ success: true, data: familyData });
    // } catch (error) {
    //     res.status(400).json({ success: false, error });
    // }
};

const updateFamily = async (req, res) => {

    const { familyId } = req.params;

    try {
        const family = await Family.findByIdAndUpdate(familyId, req.body)
        res.status(200).json({ success: true, data: family });
    } catch (error) {
        res.status(400).json({ success: false });
    }
};

const addRoot = async (req, res) => {

    const { familyId, memberId } = req.params;
    try {

        const member = await Member.findById(memberId);
        if (member.parent) {

            res.status(400).json({
                success: false,
                error: 'Root of the family should not have a parent',
            });
            return;
        }

        const family = await Family.findByIdAndUpdate(familyId, {
            $set: { root: memberId }
        }, {
            new: true,
        }).populate('root');
        res.status(200).json({ success: true, data: family });
    } catch (error) {
        res.status(400).json({ success: false });
    }
};

const removeRoot = async (req, res) => {

    const { familyId } = req.params;
    try {

        const family = await Family.findByIdAndUpdate(familyId, {
            $set: { root: null }
        }, {
            new: true,
        });
        res.status(201).json({ success: true, data: family });
    } catch (error) {
        res.status(400).json({ success: false });
    }
};

// ! NOT USED
const createFamily = async (req, res) => {

    try {
        const family = await Family.create(req.body)
        res.status(201).json({ success: true, data: family })
    } catch (error) {
        res.status(400).json({ success: false })
    }
};

module.exports = {
    getFamilies,
    getFamilyById,
    createFamily,
    updateFamily,
    addRoot,
    removeRoot,
};