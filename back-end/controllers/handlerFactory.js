import catchAsync from '../utils/catchAsync.js';
import AppError from '../utils/appError.js';

const createOne = Model => catchAsync(async (req, res, next) => {
    const doc = await Model.create(req.body);
    res.status(201).json({
        status: 'success',
        data: doc
    });
});

const getOne = (Model, popOptions) => catchAsync(async (req, res, next) => {
    let query = Model.findById(req.params.id).select('-__v');
    if(popOptions) query = query.populate(popOptions);
    const doc = await query;
    if(!doc) return next(new AppError(`No document found with ID : ${req.params.id}`, 404));
    res.status(200).json({
        status: 'success',
        data: doc
    });
});

const updateOne = Model => catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });
    if(!doc) return next(new AppError(`No document found with ID : ${req.params.id}`, 404));
    res.status(200).json({
        status: 'success',
        data: doc
    });
});

const deleteOne = Model => catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndDelete(req.params.id);
    if(!doc) return next(new AppError(`No document found with ID : ${req.params.id}`, 404));
    res.status(204).json({
        status: 'success',
        data: null
    });
});

const getAll = Model => catchAsync(async (req, res, next) => {
    const doc = await Model.find();
    res.status(200).json({
        status: 'success',
        length: doc.length,
        data: doc
    });
});

const factory = {createOne, getAll, getOne, updateOne, deleteOne};

export default factory;