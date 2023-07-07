if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const cloudinary = require('cloudinary').v2;
const fileUpload = require('express-fileupload');

const apiRoutes = require('./routes');
const { isAuth } = require('./middlewares/auth');

const {
    // ORIGIN,
    CLOUDINARY_CLOUD_NAME,
    CLOUDINARY_API_KEY,
    CLOUDINARY_API_SECRET,
} = process.env;

const app = express();
app.use(cors({
    origin: '*',
    // origin: ORIGIN,
    credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

app.use(fileUpload({
    useTempFiles : true,
    tempFileDir : '/tmp/'
}));

cloudinary.config({
    cloud_name: CLOUDINARY_CLOUD_NAME,
    api_key: CLOUDINARY_API_KEY,
    api_secret: CLOUDINARY_API_SECRET,
});

app.use('/api', isAuth, apiRoutes);

(async () => {

    const { MONGODB_URI, PORT } = process.env;
    try {
        await mongoose.connect(MONGODB_URI);
        app.listen(PORT, () => console.log(`Server started on port ${ PORT }`));
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
})();