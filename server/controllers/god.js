const User = require('../models/User');
const Workspace = require('../models/Workspace');

const getUsers = async (req, res) => {

    // const filters = req.query;
    try {
        const users = await User.find({});
        res.status(200).json({ success: true, users });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, error: 'Something went wrong!' });
    }
};

const getWorkspaces = async (req, res) => {

    const { family } = req.query;
    const query = {
        owner: req.params.userId,
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

module.exports = {
    getUsers,
    getWorkspaces,
};