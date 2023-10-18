import * as express from "express";
import * as mongodb from "mongodb";
import { collections } from "./database";
import { PaystackResponse } from './employee';
import { PaystackService } from "./paystack";

export const shopCardsRouter = express.Router();
export const cartProductsRouter = express.Router();
shopCardsRouter.use(express.json());
cartProductsRouter.use(express.json());

cartProductsRouter.post('/', async (req, res) => {
    try{
        const cart = req.body;
        const result = await collections.cart.insertOne(cart);
        

        if(result.acknowledged){
            res.status(201).send(`Added ${req.body.productName} to cart`);
        }else{
            res.status(500).send(`Failed to create a new employee`);
        }
    }
    catch(error){
        console.error(error);
        res.status(400).send(error.message)
    }
})

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



