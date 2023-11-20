import * as mongodb from "mongodb";
import { ShopCardsDetails, reviews, users } from "./employee";
import { Collection } from "mongodb";

export let collections: {
  products: Collection<ShopCardsDetails>;
  users: Collection<users>;
  reviews: Collection<reviews>;
};

export async function connectToDb(uri: string) {
  const client = new mongodb.MongoClient(uri);

  await client.connect();
  console.log('Connected to the database');

  const db = client.db("mpampaWebsite");
//   await applySchemaValidation(db);

collections = {
  products: db.collection<ShopCardsDetails>('products'),
  users: db.collection<users>('users'),
  reviews: db.collection<reviews>('reviews'),
};

  // const shopCardsCollection = db.collection<ShopCardsDetails>("products");
  // collections.products = shopCardsCollection;

  // const usersCollection = db.collection<users>("users");
  // collections.users = usersCollection;

  // const reviewsCollection = db.collection<reviews>("reviews");
  // collections.reviews = reviewsCollection;
}

// YWZmcolpJQmnUZdT


// // import { MongoClient } from 'mongodb';
// import * as mongodb from "mongodb";

// import { ShopCardsDetails, reviews, users } from './employee';

// const uri = process.env.ATLAS_URI;
// const client = new mongodb.MongoClient(uri);

// const connectToDb = async () => {
//   try {
//     await client.connect();
//     console.log('Connected to MongoDB');

//     // Specify your database and collection
//     const database = client.db('mpampaWebsite');
//     const shopCardsCollection = database.collection<ShopCardsDetails>('products');
//     const usersCollection = database.collection<users>('users');
//     const reviewsCollection = database.collection<reviews>('reviews');


//     // Now you can use productsCollection for database operations
//     return { products: shopCardsCollection, users: usersCollection, reviews: reviewsCollection};
//   } catch (error) {
//     console.error('Error connecting to MongoDB:', error);
//     throw error;
//   }
// };

// export default connectToDb;
