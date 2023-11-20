import * as express from "express";
import * as mongodb from "mongodb";
import {collections} from "./database";
import {connectToDb} from "./database";
import { PaystackResponse } from "./employee";
import { PaystackService } from "./paystack";
import { Request, Response } from "express";
import bcrypt from "bcrypt";
// const { body } = require('express-validator');
import { users } from "./employee";
const { ObjectId } = require("mongodb");
import User, { IUser } from "./models/user.models";
import jwt from "jsonwebtoken";
import { S3 } from "aws-sdk";
import multerS3 from "multer-s3";
import AWS from "aws-sdk";
import multer, { FileFilterCallback } from "multer";
import { v4 as uuidv4 } from "uuid";

export const shopCardsRouter = express.Router();
export const usersRouter = express.Router();
export const reviewsRouter = express.Router();
shopCardsRouter.use(express.json());
usersRouter.use(express.json());
reviewsRouter.use(express.json());

interface S3UploadResponse {
  Location: string;
  // Other properties from the S3 upload response can be added here if needed
}

const s3 = new AWS.S3({
  accessKeyId: "AKIAY7LT2367DS4FJUDX",
  secretAccessKey: "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",
  region: "eu-north-1",
});

// const upload = multer({
//   storage: multerS3({
//     acl: 'public-read',
//     s3,
//     bucket: 'awsmpampaimagebucket',
//     key: function (req: Request, file: Express.Multer.File, cb: (error: Error | null, key?: string) => void) {
//       const uniqueId = uuidv4(); // Generate a unique ID for the file
//       const fileName = `${uniqueId}-${file.originalname}`;
//       cb(null, fileName);
//     },
//   }),
// });

const upload = multer({
  storage: multer.memoryStorage(), // Store files in memory as Buffer objects
});

// const uploadMiddleware = upload.single('photo');

// API endpoint for posting reviews with image upload
reviewsRouter.post(
  "/",
  upload.single("photo"),
  async (req: Request, res: Response) => {
    try {
      // const { reviews } = await connectToDb();
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

// const storage = multer.diskStorage({
//   destination: function(req, file, cb) {
//     cb(null, 'uploads/'); // Make sure this path is correct
//   },
//   filename: function(req, file, cb) {
//     cb(null, file.originalname);
//   }
// });

// const upload = multer({ storage: storage });

// reviewsRouter.post("/", upload.single('photo'), async (req, res) => {
//   try {
//     const { ratingValue, reviewMessage, reviewId } = req.body;
//     const photo = req.file ? req.file.path : null;

//     const reviewData = {
//       ratingValue,
//       reviewMessage,
//       photo,
//       reviewId,
//     };

//     const result = await collections.reviews.insertOne(reviewData);

//     if (result.acknowledged) {
//       res.status(201).json({
//         message: "Added new review successfully",
//         review: reviewData, // Include the newly added review data in the response
//       });
//     } else {
//       res.status(500).send(`Failed to add review`);
//     }
//   } catch (error) {
//     console.error(error);
//     res.status(400).send(error.message);
//   }
// });

// To post reviews
// reviewsRouter.post("/", upload.single('photo'), async (req, res) => {
//   try {
//     const reviews = req.body;
//     const photo = req.file ? req.file.path : null;

//     const reviewData = {
//       ratingValue: 0,
//       ratingMessage: '',
//       photo: '',
//       reviewId: ''
//       // ...other review properties
//     };

//     const result = await collections.reviews.insertOne(reviews);

//     if (result.acknowledged) {
//       res.status(201).json({
//         message: "Added new review successfully",
//         review: reviewData, // Include the newly added review data in the response
//       });
//     } else {
//       res.status(500).send(`Failed to add review`);
//     }
//   } catch (error) {
//     console.error(error);
//     res.status(400).send(error.message);
//   }
// });

// Get reviews by productId's
// reviewsRouter.get("/", async (req, res) => {
//   try {
//     // const { reviews } = await connectToDb();
//     const { reviewId } = req.query;
//     let filter = {}; // Default filter to get all reviews

//     // If reviewId is provided in the query parameters, add it to the filter
//     if (reviewId) {
//       filter = { reviewId: String(reviewId) }; // Assuming _id is the field in your reviews collection
//     }

//     const reviewsData = await collections.reviews.find(filter).toArray();
//     res.status(200).send(reviewsData);
//   } catch (error) {
//     console.error(error);
//     res.status(500).send("Internal Server Error");
//   }
// });

// Get all products
shopCardsRouter.get("/", async (_req, res) => {
  try {
        // const { products } = await connectToDb();
    // const collection = await db.collections.products("products");
    const productsData = await collections.products.find({}).toArray();
    res.status(200).send(productsData);
  } catch (error) {
    console.error(error);
    res.status(400).send(error.message);
  }
});

// Get all reviews
reviewsRouter.get("/", async (_req, res) => {
  // try {
    if(collections && collections.products){
      console.log('Collection for products exits');
      const reviewData = await collections.reviews.find({}).toArray();
      res.status(200).send(reviewData);
    }else{
      console.log('Collection for products doesnt exist')
    }
    // const { products } = await connectToDb();
    
  // } catch (error) {
  //   console.error(error);
  //   res.status(400).send(error.message);
  // }
});

// Get products by id
shopCardsRouter.get("/:id", async (req, res) => {
  try {
    // const { products } = await connectToDb();
    const id = req?.params?.id;
    const query = { _id: id };
    const productsDetail = await collections.products.findOne(query);

    if (productsDetail) {
      res.status(200).send(productsDetail);
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
