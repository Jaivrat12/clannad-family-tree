const mongoose = require('mongoose');
const Family = require('../models/Family');
const Member = require('../models/Member');
const NuclearFamily = require('../models/NuclearFamily');
const { getDescendants } = require('../utils');
const { uploadImage } = require('../utils/cloudinary');

const getMember = async (req, res) => {

    const { memberId } = req.params;

    try {
        const member = await Member.findById(memberId);
        res.status(200).json({ success: true, data: member });
    } catch (error) {
        res.status(400).json({ success: false });
    }
};

const createMember = async (req, res) => {

    const data = req.body;

    try {
        const member = await Member.create(data);
        res.status(200).json({ success: true, data: member });
    } catch (error) {
        res.status(400).json({ success: false });
    }
};

const updateMember = async (req, res) => {

    const { memberId } = req.params;
    const updates = req.body;

    try {

        const member = await Member.findById(memberId).populate('nuclearFamily');
        const { nuclearFamily } = member;
        member.depopulate('nuclearFamily');

        if (member.gender !== updates.gender) {

            if (nuclearFamily[updates.gender]) {

                res.status(400).json({
                    success: false,
                    error: 'Can\'t change gender of a member that has a spouse',
                });
                return;
            }

            nuclearFamily[member.gender] = null;
            nuclearFamily[updates.gender] = member._id;
        }

        member.set(updates);
        if (req.files?.image) {
            member.image = await uploadImage(req.files.image.tempFilePath, {
                folder: member.workspace,
                public_id: member._id,
            });
        }

        await member.save();
        await nuclearFamily.save();

        res.status(200).json({ success: true, member, nuclearFamily });
    } catch (error) {
        res.status(400).json({ success: false, error });
    }
};

const addSpouse = async (req, res) => {

    const { memberId, spouseId } = req.params;

    try {

        const member = await Member.findById(memberId).populate('nuclearFamily');
        const spouse = await Member.findById(spouseId).populate('nuclearFamily');

        let memberDescendants, spouseDescendants;

        let error = '';
        if (member.gender === spouse.gender) {
            error = 'Couple should have different genders';
        } else if (member.nuclearFamily[spouse.gender]) {
            error = 'Member already has a spouse';
        } else if (spouse.nuclearFamily[member.gender]) {
            error = 'Spouse already has a spouse';
        } else if (
            member.parent &&
            spouse.parent &&
            member.parent.toString() === spouse.parent.toString()
        ) {
            error = 'Bro! They are brother and sister 💀';
        } else {

            memberDescendants = await getDescendants(member.nuclearFamily._id);
            if (memberDescendants.members[spouse._id]) {
                error = 'Cycle detected! Spouse exists as a descendant of the member';
            } else {

                spouseDescendants = await getDescendants(spouse.nuclearFamily._id);
                if (spouseDescendants.members[member._id]) {
                    error = 'Cycle detected! Member exists as a descendant of the spouse';
                }
            }
        }

        if (error) {
            res.status(400).json({ success: false, error });
            return;
        }

        const nfId = member.nuclearFamily._id;
        const spouseNfId = spouse.nuclearFamily._id;
        const updateNuclearFamily = NuclearFamily.findByIdAndUpdate(nfId, {
            $set: { [spouse.gender]: spouse._id },
            $push: { children: { $each: spouse.nuclearFamily.children } },
        }, {
            new: true,
        });

        const updateSpouseChildren = async () => {

            await Member.updateMany({
                parent: spouseNfId,
            }, {
                $set: { parent: nfId },
            });
            return await Member.find({ parent: nfId });
        };

        const deleteSpouseNuclearFamily = NuclearFamily.deleteOne({
            _id: spouseNfId,
        });

        const updateSpouseParent = spouse.parent && NuclearFamily.findByIdAndUpdate(spouse.parent._id, {
            $set: { 'children.$[child]': nfId, },
        }, {
            arrayFilters: [ { child: spouseNfId } ],
            new: true,
        });

        spouse.depopulate('nuclearFamily');
        spouse.nuclearFamily = nfId;

        const [
            nuclearFamily,
            children,
            spouseParent,
        ] = await Promise.all([
            updateNuclearFamily.exec(),
            updateSpouseChildren(),
            updateSpouseParent?.exec(),
            deleteSpouseNuclearFamily.exec(),
            spouse.save(),
        ]);

        const {
            members,
            nuclearFamilies,
            parents,
        } = spouseDescendants;

        delete nuclearFamilies[spouseNfId];
        [nuclearFamily, spouseParent].forEach((nf) => {
            if (nf) {
                nuclearFamilies[nf._id] = nf;
            }
        });

        [spouse, ...children].forEach((member) => {
            members[member._id] = member;
        });

        res.status(200).json({ success: true, nuclearFamilies, members, parents });
    } catch (error) {
        res.status(400).json({ success: false, error });
    }
};

