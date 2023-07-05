const cloudinary = require('cloudinary').v2;

const getFullFolderName = (folder) => `clannad/${folder}`;

const uploadImage = async (imagePath, { folder, public_id }) => {
    return (await cloudinary.uploader.upload(imagePath, {
        folder: getFullFolderName(folder),
        public_id,
    })).secure_url;
};

const deleteImage = async (id) => {
    return await cloudinary.uploader.destroy(id);
};

const deleteImageFolder = async (folder) => {
    const path = getFullFolderName(folder);
    await cloudinary.api.delete_resources_by_prefix(path);
    cloudinary.api.delete_folder(path);
};

module.exports = {
    uploadImage,
    deleteImage,
    deleteImageFolder,
};