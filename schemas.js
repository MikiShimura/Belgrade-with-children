const Joi = require('joi');

module.exports.placeSchema = Joi.object({
    place: Joi.object({
        title: Joi.string().required(),
        // image: Joi.string().required(),
        description: Joi.string().required(),
        location: Joi.string().required(),
        price: Joi.number().required().min(0),
        category: Joi.string(),
        ages: Joi.array(),
    }).required(),
    // deleteImages: Joi.array()
})
