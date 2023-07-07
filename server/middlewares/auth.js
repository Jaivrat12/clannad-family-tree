const User = require('../models/User');
const Workspace = require('../models/Workspace');
const Member = require('../models/Member');
const { decode } = require('next-auth/jwt');

// authentication
const isAuth = async (req, res, next) => {

    try {
        const { AUTH_TOKEN_KEY, AUTH_SECRET_KEY } = process.env;
        const decoded = await decode({
            token: req.cookies[AUTH_TOKEN_KEY],
            secret: AUTH_SECRET_KEY,
        });

        if (decoded === null) {
            throw new Error();
        }

        // if user isn't registered, then register it
        req.user = await User.findOneAndUpdate({
            email: decoded.email,
        }, {
            $set: { email: decoded.email },
        }, {
            upsert: true,
            new: true,
        });

        next();
    } catch (err) {

        res.status(401).json({
            success: false,
            error: 'Invalid Token'
        });
    }
};

// authorization
const checkOwnership = async (req, res, next) => {

    const isWorkspaceOwner = async (id) => {
        const workspace = await Workspace.findById(id).populate('owner');
        return workspace.owner.email === req.user.email;
    };

    const isFamilyOwner = async (id) => {
        const workspace = await Workspace.findOne({ families: id }).populate('owner');
        return workspace.owner.email === req.user.email;
    };

    const isMemberOwner = async (id) => {
        const member = await Member.findById(id)
            .populate({
                path: 'workspace',
                populate: 'owner',
            });
        return member.workspace.owner.email === req.user.email;
    };

    const isOwner = async (paramType, id) => {

        switch (paramType) {

            case 'workspaceId': {
                return await isWorkspaceOwner(id);
            }

            case 'familyId': {
                return await isFamilyOwner(id);
            }

            case 'memberId':
            case 'spouseId':
            case 'childId': {
                return await isMemberOwner(id);
            }
        }
    };

    try {

        const promises = Object.keys(req.params).map((param) => {
            const id = req.params[param];
            return isOwner(param, id);
        });

        const result = await Promise.all(promises);
        if (!result.every(x => x)) {
            throw new Error();
        }

        next();
    } catch (err) {

        res.status(401).json({
            success: false,
            error: 'Unauthorized Access!',
        });
    }
};

module.exports = {
    isAuth,
    checkOwnership,
};