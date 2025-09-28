import { Router } from 'express';
import { getContactsController, getContactsByIDController, createContactsController, patchContactsController, deleteContactsController } from '../controllers/contacts.js';
import {ctrlWrapper } from '../utils/ctrlWrapper.js';

const router = Router();


 router.get('/contacts',ctrlWrapper(getContactsController));


 router.get('/contacts/:contactId', ctrlWrapper(getContactsByIDController));
 
 router.post('/contacts', ctrlWrapper(createContactsController));
 
 
 router.put('/contacts/:contactId', ctrlWrapper(patchContactsController)); 

router.delete('/contacts/:contactId', ctrlWrapper(deleteContactsController));

export default router;