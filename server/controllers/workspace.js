const mongoose = require('mongoose');
const Family = require('../models/Family');
const Member = require('../models/Member');
const NuclearFamily = require('../models/NuclearFamily');
const Workspace = require('../models/Workspace');
const { uploadImage, deleteImageFolder } = require('../utils/cloudinary');

const getWorkspaces = async (req, res) => {

    const { family } = req.query;
    const query = {
        owner: req.user._id,
    };
    if (family) {
        query.families = family;
    }

    try {
        const workspaces = await Workspace.find(query)
            .populate({
                path: 'families',
                populate: 'root',
            });
        res.status(200).json({ success: true, workspaces });
    } catch (error) {
        res.status(400).json({ success: false, error });
    }
};

const createWorkspace = async (req, res) => {

    try {

        const workspace = await Workspace.create({
            ...req.body,
            owner: req.user._id,
        });

        if (req.files?.image) {
            workspace.image = await uploadImage(req.files.image.tempFilePath, {
                folder: workspace._id,
                public_id: 'workspace',
            });
            workspace.save();
        }

        res.status(201).json({ success: true, data: workspace });
    } catch (error) {
        res.status(400).json({ success: false, error });
    }
};

const updateWorkspace = async (req, res) => {

    const { workspaceId } = req.params;

    try {

        const workspace = await Workspace.findByIdAndUpdate(workspaceId, req.body);

        if (req.files?.image) {
            workspace.image = await uploadImage(req.files.image.tempFilePath, {
                folder: workspace._id,
                public_id: 'workspace',
            });
            workspace.save();
        }

        res.status(200).json({ success: true, data: workspace });
    } catch (error) {
        res.status(400).json({ success: false, error });
    }
};

// TODO: delete families, members, and nuclearFamilies
const deleteWorkspace = async (req, res) => {

    const { workspaceId } = req.params;

    try {

        const [workspace] = await Promise.all([
            Workspace.findByIdAndDelete(workspaceId),
            deleteImageFolder(workspaceId),
        ]);
        res.status(200).json({ success: true, data: workspace });
    } catch (error) {
        res.status(400).json({ success: false, error });
    }
};

const createFamily = async (req, res) => {

    const { workspaceId } = req.params;

    try {

        const family = await Family.create(req.body);
        const workspace = await Workspace.findOneAndUpdate({
            _id: workspaceId,
        }, {
            $push: { families: family._id },
        }, {
            new: true,
        });
        res.status(201).json({ success: true, workspace });
    } catch (error) {
        res.status(400).json({ success: false });
    }
};

const removeFamily = async (req, res) => {

    const { workspaceId, familyId } = req.params;

    try {

        // const family = await Family.deleteOne({ _id: familyId });

        const query = { _id: workspaceId };
        const updates = {
            families: { $pull: familyId }
        };
        const options = { new: true };
        const workspace = await Workspace.findOneAndUpdate(query, updates, options)
            .populate({
                path: 'families',
                populate: 'root',
            });
        res.status(201).json({ success: true, workspace });
    } catch (error) {
        res.status(400).json({ success: false });
    }
};

const getMembersByWorkspaceId = async (req, res) => {

    const { workspaceId } = req.params;
    const { gender, hasSpouse, hasParent } = req.query;
    const filters = {
        workspace: workspaceId
    };

    if (gender) {
        filters.gender = gender;
    }
    if (hasParent === 'false') {
        filters.parent = null;
    }

    try {
        let members = await Member.find(filters).populate('nuclearFamily');
        // members.depopulate();
        if (hasSpouse === 'false') {
            members = members.filter((member) => {
                const spouseGender = member.gender === 'male' ? 'female' : 'male';
                return !member.nuclearFamily[spouseGender];
            });
        }
        res.status(200).json({ success: true, members });
    } catch (error) {
        res.status(400).json({ success: false });
    }
};

const createMember = async (req, res) => {

    const { workspaceId } = req.params;

    try {

        const member = new Member({
            _id: new mongoose.Types.ObjectId(),
            ...req.body,
            workspace: workspaceId,
        });

        const nuclearFamily = new NuclearFamily({
            _id: new mongoose.Types.ObjectId(),
            [member.gender]: member._id,
        });

        member.nuclearFamily = nuclearFamily._id;
        if (req.files?.image) {
            member.image = await uploadImage(req.files.image.tempFilePath, {
                folder: workspaceId,
                public_id: member._id,
            });
        }

        await Promise.all([ member.save(), nuclearFamily.save() ]);
        res.status(201).json({ success: true, member });
    } catch (error) {
        res.status(400).json({ success: false, error });
    }
};

module.exports = {
    getWorkspaces,
    createWorkspace,
    updateWorkspace,
    deleteWorkspace,
    createFamily,
    removeFamily,
    getMembersByWorkspaceId,
    createMember,
};