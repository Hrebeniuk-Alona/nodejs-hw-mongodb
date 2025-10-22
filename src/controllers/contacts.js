import { getAllContacts, getContactByID, createContact, updateContact, deleteContact } from '../services/contacts.js';
import createHttpError from 'http-errors';
import {parsePaginationParams } from '../utils/parsePaginationParams.js';
import { parseSortParams} from '../utils/parseSortParams.js';
import { parseFilterParams } from '../utils/parseFilterParams.js';
import { saveFileToUploadDir } from '../utils/saveFileToUploadDir.js';
import {saveFileToCloudinary } from '../utils/saveFileToCloudinary.js';
import { getEnvVar } from '../utils/getEnvVar.js';


export const getContactsController = async (req, res) => {
   
    const { page, perPage } = parsePaginationParams(req.query);
    const { sortBy, sortOrder } = parseSortParams(req.query);
    const filter = parseFilterParams(req.query);
    filter.userId = req.user._id;

    const contacts = await getAllContacts({ page, perPage, sortBy, sortOrder, filter});
    
    res.status(200).json({
        status: 200,
        message: "Successfully found contacts!",
        data: contacts,
    });
    
};



export const getContactsByIDController = async (req, res) => {
    const { contactId } = req.params;
    const userId = req.user._id;
    const contact = await getContactByID(contactId,userId);

    if (!contact){
        throw createHttpError(404, 'Contact not found');
    }

    res.status(200).json({
        status: 200,
        message: `Successfully found contact with id ${contactId}!`,
        data: contact,
    });
};



export const createContactsController = async (req, res) => {
    const photo = req.file;


    let photoUrl;

        if (photo) {
        if (getEnvVar('ENABLE_CLOUDINARY') === 'true'){
            photoUrl = await saveFileToCloudinary(photo);
        } else {
            photoUrl = await saveFileToUploadDir(photo);
        }   
    }


    const contact = await createContact({
        ...req.body,
        userId: req.user._id,
        photo:photoUrl,
    });

    res.status(201).json({
        status: 201,
        message: `Successfully created a contact!`,
        data: contact,
    });
};


export const patchContactsController = async (req, res, next) => {
    const { contactId } = req.params;
    const userId = req.user._id;
    const photo = req.file;

    let photoUrl;

    if (photo) {
        if (getEnvVar('ENABLE_CLOUDINARY') === 'true'){
            photoUrl = await saveFileToCloudinary(photo);
        } else {
            photoUrl = await saveFileToUploadDir(photo);
        }   
    }

    const result = await updateContact(contactId, userId, {
        ...req.body, photo: photoUrl
    }
    );

    if (!result) {
        next(createHttpError(404, "Contact not found"));
        return;
    }

        res.json({
        status: 200,
        message: `Successfully created a contact!`,
        data: result.contact,
    });
};



export const deleteContactsController = async (req, res, next) => {
    const { contactId } = req.params;

    const userId = req.user._id;
    const contact = await deleteContact(contactId, userId);

    if (!contact) {
        next(createHttpError(404, "Contact not found"));
    }

    res.status(204).send();
};