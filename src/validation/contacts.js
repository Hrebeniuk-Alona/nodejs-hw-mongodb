import Joi from "joi";

export const createContactSchema = Joi.object({
    name: Joi.string().min(3).max(20).required().messages({
        'any.required': 'Name is required',
        'string.min': 'Name should have at least 3 characters',
        'string.max': 'Name should not exceed 20 characters',
    }),
    phoneNumber: Joi.number().required().messages({
        'any.required': 'Phone number is required',
    }),
    email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }).required().messages({
        'any.required': 'Email is required',
        'string.email': 'Invalid email adress.'
    }),
    isFavourite: Joi.boolean().required(),
    contactType: Joi.string().valid('work', 'home', 'personal').required().messages({
        'any.only': 'Choose nessesary type of contact.',
        'any.required': 'Contact type is required',
    }),
});

export const updateContactSchema = Joi.object({
    name: Joi.string().min(3).max(20),
    phoneNumber: Joi.number(),
    email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }),
    isFavourite: Joi.boolean(),
    contactType: Joi.string().valid('work', 'home', 'personal'),
});

