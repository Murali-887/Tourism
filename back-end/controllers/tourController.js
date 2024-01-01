import multer from 'multer';
import Tour from '../models/tourModel.js';
import AppError from '../utils/appError.js';
import factory from './handlerFactory.js';

const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
    if(file.mimetype.startsWith('image')) {
        cb(null, true);
    } else {
        cb(new AppError('Not an image! Please upload only images.', 400), false);
    }
}

const upload = multer({
    storage: multerStorage,
    fileFilter: multerFilter
});

const uploadTourImages = upload.fields([{name: 'imageCover', maxCount: 1}, {name: 'images', maxCount: 3}])

const getAllTours = factory.getAll(Tour);
const createTour = factory.createOne(Tour);
// const getTour = factory.getOne(Tour, {path: 'reviews'});
const getTour = factory.getOne(Tour);
const updateTour = factory.updateOne(Tour);
const deleteTour = factory.deleteOne(Tour);


const tourController = {
    createTour,
    getAllTours,
    getTour,
    updateTour,
    deleteTour,
    uploadTourImages
}

export default tourController