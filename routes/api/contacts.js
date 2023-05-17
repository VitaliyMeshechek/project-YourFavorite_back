const express = require('express');

const router = express.Router();

const ctrl = require('..//..//controllers/contacts');

const {schemas} = require('..//..//models/contact');

const {validateBody, isValidId, authenticate} = require('../../middlewares');


router.get('/', authenticate, ctrl.getAllContacts);

router.get('/:contactId', authenticate, isValidId, ctrl.getContactById);

router.post('/', authenticate, validateBody(schemas.addSchema), ctrl.addContact);
 
router.put('/:contactId', authenticate, isValidId, validateBody(schemas.updateSchema), ctrl.updateContact);

router.patch('/:contactId/favorite', authenticate, isValidId, validateBody(schemas.updateFavoriteSchema), ctrl.updateStatusContact);

router.delete('/:contactId', authenticate, isValidId, ctrl.deleteContact);


module.exports = router;
