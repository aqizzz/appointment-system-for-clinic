const express = require('express');
const bodyParser = require('body-parser');
const client = require('../db');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const customerRouter = express.Router();
customerRouter.use(bodyParser.json());
const logger = require('../logger');

const secret = Buffer.from('f351f2f7f429ab4456d7d6cd62aa6aee', 'hex');

function hashPassword(password, salt) {
    const hash = crypto.createHash('sha256');
    return hash.update(password + salt, 'utf-8').digest('hex');
}

async function getUserByEmail(email) {
    const customerCollection = client.db('clinic').collection('customer');
    return await customerCollection.findOne({ email: email });
}

// Create JWT
function generateToken(customer) {
  const payload = {
      customerId: customer.customerId,
      firstname: customer.firstname,
      lastname: customer.lastname,
      email: customer.email,
      phone: customer.phone,
      avatar: customer.avatar,
      address: customer.address,
      city: customer.city,
      province: customer.province,
      country: customer.country,
      postcode: customer.postcode,
      contactName: customer.contactName,
      contactPhone: customer.contactPhone,
      acceptEmailMsg: customer.acceptEmailMsg
  };
  // Set the expiration time of JWT
  const expiresIn = '6h';
  // Generate JWT
  const token = jwt.sign(payload, secret, { expiresIn });
  return token;
}

// Verify JWT
function verifyToken(token) {
  try {
    // Validate the JWT and decode its payload
    const decoded = jwt.verify(token, secret);
    return decoded;
  } catch (error) {
    // Verification failed
    return null;
  }
}

customerRouter.get('/getCustomerByJwt', async (req, res) => {
  try {
    const token = req.headers.authorization;
    const jwt = token.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }
      // Verify JWT
    const decoded = verifyToken(jwt);
    if (!decoded) {
      return res.status(401).json({ error: 'Invalid token' });
    }
    res.json(decoded);
  } catch (error) {
    logger.error('Error fetching customer:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

customerRouter.post('/checkCustomerEmail', async (req, res) => {

  const email = req.body.email;

  try {
    const customer = await getUserByEmail(email);

    if (customer) {
      res.status(200).json(true);
    } else {
      res.status(200).json(false);
    }
  } catch (error) {
    logger.error('Error checking customer email:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

customerRouter.post('/insertCustomer', async (req, res) => {
  try {
    const customerCollection = client.db('clinic').collection('customer');
    let lastDoc = await customerCollection.find().sort({ _id: -1 }).limit(1).toArray();
    const customerId = parseInt(lastDoc[0].customerId) + 1;
    const cust = req.body;
    const salt = crypto.randomBytes(16).toString('hex');
    const hashedPassword = hashPassword(cust.password, salt);
    await customerCollection.insertOne({
      customerId: customerId,
      firstname: cust.firstname,
      lastname: cust.lastname,
      email: cust.email,
      phone: cust.phone,
      password: hashedPassword,
      salt: salt,
      avatar: '',
      address: '',
      city: '',
      province: '',
      country: '',
      postcode: '',
      contactName: '',
      contactPhone: '',
      acceptEmailMsg: cust.acceptEmailMsg
    });
    res.status(201).json({ message: 'Customer created successfully' });
  } catch (error) {
    logger.error('Error creating customer:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

customerRouter.post('/login', async (req, res) => {

  const { email, password } = req.body;

  try {
    const customer = await getUserByEmail(email);
    
    if (!customer) {
        return res.status(400).json({ error: 'Email does not exist' });
    }
    
    const hashedPassword = hashPassword(password, customer.salt);
    if (hashedPassword !== customer.password) {
        return res.status(400).json({ error: 'Password does not match' });
    }
    
    const token = generateToken(customer);
    res.json({ token: token, userId: customer.customerId, firstname: customer.firstname });
  } catch (error) {
      logger.error('Error logging in:', error);
      res.status(500).json({ error: 'Internal server error' });
  }
});

customerRouter.put('/updateCustomer/:customerId', async (req, res) => {
  try {
    const customerCollection = client.db('clinic').collection('customer');

    const customerId = parseInt(req.params.customerId);
    const updatedData = {
      firstname: req.body.firstname,
      lastname: req.body.lastname, 
      email: req.body.email,
      phone: req.body.phone,
      avatar: req.body.avatar,
      city: req.body.city,
      province: req.body.province,
      country: req.body.country,
      postcode: req.body.postcode,
      contactName: req.body.contactName,
      contactPhone: req.body.contactPhone,
      acceptEmailMsg: req.body.acceptEmailMsg
    }
    await customerCollection.findOneAndUpdate({customerId: customerId}, { $set: updatedData});

    // Generate new JWT token
    const customer = await customerCollection.findOne({ customerId: customerId });
    const newToken = generateToken(customer);

    // Send new JWT token back to client side
    res.status(200).json({ message: 'Customer updated successfully', token: newToken });
  } catch (error) {
    logger.error('Error updating customer:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = customerRouter;