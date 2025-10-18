import mongoose, { model, Schema } from 'mongoose';


const contactSchema = new Schema({
    name: {
        type: String,
       required: true,
    },
    phoneNumber: {
        type: String,
    },
    email: {
        type: String,
    },
    isFavourite: {
        type: Boolean,
        default: false,
    },
    contactType: {
        type: String,
        enum: ['work', 'home', 'personal'],
        required: true,
        default: 'personal',
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'users',
    }
},
    {
        timestamps: true,
    },
);


export const ContactsCollection = model("contacts", contactSchema);