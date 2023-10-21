import * as express from "express";
import * as mongodb from "mongodb";
import { collections } from "./database";
import { PaystackResponse } from "./employee";
import { PaystackService } from "./paystack";
import { Request, Response } from "express";
import bcrypt from "bcrypt";
// const { body } = require('express-validator');
import { users } from "./employee";
const { ObjectId } = require("mongodb");
import User, { IUser } from "./models/user.models";
import jwt from "jsonwebtoken";
import AWS from "aws-sdk";
import multer, { FileFilterCallback } from "multer";
import { v4 as uuidv4 } from "uuid";

export const shopCardsRouter = express.Router();
export const usersRouter = express.Router();
export const reviewsRouter = express.Router();
shopCardsRouter.use(express.json());
usersRouter.use(express.json());
reviewsRouter.use(express.json());

const s3 = new AWS.S3({
  accessKeyId: "AKIAY7LT2367DS4FJUDX",
  secretAccessKey: "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",
  region: "eu-north-1",
});


const upload = multer({
  storage: multer.memoryStorage(), // Store files in memory as Buffer objects
});

// API endpoint for posting reviews with image upload
reviewsRouter.post(
  "/",
  upload.single("photo"),
  async (req: Request, res: Response) => {
    try {
      const { ratingValue, reviewMessage, reviewId } = req.body;
      const photo = req.file; // Use req.file.location to get the S3 URL

      if (!photo) {
        return res.status(400).send("No file uploaded.");
      }

      // Generate a unique file name using UUID
      const fileName = `${uuidv4()}-${photo.originalname}`;

      // Upload the file to S3
      const params = {
        Bucket: "awsmpampaimagebucket",
        Key: fileName,
        Body: photo.buffer,
      };

      const uploadResult = await s3.upload(params).promise();

      // Get the S3 URL of the uploaded file
      const photoUrl = uploadResult.Location;

      const reviewData = {
        ratingValue,
        reviewMessage,
        photo: photoUrl,
        reviewId,
      };

      // const result = await collections.reviews.insertOne(reviewData);
      const savedReview = await collections.reviews.insertOne(reviewData);

      // Insert the reviewData into your database or perform necessary actions
      // ...
      if (savedReview.acknowledged) {
        res.status(201).json({
          message: "Added new review successfully",
          review: reviewData, // Include the newly added review data in the response
        });
      }
    } catch (error) {
      console.error(error);
      res.status(400).send(error.message);
    }
  }
);

// Get reviews by productId's
reviewsRouter.get("/", async (req, res) => {
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
    res.status(500).send("Internal Server Error");
  }
});

// Get all products
shopCardsRouter.get("/", async (_req, res) => {
  try {
    const products = await collections.products.find({}).toArray();
    res.status(200).send(products);
  } catch (error) {
    console.error(error);
    res.status(400).send(error.message);
  }
});

// Get products by id
shopCardsRouter.get("/:id", async (req, res) => {
  try {
    const id = req?.params?.id;
    const query = { _id: id };
    const products = await collections.products.findOne(query);

    if (products) {
      res.status(200).send(products);
    } else {
      res.status(404).send(`Failed to find ${id}`);
    }
  } catch (error) {
    console.error(error);
    res.status(400).send(`Failed to find ${req?.params?.id}`);
  }
});

// src/routes/paystack.route.ts

const router = express.Router();

router.post("/initiate-payment", async (req, res) => {
  const { amount, email } = req.body;
  const paymentResponse = await PaystackService.initiateTransaction(
    amount,
    email
  );
  res.json(paymentResponse);
});

// router.post('/signup', async (req, res) => {
//   try {
//     const { email, password } = req.body;
//     const hashedPassword = await bcrypt.hash(password, 10);
//     const user = new User({ email, password: hashedPassword });
//     await user.save();
//     res.status(201).json({ message: 'User created successfully' });
//   } catch (error) {
//     res.status(500).json({ message: 'Signup failed' });
//   }
// });

// router.post('/login', async (req, res) => {
//   try {
//     const { email, password } = req.body;
//     const user: IUser | null = await User.findOne({ email });
//     if (!user) {
//       return res.status(401).json({ message: 'Authentication failed' });
//     }
//     const isValidPassword = await bcrypt.compare(password, user.password);
//     if (!isValidPassword) {
//       return res.status(401).json({ message: 'Authentication failed' });
//     }
//     const token = jwt.sign({ email: user.email, userId: user._id }, 'your_secret_key', { expiresIn: '1h' });
//     res.status(200).json({ token, expiresIn: 3600 }); // Token expires in 1 hour
//   } catch (error) {
//     res.status(500).json({ message: 'Login failed' });
//   }
// });

export default router;