const removeSpouse = async (req, res) => {

    const { memberId } = req.params;

    try {

        const member = await Member.findById(memberId).populate({
            path: 'nuclearFamily',
            populate: {
                path: 'male female',
                populate: {
                    path: 'parent',
                }
            },
        });

        const nuclearFamily = member.nuclearFamily;
        const spouseGender = member.gender === 'male' ? 'female' : 'male';
        const spouse = nuclearFamily[spouseGender];
        if (!spouse) {

            res.status(400).json({
                success: false,
                error: 'Member doesn\'t have a spouse',
            });
            return;
        }

        nuclearFamily.depopulate('male female');
        nuclearFamily[spouse.gender] = null;

        const spouseNuclearFamily = new NuclearFamily({
            _id: new mongoose.Types.ObjectId(),
            [member.gender]: null,
            [spouse.gender]: spouse._id,
            children: [],
            workspace: spouse.workspace,
        });
        spouse.nuclearFamily = spouseNuclearFamily._id;

        spouse.depopulate('parent');
        const updateSpouseParent = spouse.parent && NuclearFamily.findOneAndUpdate({
            _id: spouse.parent,
        }, {
            $set: { 'children.$[child]': spouse.nuclearFamily._id, },
        }, {
            arrayFilters: [ { child: nuclearFamily._id } ],
            new: true,
        });

        const updateFamilyRoots = Family.updateMany({
            root: spouse._id,
        }, {
            root: member._id,
        });

        const [ spouseParent ] = await Promise.all([
            updateSpouseParent?.exec(),
            nuclearFamily.save(),
            spouse.save(),
            spouseNuclearFamily.save(),
            updateFamilyRoots.exec(),
        ]);

        const nuclearFamilies = {
            [nuclearFamily._id]: nuclearFamily,
            [spouseNuclearFamily._id]: spouseNuclearFamily,
        };
        if (spouseParent) {
            nuclearFamilies[spouseParent._id] = spouseParent;
        }

        res.status(200).json({ success: true, nuclearFamilies, spouse });
    } catch (error) {
        res.status(400).json({ success: false, error });
    }
};

const addChild = async (req, res) => {

    const { memberId, childId } = req.params;

    const getFamilyRootIds = async (id) => {
        return await Family.find({ root: id });
    };

    try {

        const member = await Member.findById(memberId);
        const child = await Member.findById(childId);
        let childDescendants;

        let error = '';
        if (child.parent) {
            error = 'Child already has a parent';
        } else {

            childDescendants = await getDescendants(child.nuclearFamily);
            if (childDescendants.members[memberId]) {
                error = 'Cycle detected! Member exists as a descendant of the child';
            }
        }

        if (error) {
            res.status(400).json({ success: false, error });
            return;
        }

        const childRootFamilies = await getFamilyRootIds(childId);

        const nuclearFamily = await NuclearFamily.findOneAndUpdate({
            $or: [
                { male: memberId },
                { female: memberId },
            ],
        }, {
            $push: { children: child.nuclearFamily },
        }, {
            new: true,
        });

        child.parent = nuclearFamily._id;

        const updateFamilyRoots = childRootFamilies.length > 0 && Family.updateMany({
            root: childId,
        }, {
            $set: { root: memberId },
        });

        const families = {};
        childRootFamilies.forEach((family) => {
            family.root = member;
            families[family._id] = family;
        });

        await Promise.all([
            child.save(),
            updateFamilyRoots && updateFamilyRoots.exec(),
        ]);

        const {
            members,
            nuclearFamilies,
            parents,
        } = childDescendants;

        members[member._id] = member;
        members[child._id] = child;
        nuclearFamilies[nuclearFamily._id] = nuclearFamily;

        res.status(200).json({
            success: true,
            members,
            nuclearFamilies,
            parents,
            families,
        });
    } catch (error) {
        res.status(400).json({ success: false, error });
    }
};

const removeChild = async (req, res) => {

    const { childId } = req.params;

    try {

        const child = await Member.findById(childId);

        let error = '';
        if (!child) {
            error = 'Member not found';
        } else if (!child.parent) {
            error = 'Member does not have a parent';
        }

        if (error) {
            res.status(400).json({ success: false, error });
            return;
        }

        const removeChild = NuclearFamily.findOneAndUpdate({
            _id: child.parent,
        }, {
            $pull: { children: child.nuclearFamily },
        }, {
            new: true,
        });

        child.parent = null;

        const [nuclearFamily] = await Promise.all([
            removeChild.exec(),
            child.save(),
        ]);

        res.status(200).json({
            success: true,
            nuclearFamily,
            member: child,
        });
    } catch (error) {
        res.status(400).json({ success: false, error });
    }
};

module.exports = {
    getMember,
    createMember,
    updateMember,
    addSpouse,
    removeSpouse,
    addChild,
    removeChild,
};