import { getAllContacts, getContactByID, createContact, updateContact, deleteContact } from '../services/contacts.js';
import createHttpError from 'http-errors';



export const getContactsController = async (req, res) => {
    const contacts = await getAllContacts();
    res.status(200).json({
        status: 200,
        message: "Successfully found contacts!",
        data: contacts,
    });
};



export const getContactsByIDController = async (req, res) => {
    const { contactId } = req.params;
    const contact = await getContactByID(contactId);

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
    const contact = await createContact(req.body);

    res.status(201).json({
        status: 201,
        message: `Successfully created a student!`,
        data: contact,
    });
};


export const patchContactsController = async (req, res, next) => {
    const { contactId } = req.params;

    const result = await updateContact(contactId, req.body);

    if (!result) {
        next(createHttpError(404, "Contact not found"));
        return;
    }

        res.json({
        status: 200,
        message: `Successfully created a student!`,
        data: result.contact,
    });
};



export const deleteContactsController = async (req, res, next) => {
    const { contactId } = req.params;
    const contact = await deleteContact(contactId);

    if (!contact) {
        next(createHttpError(404, "Contact not found"));
    }

    res.status(204).send();
};