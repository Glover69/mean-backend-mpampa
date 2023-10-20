import * as express from "express";
import * as mongodb from "mongodb";
import { collections } from "./database";
import { PaystackResponse } from './employee';
import { PaystackService } from "./paystack";
import { Request, Response } from 'express';
import bcrypt from "bcrypt";
// const { body } = require('express-validator');
import { users } from "./employee";
const { ObjectId } = require('mongodb');



export const shopCardsRouter = express.Router();
export const usersRouter = express.Router();
export const reviewsRouter = express.Router();
shopCardsRouter.use(express.json());
usersRouter.use(express.json());
reviewsRouter.use(express.json());


reviewsRouter.post('/', async (req, res) => {
    try{
        const reviews = req.body;
        const result = await collections.reviews.insertOne(reviews);

        if(result.acknowledged){
            res.status(201).send(`Added new review: ID ${result.insertedId}`)
        }else{
            res.status(500).send(`Failed to add review`);
        }

    }catch(error){
        console.error(error);
        res.status(400).send(error.message)
    }
})

// Get all Reviews
// reviewsRouter.get('/', async (req, res) => {
//     try{
//         const reviews = await collections.reviews.find({}).toArray();
//         res.status(200).send(reviews);
//     }
//     catch(error){
//         console.error(error);
//         res.status(400).send(error.message)
//     }
// })

reviewsRouter.get('/', async (req, res) => {
    try {
        const { reviewId } = req.query;
        let filter = {}; // Default filter to get all reviews

        // If reviewId is provided in the query parameters, add it to the filter
        if (reviewId) {
            filter = { reviewId: String(reviewId) }; // Assuming _id is the field in your reviews collection
        }

        const reviews = await collections.reviews.find(filter).toArray();
        res.status(200).send(reviews);
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

// Request validation middleware
// const validateLoginRequest = [
//     body('emailAddress').isEmail(),
//     body('password').isLength({ min: 6 })
//   ];

// usersRouter.post('/', validateLoginRequest, async (req, res) => {
//     try{
//         const { emailAddress, password } = req.body;
//         // const result = await collections.users.insertOne(users);
        

//         const user = await users.findOne({ emailAddress });
//         if (user && await bcrypt.compare(password, user.password)) {
//           res.json({ message: 'Login successful!' });
//         } else {
//           res.status(401).json({ message: 'Invalid credentials' });
//         }
//     }
//     catch(error){
//         console.error(error);
//         res.status(400).send(error.message)
//     }
// })

// Get all products
shopCardsRouter.get('/', async (req, res) => {
    try{
        const products = await collections.products.find({}).toArray();
        res.status(200).send(products);
    }
    catch(error){
        console.error(error);
        res.status(400).send(error.message)
    }
})

// Get products by id
shopCardsRouter.get('/:id', async (req, res) => {
    try{
        const id = req?.params?.id;
        const query = {_id: (id)};
        const products = await collections.products.findOne(query);

        if(products){
            res.status(200).send(products);
        }else{
            res.status(404).send(`Failed to find ${id}`);
        }
    }
    catch(error){
        console.error(error);
        res.status(400).send(`Failed to find ${req?.params?.id}`)
    }
})

// src/routes/paystack.route.ts

const router = express.Router();

router.post('/initiate-payment', async (req, res) => {
  const { amount, email } = req.body;
  const paymentResponse = await PaystackService.initiateTransaction(amount, email);
  res.json(paymentResponse);
});

export default router;



