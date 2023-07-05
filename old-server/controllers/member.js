import mongoose from 'mongoose';
import Member from '@server/models/Member';
import NuclearFamily from '@server/models/NuclearFamily';
import Family from '@server/models/Family';

const getMember = async (req, res) => {

    const id = req.query.id;

    try {
        const member = await Member.findById(id);
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

    const id = req.query.id;
    const data = req.body;

    try {
        const member = await Member.findOneAndUpdate({ _id: id }, data, { new: true });
        res.status(200).json({ success: true, member });
    } catch (error) {
        res.status(400).json({ success: false });
    }
};

const addSpouse = async (req, res) => {

    const { id, spouseId } = req.query;

    try {

        const member = await Member.findById(id).populate('nuclearFamily');
        const spouse = await Member.findById(spouseId).populate('nuclearFamily');

        if (
            member.family === spouse.family
            || member.gender === spouse.gender
            || member.nuclearFamily?.[spouse.gender]
            || spouse.nuclearFamily?.[member.gender]
        ) {
            res.status(400).json({
                success: false,
                error: 'Couple not suitable or already have their own spouses'
            });
            return;
        }

        const nuclearFamily = member.nuclearFamily ?? new NuclearFamily({
            _id: new mongoose.Types.ObjectId(),
            [member.gender]: member._id,
        });

        nuclearFamily[spouse.gender] = spouseId;
        nuclearFamily.children = [
            ...(member.nuclearFamily.children ?? []),
            ...(spouse.nuclearFamily?.children ?? []),
        ];

        member.depopulate('nuclearFamily');
        spouse.depopulate('nuclearFamily');
        member.nuclearFamily = spouse.nuclearFamily = nuclearFamily._id;

        const promises = [nuclearFamily.save(), spouse.save()];
        if (member.isModified()) {
            promises.push(member.save());
        }
        await Promise.all(promises);

        res.status(200).json({ success: true, nuclearFamily, member, spouse });
    } catch (error) {
        res.status(400).json({ success: false, error });
    }
};

const removeSpouse = async (req, res) => {

    const { id } = req.query;

    try {

        const member = await Member.findById(id).populate({
            path: 'nuclearFamily',
            populate: {
                path: 'male female',
            },
        });

        const nuclearFamily = member.nuclearFamily;
        const spouseGender = member.gender === 'male' ? 'female' : 'male';
        const spouse = nuclearFamily?.[spouseGender];
        if (!spouse) {

            res.status(400).json({
                success: false,
                error: 'Member doesn\'t have a spouse',
            });
            return;
        }

        nuclearFamily.depopulate('male female');
        nuclearFamily[spouse.gender] = null;
        spouse.nuclearFamily = null;
        await Promise.all([nuclearFamily.save(), spouse.save()]);

        res.status(200).json({ success: true, nuclearFamily, spouse });
    } catch (error) {
        res.status(400).json({ success: false, error });
    }
};

const addChildren = async (req, res) => {

    const { id, childId } = req.query;

    const hasParent = async (id) => {

        const nuclearFamily = await NuclearFamily.findOne({
            children: id
        });
        return nuclearFamily !== null;
    };

    try {

        const member = await Member.findById(id).populate('nuclearFamily');
        const child = await Member.findById(childId).populate('family');

        let error = '';
        if (member.family.toString() !== child.family._id.toString()) {
            error = 'Member and child don\'t belong to the same family';
        } else if (child._id.toString() === child.family.root.toString()) {
            error = 'Can\'t make the root of the family a child of some member';
        } else if (await hasParent(childId)) {
            error = 'Child already has a parent';
        }

        if (error) {
            res.status(400).json({ success: false, error });
            return;
        }

        const nuclearFamily = member.nuclearFamily ?? new NuclearFamily({
            _id: new mongoose.Types.ObjectId(),
            [member.gender]: member._id,
            children: [],
        });
        // TODO: try to use $push operator of mongoose here
        nuclearFamily.children.push(childId);

        member.depopulate('nuclearFamily');
        member.nuclearFamily = nuclearFamily._id;

        const promises = [nuclearFamily.save()];
        if (member.isModified()) {
            promises.push(member.save());
        }
        await Promise.all(promises);

        res.status(200).json({ success: true, nuclearFamily, member });
    } catch (error) {
        res.status(400).json({ success: false, error });
    }
};

const removeChildren = async (req, res) => {

    const { id, childId } = req.query;

    try {

        const member = await Member.findById(id).populate('nuclearFamily');

        const nuclearFamily = member.nuclearFamily;
        const child = nuclearFamily?.children.includes(childId);
        if (!child) {

            res.status(400).json({
                success: false,
                error: 'Member doesn\'t have this child',
            });
            return;
        }

        const newNuclearFamily = await NuclearFamily.findOneAndUpdate({
            _id: nuclearFamily._id
        }, {
            $pull: { children: childId }
        }, {
            new: true
        });

        res.status(200).json({ success: true, nuclearFamily: newNuclearFamily });
    } catch (error) {
        res.status(400).json({ success: false, error });
    }
};

export {
    getMember,
    createMember,
    updateMember,
    addSpouse,
    removeSpouse,
    addChildren,
    removeChildren,
};