const express = require('express');
const bodyParser = require('body-parser');
const client = require('../db');
const logger = require('../logger');

const feedbackRouter = express.Router();
feedbackRouter.use(bodyParser.json());



feedbackRouter.post('/insertFeedback', async (req, res) => {
    try {
        const feedbackCollection = client.db('clinic').collection('feedback');
        let lastDoc = await feedbackCollection.find().sort({_id:-1}).limit(1).toArray();
        const feedbackId = parseInt(lastDoc[0].feedbackId) + 1;
        const feedbackInfo = req.body;
        await feedbackCollection.insertOne({
            feedbackId:  feedbackId,
            serviceName:  feedbackInfo.serviceName,
            source: feedbackInfo.source,
            preSchedule:  feedbackInfo.preSchedule,
            promptReceptionLevel:  feedbackInfo.promptReceptionLevel,
            instructionClarityLevel:  feedbackInfo.instructionClarityLevel,
            satisfactionLevel:  feedbackInfo.satisfactionLevel,
        });
        res.status(201).json({ feedbackId: feedbackId });
    } catch (error) {
        logger.error('Feedback submission error: ', error);
        res.status(500).json({error:'Internal server error'});
    }
});

module.exports = feedbackRouter;