import nc from 'next-connect';
import dbConnect from './lib/db-connect';

// Register all models
// eslint-disable-next-line no-unused-vars
import Workspace from './models/Workspace';
// eslint-disable-next-line no-unused-vars
import Family from './models/Family';
// eslint-disable-next-line no-unused-vars
import Member from './models/Member';
// eslint-disable-next-line no-unused-vars
import NuclearFamily from './models/NuclearFamily';


const handler = nc({
    onError: (err, req, res) => {
        console.error(err.stack);
        res.status(500).end('Something broke!');
    },
    onNoMatch: (req, res) => {
        res.status(404).end('Page is not found');
    },
}).use(async (req, res, next) => {
    await dbConnect();
    console.log('Connected to MongoDB server');
    next();
});

export default handler;