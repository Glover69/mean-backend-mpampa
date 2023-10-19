import * as mongodb from "mongodb";
import { ShopCardsDetails, reviews, users } from "./employee";

export const collections: {
    products?: mongodb.Collection<ShopCardsDetails>;
    users?: mongodb.Collection<users>;
    reviews?: mongodb.Collection<reviews>;
} = {};

export async function connectToDb(uri: string) {
  const client = new mongodb.MongoClient(uri);

  await client.connect();
  console.log('Connected to the database');

  const db = client.db("mpampaWebsite");
//   await applySchemaValidation(db);

  const shopCardsCollection = db.collection<ShopCardsDetails>("products");
  collections.products = shopCardsCollection;

  const usersCollection = db.collection<users>("users");
  collections.users = usersCollection;

  const reviewsCollection = db.collection<reviews>("reviews");
  collections.reviews = reviewsCollection;
}

// YWZmcolpJQmnUZdT
