import { Router } from 'express';
import { getContactsController, getContactsByIDController, createContactsController, patchContactsController, deleteContactsController } from '../controllers/contacts.js';
import {ctrlWrapper } from '../utils/ctrlWrapper.js';
import { isValidId } from '../middlewares/isValidId.js';
import { validateBody } from '../middlewares/validateBody.js';
import { createContactSchema, updateContactSchema } from '../validation/contacts.js';
import { authenticate} from '../middlewares/authenticate.js';


const router = Router();

router.use(authenticate);

 router.get('/',ctrlWrapper(getContactsController));


 router.get('/:contactId',isValidId, ctrlWrapper(getContactsByIDController));
 
 router.post('/', validateBody(createContactSchema), ctrlWrapper(createContactsController));
 
 
 router.patch('/:contactId', isValidId, validateBody(updateContactSchema), ctrlWrapper(patchContactsController)); 

router.delete('/:contactId', isValidId, ctrlWrapper(deleteContactsController));



export default router;