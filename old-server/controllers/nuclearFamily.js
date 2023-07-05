import NuclearFamily from '@server/models/NuclearFamily';

const createNuclearFamily = async (req, res) => {

    const data = req.body;

    try {
        const nuclearFamily = await NuclearFamily.create(data);
        res.status(200).json({ success: true, data: nuclearFamily });
    } catch (error) {
        res.status(400).json({ success: false });
    }
};

const updateNuclearFamily = async (req, res) => {

    const id = req.query.id;
    const data = req.body;

    try {
        const result = await NuclearFamily.updateOne({ _id: id }, data);
        res.status(200).json({ success: true, data: result });
    } catch (error) {
        res.status(400).json({ success: false });
    }
};

export {
    createNuclearFamily,
    updateNuclearFamily,
};