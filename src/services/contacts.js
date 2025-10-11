import { ContactsCollection } from "../db/models/contact.js";
import { SORT_ORDER } from "../constants/index.js";


export const getAllContacts = async ({
    page = 1,
    perPage = 10,
    sortBy="_id",
    sortOrder = SORT_ORDER.ASC,
    filter = {} }) => {
    const skip = page > 0 ? (page - 1) * perPage : 0;

    const contactQuery = ContactsCollection.find();

    if (filter.contactType) {
        contactQuery.where('contactType').equals(filter.contactType);
    }
    if (filter.isFavourite) {
        contactQuery.where('isFavourite').equals(filter.isFavourite);
    }

    const [contacts, totalItems] = await Promise.all([
        contactQuery
            .sort({ [sortBy]: sortOrder })
            .skip(skip)
            .limit(perPage),
        ContactsCollection.find().merge(contactQuery).countDocuments()
    ]);

    const totalPages = Math.ceil(totalItems / perPage);
    
    return {
        data: contacts,
        page,
        perPage,
        totalItems,
        totalPages,
        hasPreviousPage: page > 1,
        hasNextPage: totalPages > page,
    };
};


export const getContactByID = async (contactId) => {
    const contact = await ContactsCollection.findById(contactId);
    return contact;
}; 


export const createContact = async (payload) => {
    const contact = await ContactsCollection.create(payload);
    return contact;
};


export const updateContact = async (contactId, payload, options={}) => {
    const rawResult = await ContactsCollection.findOneAndUpdate(
        { _id: contactId },
        payload,
        {
            new: true,
            includeResultMetadata: true,
            ...options,
        },
    );

    if (!rawResult || !rawResult.value) return null;

    return {
        contact: rawResult.value,
        isNew: Boolean(rawResult?.lastErrorObject?.upserted),
    };
};


export const deleteContact = async (contactId) => {
    const contact = await ContactsCollection.findOneAndDelete({
        _id: contactId,
    });
    
    return contact;
};