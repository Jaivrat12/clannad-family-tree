import Family from '@server/models/Family';
import Workspace from '@server/models/Workspace';

const getWorkspaces = async (req, res) => {

    const { family } = req.query;
    const query = {};
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
        res.status(400).json({ success: false });
    }
};

const createWorkspace = async (req, res) => {

    // await Workspace.create({
    //     name: 'Clannad',
    //     description: 'A group of families from the world of Clannad. Contains Okazaki and Furukawa families.',
    //     families: ['63fc6a004e62e8011d31be7f'],
    // });

    try {
        const workspace = await Workspace.create(req.body);
        res.status(201).json({ success: true, data: workspace });
    } catch (error) {
        res.status(400).json({ success: false });
    }
};

const createFamily = async (req, res) => {

    const { id } = req.query;

    try {

        const family = await Family.create(req.body);

        const query = { _id: id };
        const updates = {
            $push: { families: family._id }
        };
        const options = { new: true };
        const workspace = await Workspace.findOneAndUpdate(query, updates, options)
            // .populate({
            //     path: 'families',
            //     populate: 'root',
            // });
        console.log(workspace);
        res.status(201).json({ success: true, workspace });
    } catch (error) {
        res.status(400).json({ success: false });
    }
};

const removeFamily = async (req, res) => {

    const { id, familyId } = req.query;

    try {

        // const family = await Family.deleteOne({ _id: familyId });

        const query = { _id: id };
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

export {
    getWorkspaces,
    createWorkspace,
    createFamily,
    removeFamily,
};