import * as mongodb from "mongodb";
import { ShopCardsDetails, cartProduct } from "./employee";

export const collections: {
    products?: mongodb.Collection<ShopCardsDetails>;
    cart?: mongodb.Collection<cartProduct>;
} = {};

export async function connectToDb(uri: string) {
  const client = new mongodb.MongoClient(uri);

  await client.connect();
  console.log('Connected to the database');

  const db = client.db("mpampaWebsite");
//   await applySchemaValidation(db);

  const shopCardsCollection = db.collection<ShopCardsDetails>("products");
  collections.products = shopCardsCollection;

  const cartCollection = db.collection<cartProduct>("cart");
  collections.cart = cartCollection;
}

// YWZmcolpJQmnUZdT
