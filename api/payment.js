const express = require('express');
const bodyParser = require('body-parser');
const client = require('../db');
const logger = require('../logger');

const paymentRouter = express.Router();
paymentRouter.use(bodyParser.json());


paymentRouter.post('/insertPayment', async (req, res) => {
  try {
    const paymentCollection = client.db('clinic').collection('payment');

    let lastDoc = await paymentCollection.find().sort({_id:-1}).limit(1).toArray();
    const paymentId = parseInt(lastDoc[0].paymentId) + 1;
    const payment = req.body;
    
    await paymentCollection.insertOne({ 
      paymentId: paymentId,
      cardType: payment.cardType,
      cardNumber: payment.cardNumber, 
      ownerName: payment.ownerName, 
      cvvNumber: payment.cvvNumber, 
      cardExpDate: payment.cardExpDate, 
      servicePrice: payment.servicePrice, 
      serviceFee: payment.serviceFee,
      donation: payment.donation, 
      totalAmount: payment.totalAmount,
      createdTimeStamp: new Date().toISOString(),
      needRefund: payment.needRefund
     });
    
     res.json(paymentId);
  } catch (error) {
    logger.error('Error creating paymentment:', error);
    res.status(500).json({ error: 'Internal server error' });
  }

});

paymentRouter.put('/updatePayment/:paymentId', async (req, res) => {
  try {
    const paymentCollection = client.db('clinic').collection('payment');
    let paymentId = parseInt(req.params.paymentId);
    let response = await paymentCollection.findOneAndUpdate({paymentId: paymentId}, { $set: { needRefund: true }});
    res.status(204).send({ message: `Payment# ${response.paymentId} will be refunded` });
  } catch (error) {
    logger.error('Error updating payment:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = paymentRouter;