const Joi = require('joi');

module.exports.placeSchema = Joi.object({
    place: Joi.object({
        title: Joi.string().required(),
        // image: Joi.string().required(),
        description: Joi.string().required(),
        categories: Joi.string(),
        ages: Joi.array().items(Joi.string()),
        location: Joi.string().required(),
        price: Joi.number().required().min(0),
    }).required(),
    // deleteImages: Joi.array()
})
