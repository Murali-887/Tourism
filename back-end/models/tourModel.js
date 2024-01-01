import mongoose from 'mongoose';
import slugify from 'slugify';

const tourSchema = new mongoose.Schema({
        name: {
            type: String,
            reqired: [true, `A tour must have a name`],
            unique: true,
            minLength: [8, `A tour name must have at least 8 characters in length`],
            maxLength: [40, `A tour name must have at most 40 characters in length`]
        },
        slug: String,
        price: {
            type: Number,
            required: [true, `A tour must have a price`],
        },
        duration: {
            type: Number,
            required: [true, `A tour must have a duration`]
        },
        maxGroupSize: {
            type: Number,
            required: [true, `A tour must have a max group size`]
        },
        ratingsQuantity: {
            type: Number,
            default: 0
        },
        ratingsAverage: {
            type: Number,
            default: 4.5,
            min: [1, `Rating must be above 1.0`],
            max: [5, `Rating must be above 5.0`]
        },
        summary: {
            type: String,
            trim: true,
            required: [true, `A tour must have a summary`]
        },
        description: {
            type: String,
            trim: true
        },
        difficulty: {
            type: String,
            required: [true, 'A tour must have a difficulty'],
            enum: {
              values: ['easy', 'medium', 'difficult'],
              message: 'Difficulty must be either easy, medium or difficult'
            }
        },
        imageCover: {
            type: String,
            required: [true, `A tour must have a image cover`]
        },
        images: [String],
        startDates: [Date],
        secretTour: {
            type: Boolean,
            default: false
        },
        guides: [
            {
                type: mongoose.Schema.ObjectId,
                ref: 'User'
            }
        ]
    },
    {
        toJSON: {virtuals: true},
        toObject: {virtuals: true}
    }
);

tourSchema.index({ratingsAverage: -1});
tourSchema.index({slug: 1});

tourSchema.virtual('durationWeeks').get(function() {
    return this.duration / 7;
});

// virtual populate
tourSchema.virtual('reviews', {
    ref: 'Review',
    foreignField: 'tour',
    localField: '_id'
});

// Document Middleware
tourSchema.pre('save', function(next) {
    this.slug = slugify(this.name, {lower: true});
    next();
});

// Query Middleware
tourSchema.pre(/^find/, function(next) {
    this.find({secretTour: {$ne: true}});
    this.start = Date.now();
    next();
});

tourSchema.pre(/^find/, function(next) {
    this.populate({
        path: 'guides',
        select: '-__v, -passwordChangedAt'
    });
    next();
});

tourSchema.post(/^find/, function(next) {
    console.log(`Query took ${Date.now() - this.start} milliseconds`);
})

const Tour = mongoose.model('Tour', tourSchema);

export default Tour;