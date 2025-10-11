import { Router } from 'express';
import { getContactsController, getContactsByIDController, createContactsController, patchContactsController, deleteContactsController } from '../controllers/contacts.js';
import {ctrlWrapper } from '../utils/ctrlWrapper.js';
import { isValidId } from '../middlewares/isValidId.js';
import { validateBody } from '../middlewares/validateBody.js';
import { createContactSchema, updateContactSchema} from '../validation/contacts.js';


const router = Router();


 router.get('/contacts',ctrlWrapper(getContactsController));


 router.get('/contacts/:contactId',isValidId, ctrlWrapper(getContactsByIDController));
 
 router.post('/contacts', validateBody(createContactSchema), ctrlWrapper(createContactsController));
 
 
 router.patch('/contacts/:contactId', isValidId, validateBody(updateContactSchema), ctrlWrapper(patchContactsController)); 

router.delete('/contacts/:contactId', isValidId, ctrlWrapper(deleteContactsController));

export default router;