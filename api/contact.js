const express = require('express');
const bodyParser = require('body-parser');
const client = require('../db');
const logger = require('../logger');

const contactRouter = express.Router();
contactRouter.use(bodyParser.json());

contactRouter.post('/insertContact', async(req, res) => {
    try{
        const contactCollection = client.db('clinic').collection('contact');
        let lastDoc = await contactCollection.find().sort({_id:-1}).limit(1).toArray();
        const contactId = parseInt(lastDoc[0].contactId) + 1;
        const contactInfo = req.body;
        await contactCollection.insertOne({
            contactId: contactId,
            firstname: contactInfo.firstname,
            lastname:contactInfo.lastname,
            email: contactInfo.email,
            subject: contactInfo.subject,
            message: contactInfo.message
        });
        res.status(201).json({message:'Submit query successfully'});
    } catch (error){
        logger.error('Submit query error:', error);
        res.status(500).json({error: 'Internal server error'});
    } 
});
contactRouter.post('/insertContact', (req, res) => {

});


module.exports = contactRouter;


